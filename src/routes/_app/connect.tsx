import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Plus, Users, BriefcaseBusiness, Utensils, Truck, Heart, Compass, ChevronRight, UserRound, Sparkles } from "lucide-react";
import { Avatar, PersonMeta } from "@/components/unibud/person";
import { RelationActions } from "@/components/unibud/relation-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PEOPLE, uniById } from "@/lib/unibud/catalog";
import { useCampusStore } from "@/lib/unibud/campus-store";
import { academicLine, proximityScore, sharedContext } from "@/lib/unibud/identity";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/connect")({ component: Connect });

type MainView = "people" | "opportunities";
type PeopleTab = "discover" | "requests" | "sent" | "connections" | "following" | "followers";

const peopleTabs: { id: PeopleTab; label: string }[] = [
  { id: "discover", label: "Discover" },
  { id: "requests", label: "Requests" },
  { id: "sent", label: "Sent" },
  { id: "connections", label: "Connections" },
  { id: "following", label: "Following" },
  { id: "followers", label: "Followers" },
];

const opportunityTypes = [
  { label: "Work", detail: "Remote jobs, freelance and internships", icon: BriefcaseBusiness },
  { label: "Services", detail: "Skills, domestic help and local services", icon: Users },
  { label: "Food & goods", detail: "Cafeterias, meals and everyday items", icon: Utensils },
  { label: "Delivery", detail: "Pickup, drop-off and errands", icon: Truck },
  { label: "Requests", detail: "Ask the community for what you need", icon: Sparkles },
];

