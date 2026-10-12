import { timingSafeEqual } from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";

export const Route = createFileRoute("/api/internal/analytics")({
  server: { handlers: { GET: async ({ request }) => {
    const expected = process.env.UNIBUD_ANALYTICS_API_KEY ?? "";
    const supplied = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (expected.length < 32 || supplied.length !== expected.length || Buffer.byteLength(supplied) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
      return Response.json({ error: "Unauthorized." }, { status: 401, headers: { "Cache-Control": "no-store" } });
    }
    const sql = await getSql();
    const [totals, topPosts, pages] = await Promise.all([
      sql`SELECT COUNT(*) FILTER (WHERE event_name = 'page_view')::int AS page_views,
        COUNT(DISTINCT session_key) FILTER (WHERE event_name = 'page_view')::int AS unique_visitors,
        COUNT(*) FILTER (WHERE event_name = 'post_view')::int AS post_views
        FROM analytics_events WHERE created_at >= NOW() - INTERVAL '30 days'`,
      sql`SELECT p.id, LEFT(p.body, 120) AS title,
        (SELECT COUNT(*)::int FROM analytics_events e WHERE e.content_id = p.id AND e.event_name = 'post_view' AND e.created_at >= NOW() - INTERVAL '30 days') AS views,
        (SELECT COUNT(*)::int FROM post_likes l WHERE l.post_id = p.id AND l.created_at >= NOW() - INTERVAL '30 days') AS likes,
        (SELECT COUNT(*)::int FROM post_replies r WHERE r.post_id = p.id AND r.created_at >= NOW() - INTERVAL '30 days') AS comments
        FROM posts p
        ORDER BY views DESC, likes DESC, comments DESC LIMIT 10`,
      sql`SELECT page_path, COUNT(*)::int AS views FROM analytics_events WHERE event_name = 'page_view' AND created_at >= NOW() - INTERVAL '30 days' GROUP BY page_path ORDER BY views DESC LIMIT 12`,
    ]);
    return Response.json({ periodDays: 30, totals: totals[0] ?? { page_views: 0, unique_visitors: 0, post_views: 0 }, topPosts, pages }, { headers: { "Cache-Control": "no-store" } });
  } } },
});
