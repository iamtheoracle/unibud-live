import { createFileRoute, Link } from "@tanstack/react-router";
import { Banknote, Calendar, ConciergeBell } from "lucide-react";

export const Route = createFileRoute("/_app/guild")({ component: Guild });

const faces = [
  {
    to: "/guild/quarter",
    label: "The Quarter",
    desc: "Money, marketplace, and lending in one place.",
    icon: Banknote,
    accent: "bg-emerald-50 text-emerald-900",
  },
  {
    to: "/guild/concierge",
    label: "Concierge",
    desc: "Request a service. We coordinate. You confirm.",
    icon: ConciergeBell,
    accent: "bg-amber-50 text-amber-900",
  },
  {
    to: "/board",
    label: "Board",
    desc: "Coordination, schedules, and Spark Calendar.",
    icon: Calendar,
    accent: "bg-slate-100 text-slate-900",
  },
] as const;

function Guild() {
  return (
    <main className="safe-bottom mx-auto max-w-lg px-5 py-8">
      <p className="kicker">Guild</p>
      <h1 className="mt-1 font-display text-4xl">Three faces.</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The Quarter handles money and commerce. Concierge handles services. Board handles coordination.
      </p>
      <div className="mt-8 grid gap-3">
        {faces.map((f) => (
          <Link
            key={f.to}
            to={f.to}
            className={`flex items-center gap-4 rounded-2xl p-4 ${f.accent}`}
          >
            <f.icon className="size-6" />
            <div>
              <p className="font-medium">{f.label}</p>
              <p className="text-sm opacity-80">{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
