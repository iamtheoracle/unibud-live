import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export type BudWaveState = "idle" | "listening" | "processing" | "responding" | "unavailable" | "error";

/**
 * Bud intelligence signal — large wave across the bottom nav.
 * Distinctive bud color. Calm when idle. Motion only for real Bud activity.
 * Not an "Ask Bud" pill. Not a tiny icon.
 */
export function BudWave({
  state = "idle",
  className,
}: {
  state?: BudWaveState;
  className?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onBud = pathname.startsWith("/bud");
  const active = state !== "idle" || onBud;

  return (
    <Link
      to="/bud"
      aria-label="Bud"
      title="Bud"
      className={cn(
        "group relative flex h-11 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-full",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-bud)]/50",
        className,
      )}
    >
      <svg
        viewBox="0 0 320 44"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="budWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-bud)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--color-bud)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--color-bud)" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        <path
          d="M0 22 C40 8, 80 36, 120 22 S200 8, 240 22 S280 36, 320 22"
          fill="none"
          stroke="url(#budWaveGrad)"
          strokeWidth="2.25"
          strokeLinecap="round"
          className={cn(active && state !== "idle" ? "bud-wave-pulse" : undefined)}
          opacity={0.55}
        />
        <path
          d="M0 22 C50 34, 90 10, 140 22 S230 34, 280 22 S300 12, 320 22"
          fill="none"
          stroke="url(#budWaveGrad)"
          strokeWidth="1.75"
          strokeLinecap="round"
          opacity={0.85}
        />
        <path
          d="M0 22 C60 16, 100 28, 160 22 S260 16, 320 22"
          fill="none"
          stroke="var(--color-bud)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={onBud ? 1 : 0.9}
        />
      </svg>
      <span
        className={cn(
          "relative z-[1] text-[10px] font-semibold tracking-[0.22em] uppercase",
          "text-[color:var(--color-bud)]",
          onBud ? "opacity-100" : "opacity-90 group-hover:opacity-100",
        )}
      >
        Bud
      </span>
    </Link>
  );
}
