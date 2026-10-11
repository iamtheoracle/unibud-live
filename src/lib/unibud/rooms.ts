import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

type RoomKind = "group" | "class" | "study" | "community";

async function requireRoomMember(userId: string, roomId: string) {
  const sql = await getSql();
  const rows = await sql`
    select r.id, r.kind, r.title, r.subtitle, r.community_id, r.is_private,
           m.role
    from campus_rooms r
    join campus_room_members m on m.room_id = r.id and m.user_id = ${userId}
    where r.id = ${roomId}
    limit 1
  `;
  if (!rows[0]) throw new Error("Room not found or access denied.");
  if (rows[0].community_id) {
    const membership = await sql`select user_id from community_members where community_id = ${String(rows[0].community_id)} and user_id = ${userId} limit 1`;
    if (!membership[0]) throw new Error("Join this Quad before accessing its linked room.");
  }
  return rows[0];
}

export const listCampusRooms = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql`
      select r.id, r.kind, r.title, r.subtitle, r.community_id, r.updated_at,
        (select count(*)::int from campus_room_members m where m.room_id = r.id) as member_count,
        (select rm.body from room_messages rm where rm.room_id = r.id order by rm.created_at desc limit 1) as last_body,
        exists(select 1 from campus_room_members mine where mine.room_id = r.id and mine.user_id = ${context.userId}) as is_member
      from campus_rooms r
      where not r.is_private or exists(
        select 1 from campus_room_members mine where mine.room_id = r.id and mine.user_id = ${context.userId}
      )
      order by r.updated_at desc
      limit 100
    `;
    const visible = [];
    for (const row of rows) {
      if (row.community_id) {
        const membership = await sql`select user_id from community_members where community_id = ${String(row.community_id)} and user_id = ${context.userId} limit 1`;
        if (!membership[0]) continue;
      }
      visible.push({
        id: String(row.id),
        kind: String(row.kind) as RoomKind,
        title: String(row.title),
        subtitle: String(row.subtitle ?? ""),
        communityId: row.community_id == null ? undefined : String(row.community_id),
        updatedAt: String(row.updated_at),
        lastBody: String(row.last_body ?? ""),
        memberCount: Number(row.member_count ?? 0),
        isMember: Boolean(row.is_member),
      });
    }
    return visible;
  });

export const createCampusRoom = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { title: string; subtitle?: string; kind: RoomKind; isPrivate?: boolean; communityId?: string }) => input)
  .handler(async ({ context, data }) => {
    const title = (data.title ?? "").trim().slice(0, 100);
    const subtitle = (data.subtitle ?? "").trim().slice(0, 240);
    if (title.length < 2) throw new Error("Room title must contain at least two characters.");
    if (!["group", "class", "study", "community"].includes(data.kind)) throw new Error("Invalid room type.");
    if (data.kind === "class") throw new Error("Class rooms must be created through a verified course flow.");
    if (data.kind === "community") throw new Error("Create community-linked rooms through the authorized Quad management flow.");
    if (data.isPrivate) throw new Error("Private rooms are unavailable until room invitations are supported.");
    const sql = await getSql();
    if (data.communityId) throw new Error("Community-linked rooms must be created through the authorized Quad management flow.");
    const id = `room_${crypto.randomUUID()}`;
    await sql`insert into campus_rooms (id, kind, title, subtitle, created_by, community_id, is_private)
      values (${id}, ${data.kind}, ${title}, ${subtitle}, ${context.userId}, ${data.communityId ?? null}, ${Boolean(data.isPrivate)})`;
    await sql`insert into campus_room_members (room_id, user_id, role) values (${id}, ${context.userId}, 'owner')`;
    return { id, kind: data.kind, title, subtitle };
  });

export const joinCampusRoom = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((roomId: string) => roomId)
  .handler(async ({ context, data: roomId }) => {
    const sql = await getSql();
    const rooms = await sql`select id, is_private, community_id from campus_rooms where id = ${roomId} limit 1`;
    if (!rooms[0]) throw new Error("Room not found.");
    const room = rooms[0];
    const existing = await sql`select role from campus_room_members where room_id = ${roomId} and user_id = ${context.userId} limit 1`;
    if (existing[0]) return { joined: true, roomId };
    if (Boolean(room.is_private)) throw new Error("This room is private. Ask a room member to invite you.");
    if (room.community_id) {
      const communityMember = await sql`select user_id from community_members where community_id = ${String(room.community_id)} and user_id = ${context.userId} limit 1`;
      if (!communityMember[0]) throw new Error("Join the linked Quad before joining its room.");
    }
    await sql`insert into campus_room_members (room_id, user_id) values (${roomId}, ${context.userId}) on conflict do nothing`;
    return { joined: true, roomId };
  });

export const leaveCampusRoom = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((roomId: string) => roomId)
  .handler(async ({ context, data: roomId }) => {
    const sql = await getSql();
    const rows = await sql`select role from campus_room_members where room_id = ${roomId} and user_id = ${context.userId} limit 1`;
    if (!rows[0]) return { left: true, roomId };
    if (String(rows[0].role) === "owner") throw new Error("Room owners must transfer ownership or delete the room before leaving.");
    await sql`delete from campus_room_members where room_id = ${roomId} and user_id = ${context.userId}`;
    return { left: true, roomId };
  });

export const listPersistentRoomMessages = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((roomId: string) => roomId)
  .handler(async ({ context, data: roomId }) => {
    await requireRoomMember(context.userId, roomId);
    const sql = await getSql();
    const rows = await sql`select id, sender_name, body, media_id, share_kind, share_json, created_at
      from room_messages where room_id = ${roomId} order by created_at desc limit 200`;
    return rows.reverse().map((row) => ({
      id: String(row.id),
      sender: String(row.sender_name),
      body: String(row.body),
      mediaId: row.media_id == null ? undefined : String(row.media_id),
      shareKind: row.share_kind == null ? undefined : String(row.share_kind),
      shareJson: row.share_json == null ? undefined : String(row.share_json),
      createdAt: String(row.created_at),
    }));
  });


export const getCampusRoom = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((roomId: string) => roomId)
  .handler(async ({ context, data: roomId }) => {
    const room = await requireRoomMember(context.userId, roomId);
    return {
      id: String(room.id),
      kind: String(room.kind) as RoomKind,
      title: String(room.title),
      subtitle: String(room.subtitle ?? ""),
      communityId: room.community_id == null ? undefined : String(room.community_id),
    };
  });
