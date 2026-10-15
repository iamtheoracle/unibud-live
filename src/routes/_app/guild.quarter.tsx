import { createFileRoute } from "@tanstack/react-router";
import { Banknote, ShoppingBag, Landmark } from "lucide-react";

export const Route = createFileRoute("/_app/guild/quarter")({ component: Quarter });

function Quarter() {
  return (
    <main className="safe-bottom mx-auto max-w-lg bg-emerald-50/40 px-5 py-8">
      <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">The Quarter</p>
      <h1 className="mt-1 font-display text-4xl text-emerald-950">Money & market.</h1>
      <p className="mt-2 text-sm text-emerald-900/80">
        Banking, marketplace, and lending live here. Nothing moves until a real provider confirms it.
      </p>

      <section className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Banknote className="size-5 text-emerald-700" />
          <p className="font-medium">Balance</p>
        </div>
        <p className="mt-3 text-3xl font-medium text-emerald-950">—</p>
        <p className="mt-1 text-xs text-muted-foreground">No bank connected. Balances appear only after an authorized provider is linked.</p>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <ShoppingBag className="size-5 text-emerald-700" />
          <p className="font-medium">Marketplace</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Products and services from verified sellers. No listings until inventory and pricing are confirmed.
        </p>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Landmark className="size-5 text-emerald-700" />
          <p className="font-medium">Lending</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Loan discovery through authorized partners only. No offers are shown until a partner is connected and consent is given.
        </p>
      </section>
    </main>
  );
}
