import { useState } from "react";
import { toast } from "sonner";
import { createPost } from "@/lib/social/server";
import { useCampusStore } from "@/lib/unibud/campus-store";
import { Button } from "@/components/ui/button";

export function WriteDesk() {
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const addPost = useCampusStore((s) => s.addPost);
  const setComposeOpen = useCampusStore((s) => s.setComposeOpen);

  async function publish() {
    if (!draft.trim() || busy) return;
    setBusy(true);
    try {
      const r = await createPost({ data: { communityId: "square", body: draft.trim() } });
      addPost(r.body, r.handle, { id: r.id });
      toast.success("Posted to Square.");
      setDraft("");
      setComposeOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not publish.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <textarea
        className="min-h-32 w-full rounded-2xl bg-secondary p-4 text-sm outline-none"
        placeholder="Share something…"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
      />
      <Button disabled={busy || !draft.trim()} onClick={() => void publish()}>
        {busy ? "Posting…" : "Post"}
      </Button>
    </div>
  );
}
