import { Radio, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStudioStore } from "@/lib/studio/store";
import { useCampusStore } from "@/lib/unibud/campus-store";

/**
 * Live is intentionally unavailable until server-backed room membership,
 * signaling, media transport, moderation and participant presence exist.
 * Do not show local viewer counts, invented participants or pretend broadcasts.
 */
export function LiveDesk({ kind }: { kind: "live" | "stream" }) {
  const setView = useStudioStore((s) => s.setView);
  const setComposeOpen = useCampusStore((s) => s.setComposeOpen);

  return (
    <div className="relative flex h-dvh flex-col items-center justify-center bg-ink px-6 text-paper">
      <div className="grid size-16 place-items-center rounded-3xl bg-paper/10">
        <Radio className="size-7" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold">
        {kind === "stream" ? "Streaming is not connected" : "Live is not connected"}
      </h1>
      <p className="mt-2 max-w-sm text-center text-sm leading-6 text-paper/70">
        No broadcast has started. UNIBUD will enable Live when real room membership,
        participant presence, audio/video transport and moderation are ready.
      </p>
      <div className="mt-5 flex items-center gap-2 text-xs text-paper/60">
        <ShieldCheck className="size-4" />
        No fake viewers or invented participants
      </div>
      <Button
        className="mt-8"
        variant="outline"
        onClick={() => {
          setView("camera");
          setComposeOpen(false);
        }}
      >
        Back to Studio
      </Button>
    </div>
  );
}
