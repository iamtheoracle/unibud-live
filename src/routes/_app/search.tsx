import { createFileRoute } from "@tanstack/react-router";
import { Clock, Search as SearchIcon, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DemoCallout } from "@/components/unibud/demo-callout";
import { useCampusStore } from "@/lib/unibud/campus-store";

export const Route = createFileRoute("/_app/search")({ component: SearchPage });

const FILTERS = ["all", "people", "communities", "classes", "posts", "learning", "news", "live", "podcasts"] as const;

function SearchPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const recent = useCampusStore((s) => s.recentSearches);
  const addSearch = useCampusStore((s) => s.addSearch);
  const clearSearches = useCampusStore((s) => s.clearSearches);
  const removeSearch = useCampusStore((s) => s.removeSearch);

  function commit(term: string) {
    const normalized = term.trim();
    if (!normalized) return;
    setQ(normalized);
    addSearch(normalized);
  }

  return (
    <main className="safe-bottom px-5 pt-8">
      <p className="kicker text-center">Discover UNIBUD</p>
      <h1 className="mt-3 text-center font-display text-4xl">What are you looking for?</h1>
      <p className="mx-auto mt-2 max-w-lg text-center text-sm text-muted-foreground">
        Search across people, communities, courses, posts, news and learning resources when their providers are connected.
      </p>
      <DemoCallout>
        Live search is not connected yet. This screen will not show fixture people, posts, classes, headlines, or podcasts as if they were real records. Recent searches are saved only in this device's local state.
      </DemoCallout>
      <div className="relative mt-6">
        <SearchIcon className="pointer-events-none absolute top-3.5 left-4 size-4 text-muted-foreground" />
        <Input
          className="pl-10"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit(q);
          }}
          placeholder="People, classes, news, live, podcasts"
          autoFocus
        />
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Search category filters">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`h-9 shrink-0 rounded-full px-4 text-sm capitalize ${filter === f ? "bg-ink text-paper" : "bg-card text-muted-foreground ring-1 ring-border"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {!q.trim() ? (
        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-medium">Recent searches</h2>
            {recent.length ? (
              <button type="button" className="text-sm text-muted-foreground" onClick={clearSearches}>
                Clear all
              </button>
            ) : null}
          </div>
          {recent.length ? (
            <ul className="mt-2 divide-y divide-border">
              {recent.map((term) => (
                <li key={term} className="flex items-center gap-3 py-3">
                  <Clock className="size-4 text-muted-foreground" />
                  <button type="button" className="flex-1 text-left text-sm" onClick={() => commit(term)}>
                    {term}
                  </button>
                  <button type="button" aria-label={`Remove recent search ${term}`} onClick={() => removeSearch(term)}>
                    <X className="size-4 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
              Your recent searches will appear here. Nothing is pre-filled with sample activity.
            </p>
          )}
        </section>
      ) : (
        <section className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6" role="status">
          <p className="kicker">SEARCH PREVIEW</p>
          <h2 className="mt-1 text-xl font-medium">Live results are unavailable</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You searched for <span className="font-medium text-foreground">“{q.trim()}”</span> in <span className="capitalize">{filter}</span>. The search provider is not connected, so no result list is shown.
          </p>
          <Button className="mt-4" variant="outline" onClick={() => setQ("")}>Clear search</Button>
        </section>
      )}
    </main>
  );
}
