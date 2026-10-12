import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";

const EVENT_NAMES = new Set(["page_view", "post_view", "post_like", "post_comment", "post_share", "category_filter"]);

export const trackAnalyticsEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { eventName: string; pagePath: string; contentId?: string }) => input)
  .handler(async ({ context, data }) => {
    const eventName = data.eventName.trim();
    const pagePath = data.pagePath.trim();
    const contentId = data.contentId?.trim().slice(0, 128) || null;
    if (!EVENT_NAMES.has(eventName)) throw new Error("Unsupported analytics event.");
    if (!pagePath.startsWith("/") || pagePath.startsWith("//") || pagePath.length > 300) {
      throw new Error("Invalid analytics page path.");
    }
    const sql = await getSql();
    await sql`INSERT INTO analytics_events (id, event_name, page_path, content_id, user_id)
      VALUES (${crypto.randomUUID()}, ${eventName}, ${pagePath}, ${contentId}, ${context.userId})`;
    return { recorded: true as const };
  });

/** Admin reporting is deny-by-default until Netlify configures the approved account IDs. */
export const getAnalyticsSummary = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const allowed = new Set((process.env.UNIBUD_ANALYTICS_ADMIN_IDS ?? "").split(",").map((id) => id.trim()).filter(Boolean));
    if (!allowed.has(context.userId)) throw new Error("Analytics access is restricted to approved administrators.");
    const sql = await getSql();
    const [totals, topPosts, eventBreakdown] = await Promise.all([
      sql`SELECT COUNT(*)::int AS events, COUNT(*) FILTER (WHERE event_name = 'page_view')::int AS page_views,
        COUNT(DISTINCT user_id) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days')::int AS active_signed_in_users
        FROM analytics_events WHERE created_at >= NOW() - INTERVAL '30 days'`,
      sql`SELECT p.id, LEFT(p.body, 120) AS title,
        (SELECT COUNT(*)::int FROM analytics_events e WHERE e.content_id = p.id AND e.event_name = 'post_view' AND e.created_at >= NOW() - INTERVAL '30 days') AS views,
        (SELECT COUNT(*)::int FROM post_likes l WHERE l.post_id = p.id) AS likes,
        (SELECT COUNT(*)::int FROM post_replies r WHERE r.post_id = p.id) AS comments
        FROM posts p ORDER BY views DESC, likes DESC, comments DESC LIMIT 10`,
      sql`SELECT event_name, COUNT(*)::int AS count FROM analytics_events
        WHERE created_at >= NOW() - INTERVAL '30 days' GROUP BY event_name ORDER BY count DESC`,
    ]);
    return { periodDays: 30, totals: totals[0] ?? { events: 0, page_views: 0, active_signed_in_users: 0 }, topPosts, eventBreakdown };
  });
