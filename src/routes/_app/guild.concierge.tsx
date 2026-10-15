import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/guild/concierge")({ component: Concierge });

function Concierge() {
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <main className="safe-bottom mx-auto max-w-lg bg-amber-50/40 px-5 py-8">
      <p className="text-xs font-medium uppercase tracking-wide text-amber-800">Concierge</p>
      <h1 className="mt-1 font-display text-4xl text-amber-950">Tell us what you need.</h1>
      <p className="mt-2 text-sm text-amber-900/80">
        We coordinate. Nothing is ordered, booked, or paid until a provider confirms.
      </p>

      <form
        className="mt-8 rounded-2xl bg-white p-4 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          if (!note.trim()) return;
          setSent(true);
        }}
      >
        <label className="text-sm font-medium">Request</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What do you need help with?"
          className="mt-2 min-h-24 w-full resize-none rounded-xl bg-amber-50 p-3 text-sm outline-none"
        />
        <Button type="submit" className="mt-3 w-full" disabled={!note.trim() || sent}>
          {sent ? "Noted — waiting for a provider" : "Send request"}
        </Button>
        {sent ? (
          <p className="mt-2 text-xs text-muted-foreground">
            This is a request only. No booking or payment has been made.
          </p>
        ) : null}
      </form>
    </main>
  );
}