function Connect() {
  const [view, setView] = useState<MainView>("people");
  const [tab, setTab] = useState<PeopleTab>("discover");
  const [q, setQ] = useState("");
  const incoming = useCampusStore((s) => s.incoming);
  const outgoing = useCampusStore((s) => s.outgoing);
  const connections = useCampusStore((s) => s.connections);
  const following = useCampusStore((s) => s.following);
  const followers = useCampusStore((s) => s.followers);
  const accept = useCampusStore((s) => s.accept);
  const decline = useCampusStore((s) => s.decline);
  const cancelRequest = useCampusStore((s) => s.cancelRequest);
  const homeCampusId = useCampusStore((s) => s.homeCampusId);
  const faculty = useCampusStore((s) => s.faculty);
  const department = useCampusStore((s) => s.department);
  const lens = {
    universityId: homeCampusId || "unilag",
    program: "Computer Engineering",
    year: "300",
    faculty,
    department,
  };

  const filtered = useMemo(
    () =>
      PEOPLE.filter((p) => {
        const hay = `${p.name} ${p.handle} ${p.program} ${p.year} ${p.universityId} ${p.faculty ?? ""} ${p.department ?? ""}`.toLowerCase();
        return !q.trim() || hay.includes(q.toLowerCase());
      }),
    [q],
  );

  const list =
    tab === "requests"
      ? PEOPLE.filter((p) => incoming.includes(p.handle))
      : tab === "sent"
        ? PEOPLE.filter((p) => outgoing.includes(p.handle))
        : tab === "connections"
          ? PEOPLE.filter((p) => connections.includes(p.handle))
          : tab === "following"
            ? PEOPLE.filter((p) => following.includes(p.handle))
            : tab === "followers"
              ? PEOPLE.filter((p) => followers.includes(p.handle))
              : filtered;

  const shown =
    tab === "discover"
      ? [...filtered].sort((a, b) => proximityScore(b, connections, lens) - proximityScore(a, connections, lens))
      : list;

  return (
    <main className="safe-bottom mx-auto w-full max-w-3xl px-4 pb-24 pt-5 sm:px-6">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">UNIBUD</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">Connect</h1>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">
            People, opportunities and everyday help — all in one place.
          </p>
        </div>
        <Button size="sm" className="shrink-0 gap-2 rounded-full">
          <Plus className="size-4" />
          Post
        </Button>
      </header>

      <div className="mt-5 grid grid-cols-2 rounded-2xl bg-muted/70 p-1">
        <button
          type="button"
          onClick={() => setView("people")}
          className={cn("flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-medium transition", view === "people" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}
        >
          <Users className="size-4" /> People
        </button>
        <button
          type="button"
          onClick={() => setView("opportunities")}
          className={cn("flex h-10 items-center justify-center gap-2 rounded-xl text-sm font-medium transition", view === "opportunities" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}
        >
          <Compass className="size-4" /> Opportunities
        </button>
      </div>

      {view === "people" ? (
        <>
          <div className="mt-4 flex items-center gap-2">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people, skills or campus" aria-label="Search people" className="h-11 rounded-2xl pl-9" />
            </div>
            <Button variant="outline" size="icon" className="size-11 shrink-0 rounded-2xl" aria-label="Search filters">
              <SlidersHorizontal className="size-4" />
            </Button>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {peopleTabs.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn("h-8 shrink-0 rounded-full px-3 text-xs font-medium transition", tab === id ? "bg-foreground text-background" : "bg-muted text-muted-foreground")}
              >
                {label}
                {id === "requests" && incoming.length > 0 ? <span className="ml-1.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">{incoming.length}</span> : null}
              </button>
            ))}
          </div>

          {tab === "discover" ? (
            <section className="mt-5 rounded-2xl border bg-card p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="size-4 text-primary" /> Find your people
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover people across campuses through shared interests, skills and academic paths.
              </p>
            </section>
          ) : null}

          <div className="mt-5 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{tab === "discover" ? "People you may like" : peopleTabs.find((item) => item.id === tab)?.label}</h2>
            <span className="text-xs text-muted-foreground">{shown.length} {shown.length === 1 ? "person" : "people"}</span>
          </div>

          <ul className="mt-3 divide-y rounded-2xl border bg-card">
            {shown.map((p) => {
              const uni = uniById(p.universityId);
              const ctx = sharedContext(p, lens);
              return (
                <li key={p.handle} className="p-3">
                  <div className="flex items-center gap-3">
                    <Link to="/u/$handle" params={{ handle: p.handle }} className="shrink-0">
                      <Avatar name={p.name} className="size-11" />
                    </Link>
                    <Link to="/u/$handle" params={{ handle: p.handle }} className="min-w-0 flex-1">
                      <PersonMeta person={p} compact />
                      <p className="truncate text-xs text-muted-foreground">{uni?.shortName} · {academicLine(p)}</p>
                      {ctx.items.length > 0 ? <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{ctx.items.join(" · ")}</p> : null}
                    </Link>
                    <div className="shrink-0">
                      {tab === "requests" ? (
                        <div className="flex gap-1.5">
                          <Button size="sm" onClick={() => accept(p.handle)}>Accept</Button>
                          <Button size="sm" variant="outline" onClick={() => decline(p.handle)}>Decline</Button>
                        </div>
                      ) : tab === "sent" ? (
                        <Button size="sm" variant="outline" onClick={() => cancelRequest(p.handle)}>Cancel</Button>
                      ) : (
                        <RelationActions handle={p.handle} />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {shown.length === 0 ? (
            <div className="rounded-2xl border border-dashed px-5 py-12 text-center">
              <UserRound className="mx-auto size-7 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Nothing here yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Your people and requests will appear here.</p>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <section className="mt-5">
            <h2 className="text-lg font-semibold tracking-tight">What are you looking for?</h2>
            <p className="mt-1 text-sm text-muted-foreground">Find work, offer a service, order something or ask for help.</p>
          </section>
          <div className="mt-4 divide-y rounded-2xl border bg-card">
            {opportunityTypes.map(({ label, detail, icon: Icon }) => (
              <button key={label} type="button" className="flex w-full items-center gap-3 p-4 text-left transition hover:bg-muted/50">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted"><Icon className="size-5" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{detail}</span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
          <section className="mt-5 rounded-2xl border border-dashed p-4">
            <p className="text-sm font-semibold">Your listings and activity</p>
            <p className="mt-1 text-xs text-muted-foreground">Manage your offers, applications, orders and active deals from one place.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">My posts</span>
              <span className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">My requests</span>
              <span className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">My deals</span>
            </div>
          </section>
          <p className="mt-4 text-center text-xs text-muted-foreground">Food, goods, local services and remote work belong here too.</p>
        </>
      )}

      <section className="mt-6 border-t pt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">MORE IN UNIBUD</p>
        <div className="grid grid-cols-2 gap-2">
          <Link to="/messages" className="flex items-center justify-between rounded-xl bg-muted/60 p-3 text-sm">
            <span>Chat</span><ChevronRight className="size-4 text-muted-foreground" />
          </Link>
          <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3 text-sm">
            <span>SoulLync</span><Heart className="size-4 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3 text-sm">
            <span>WAYWARD</span><Compass className="size-4 text-muted-foreground" />
          </div>
          <Link to="/riff" className="flex items-center justify-between rounded-xl bg-muted/60 p-3 text-sm">
            <span>Riff</span><ChevronRight className="size-4 text-muted-foreground" />
          </Link>
          <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3 text-sm" aria-disabled="true" title="Not connected yet">
            <span>SoulLync · planned</span><Heart className="size-4 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3 text-sm" aria-disabled="true" title="Not connected yet">
            <span>WAYWARD · planned</span><Compass className="size-4 text-muted-foreground" />
          </div>
          <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3 text-sm" aria-disabled="true" title="Not connected yet">
            <span>Concierge · planned</span><Sparkles className="size-4 text-muted-foreground" />
          </div>
        </div>
      </section>
    </main>
  );
}
