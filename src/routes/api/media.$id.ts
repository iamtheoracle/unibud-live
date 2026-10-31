import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { requireUserId } from "@/lib/auth/verify.server";
import { readMediaBytes } from "@/lib/media/store.server";

/**
 * Media is private by default. Until conversation/room/class membership checks
 * are wired to authoritative membership records, shared visibility is denied.
 */
export const Route = createFileRoute("/api/media/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        let userId: string;
        try {
          userId = await requireUserId();
        } catch {
          return new Response("Unauthorized", {
            status: 401,
            headers: { "Cache-Control": "no-store" },
          });
        }

        const id = params.id;
        if (!id || id.length > 128 || !/^[a-zA-Z0-9_-]+$/.test(id)) {
          return new Response("Not found", { status: 404 });
        }

        const sql = await getSql();
        const rows = await sql`select owner_id, mime_type, status, visibility
          from media_assets where id = ${id} limit 1`;
        const row = rows[0];
        if (!row || String(row.status) !== "ready") {
          return new Response("Not found", {
            status: 404,
            headers: { "Cache-Control": "no-store" },
          });
        }

        // Owner-only is the only permission currently proven by the schema.
        // Never expose shared media until membership authorization is implemented.
        if (
          String(row.owner_id) !== userId ||
          String(row.visibility) !== "private"
        ) {
          return new Response("Forbidden", {
            status: 403,
            headers: { "Cache-Control": "no-store" },
          });
        }

        try {
          const bytes = await readMediaBytes(id);
          return new Response(bytes, {
            headers: {
              "Content-Type": String(row.mime_type),
              "Content-Length": String(bytes.byteLength),
              "Cache-Control": "private, no-store",
              "X-Content-Type-Options": "nosniff",
              "Content-Security-Policy": "default-src 'none'; sandbox",
              "Cross-Origin-Resource-Policy": "same-origin",
            },
          });
        } catch {
          return new Response("Media unavailable", {
            status: 404,
            headers: { "Cache-Control": "no-store" },
          });
        }
      },
    },
  },
});
