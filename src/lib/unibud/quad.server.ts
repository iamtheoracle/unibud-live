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

    const profile = await sql<{ university_id: string }>`select university_id from student_profiles where user_id = ${context.userId} limit 1`;
    if (!profile[0]) throw new Error("Complete your campus profile before creating a Quad.");
    const universityId = String(profile[0].university_id);
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
    const inserted = await sql`
      insert into community_members (user_id, community_id, role)
      values (${context.userId}, ${communityId}, ${"member"})
      on conflict (user_id, community_id) do nothing
      returning user_id
    `;
    if (inserted[0]) {
      const count = await sql`select count(*)::int as count from community_members where community_id = ${communityId}`;
      await sql`update communities set members = ${Number(count[0]?.count ?? 0)} where id = ${communityId}`;
    }
    return { joined: true as const };
  });

export const leaveQuad = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((communityId: string) => communityId)
  .handler(async ({ context, data: communityId }) => {
    const sql = await getSql();
    const mem = await sql<{ role?: string }>`
      select role from community_members where user_id = ${context.userId} and community_id = ${communityId}
    `;
    if (!mem[0]) return { left: true as const };
    if (mem[0].role === "owner") {
      const otherOwners = await sql`
        select user_id from community_members
        where community_id = ${communityId} and role = ${"owner"} and user_id <> ${context.userId}
        limit 1
      `;
      if (!otherOwners[0]) throw new Error("Transfer Quad ownership before leaving.");
    }
    await sql`delete from community_members where user_id = ${context.userId} and community_id = ${communityId}`;
    const count = await sql`select count(*)::int as count from community_members where community_id = ${communityId}`;
    await sql`update communities set members = ${Number(count[0]?.count ?? 0)} where id = ${communityId}`;
    return { left: true as const };
  });
