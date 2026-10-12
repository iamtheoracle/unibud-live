import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, CalendarDays, ShoppingBag, Utensils } from "lucide-react";

export const Route = createFileRoute("/_app/guild")({ component: Guild });

const spaces = [
  {
    title: "The Quarter",
    description: "Money, banking, payments, buying, selling, rentals, orders and service listings in one connected space.",
    icon: ShoppingBag,
    status: "Some financial and marketplace actions may not yet be available.",
  },
  {
    title: "Concierge",
    description: "Plan bookings, food, transport, appointments and everyday arrangements with clear approval before paid actions.",
    icon: Utensils,
    status: "Booking and paid-action integrations must be verified before use.",
  },
  {
    title: "Board",
    description: "Classrooms, live learning, course discussions and academic activities.",
    icon: BookOpen,
    status: "Academic space",
    to: "/board" as const,
  },
] as const;

function Guild() {
  return (
    <main className="safe-bottom px-5 pt-6 pb-8">
      <p className="kicker">UNIBUD spaces</p>
      <h1 className="mt-1 font-display text-4xl">The Guild</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">
        Three connected spaces for money and commerce, everyday arrangements, and learning.
        The Guild is a doorway to these spaces, not another AI agent.
      </p>
      <div className="mt-5 flex items-center gap-2 rounded-2xl bg-card p-4 text-sm ring-1 ring-border">
        <CalendarDays className="size-5 shrink-0 text-muted-foreground" />
        <p className="text-muted-foreground">
          Spark Calendar remains part of Board. Payments and bookings must be verified before they are presented as available.
        </p>
      </div>
      <section className="mt-5 grid gap-3">
        {spaces.map((space) => {
          const Icon = space.icon;
          const card = (
            <div className="rounded-2xl bg-card p-4 ring-1 ring-border">
              <div className="flex items-start gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-secondary">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium">{space.title}</h2>
                    {"to" in space && space.to ? <ArrowUpRight className="size-4 text-muted-foreground" /> : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{space.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{space.status}</p>
                </div>
              </div>
            </div>
          );
          return "to" in space && space.to ? (
            <Link key={space.title} to={space.to} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              {card}
            </Link>
          ) : (
            <div key={space.title}>{card}</div>
          );
        })}
      </section>
    </main>
  );
}
