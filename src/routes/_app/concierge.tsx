import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  ArrowUp,
  CalendarDays,
  CreditCard,
  Menu,
  MessageSquareText,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoCallout } from "@/components/unibud/demo-callout";

export const Route = createFileRoute("/_app/concierge")({ component: Concierge });

type QuickAction = "marketplace" | "payments" | "booking" | "savings" | "fixer" | "human";
const quickActions: { id: QuickAction; label: string; detail: string }[] = [
  { id: "marketplace", label: "Products and services", detail: "Open The Quarter" },
  { id: "payments", label: "Payments and transfers", detail: "Draft a request for supported workflows" },
  { id: "booking", label: "Bookings and dates", detail: "Arrange a time or schedule" },
  { id: "savings", label: "Budgets and savings", detail: "Review purpose-based funds" },
  { id: "fixer", label: "Managed service", detail: "Open the Fixer workspace" },
  { id: "human", label: "Ask a person", detail: "Open Help & Support" },
];

function Concierge() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [localRequest, setLocalRequest] = useState("");
  const [notice, setNotice] = useState("");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const request = message.trim();
    if (!request) return;
    setLocalRequest(request);
    setNotice("Preview only: Concierge is not connected, so this request was not sent, saved, or acted on.");
    setMessage("");
    setActionsOpen(false);
  }

  function chooseAction(action: QuickAction) {
    setActionsOpen(false);
    if (action === "marketplace") {
      void navigate({ to: "/market" });
      return;
    }
    if (action === "fixer") {
      void navigate({ to: "/fixer" });
      return;
    }
    if (action === "human") {
      void navigate({ to: "/help" });
      return;
    }
    const starters: Record<Exclude<QuickAction, "marketplace" | "fixer" | "human">, string> = {
      payments: "I want help with a payment or transfer. ",
      booking: "I want to arrange a booking. ",
      savings: "I want to review money set aside for a purpose. ",
    };
    setMessage(starters[action]);
    setNotice("Starter text added to the composer. Nothing has been sent.");
    document.getElementById("concierge-message")?.focus();
  }

  return (
    <main className="safe-bottom mx-auto flex min-h-[calc(100dvh-7rem)] max-w-3xl flex-col px-5 pt-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="kicker">GUILD · EVERYDAY SERVICES</p>
          <h1 className="mt-1 font-display text-4xl">Concierge</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">One conversation for products, services, bookings, rentals, and practical next steps.</p>
        </div>
        <Button variant="outline" size="icon" aria-label="Conversation history" aria-expanded={historyOpen} onClick={() => setHistoryOpen((open) => !open)}><Menu className="size-4" /></Button>
      </div>

      <DemoCallout>
        Concierge is a UI preview. It does not send requests, search providers, check availability, create orders, book appointments, or initiate payments. No assistant response is simulated.
      </DemoCallout>

      {historyOpen && (
        <section className="mt-4 rounded-2xl border border-border bg-card p-4" aria-label="Conversation history">
          <div className="flex items-center justify-between"><h2 className="font-medium">Conversation history</h2><Button variant="ghost" size="icon" aria-label="Close conversation history" onClick={() => setHistoryOpen(false)}><X className="size-4" /></Button></div>
          <p className="mt-2 text-sm text-muted-foreground">Saved conversations will appear here when secure persistence is connected.</p>
          <Button className="mt-3" variant="outline" onClick={() => { setLocalRequest(""); setMessage(""); setNotice("New local preview conversation. No server conversation was created."); setHistoryOpen(false); }}>Start new chat</Button>
        </section>
      )}

      <section className="mt-5 flex flex-1 flex-col rounded-3xl border border-border bg-card p-4 sm:p-6">
        {!localRequest ? (
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary"><MessageSquareText className="size-6" /></span>
            <h2 className="mt-4 font-display text-2xl">What would you like to arrange?</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">Describe what you need in your own words. A connected Concierge will clarify the details and offer verified next steps.</p>
            <div className="mt-5 grid w-full gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => chooseAction("marketplace")} className="flex items-center gap-3 rounded-xl border border-border p-3 text-left hover:bg-secondary"><ShoppingBag className="size-4" /><span><strong className="block text-sm">Find products or services</strong><small className="text-muted-foreground">The Quarter</small></span></button>
              <button type="button" onClick={() => chooseAction("booking")} className="flex items-center gap-3 rounded-xl border border-border p-3 text-left hover:bg-secondary"><CalendarDays className="size-4" /><span><strong className="block text-sm">Plan a booking</strong><small className="text-muted-foreground">Dates and schedules</small></span></button>
              <button type="button" onClick={() => chooseAction("payments")} className="flex items-center gap-3 rounded-xl border border-border p-3 text-left hover:bg-secondary"><CreditCard className="size-4" /><span><strong className="block text-sm">Payments and transfers</strong><small className="text-muted-foreground">Draft a question</small></span></button>
              <button type="button" onClick={() => chooseAction("savings")} className="flex items-center gap-3 rounded-xl border border-border p-3 text-left hover:bg-secondary"><Wallet className="size-4" /><span><strong className="block text-sm">Budgets and savings</strong><small className="text-muted-foreground">Purpose-based funds</small></span></button>
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <div className="ml-auto max-w-[90%] rounded-2xl rounded-br-sm bg-secondary p-4 text-sm">{localRequest}</div>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-border p-3 text-sm text-muted-foreground" role="status"><ShieldCheck className="mt-0.5 size-4 shrink-0" />Not sent. The assistant and connected services are unavailable in this build.</div>
            <Button variant="outline" className="mt-4" onClick={() => { setLocalRequest(""); setNotice(""); }}>Start another request</Button>
          </div>
        )}

        {notice && <p className="mt-4 rounded-xl bg-secondary p-3 text-sm" role="status">{notice}</p>}

        <div className="mt-5">
          {actionsOpen && (
            <div className="mb-3 grid gap-1 rounded-2xl border border-border bg-background p-2 sm:grid-cols-2" role="group" aria-label="Concierge tools">
              {quickActions.map((action) => <button key={action.id} type="button" onClick={() => chooseAction(action.id)} className="rounded-xl p-3 text-left hover:bg-secondary"><strong className="block text-sm">{action.label}</strong><small className="text-muted-foreground">{action.detail}</small></button>)}
            </div>
          )}
          <form onSubmit={submit} className="rounded-2xl border border-border bg-background p-2">
            <label htmlFor="concierge-message" className="sr-only">Ask Concierge</label>
            <textarea id="concierge-message" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask Concierge anything…" rows={2} maxLength={2000} className="w-full resize-y bg-transparent px-3 py-2 text-sm outline-none" />
            <div className="flex items-center justify-between gap-2 px-1 pb-1">
              <Button type="button" size="icon" variant="ghost" aria-label="Open Concierge tools" aria-expanded={actionsOpen} onClick={() => setActionsOpen((open) => !open)}><Plus className="size-4" /></Button>
              <div className="flex items-center gap-3"><span className="text-xs text-muted-foreground">{message.length}/2000</span><Button type="submit" size="icon" aria-label="Prepare local request" disabled={!message.trim()}><ArrowUp className="size-4" /></Button></div>
            </div>
          </form>
          <p className="mt-2 text-center text-xs text-muted-foreground">Nothing is sent or acted on in this preview. For managed services, use <Link to="/fixer" className="underline underline-offset-2">Fixer</Link>.</p>
        </div>
      </section>

      <p className="pb-6 pt-3 text-xs text-muted-foreground">Concierge coordinates connected services when available. Payment, booking, and provider status must be verified by their owning systems.</p>
    </main>
  );
}
