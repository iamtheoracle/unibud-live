import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { assertConversationMember } from "@/lib/social/server";
import { parseDataUrl, removeMediaBytes, writeMediaBytes } from "./store.server";
import { kindFromMime, MAX_UPLOAD_BYTES, type MediaKind } from "./types";
import { BUD_MEDIA } from "./bud-media";
import { REVENUE_POLICY } from "@/lib/music/monetization";

async function ensureBudSeed() {
  const sql = await getSql();
  for (const m of BUD_MEDIA) {
    const existing = await sql`select id from bud_media where id = ${m.id} limit 1`;
    if (existing[0]) continue;
    await sql`insert into bud_media (id, owner_id, kind, title, course, duration_min, status, visibility)
      values (${m.id}, ${"unibud-academic"}, ${m.kind}, ${m.title}, ${m.course ?? null}, ${m.durationMin}, ${"awaiting_file"}, ${"class"})`;
  }
}

export const uploadMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { dataUrl: string; fileName: string; mime?: string; kind?: MediaKind; conversationId?: string; roomId?: string }) => input)
  .handler(async ({ context, data }) => {
    const parsed = parseDataUrl(data.dataUrl);
    if (parsed.bytes.length > MAX_UPLOAD_BYTES) {
      return { ok: false as const, error: "That file is over 8 MB." };
    }
    const mime = data.mime || parsed.mime;
    const kind = data.kind ?? kindFromMime(mime);
    if (data.conversationId) {
      await assertConversationMember(context.userId, data.conversationId);
    }
    if (data.conversationId && data.roomId) {
      throw new Error("A media upload can belong to a conversation or a room, not both.");
    }
    const sql = await getSql();
    if (data.roomId) {
      const room = await sql`select r.id, r.community_id from campus_rooms r join campus_room_members m on m.room_id = r.id and m.user_id = ${context.userId} where r.id = ${data.roomId} limit 1`;
      if (!room[0]) throw new Error("Room not found or access denied.");
      if (room[0].community_id) {
        const cm = await sql`select user_id from community_members where community_id = ${String(room[0].community_id)} and user_id = ${context.userId} limit 1`;
        if (!cm[0]) throw new Error("Join the linked Quad before uploading to this room.");
      }
    }
    const id = crypto.randomUUID();
    await sql`insert into media_assets (id, owner_id, kind, mime_type, file_name, file_size, storage_path, status, visibility, conversation_id, room_id)
      values (${id}, ${context.userId}, ${kind}, ${mime}, ${data.fileName}, ${parsed.bytes.length}, ${id}, ${"processing"}, ${data.roomId ? "room" : data.conversationId ? "conversation" : "private"}, ${data.conversationId ?? null}, ${data.roomId ?? null})`;
    try {
      await writeMediaBytes(id, parsed.bytes);
      await sql`update media_assets set status = ${"ready"}, updated_at = now() where id = ${id}`;
      return { ok: true as const, id, kind, mime, size: parsed.bytes.length };
    } catch (err) {
      await sql`update media_assets set status = ${"failed"}, error = ${String(err)}, updated_at = now() where id = ${id}`;
      return { ok: false as const, error: "Upload failed. Try again." };
    }
  });

export const deleteMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const rows = await sql`select owner_id from media_assets where id = ${id} limit 1`;
    if (!rows[0] || String(rows[0].owner_id) !== context.userId) throw new Error("Not allowed");
    await sql`update media_assets set status = ${"deleted"}, updated_at = now() where id = ${id}`;
    await removeMediaBytes(id);
    return { ok: true };
  });

export const reportMedia = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { mediaId?: string; audioId?: string; reason: string }) => input)
  .handler(async ({ context, data }) => {
    const reason = (data.reason ?? "").trim().slice(0, 1000);
    if (Boolean(data.mediaId) === Boolean(data.audioId)) {
      throw new Error("Choose exactly one media item to report.");
    }
    if (reason.length < 3) throw new Error("Please provide a short reason for this report.");
    const sql = await getSql();
    if (data.mediaId) {
      const target = await sql`select id from media_assets where id = ${data.mediaId} and status <> ${"deleted"} limit 1`;
      if (!target[0]) throw new Error("Media item not found.");
    } else if (data.audioId) {
      const target = await sql`select audio_id from audio_objects where audio_id = ${data.audioId} limit 1`;
      if (!target[0]) throw new Error("Audio item not found.");
    }
    await sql`insert into media_reports (id, media_id, audio_id, reporter_id, reason)
      values (${crypto.randomUUID()}, ${data.mediaId ?? null}, ${data.audioId ?? null}, ${context.userId}, ${reason})`;
    return { ok: true };
  });

export const listBudMedia = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async () => {
    await ensureBudSeed();
    const sql = await getSql();
    const rows = await sql`select * from bud_media order by created_at desc`;
    return rows.map((r) => ({
      id: String(r.id),
      kind: String(r.kind),
      title: String(r.title),
      course: r.course ? String(r.course) : undefined,
      durationMin: Number(r.duration_min ?? 0),
      mediaId: r.media_id ? String(r.media_id) : undefined,
      status: String(r.status),
      lecturer: r.lecturer ? String(r.lecturer) : undefined,
      origin: "bud" as const,
    }));
  });

