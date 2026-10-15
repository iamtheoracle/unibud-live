import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConciergeBell, MessageCircle, Send } from "lucide-react";

export const Route = createFileRoute("/_app/guild/concierge")({ component: Concierge });

function Concierge() {
  const [message, setMessage] = useState("");
  const [draftReady, setDraftReady] = useState(false);

  return (
    <main className="safe-bottom mx-auto max-w-lg bg-amber-50/40 px-5 py-8">
      <p className="text-xs font-medium uppercase tracking-wide text-amber-800">Concierge</p>
      <h1 className="mt-1 font-display text-4xl text-amber-950">How may we assist?</h1>
      <p className="mt-2 text-sm text-amber-900/80">
        A personal conversation for guidance, planning, requests, and service coordination.
      </p>

      <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-amber-100 px-4 py-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-900">
            <ConciergeBell className="size-5" />
          </span>
          <div>
            <p className="font-medium text-amber-950">Concierge</p>
            <p className="text-xs text-muted-foreground">Personal assistance</p>
          </div>
        </div>

        <div className="min-h-44 space-y-3 bg-amber-50/50 p-4">
          <div className="flex items-start gap-2">
            <MessageCircle className="mt-1 size-4 shrink-0 text-amber-800" />
            <p className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white p-3 text-sm text-amber-950">
              Tell us what you need help with. You can ask a question, explain a plan, or request a service.
            </p>
          </div>
          {draftReady ? (
            <p role="status" className="rounded-xl border border-amber-200 bg-white p-3 text-xs text-amber-900">
              Your message is prepared locally. Concierge messaging is not connected yet, so nothing has been sent and no service has been booked.
            </p>
          ) : null}
        </div>

        <form
          className="border-t border-amber-100 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!message.trim()) return;
            setDraftReady(true);
          }}
        >
          <label htmlFor="concierge-message" className="text-sm font-medium text-amber-950">Your message</label>
          <textarea
            id="concierge-message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setDraftReady(false);
            }}
            placeholder="What would you like help with?"
            className="mt-2 min-h-24 w-full resize-y rounded-xl bg-amber-50 p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-amber-700"
          />
          <Button type="submit" className="mt-3 w-full" disabled={!message.trim()}>
            <Send className="mr-2 size-4" />
            Prepare message
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            Requests are not bookings or payments. A provider must confirm any arrangement.
          </p>
        </form>
      </section>
    </main>
  );
}
