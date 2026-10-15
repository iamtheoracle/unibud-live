import { createFileRoute } from "@tanstack/react-router";
import { Banknote, ShoppingBag, Landmark, GraduationCap, CreditCard } from "lucide-react";

export const Route = createFileRoute("/_app/guild/quarter")({ component: Quarter });

function Quarter() {
  return (
    <main className="safe-bottom mx-auto max-w-lg bg-emerald-50/40 px-5 py-8">
      <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">The Quarter</p>
      <h1 className="mt-1 font-display text-4xl text-emerald-950">Money & market.</h1>
      <p className="mt-2 text-sm text-emerald-900/80">
        Money management, shopping, payments, and partner-provided financing in one place.
      </p>

      <section className="mt-8 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Banknote className="size-5 text-emerald-700" />
          <p className="font-medium">Balance</p>
        </div>
        <p className="mt-3 text-3xl font-medium text-emerald-950">—</p>
        <p className="mt-1 text-xs text-muted-foreground">No financial provider is connected. A balance will appear only after an authorised provider supplies verified data.</p>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <ShoppingBag className="size-5 text-emerald-700" />
          <p className="font-medium">Marketplace</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Shop products and services from participating sellers. Listings, stock, and prices will appear when verified merchant data is connected.
        </p>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <GraduationCap className="size-5 text-emerald-700" />
          <p className="font-medium">Education loans</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore partner-provided financing for eligible tuition, school fees, learning materials, and other approved education costs.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Applications, eligibility, offers, and disbursements remain subject to the lending provider's assessment and confirmation.
        </p>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <CreditCard className="size-5 text-emerald-700" />
          <p className="font-medium">Purchase credit</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Financing for eligible marketplace purchases, such as laptops, phones, books, and student essentials, through participating lenders.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Credit limits and repayment terms will be shown only when a provider returns a verified offer. UNIBUD does not promise approval.
        </p>
      </section>

      <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Landmark className="size-5 text-emerald-700" />
          <p className="font-medium">Financial partners</p>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Lending and financial services are supplied by authorised partners under their terms. No partner is represented as connected until the integration is configured and verified.
        </p>
      </section>
    </main>
  );
}
