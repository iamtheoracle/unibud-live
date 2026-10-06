import { Link } from "@tanstack/react-router";
import { BriefcaseBusiness, GraduationCap, Wallet, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Spark — compact quick-action gateway.
 * Exactly three destinations: Board · Commerce · Services.
 * Not a page, not a dashboard, not Bud.
 */
const SPARK_ACTIONS = [
  {
    id: "board",
    label: "Board",
    description: "Class, cohort, academic space",
    to: "/board" as const,
    icon: GraduationCap,
  },
  {
    id: "commerce",
    label: "Commerce",
    description: "Wallet, payments, marketplace",
    to: "/money" as const,
    icon: Wallet,
  },
  {
    id: "services",
    label: "Services",
    description: "Find or offer campus services",
    to: "/creator" as const,
    icon: BriefcaseBusiness,
  },
] as const;

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
        aria-label={open ? "Close Spark" : "Open Spark"}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "grid size-11 place-items-center rounded-full text-muted-foreground transition-colors",
          open ? "bg-secondary text-ink" : "hover:bg-secondary/80 hover:text-ink",
        )}
      >
        <Zap className="size-5" strokeWidth={1.75} aria-hidden />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="Spark"
          className="absolute bottom-[calc(100%+0.5rem)] left-1/2 z-50 w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl bg-background p-2 shadow-soft ring-1 ring-border"
        >
          <p className="px-3 pt-2 pb-1 text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Spark
          </p>
          <ul className="space-y-0.5">
            {SPARK_ACTIONS.map((action) => {
              const Icon = action.icon;
              return (
                <li key={action.id}>
                  <Link
                    to={action.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-secondary"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-secondary text-ink">
                      <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold tracking-wide uppercase">
                        {action.label}
                      </span>
                      <span className="block text-xs text-muted-foreground">{action.description}</span>
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
