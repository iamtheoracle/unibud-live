import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCatalog } from "@/lib/unibud/queries";
import { myCommunities } from "@/lib/social/server";
import { createQuad } from "@/lib/unibud/quad-api";
import { useQuery } from "@tanstack/react-query";
import { useAuthReady } from "@/components/unibud/sign-in-gate";
import { canGovernClass } from "@/lib/unibud/roles";
import { useCampusStore } from "@/lib/unibud/campus-store";
import { communityKindLabel } from "@/lib/unibud/community-meta";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/communities")({ component: Communities });

function Communities() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nested = pathname !== "/communities" && pathname.startsWith("/communities/");
  if (nested) return <Outlet />;

  const { data } = useCatalog();
  const allRooms = data?.communities ?? [];
  const { user } = useAuthReady();
  const role = useCampusStore((s) => s.role ?? "student");
  const [tab, setTab] = useState<"discover" | "mine">("discover");
  const [kind, setKind] = useState<"all" | "Class" | "Study" | "University" | "Faculty" | "Interest">("all");
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [createKind, setCreateKind] = useState<"Study" | "Interest" | "Class">("Study");
  const mine = useQuery({
    queryKey: ["my-communities"],
    queryFn: () => myCommunities(),
    enabled: Boolean(user),
  });
  const communities = allRooms.filter(
    (c) =>
      !q.trim() ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.description.toLowerCase().includes(q.toLowerCase()),
  );
  const shown = (tab === "mine" ? communities.filter((c) => mine.data?.includes(c.id)) : communities).filter(
    (c) => kind === "all" || c.kind === kind || (kind === "Interest" && ["Interest", "Music", "Sports", "Career"].includes(c.kind)),
  );

  return (
    <main className="safe-bottom px-5 pt-6">
      <p className="kicker">Find your rooms</p>
      <div className="mt-1 flex items-end justify-between gap-3">
        <h1 className="font-display text-4xl">Quad</h1>
        <Button size="sm" variant="outline" className="shrink-0" onClick={() => setCreating((v) => !v)}>
          <Plus className="size-4" />
          New
        </Button>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        App-like communities — not a class list, not Square. Groups live inside a Quad.
      </p>

      {creating ? (
        <form
          className="mt-4 space-y-3 rounded-2xl bg-card p-4 ring-1 ring-border"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            if (createKind === "Class" && !canGovernClass(role)) {
              toast.error("Only class governors can open a Class room.");
              return;
            }
            if (!user) {
              toast.error("Sign in to create a Quad.");
              return;
            }
            void createQuad({
              data: { name: name.trim(), kind: createKind, description: "", privacy: "public" },
            })
              .then(() => {
                toast.success("Quad created.");
                setCreating(false);
                setName("");
                void mine.refetch();
              })
              .catch((err: Error) => toast.error(err.message || "Could not create Quad."));
          }}
        >
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name this Quad or group" />
          <div className="flex flex-wrap gap-2">
            {(["Study", "Interest", "Class"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setCreateKind(k)}
                className={cn("h-9 rounded-full px-3 text-sm", createKind === k ? "bg-ink text-paper" : "bg-secondary")}
              >
                {k}
              </button>
            ))}
          </div>
          <Button type="submit" size="sm" disabled={!name.trim()}>
            Continue
          </Button>
        </form>
      ) : null}

      <div className="mt-5 flex gap-2">
        {(["discover", "mine"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn("h-9 rounded-full px-4 text-sm capitalize", tab === id ? "bg-ink text-paper" : "bg-card ring-1 ring-border")}
          >
            {id}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {(["all", "Class", "Study", "University", "Faculty", "Interest"] as const).map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setKind(id)}
            className={cn("h-9 shrink-0 rounded-full px-3 text-xs", kind === id ? "bg-ink text-paper" : "bg-secondary")}
          >
            {id === "all" ? "All" : communityKindLabel(id)}
          </button>
        ))}
      </div>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Quads" className="pl-10" />
      </div>

      <ul className="mt-5 space-y-3">
        {shown.length === 0 ? (
          <li className="rounded-2xl bg-card p-6 text-center ring-1 ring-border">
            <p className="font-medium">No Quads here yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Real communities appear when they exist in the database. Nothing is fabricated to fill the list.
            </p>
          </li>
        ) : (
          shown.map((c) => (
            <li key={c.id}>
              <Link to="/communities/$id" params={{ id: c.id }} className="block rounded-2xl bg-card p-4 ring-1 ring-border">
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">{communityKindLabel(c.kind)}</p>
                <h2 className="mt-1 font-medium">{c.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{c.description}</p>
              </Link>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
