import { Link, useRouterState } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { resolveBudShortcut, useCampusStore } from "@/lib/unibud/campus-store";
import { cn } from "@/lib/utils";

/**
 * Bud shortcut — the only visible AI entry.
 * Placement: top (default) | bottom | hidden (Settings).
 * Quiet chrome, clear presence: always available, never competing with Square/Connect/Chat.
 */
export function AskBudFab({ menuOpen }: { menuOpen: boolean }) {
  const shortcut = useCampusStore((s) => resolveBudShortcut(s));
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hideOnRoute =
    menuOpen ||
    pathname.startsWith("/bud") ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/studies") ||
    pathname.startsWith("/board") ||
    pathname.startsWith("/tutor") ||
    pathname.startsWith("/live") ||
    pathname.startsWith("/podcasts") ||
    pathname.startsWith("/welcome") ||
    pathname.startsWith("/spill") ||
    pathname.startsWith("/riff") ||
    pathname.startsWith("/fixer");

  if (shortcut === "hidden" || hideOnRoute) return null;

  const atTop = shortcut === "top";

  return (
    <Link
      to="/bud"
      aria-label="Ask Bud"
      className={cn(
        "fixed z-40 flex h-11 items-center gap-2 rounded-full px-4 text-sm font-medium shadow-soft",
        "bg-ink text-paper",
        "ring-1 ring-black/5",
        atTop ? "right-3" : "right-4",
      )}
      style={
        atTop
          ? {
              /* Sit where primary nav used to live: just under the global header */
              top: "max(0.75rem, calc(env(safe-area-inset-top) + 3.25rem))",
            }
          : {
              bottom: "max(1.25rem, calc(env(safe-area-inset-bottom) + 4.75rem))",
            }
      }
    >
      <Sparkles className="size-4 shrink-0 opacity-90" aria-hidden />
      <span>Ask Bud</span>
    </Link>
  );
}
