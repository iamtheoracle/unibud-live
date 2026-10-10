import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapCommunity } from "./map";

export type QuadPrivacy = "public" | "campus" | "private";

export const createQuad = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      name: string;
      description?: string;
      kind?: string;
      privacy?: QuadPrivacy;
      cover?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const name = data.name.trim();
    if (name.length < 2) throw new Error("Give your Quad a name.");
    if (name.length > 80) throw new Error("Keep the name under 80 characters.");
    const description = (data.description ?? "").trim().slice(0, 500);
    const kind = (data.kind ?? "Interest").trim() || "Interest";
    const privacy: QuadPrivacy =
      data.privacy === "private" || data.privacy === "campus" ? data.privacy : "public";
    const sql = await getSql();
    const id = `q_${crypto.randomUUID().slice(0, 10)}`;
    try {
      await sql`
        insert into communities (id, name, kind, university_id, description, cover, members, privacy, created_by)
        values (${id}, ${name}, ${kind}, ${null}, ${description}, ${data.cover ?? null}, ${1}, ${privacy}, ${context.userId})
      `;
    } catch {
      await sql`
        insert into communities (id, name, kind, university_id, description, cover, members)
        values (${id}, ${name}, ${kind}, ${null}, ${description}, ${data.cover ?? null}, ${1})
      `;
    }
    try {
      await sql`
        insert into community_members (user_id, community_id, role)
        values (${context.userId}, ${id}, ${"owner"})
        on conflict (user_id, community_id) do update set role = ${"owner"}
      `;
    } catch {
      await sql`
        insert into community_members (user_id, community_id)
        values (${context.userId}, ${id})
        on conflict do nothing
      `;
    }
    const rows = await sql`select * from communities where id = ${id} limit 1`;
    return mapCommunity(rows[0]);
  });

export const joinQuad = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((communityId: string) => communityId)
  .handler(async ({ context, data: communityId }) => {
    const sql = await getSql();
    const room = await sql<{ privacy?: string }>`select privacy from communities where id = ${communityId} limit 1`;
    if (!room[0]) throw new Error("That Quad was not found.");
    const privacy = room[0].privacy ?? "public";
    if (privacy === "private") {
      const already = await sql`
        select user_id from community_members where user_id = ${context.userId} and community_id = ${communityId}
      `;
      if (!already[0]) throw new Error("This Quad is private. Ask an admin to invite you.");
      return { joined: true as const };
    }
    const existing = await sql`
      select user_id from community_members where user_id = ${context.userId} and community_id = ${communityId}
    `;
    if (existing[0]) return { joined: true as const };
    try {
      await sql`
        insert into community_members (user_id, community_id, role)
        values (${context.userId}, ${communityId}, ${"member"})
      `;
    } catch {
      await sql`
        insert into community_members (user_id, community_id)
        values (${context.userId}, ${communityId})
        on conflict do nothing
      `;
    }
    await sql`update communities set members = members + 1 where id = ${communityId}`;
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
    await sql`delete from community_members where user_id = ${context.userId} and community_id = ${communityId}`;
    await sql`update communities set members = greatest(members - 1, 0) where id = ${communityId}`;
    return { left: true as const };
  });
