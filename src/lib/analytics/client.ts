export type PublicAnalyticsEvent = { eventName: "page_view" | "post_view" | "post_like" | "post_comment" | "post_share" | "category_filter"; pagePath: string; contentId?: string };
const CONSENT_KEY = "unibud-optional-analytics-consent";
export function trackPublicAnalyticsEvent(event: PublicAnalyticsEvent) {
  if (typeof window === "undefined" || navigator.doNotTrack === "1") return;
  try { if (window.localStorage.getItem(CONSENT_KEY) !== "accepted") return; } catch { return; }
  const pagePath = event.pagePath.split(/[?#]/, 1)[0] || "/";
  if (!pagePath.startsWith("/") || pagePath.startsWith("//") || pagePath.length > 300) return;
  if (event.eventName !== "page_view") window.gtag?.("event", event.eventName, { page_path: pagePath, content_id: event.contentId });
  void fetch("/api/analytics/event", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...event, pagePath }) }).catch(() => {});
}
