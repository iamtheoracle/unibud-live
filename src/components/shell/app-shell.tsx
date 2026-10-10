import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Bell, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "@/components/brand/logo";
import { AskBudFab } from "@/components/unibud/ask-bud";
import { SparkGate } from "@/components/shell/spark-gate";
import { DropSheet } from "@/components/unibud/drop-sheet";
import { StudioRoot } from "@/components/studio/studio-root";
import { cn } from "@/lib/utils";
import { unreadCount, useCampusStore } from "@/lib/unibud/campus-store";
import { PrimaryNav } from "./primary-nav";
import { SideMenu } from "./side-menu";
import { useRightDrawer } from "./use-right-drawer";

export function AppShell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const notes = useCampusStore((s) => s.notes);
  const unread = unreadCount(notes);
  const drawer = useRightDrawer();
  const composeOpen = useCampusStore((s) => s.composeOpen);
  const dropOpen = useCampusStore((s) => s.dropOpen);
  const setDropOpen = useCampusStore((s) => s.setDropOpen);
  const squareView = useCampusStore((s) => s.squareView);
  const setSquareView = useCampusStore((s) => s.setSquareView);
  const hideTabs = pathname.startsWith("/bud") || pathname.startsWith("/welcome");
  const [away, setAway] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    if (!pathname.startsWith("/bud")) sessionStorage.setItem("unibud-last-path", pathname);
    if (pathname !== "/") setSquareView("feed");
  }, [pathname, setSquareView]);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const down = y > lastY.current + 6;
      const up = y < lastY.current - 6;
      if (down && y > 24) setAway(true);
      else if (up || y < 16) setAway(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const hidden = hideTabs ? false : away || squareView === "peek";
  const showPrimary = !hideTabs && squareView !== "peek";

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {hideTabs ? null : (
        <header
          className={cn(
            "fixed inset-x-0 top-0 z-30 bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur-sm transition-transform duration-200",
            hidden ? "-translate-y-full" : "translate-y-0",
          )}
        >
          <div className="mx-auto flex h-12 max-w-3xl items-center justify-between gap-2 px-3">
            <button
              type="button"
              aria-label="Open menu"
              onClick={drawer.openMenu}
              className="grid size-11 place-items-center rounded-full text-foreground hover:bg-secondary"
            >
              <span className="flex flex-col gap-1">
                <span className="block h-0.5 w-4 rounded-full bg-current" />
                <span className="block h-0.5 w-3 rounded-full bg-current" />
              </span>
            </button>
            <Link to="/" className="min-w-0 flex-1">
              <Wordmark size="sm" className="mx-auto max-w-[7.5rem]" />
            </Link>
            <div className="flex items-center gap-0.5">
              <Link
                to="/search"
                aria-label="Search"
                className="grid size-11 place-items-center rounded-full text-foreground hover:bg-secondary"
              >
                <Search className="size-5" />
              </Link>
              <Link
                to="/notifications"
                aria-label="Notifications"
                title="Notifications"
                className="relative grid size-11 place-items-center rounded-full text-foreground hover:bg-secondary"
              >
                <Bell className="size-5" />
                {unread > 0 ? (
                  <span className="absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-bud px-1 text-[10px] font-semibold text-bud-foreground">
                    {unread}
                  </span>
                ) : null}
              </Link>
            </div>
          </div>
          <div className="mx-auto max-w-3xl border-t border-border/30">
          </div>
        </header>
      )}

      <div
        className={cn(
          "mx-auto min-h-dvh max-w-3xl",
          hideTabs || squareView === "peek"
            ? ""
            : showPrimary
              ? "pt-[calc(3rem+3.25rem+env(safe-area-inset-top))] pb-[calc(4.5rem+env(safe-area-inset-bottom))]"
              : "pt-[calc(3rem+3.25rem+env(safe-area-inset-top))]",
        )}
      >
        <Outlet />
      </div>

      {showPrimary ? (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-30 border-t border-border/60 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm transition-transform duration-200",
            hidden ? "translate-y-full" : "translate-y-0",
          )}
        >
          <div className="mx-auto max-w-3xl px-2 pt-1">
            <PrimaryNav />
          </div>
        </div>
      ) : null}

      {/* Destinations launcher — float above primary dock; not the Spark agent */}
      {showPrimary && !hidden ? (
        <div
          className="pointer-events-none fixed right-3 z-40 max-w-3xl"
          style={{
            bottom: "calc(4.25rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div className="pointer-events-auto ml-auto w-fit">
            <SparkGate />
          </div>
        </div>
      ) : null}

      {!showPrimary ? (
        <AskBudFab menuOpen={drawer.open || hidden || composeOpen || dropOpen} />
      ) : null}
      {dropOpen ? <DropSheet onClose={() => setDropOpen(false)} /> : null}
      <StudioRoot />

      <SideMenu
        open={drawer.open}
        progress={drawer.progress}
        dragging={drawer.dragging}
        onClose={drawer.close}
        onDrawerPointerDown={drawer.onDrawerPointerDown}
        onPointerMove={drawer.onPointerMove}
        onPointerUp={drawer.onPointerUp}
      />
    </div>
  );
}
