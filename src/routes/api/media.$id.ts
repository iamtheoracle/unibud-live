import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { requireUserId } from "@/lib/auth/verify.server";
import { assertConversationMember } from "@/lib/social/server";
import { readMediaBytes } from "@/lib/media/store.server";

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

        // Media is private by default. Conversation attachments require current
        // membership, including revalidation of class and community access.
        if (String(row.visibility) === "conversation" && row.conversation_id) {
          try {
            await assertConversationMember(userId, String(row.conversation_id));
          } catch {
            return new Response("Forbidden", { status: 403 });
          }
        } else if (String(row.visibility) === "room" || row.room_id) {
          // Room membership is not backed by a verified persistent room model
          // yet. Fail closed rather than exposing room uploads by guessed IDs.
          return new Response("Forbidden", { status: 403 });
        } else if (String(row.owner_id) !== userId) {
          return new Response("Forbidden", { status: 403 });
        }

        try {
          const bytes = await readMediaBytes(id);
          return new Response(bytes, {
            headers: {
              "Content-Type": String(row.mime_type),
              "Cache-Control": "private, no-store",
              "X-Content-Type-Options": "nosniff",
              "Content-Security-Policy": "default-src 'none'; sandbox",
            },
          });
        } catch {
          return new Response("Missing file", { status: 404 });
        }
      },
    },
  },
});
