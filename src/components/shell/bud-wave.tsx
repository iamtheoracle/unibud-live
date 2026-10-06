import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export type BudWaveState =
  | "idle"
  | "listening"
  | "processing"
  | "responding"
  | "unavailable"
  | "error";

/**
 * Bud intelligence signal — particle wave across the bottom nav.
 * Visual language: flowing signal / sound wave (not a pill, not a tiny icon).
 * Distinctive bud color. Calm when idle. Motion only for real Bud activity.
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
  const live = state !== "idle" && state !== "unavailable" && state !== "error";

  return (
    <Link
      to="/bud"
      aria-label="Bud"
      title="Bud"
      className={cn(
        "group relative flex h-12 min-w-0 flex-1 items-center justify-center overflow-hidden",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-bud)]/40",
        className,
      )}
    >
      <svg
        viewBox="0 0 640 56"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <linearGradient id="budParticleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-bud)" stopOpacity="0" />
            <stop offset="18%" stopColor="var(--color-bud)" stopOpacity="0.35" />
            <stop offset="50%" stopColor="var(--color-bud)" stopOpacity="0.95" />
            <stop offset="82%" stopColor="var(--color-bud)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-bud)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="budRibbonSoft" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-bud)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--color-bud)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-bud)" stopOpacity="0" />
          </linearGradient>
          <filter id="budGlow" x="-20%" y="-80%" width="140%" height="260%">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M0 28 C48 12, 96 44, 144 28 S240 10, 288 28 S384 46, 432 28 S528 12, 576 28 S616 40, 640 28
             L640 40 C600 48, 540 36, 480 40 S360 52, 300 40 S180 28, 120 40 S40 48, 0 40 Z"
          fill="url(#budRibbonSoft)"
          opacity={0.7}
        />
        <path
          d="M0 28 C56 40, 112 16, 168 28 S280 44, 336 28 S448 12, 504 28 S584 42, 640 28
             L640 36 C580 30, 500 44, 420 36 S280 22, 200 36 S80 46, 0 36 Z"
          fill="url(#budRibbonSoft)"
          opacity={0.55}
        />

        <path
          d="M0 28 C50 14, 100 42, 150 28 S250 12, 300 28 S400 44, 450 28 S550 14, 600 28 S620 36, 640 28"
          fill="none"
          stroke="url(#budParticleGrad)"
          strokeWidth="1.75"
          strokeLinecap="round"
          filter="url(#budGlow)"
          className={cn(live ? "bud-wave-drift" : undefined)}
          opacity={onBud ? 1 : 0.88}
        />
        <path
          d="M0 28 C60 38, 120 16, 180 28 S300 42, 360 28 S480 14, 540 28 S600 40, 640 28"
          fill="none"
          stroke="url(#budParticleGrad)"
          strokeWidth="1.15"
          strokeLinecap="round"
          opacity={0.65}
        />
        <path
          d="M0 28 C40 22, 80 34, 120 28 S200 20, 260 28 S340 36, 400 28 S480 22, 540 28 S600 32, 640 28"
          fill="none"
          stroke="var(--color-bud)"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity={0.5}
        />

        <g fill="var(--color-bud)" className={cn(live ? "bud-wave-spark" : undefined)}>
          <circle cx="36" cy="22" r="0.9" opacity="0.55" />
          <circle cx="72" cy="34" r="0.7" opacity="0.4" />
          <circle cx="108" cy="18" r="1.1" opacity="0.5" />
          <circle cx="148" cy="32" r="0.8" opacity="0.45" />
          <circle cx="186" cy="20" r="0.6" opacity="0.35" />
          <circle cx="224" cy="36" r="1" opacity="0.5" />
          <circle cx="262" cy="16" r="0.7" opacity="0.4" />
          <circle cx="300" cy="30" r="1.2" opacity="0.55" />
          <circle cx="338" cy="22" r="0.8" opacity="0.45" />
          <circle cx="376" cy="38" r="0.7" opacity="0.4" />
          <circle cx="414" cy="18" r="1" opacity="0.5" />
          <circle cx="452" cy="34" r="0.9" opacity="0.45" />
          <circle cx="490" cy="24" r="0.6" opacity="0.35" />
          <circle cx="528" cy="36" r="1.1" opacity="0.5" />
          <circle cx="566" cy="20" r="0.7" opacity="0.4" />
          <circle cx="604" cy="30" r="0.8" opacity="0.45" />
          <rect x="94" y="28" width="1.4" height="1.4" rx="0.2" opacity="0.35" transform="rotate(18 94.7 28.7)" />
          <rect x="210" y="24" width="1.2" height="1.2" rx="0.2" opacity="0.3" transform="rotate(-12 210.6 24.6)" />
          <rect x="390" y="26" width="1.3" height="1.3" rx="0.2" opacity="0.32" transform="rotate(25 390.65 26.65)" />
          <rect x="510" y="22" width="1.2" height="1.2" rx="0.2" opacity="0.28" transform="rotate(-8 510.6 22.6)" />
        </g>
      </svg>

      <span
        className={cn(
          "relative z-[1] text-[10px] font-semibold tracking-[0.28em] uppercase",
          "text-[color:var(--color-bud)] drop-shadow-[0_0_8px_rgb(109_94_246_/_0.35)]",
          onBud ? "opacity-100" : "opacity-85 group-hover:opacity-100",
        )}
      >
        Bud
      </span>
    </Link>
  );
}
