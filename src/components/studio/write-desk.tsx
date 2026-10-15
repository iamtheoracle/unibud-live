import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { createPost } from "@/lib/social/server";
import { useCampusStore } from "@/lib/unibud/campus-store";
import { Button } from "@/components/ui/button";

type Props = {
  onClose?: () => void;
};

export function WriteDesk({ onClose }: Props) {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const addPost = useCampusStore((s) => s.addPost);
  const setComposeOpen = useCampusStore((s) => s.setComposeOpen);

  function close() {
    onClose?.();
    setComposeOpen(false);
  }

  async function publish() {
    if (!draft.trim() || busy) return;
    setBusy(true);
    try {
      const r = await createPost({ data: { communityId: "square", body: draft.trim() } });
      addPost(r.body, r.handle, { id: r.id });
      toast.success("Posted to Square.");
      setDraft("");
      close();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not publish.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex h-12 items-center justify-between border-b border-border px-3 pt-[env(safe-area-inset-top)]">
        <button type="button" className="grid size-11 place-items-center rounded-full" aria-label="Close" onClick={close}>
          <X className="size-5" />
        </button>
        <p className="text-sm font-medium">Write</p>
        <span className="w-11" />
      </header>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <textarea
          className="min-h-32 w-full flex-1 rounded-2xl bg-secondary p-4 text-sm outline-none"
          placeholder="Share something…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <Button disabled={busy || !draft.trim()} onClick={() => void publish()}>
          {busy ? "Posting…" : "Post"}
        </Button>
      </div>
    </div>
  );
}
