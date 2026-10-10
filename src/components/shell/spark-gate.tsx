import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, Compass, GraduationCap, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Destinations exposed by the lifestyle launcher (not the Spark agent runtime). */
const LAUNCHER_ACTIONS = [
  {
    id: "board",
    label: "Board",
    description: "Your class, cohort, and academic space",
    to: "/board" as const,
    icon: GraduationCap,
  },
  {
    id: "commerce",
    label: "Commerce",
    description: "Wallet, payments, and marketplace",
    to: "/money" as const,
    icon: Wallet,
  },
  {
    id: "services",
    label: "Services",
    description: "Find or offer services around you",
    to: "/creator" as const,
    icon: BriefcaseBusiness,
  },
] as const;

/**
 * Compact UI entry point for Board / Commerce / Services.
 * Internal module name retained for compatibility; must not be labeled "Spark"
 * in the UI (Spark is the separate agent orchestration system).
 */
export function SparkGate({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const el = root.current;
      if (el && e.target instanceof Node && !el.contains(e.target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("touchstart", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("touchstart", onPointer);
    };
  }, [open]);

  return (
    <div ref={root} className={cn("relative", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? "Close destinations" : "Explore destinations"}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "grid size-11 place-items-center rounded-full bg-bud text-bud-foreground shadow-soft ring-1 ring-bud/30 transition-[transform,box-shadow,background-color] duration-150",
          open
            ? "scale-105 shadow-md ring-bud/50"
            : "hover:brightness-105 active:scale-95 active:brightness-95",
        )}
      >
        <Compass className="size-5" strokeWidth={1.75} aria-hidden />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Where do you need to go?"
          className="absolute bottom-[calc(100%+0.65rem)] right-0 z-50 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl bg-background shadow-soft ring-1 ring-border"
        >
          <div className="border-b border-border/70 bg-secondary/40 px-4 py-3">
            <p className="text-sm font-medium text-ink">Where do you need to go?</p>
          </div>
          <ul className="p-2">
            {LAUNCHER_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <li key={action.id}>
                  <Link
                    to={action.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3.5 rounded-xl px-3 py-3.5 text-left transition-colors hover:bg-secondary active:bg-secondary/80"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-ink text-paper">
                      <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15px] font-semibold tracking-wide text-ink">
                        {action.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
                        {action.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
