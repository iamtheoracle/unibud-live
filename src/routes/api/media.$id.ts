import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { requireUserId } from "@/lib/auth/verify.server";
import { assertConversationMember } from "@/lib/social/server";
import { canReadMedia } from "@/lib/media/access.server";
import { mediaStorageErrorStatus, readMediaBytes } from "@/lib/media/store.server";

export const Route = createFileRoute("/api/media/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const id = params.id;
        let userId: string;
        try {
          userId = await requireUserId();
        } catch {
          return new Response("Unauthorized", { status: 401 });
        }

        const sql = await getSql();
        const rows = await sql`select owner_id, mime_type, status, visibility, conversation_id, room_id
          from media_assets where id = ${id} limit 1`;
        const row = rows[0];
        if (!row || String(row.status) === "deleted") {
          return new Response("Gone", { status: 404 });
        }
        if (String(row.status) !== "ready") {
          return new Response("Not ready", { status: 409 });
        }

        // Recheck current membership on every read. Inconsistent scope metadata
        // is denied by the shared policy helper.
        const allowed = await canReadMedia({
          userId,
          row,
          assertConversationMember,
          isRoomMember: async (memberId, roomId) => {
            const membership = await sql`select r.id, r.community_id from campus_rooms r join campus_room_members m on m.room_id = r.id and m.user_id = ${memberId} where r.id = ${roomId} limit 1`;
            if (!membership[0]) return false;
            if (membership[0].community_id) {
              const communityMember = await sql`select user_id from community_members where community_id = ${String(membership[0].community_id)} and user_id = ${memberId} limit 1`;
              if (!communityMember[0]) return false;
            }
            return true;
          },
        });
        if (!allowed) return new Response("Forbidden", { status: 403 });

        try {
          const bytes = await readMediaBytes(id);
          return new Response(new Uint8Array(bytes), {
            headers: {
              "Content-Type": String(row.mime_type),
              "Cache-Control": "private, no-store",
              "X-Content-Type-Options": "nosniff",
              "Content-Security-Policy": "default-src 'none'; sandbox",
            },
          });
        } catch (error) {
          const status = mediaStorageErrorStatus(error);
          return new Response(status === 404 ? "Missing file" : "Media storage temporarily unavailable", {
            status,
            headers: {
              "Cache-Control": "private, no-store",
              ...(status === 503 ? { "Retry-After": "30" } : {}),
            },
          });
        }
      },
    },
  },
});
