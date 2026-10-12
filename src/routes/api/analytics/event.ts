import { createHash, randomBytes } from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

const COOKIE = "unibud_analytics_session";
const ALLOWED = new Set(["page_view", "post_view", "post_like", "post_comment", "post_share", "category_filter"]);
function readToken(request: Request) {
  const part = (request.headers.get("cookie") ?? "").split(";").map((v) => v.trim()).find((v) => v.startsWith(COOKIE + "="));
  return part ? decodeURIComponent(part.slice(COOKIE.length + 1)) : "";
}
export const Route = createFileRoute("/api/analytics/event")({
  server: { handlers: { POST: async ({ request }) => {
    let input: { eventName?: unknown; pagePath?: unknown; contentId?: unknown };
    try { input = await request.json(); } catch { return Response.json({ error: "Invalid JSON." }, { status: 400 }); }
    const eventName = String(input.eventName ?? "");
    const pagePath = String(input.pagePath ?? "");
    const contentId = input.contentId == null ? null : String(input.contentId).slice(0, 128);
    if (!ALLOWED.has(eventName) || !pagePath.startsWith("/") || pagePath.startsWith("//") || pagePath.length > 300 || /[?#]/.test(pagePath)) {
      return Response.json({ error: "Invalid analytics event." }, { status: 400 });
    }
    let token = readToken(request);
    const isNew = !token || token.length > 128;
    if (isNew) token = randomBytes(32).toString("base64url");
    const sessionKey = createHash("sha256").update(token).digest("hex");
    const sql = await getSql();
    const rate = await sql`SELECT COUNT(*)::int AS count FROM analytics_events WHERE session_key = ${sessionKey} AND created_at > NOW() - INTERVAL '1 minute'`;
    if (Number(rate[0]?.count ?? 0) >= 60) return Response.json({ error: "Analytics event rate limit exceeded." }, { status: 429, headers: { "Cache-Control": "no-store" } });
    const recent = await sql`SELECT id FROM analytics_events WHERE session_key = ${sessionKey} AND event_name = ${eventName}
      AND created_at > NOW() - INTERVAL '30 minutes'
      AND ((${eventName} = 'page_view' AND page_path = ${pagePath}) OR (${eventName} <> 'page_view' AND content_id IS NOT DISTINCT FROM ${contentId})) LIMIT 1`;
    if (!recent[0]) await sql`INSERT INTO analytics_events (id,event_name,page_path,content_id,session_key)
      VALUES (${crypto.randomUUID()},${eventName},${pagePath},${contentId},${sessionKey})`;
    return Response.json({ recorded: true, deduplicated: Boolean(recent[0]) }, { headers: {
      "Cache-Control": "no-store",
      ...(isNew ? { "Set-Cookie": `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=2592000` } : {}),
    } });
  } } },
});
