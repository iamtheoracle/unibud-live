import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDownUp,
  ArrowRight,
  BadgePercent,
  Banknote,
  BedDouble,
  Building2,
  CheckCircle2,
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

type ModuleCategory = "All" | "Money" | "Shop & trade" | "Property" | "Credit" | "Prepaid";

const modules = [
  {
    title: "Shop",
    description: "Discover products from participating stores and independent sellers.",
    category: "Shop & trade" as const,
    icon: ShoppingBag,
    label: "Marketplace",
    href: "/market",
  },
  {
    title: "Your store",
    description: "A home for sellers to manage their storefront, products, and orders.",
    category: "Shop & trade" as const,
    icon: Store,
    label: "Seller tools",
    href: "/market",
  },
  {
    title: "P2P exchange",
    description: "Explore person-to-person listings and trading workflows.",
    category: "Shop & trade" as const,
    icon: ArrowDownUp,
    label: "Person to person",
    href: "/market",
  },
  {
    title: "Banking",
    description: "Connect supported financial providers to view verified account activity.",
    category: "Money" as const,
    icon: Landmark,
    label: "Provider connection required",
    href: "#money",
  },
  {
    title: "Payments & transfers",
    description: "Payment and transfer actions will be available through verified providers.",
    category: "Money" as const,
    icon: Wallet,
    label: "Integration required",
    href: "#money",
  },
  {
    title: "Cards",
    description: "Manage eligible virtual or physical card products offered by supported issuers.",
    category: "Money" as const,
    icon: CreditCard,
    label: "Issuer integration required",
    href: "#cards",
  },
  {
    title: "Property",
    description: "Discover property listings for sale, rent, and longer-term housing.",
    category: "Property" as const,
    icon: House,
    label: "Property marketplace",
    href: "#property",
  },
  {
    title: "Stays",
    description: "Find short-stay accommodation and host-managed rental listings.",
    category: "Property" as const,
    icon: BedDouble,
    label: "Short stays",
    href: "#property",
  },
  {
    title: "Credit insights",
    description: "Understand credit factors and access monitoring through eligible partners.",
    category: "Credit" as const,
    icon: BadgePercent,
    label: "Partner connection required",
    href: "#credit",
  },
  {
    title: "Education financing",
    description: "Explore education-loan products provided by participating lenders.",
    category: "Credit" as const,
    icon: GraduationCap,
    label: "Lender assessment applies",
    href: "#credit",
  },
  {
    title: "Purchase financing",
    description: "Review financing options for eligible purchases when a lender provides an offer.",
    category: "Credit" as const,
    icon: Banknote,
    label: "Lender assessment applies",
    href: "#credit",
  },
  {
    title: "Prepaid services",
    description: "A home for supported prepaid cards, mobile top-ups, and other prepaid products.",
    category: "Prepaid" as const,
    icon: Smartphone,
    label: "Provider integration required",
    href: "#prepaid",
  },
];

const categories: ModuleCategory[] = ["All", "Money", "Shop & trade", "Property", "Credit", "Prepaid"];

