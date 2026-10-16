import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  BadgePercent,
  BedDouble,
  Building2,
  ChevronRight,
  CircleHelp,
  CreditCard,
  GraduationCap,
  House,
  Landmark,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
  Wallet,
  Waves,
} from "lucide-react";

export const Route = createFileRoute("/_app/guild/quarter")({ component: Quarter });

type View = "Everything" | "Marketplace" | "Property" | "Money";

const offerings = [
  { name: "Products", group: "Marketplace", description: "Shop products from stores and independent sellers.", icon: ShoppingBag, href: "/market", tag: "Shop" },
  { name: "P2P deals", group: "Marketplace", description: "Buy directly from people, negotiate, sell, and trade in the same marketplace.", icon: ArrowDownUp, href: "/market", tag: "Person to person" },
  { name: "Stores & selling", group: "Marketplace", description: "Browse stores or build a storefront to manage products and orders.", icon: Store, href: "/market", tag: "For sellers" },
  { name: "Homes & property", group: "Property", description: "Explore properties for sale, rent, and longer-term housing.", icon: House, href: "#property", tag: "Real estate" },
  { name: "Short stays", group: "Property", description: "Find short-stay accommodation, compare details, and request a booking.", icon: BedDouble, href: "#property", tag: "Stay" },
  { name: "Property services", group: "Property", description: "Connect property discovery with viewing requests and related services.", icon: Building2, href: "#property", tag: "Services" },
  { name: "Accounts & payments", group: "Money", description: "View supported accounts, payments, transfers, and activity in one money centre.", icon: Wallet, href: "#money", tag: "Banking" },
  { name: "Cards", group: "Money", description: "Access eligible debit, credit, virtual, and prepaid card services.", icon: CreditCard, href: "#money", tag: "Card centre" },
  { name: "Credit & financing", group: "Money", description: "Credit insights, education financing, and purchase financing through eligible partners.", icon: GraduationCap, href: "#money", tag: "Credit" },
  { name: "Prepaid services", group: "Money", description: "Supported top-ups, prepaid products, and related services.", icon: Smartphone, href: "#money", tag: "Prepaid" },
] as const;

function Quarter() {
  const [view, setView] = useState<View>("Everything");
  const [query, setQuery] = useState("");
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return offerings.filter((item) => {
      const groupMatches = view === "Everything" || item.group === view;
      const textMatches = !q || [item.name, item.description, item.group, item.tag].some((value) => value.toLowerCase().includes(q));
      return groupMatches && textMatches;
    });
  }, [view, query]);

  return (
    <main className="safe-bottom mx-auto min-h-screen max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Waves className="size-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">UNIBUD · GUILD</p>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">The Quarter</h1>
          </div>
        </div>
        <Link to="/guild" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted">
          <CircleHelp className="size-4" /><span className="hidden sm:inline">Guild</span>
        </Link>
      </header>

      <section className="mt-6 overflow-hidden rounded-3xl bg-slate-950 p-5 text-white sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">One connected experience</p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-5xl">
          Bank. Find a place. Buy, sell, or trade.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
          The Quarter brings money, property, and the marketplace into one home. P2P is part of the marketplace. Payments and bookings connect to the same transaction experience.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Pillar icon={Landmark} number="01" title="Money" text="Accounts, payments, cards, credit, and prepaid." />
          <Pillar icon={House} number="02" title="Property" text="Homes, rentals, and short stays." />
          <Pillar icon={Store} number="03" title="Marketplace" text="Products, stores, services, and P2P deals." />
        </div>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-stretch">
        <label className="flex min-h-12 items-center gap-3 rounded-2xl border border-border bg-card px-4">
          <Search className="size-5 shrink-0 text-muted-foreground" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, people, property, stays, or money services" aria-label="Search all Quarter services" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </label>
        <div className="flex gap-2 overflow-x-auto" role="group" aria-label="Browse Quarter">
          {(["Everything", "Marketplace", "Property", "Money"] as const).map((item) => (
            <button key={item} type="button" onClick={() => setView(item)} aria-pressed={view === item} className={view === item ? "shrink-0 rounded-xl bg-slate-950 px-4 py-3 text-sm font-medium text-white" : "shrink-0 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-slate-700 hover:bg-muted"}>
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-7">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">All connected in one place</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-slate-950 sm:text-3xl">
              {view === "Everything" ? "Explore The Quarter" : view}
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">{visible.length} services</span>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((item) => (
            <a key={item.name} href={item.href} className="group flex min-h-44 flex-col rounded-2xl border border-border bg-card p-4 transition-colors hover:border-slate-400 hover:bg-muted/40 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-900"><item.icon className="size-5" /></div>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{item.group} · {item.tag}</p>
              <h3 className="mt-1 font-semibold text-slate-950">{item.name}</h3>
              <p className="mt-1 flex-1 text-sm leading-5 text-muted-foreground">{item.description}</p>
            </a>
          ))}
          {visible.length === 0 && <div className="rounded-2xl border border-dashed border-border p-8 text-center sm:col-span-2 xl:col-span-3"><p className="font-medium">Nothing matches that search</p><p className="mt-1 text-sm text-muted-foreground">Try another word or choose Everything.</p></div>}
        </div>
      </section>

      <section id="property" className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3"><House className="size-5 text-slate-800" /><h3 className="font-semibold">Property belongs in the marketplace</h3></div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">A property can be listed, discovered, discussed, and enquired about through the same marketplace. Short-stay listings use booking dates and host confirmation; sale and rental listings use their own enquiry and viewing steps.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3"><ArrowDownUp className="size-5 text-slate-800" /><h3 className="font-semibold">P2P is a marketplace mode</h3></div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">People can list items or services, negotiate a deal, and proceed to a supported payment or agreed handover. P2P is not a fourth product or a separate app.</p>
        </div>
      </section>

      <section id="money" className="mt-3 rounded-2xl border border-border bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-slate-700" />
          <div>
            <h3 className="font-semibold text-slate-950">One transaction experience, verified financial data</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">Orders, reservations, and payment records should connect. Account balances, card controls, credit reports, loan offers, and completed transfers must come from authorised providers. No invented balances, listings, availability, credit scores, or confirmations.</p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-slate-800"><BadgePercent className="size-4" />Provider integrations are still required for live financial services.</p>
          </div>
        </div>
      </section>

      <footer className="mt-7 flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
        <span>The Quarter · One UI, three connected pillars</span>
        <Link to="/market" className="inline-flex items-center gap-1 font-medium text-slate-800 hover:underline">Open marketplace <ArrowRight className="size-3.5" /></Link>
      </footer>
    </main>
  );
}

function Pillar({ icon: Icon, number, title, text }: { icon: typeof Wallet; number: string; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4">
      <div className="flex items-center justify-between gap-2"><Icon className="size-5 text-sky-200" /><span className="text-xs font-medium text-slate-400">{number}</span></div>
      <h3 className="mt-3 font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-5 text-slate-300">{text}</p>
    </div>
  );
}
