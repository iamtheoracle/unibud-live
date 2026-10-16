import { cn } from "@/lib/utils";

/**
 * Approved UNIBUD logo: arched collegiate wordmark.
 * White letters, navy outline (#001240), transparent field.
 * Navy is for the logo only — not a UI fill.
 */
const WORDMARK = "/brand/unibud-wordmark.png";
const MARK = "/brand/unibud-mark.png";

const heights = {
  header: "h-6",
  sm: "h-7",
  md: "h-10",
  lg: "h-16",
  hero: "h-auto w-full max-w-md",
} as const;

export function Wordmark({
  className,
  size = "md",
}: {
  className?: string;
  size?: keyof typeof heights;
}) {
  return (
    <img
      src={WORDMARK}
      alt="UNIBUD"
      className={cn("w-auto bg-transparent object-contain object-left", heights[size], className)}
    />
  );
}

export function UnibudMark({ className }: { className?: string }) {
  return (
    <img
      src={MARK}
      alt=""
      className={cn("size-8 bg-transparent object-contain", className)}
    />
  );
}

export function BudMark({ className }: { className?: string }) {
  return <UnibudMark className={className} />;
}

export function LogoPlate({ className }: { className?: string }) {
  return (
    <img
      src={WORDMARK}
      alt="UNIBUD"
      className={cn("w-full max-w-lg bg-transparent object-contain", className)}
    />
  );
}

const ARC_DARK = "/brand/arc-mark-dark.jpg";
const ARC_FULL = "/brand/arc-mark-full.jpg";

/**
 * Subtle THE ORACLE ARC attribution. Preserve the supplied logo artwork.
 * Do not place this in primary navigation or feeds.
 */
export function ArcAttribution({
  variant = "compact",
  className,
}: {
  variant?: "compact" | "full";
  className?: string;
}) {
  const src = variant === "full" ? ARC_FULL : ARC_DARK;
  return (
    <figure className={cn("flex flex-col items-center gap-2", className)}>
      <div className="px-0 py-0">
        <img
          src={src}
          alt="THE ORACLE ARC · Intelligence & Systems"
          className={cn(
            "object-contain object-center",
            variant === "full" ? "h-auto w-full max-w-[360px]" : "h-auto w-full max-w-[280px]",
          )}
        />
      </div>
      <figcaption className="text-xs tracking-wide text-muted-foreground">
        A product of THE ORACLE ARC · Intelligence & Systems
      </figcaption>
    </figure>
  );
}