function Quarter() {
  const [activeCategory, setActiveCategory] = useState<ModuleCategory>("All");
  const [search, setSearch] = useState("");
  const visibleModules = useMemo(() => {
    const query = search.trim().toLowerCase();
    return modules.filter((module) => {
      const categoryMatches = activeCategory === "All" || module.category === activeCategory;
      const queryMatches =
        !query ||
        module.title.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query) ||
        module.category.toLowerCase().includes(query);
      return categoryMatches && queryMatches;
    });
  }, [activeCategory, search]);

  return (
    <main className="safe-bottom mx-auto min-h-screen max-w-6xl px-4 py-5 sm:px-6 sm:py-8">
      <header className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
            <Waves className="size-6" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Guild · UNIBUD</p>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">The Quarter</h1>
          </div>
        </div>
        <Link
          to="/guild"
          className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          <CircleHelp className="size-4" />
          <span className="hidden sm:inline">Guild</span>
        </Link>
      </header>

      <section className="mt-7 overflow-hidden rounded-3xl bg-slate-950 p-5 text-white sm:p-8">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-200">Your connected life</p>
            <h2 className="mt-3 max-w-xl font-display text-3xl font-semibold leading-tight sm:text-5xl">
              Money, commerce, and ownership. Together.
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Shop, sell, trade, find a place to stay, explore property, and manage financial services from one place.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-slate-300">
              <Wallet className="size-4" />
              <span className="text-sm">Connected balance</span>
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight">— — —</p>
            <div className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-300">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-sky-200" />
              No financial provider is connected. Verified balances appear after an authorised connection.
            </div>
          </div>
        </div>
      </section>

      <section id="money" className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction icon={ArrowDownUp} title="Transfers" detail="Payments" />
        <QuickAction icon={CreditCard} title="Cards" detail="Credit & prepaid" />
        <QuickAction icon={ShoppingBag} title="Shop" detail="Products & stores" href="/market" />
        <QuickAction icon={Building2} title="Property" detail="Homes & stays" href="#property" />
      </section>

      <section className="mt-9">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">One destination</p>
            <h2 className="mt-1 font-display text-2xl font-semibold text-slate-950 sm:text-3xl">Explore The Quarter</h2>
          </div>
          <label className="flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-3 sm:w-72">
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search services"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Search Quarter services"
            />
          </label>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter services">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              aria-pressed={activeCategory === category}
              className={
                activeCategory === category
                  ? "shrink-0 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white"
                  : "shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-slate-700 hover:bg-muted"
              }
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visibleModules.map((module) => (
            <a
              key={module.title}
              href={module.href}
              className="group flex min-h-44 flex-col rounded-2xl border border-border bg-card p-4 transition-colors hover:border-slate-400 hover:bg-muted/40 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
                  <module.icon className="size-5" aria-hidden="true" />
                </div>
                <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-950">{module.title}</h3>
              <p className="mt-1 flex-1 text-sm leading-5 text-muted-foreground">{module.description}</p>
              <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <CheckCircle2 className="size-3.5" />
                {module.label}
              </p>
            </a>
          ))}
          {visibleModules.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center sm:col-span-2 xl:col-span-3">
              <Search className="mx-auto size-6 text-muted-foreground" />
              <p className="mt-2 font-medium">No matching services</p>
              <p className="mt-1 text-sm text-muted-foreground">Try another search or category.</p>
            </div>
          ) : null}
        </div>
      </section>

      <section id="property" className="mt-8 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-950"><House className="size-5" /></div>
            <div>
              <h3 className="font-semibold">Real estate</h3>
              <p className="text-xs text-muted-foreground">Buy · Rent · List</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Property discovery with listing details, verified-agent information, viewing requests, and rental or purchase enquiries.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">Listings and availability will be shown when verified inventory is connected.</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-950"><BedDouble className="size-5" /></div>
            <div>
              <h3 className="font-semibold">Short stays</h3>
              <p className="text-xs text-muted-foreground">Discover · Book · Host</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Short-stay accommodation with search, date selection, host profiles, booking requests, and payment-linked reservations.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">No stay is represented as available or booked until the relevant provider confirms it.</p>
        </div>
      </section>

      <section id="credit" className="mt-3 rounded-2xl border border-border bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm"><BadgePercent className="size-5" /></div>
          <div>
            <h3 className="font-semibold text-slate-950">Credit, clearly presented</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Credit education and monitoring, education loans, and purchase financing will be separate services. Credit reports and scores require an authorised data partner; loan decisions and terms come from the lending provider.
            </p>
          </div>
        </div>
      </section>

      <section id="cards" className="mt-3 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-900"><CreditCard className="size-5" /></div>
          <div>
            <h3 className="font-semibold">One card centre</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              A unified place to view supported debit, credit, virtual, and prepaid card products. Issuance, activation, balances, and card controls depend on issuer integrations and eligibility.
            </p>
          </div>
        </div>
      </section>

      <section id="prepaid" className="mt-3 rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-900"><Smartphone className="size-5" /></div>
          <div>
            <h3 className="font-semibold">Prepaid services</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Prepaid cards, mobile and data top-ups, and other supported prepaid products can share one checkout and activity history once provider integrations are available.
            </p>
          </div>
        </div>
      </section>

      <footer className="mt-8 flex items-start gap-2 border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" />
        The Quarter shows real financial data only after provider verification. It does not fabricate balances, credit scores, offers, inventory, reservations, or completed transactions.
      </footer>
    </main>
  );
}

function QuickAction({
  icon: Icon,
  title,
  detail,
  href,
}: {
  icon: typeof Wallet;
  title: string;
  detail: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div className="mt-3">
        <p className="font-semibold text-slate-950">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
      </div>
      <ArrowRight className="ml-auto mt-3 size-4 text-muted-foreground" />
    </>
  );

  return href ? (
    <a href={href} className="flex min-h-32 flex-col rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/40">
      {content}
    </a>
  ) : (
    <div className="flex min-h-32 flex-col rounded-2xl border border-border bg-card p-4">
      {content}
    </div>
  );
}
