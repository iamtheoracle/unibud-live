import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapCommunity } from "./map";
import type { CampusRole } from "./roles";
import { resolveQuadPrivacy, resolveStoredQuadPrivacy, type QuadPrivacy } from "./quad-privacy";

export type { QuadPrivacy } from "./quad-privacy";

export const createQuad = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    name: string;
    description?: string;
    kind?: string;
    privacy?: QuadPrivacy;
    cover?: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const name = data.name.trim();
    if (name.length < 2) throw new Error("Give your Quad a name.");
    if (name.length > 80) throw new Error("Keep the name under 80 characters.");
    const description = (data.description ?? "").trim().slice(0, 500);
    const kind = (data.kind ?? "Interest").trim() || "Interest";
    if (!["Study", "Interest", "Class", "University", "Faculty"].includes(kind)) {
      throw new Error("Choose a supported Quad type.");
    }
    // TypeScript types do not validate requests at runtime. Reject explicitly
    // supplied unknown values instead of silently creating a public Quad.
    const privacy = resolveQuadPrivacy(data.privacy);
    const sql = await getSql();

    // Class-room creation is a privileged action and must be enforced server-side,
    // not just by the button's visibility or client-side role state.
    if (kind === "Class") {
      const rows = await sql<{ campus_role?: string }>`
        select campus_role from student_profiles where user_id = ${context.userId} limit 1
      `;
      const role = String(rows[0]?.campus_role ?? "student") as CampusRole;
      if (role !== "governor") {
        throw new Error("Only verified class governors can create Class Quads.");
      }
    }

    const profile = await sql<{ university_id: string | null }>`select university_id from student_profiles where user_id = ${context.userId} limit 1`;
    if (!profile[0]) throw new Error("Complete your campus profile before creating a Quad.");
    if (privacy === "campus" && !profile[0].university_id) {
      throw new Error("Add your university to your campus profile before creating a campus-only Quad.");
    }
    const universityId = profile[0].university_id == null ? null : String(profile[0].university_id);
    const id = `q_${crypto.randomUUID().slice(0, 10)}`;
    // Fail closed: never fall back to a schema that silently drops privacy or
    // ownership fields. A failed write must not create a public room by accident.
    // Create the Quad and its owner membership in one SQL statement. If either
    // insert fails, PostgreSQL rolls back both instead of leaving an orphaned Quad.
    const created = await sql`
      with new_quad as (
        insert into communities (id, name, kind, university_id, description, cover, members, privacy, created_by)
        values (${id}, ${name}, ${kind}, ${privacy === "campus" ? universityId : null}, ${description}, ${data.cover ?? null}, ${1}, ${privacy}, ${context.userId})
        returning id
      )
      insert into community_members (user_id, community_id, role)
      select ${context.userId}, id, ${"owner"} from new_quad
      on conflict (user_id, community_id) do update set role = ${"owner"}
      returning community_id
    `;
    if (!created[0]) throw new Error("Quad could not be created. Please try again.");
    const rows = await sql`select * from communities where id = ${id} limit 1`;
    if (!rows[0]) throw new Error("Quad was created but could not be loaded. Refresh and check your Quads.");
    return mapCommunity(rows[0]);
  });

export const joinQuad = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((communityId: string) => communityId)
  .handler(async ({ context, data: communityId }) => {
    const sql = await getSql();
    const room = await sql<{ privacy?: string; university_id?: string | null }>`select privacy, university_id from communities where id = ${communityId} limit 1`;
    if (!room[0]) throw new Error("That Quad was not found.");
    const privacy = resolveStoredQuadPrivacy(room[0].privacy);
    if (privacy === "campus") {
      const profile = await sql<{ university_id: string }>`select university_id from student_profiles where user_id = ${context.userId} limit 1`;
      if (!profile[0] || !room[0].university_id || String(profile[0].university_id) !== String(room[0].university_id)) {
        throw new Error("This Quad is limited to its university community.");
      }
    }
    if (privacy === "private") {
      const already = await sql`
        select user_id from community_members where user_id = ${context.userId} and community_id = ${communityId}
      `;
      if (!already[0]) throw new Error("This Quad is private. Ask an admin to invite you.");
      return { joined: true as const };
    }
    // Insert membership and increment the denormalized count in one statement.
    // The count changes only when this request actually creates a membership.
    await sql`
      with inserted as (
        insert into community_members (user_id, community_id, role)
        values (${context.userId}, ${communityId}, ${"member"})
        on conflict (user_id, community_id) do nothing
        returning community_id
      )
      update communities c
      set members = coalesce(c.members, 0) + 1
      from inserted
      where c.id = inserted.community_id
    `;
    return { joined: true as const };
  });

export const leaveQuad = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((communityId: string) => communityId)
  .handler(async ({ context, data: communityId }) => {
    const sql = await getSql();
    // Keep the Quad row lock, owner check, membership deletion, and count update
    // inside one SQL statement. A FOR UPDATE query in a separate statement would
    // release its lock before the later delete under autocommit/serverless clients.
    const rows = await sql<{ membership_exists: boolean; is_owner: boolean; has_other_owner: boolean; removed: boolean }>`
      with locked_quad as materialized (
        select id from communities where id = ${communityId} for update
      ),
      my_membership as materialized (
        select cm.user_id, cm.role, cm.community_id
        from community_members cm
        join locked_quad q on q.id = cm.community_id
        where cm.user_id = ${context.userId}
      ),
      owner_guard as materialized (
        select exists (
          select 1 from community_members other
          join locked_quad q on q.id = other.community_id
          where other.role = ${"owner"} and other.user_id <> ${context.userId}
        ) as has_other_owner
        from my_membership where role = ${"owner"}
      ),
      removed as (
        delete from community_members cm
        using my_membership mine
        where cm.user_id = mine.user_id
          and cm.community_id = mine.community_id
          and (mine.role <> ${"owner"} or coalesce((select has_other_owner from owner_guard), false))
        returning cm.community_id
      ),
      updated_quad as (
        update communities c
        set members = greatest(coalesce(c.members, 0) - 1, 0)
        from removed r
        where c.id = r.community_id
        returning c.id
      )
      select
        exists(select 1 from my_membership) as membership_exists,
        coalesce((select role = ${"owner"} from my_membership limit 1), false) as is_owner,
        coalesce((select has_other_owner from owner_guard), false) as has_other_owner,
        exists(select 1 from removed) as removed
    `;
    const result = rows[0];
    if (!result?.membership_exists) return { left: true as const };
    if (result.is_owner && !result.has_other_owner) {
      throw new Error("Transfer Quad ownership before leaving.");
    }
    if (!result.removed) throw new Error("Could not leave this Quad. Please retry.");
    return { left: true as const };
  });
