import { cn } from "@/lib/utils";

/** Compact Oracle brand lockup for entry and account screens. */
export function OracleBrand({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center justify-center gap-2 text-foreground", className)} aria-label="Oracle">
      <svg width="25" height="25" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 3.5C22.9 3.5 28.5 9.1 28.5 16S22.9 28.5 16 28.5 3.5 22.9 3.5 16 9.1 3.5 16 3.5Z" stroke="currentColor" strokeWidth="2.5"/>
        <path d="M8.5 16c2.1-3.3 4.6-5 7.5-5s5.4 1.7 7.5 5c-2.1 3.3-4.6 5-7.5 5s-5.4-1.7-7.5-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
      <span className="text-[22px] font-semibold leading-none tracking-[-0.04em]">ORACLE</span>
    </div>
  );
}