export const attachBudFile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { budId: string; mediaId: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const owned = await sql`select id from media_assets where id = ${data.mediaId} and owner_id = ${context.userId} and status = ${"ready"}`;
    if (!owned[0]) throw new Error("Media not ready");
    const target = await sql`select id, owner_id from bud_media where id = ${data.budId} limit 1`;
    if (!target[0] || String(target[0].owner_id) !== context.userId) {
      throw new Error("You can only attach files to media items you own.");
    }
    await sql`update bud_media set media_id = ${data.mediaId}, status = ${"ready"} where id = ${data.budId} and owner_id = ${context.userId}`;
    return { ok: true };
  });

export const listRoomMessages = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((roomId: string) => roomId)
  .handler(async ({ context, data: roomId }) => {
    const sql = await getSql();
    const room = await sql`select r.id, r.community_id from campus_rooms r join campus_room_members m on m.room_id = r.id and m.user_id = ${context.userId} where r.id = ${roomId} limit 1`;
    if (!room[0]) throw new Error("Room not found or access denied.");
    if (room[0].community_id) {
      const cm = await sql`select user_id from community_members where community_id = ${String(room[0].community_id)} and user_id = ${context.userId} limit 1`;
      if (!cm[0]) throw new Error("Join the linked Quad before accessing its room.");
    }
    const rows = await sql`select * from room_messages where room_id = ${roomId} order by created_at asc limit 200`;
    return rows.map((r) => ({
      id: String(r.id),
      sender: String(r.sender_name),
      body: String(r.body),
      mediaId: r.media_id ? String(r.media_id) : undefined,
      shareKind: r.share_kind ? String(r.share_kind) : undefined,
      shareJson: r.share_json ? String(r.share_json) : undefined,
      createdAt: String(r.created_at),
    }));
  });

export const sendRoomMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { roomId: string; body: string; senderName: string; mediaId?: string; shareKind?: string; shareJson?: string }) => input)
  .handler(async ({ context, data }) => {
    const body = (data.body ?? "").trim();
    if ((!body && !data.mediaId && !data.shareJson) || body.length > 10000) {
      throw new Error("Message must contain text or an attachment, up to 10,000 characters.");
    }
    const sql = await getSql();
    const room = await sql`select r.id, r.community_id from campus_rooms r join campus_room_members m on m.room_id = r.id and m.user_id = ${context.userId} where r.id = ${data.roomId} limit 1`;
    if (!room[0]) throw new Error("Room not found or access denied.");
    if (room[0].community_id) {
      const cm = await sql`select user_id from community_members where community_id = ${String(room[0].community_id)} and user_id = ${context.userId} limit 1`;
      if (!cm[0]) throw new Error("Join the linked Quad before sending to its room.");
    }
    if (data.mediaId) {
      const media = await sql`select id from media_assets where id = ${data.mediaId} and owner_id = ${context.userId} and room_id = ${data.roomId} and status = ${"ready"} limit 1`;
      if (!media[0]) throw new Error("Room attachment not found or access denied.");
    }
    const profile = await sql`select handle, display_name from student_profiles where user_id = ${context.userId} limit 1`;
    const senderName = String(profile[0]?.display_name ?? profile[0]?.handle ?? "UNIBUD member").slice(0, 80);
    const id = crypto.randomUUID();
    await sql`insert into room_messages (id, room_id, user_id, sender_name, body, media_id, share_kind, share_json)
      values (${id}, ${data.roomId}, ${context.userId}, ${senderName}, ${body || data.shareKind || "Attachment"}, ${data.mediaId ?? null}, ${data.shareKind ?? null}, ${data.shareJson ?? null})`;
    await sql`update campus_rooms set updated_at = now() where id = ${data.roomId}`;
    const rows = await sql`select * from room_messages where room_id = ${data.roomId} order by created_at desc limit 200`;
    return rows.reverse().map((r) => ({
      id: String(r.id),
      sender: String(r.sender_name),
      body: String(r.body),
      mediaId: r.media_id ? String(r.media_id) : undefined,
      shareKind: r.share_kind ? String(r.share_kind) : undefined,
      shareJson: r.share_json ? String(r.share_json) : undefined,
      createdAt: String(r.created_at),
    }));
  });

export const persistAudioEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { kind: string; audioId?: string; budMediaId?: string; providerId?: string; surface: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`insert into audio_events (id, kind, user_id, audio_id, bud_media_id, provider_id, surface)
      values (${crypto.randomUUID()}, ${data.kind}, ${context.userId}, ${data.audioId ?? null}, ${data.budMediaId ?? null}, ${data.providerId ?? null}, ${data.surface})`;
    return { ok: true };
  });

export const recordPartnerClick = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { provider: string; trackId?: string; surface?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`insert into partner_clicks (id, user_id, provider, track_id, surface, revenue_kobo)
      values (${crypto.randomUUID()}, ${context.userId}, ${data.provider}, ${data.trackId ?? null}, ${data.surface ?? null}, ${REVENUE_POLICY.revenueKobo})`;
    return { ok: true, revenueKobo: 0 };
  });
