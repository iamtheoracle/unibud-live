import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { trackAnalyticsEvent } from "@/lib/analytics/server";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "unibud-optional-analytics-consent";

export function GoogleAnalytics() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const [consent, setConsent] = useState<"accepted" | "rejected" | "unset">("unset");
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim() ?? "";

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CONSENT_KEY);
      if (saved === "accepted" || saved === "rejected") setConsent(saved);
    } catch {
      setConsent("rejected");
    }
  }, []);

  useEffect(() => {
    if (consent !== "accepted" || !/^G-[A-Z0-9]+$/.test(measurementId) || navigator.doNotTrack === "1") return;
    if (!document.querySelector('script[data-unibud-ga="true"]')) {
      const script = document.createElement("script");
      script.async = true;
      script.dataset.unibudGa = "true";
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
    }
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = (...args: unknown[]) => { window.dataLayer?.push(args); };
    window.gtag("js", new Date());
    window.gtag("config", measurementId, { send_page_view: false, anonymize_ip: true });
  }, [consent, measurementId]);

  useEffect(() => {
    if (consent !== "accepted" || !/^G-[A-Z0-9]+$/.test(measurementId) || navigator.doNotTrack === "1") return;
    window.gtag?.("event", "page_view", { page_path: pathname, page_location: window.location.href, page_title: document.title });
  }, [consent, measurementId, pathname]);

  useEffect(() => {
    if (isPending || !user || pathname.length > 300 || !pathname.startsWith("/")) return;
    void trackAnalyticsEvent({ data: { eventName: "page_view", pagePath: pathname } }).catch(() => {});
  }, [isPending, user, pathname]);

  if (consent !== "unset" || !/^G-[A-Z0-9]+$/.test(measurementId)) return null;
  const choose = (value: "accepted" | "rejected") => {
    try { window.localStorage.setItem(CONSENT_KEY, value); } catch { /* optional analytics stays off if consent cannot be stored */ }
    setConsent(value);
  };
  return (
    <aside className="fixed inset-x-3 bottom-3 z-[100] mx-auto flex max-w-xl flex-wrap items-center gap-3 rounded-2xl border border-border bg-background p-4 text-foreground shadow-xl" role="dialog" aria-label="Optional analytics preferences">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Help us improve UNIBUD</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Optional analytics measure visits and post engagement. No analytics runs until you choose.</p>
      </div>
      <button type="button" className="rounded-full border border-border px-3 py-2 text-xs" onClick={() => choose("rejected")}>Reject</button>
      <button type="button" className="rounded-full bg-ink px-3 py-2 text-xs font-semibold text-paper" onClick={() => choose("accepted")}>Accept analytics</button>
    </aside>
  );
}
