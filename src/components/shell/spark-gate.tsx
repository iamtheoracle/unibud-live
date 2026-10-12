import { Link } from "@tanstack/react-router";
import { Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

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
        aria-label={open ? "Close The Guild" : "Explore The Guild"}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "grid size-12 place-items-center rounded-full transition-transform",
          open ? "scale-105 bg-secondary ring-1 ring-border" : "hover:bg-secondary/70",
        )}
      >
        <Layers className="size-6" aria-hidden />
      </button>

      {open ? (
        <div
          role="dialog"
          aria-label="The Guild"
          className="absolute bottom-[calc(100%+0.65rem)] right-0 z-50 w-[min(20rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl bg-background shadow-soft ring-1 ring-border"
        >
          <div className="flex items-center gap-3 border-b border-border/70 bg-secondary/40 px-4 py-3">
            <Layers className="size-6" />
            <div>
              <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">The Guild</p>
              <p className="text-sm font-medium text-ink">Choose your space</p>
            </div>
          </div>
          <ul className="p-2">
            <li>
              <Link to="/guild" onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-3.5 hover:bg-secondary">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ink text-paper"><Layers className="size-5" /></span>
                <span><span className="block text-sm font-semibold">The Guild</span><span className="mt-0.5 block text-xs text-muted-foreground">The Quarter · Concierge · Board</span></span>
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </div>
  );
}
