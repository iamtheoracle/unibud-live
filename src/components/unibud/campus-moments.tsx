import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useCampusStore } from "@/lib/unibud/campus-store";
import { cn } from "@/lib/utils";

export function CampusMoments({ onCreate }: { onCreate: () => void }) {
  const mine = useCampusStore((s) => s.myStories ?? []);
  const [mineOpen, setMineOpen] = useState(false);

  return (
    <>
      <div className="flex gap-3 overflow-x-auto px-4 py-2" aria-label="Stories">
        <button
          type="button"
          onClick={() => (mine.length ? setMineOpen(true) : onCreate())}
          className="w-[3.25rem] shrink-0"
          aria-label={mine.length ? "Your story" : "Create a story"}
        >
          <span
            className={cn(
              "relative mx-auto grid size-11 place-items-center overflow-hidden rounded-full bg-secondary text-ink",
              mine.length ? "ring-2 ring-success" : "ring-2 ring-dashed ring-ink/30",
            )}
          >
            {mine[0]?.image ? (
              <img src={mine[0].image} alt="" className="size-full object-cover" />
            ) : (
              <Plus className="size-3.5" />
            )}
          </span>
          <p className="mt-1 truncate text-center text-[10px] text-muted-foreground">You</p>
        </button>
      </div>

      {mineOpen && mine[0] ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink text-paper">
          <div className="flex items-center justify-between px-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
            <p className="px-2 text-sm font-semibold">You</p>
            <button
              type="button"
              className="grid size-11 place-items-center"
              onClick={() => setMineOpen(false)}
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center">
            {mine[0].video ? (
              <video src={mine[0].video} className="max-h-full w-full object-contain" autoPlay playsInline />
            ) : (
              <img src={mine[0].image} alt="" className="max-h-full w-full object-contain" />
            )}
          </div>
          {mine[0].caption ? <p className="px-5 py-3 text-sm">{mine[0].caption}</p> : null}
          <button type="button" className="sheet-safe pb-4 text-center text-sm font-medium" onClick={onCreate}>
            Add another
          </button>
        </div>
      ) : null}
    </>
  );
}
