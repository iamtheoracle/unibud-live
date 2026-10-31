import { createFileRoute, Link } from "@tanstack/react-router";
import { Headphones, Mic2, Radio, Search } from "lucide-react";

export const Route = createFileRoute("/_app/podcasts")({ component: Podcasts });

function Podcasts() {
  return (
    <main className="safe-bottom px-4 pb-8 pt-6 md:px-6">
      <p className="kicker">UNIBUD SOCIAL</p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <h1 className="font-display text-4xl">Podcasts</h1>
        <span className="grid size-11 place-items-center rounded-2xl bg-bud/10 text-bud">
          <Headphones className="size-5" />
        </span>
      </div>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Stories, opinions, comedy, culture, music, relationships and conversations from independent creators.
      </p>

      <section className="mt-6 rounded-3xl bg-card p-5 ring-1 ring-border">
        <p className="text-xs font-semibold uppercase tracking-wide text-bud">Discover</p>
        <h2 className="mt-2 text-xl font-semibold">Find your next favourite show.</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Social podcast discovery is being connected to creator publishing and real audio hosting. No sample episodes are shown as playable content.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Comedy", "Culture", "Music", "Lifestyle", "Relationships", "Stories", "Gaming", "Talk"].map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-3 py-2 text-xs">{tag}</span>
          ))}
        </div>
      </section>

      <section className="mt-4 grid gap-3 sm:grid-cols-2">
        <article className="rounded-2xl border border-border p-4">
          <Mic2 className="size-5 text-bud" />
          <h3 className="mt-3 font-semibold">Create a show</h3>
          <p className="mt-1 text-sm text-muted-foreground">Build a creator profile, publish episodes and grow an audience.</p>
          <span className="mt-3 inline-block text-xs font-medium text-muted-foreground">Creator publishing in development</span>
        </article>
        <article className="rounded-2xl border border-border p-4">
          <Radio className="size-5 text-bud" />
          <h3 className="mt-3 font-semibold">Live podcast</h3>
          <p className="mt-1 text-sm text-muted-foreground">Bring guests on air and let listeners join the conversation.</p>
          <Link to="/live" className="mt-3 inline-flex text-xs font-semibold text-bud">Explore Live</Link>
        </article>
      </section>

      <div className="mt-5 rounded-2xl bg-secondary/50 p-4">
        <div className="flex items-center gap-2 text-sm font-medium"><Search className="size-4" /> Your library is ready to take shape</div>
        <p className="mt-1 text-xs text-muted-foreground">Follow creators and save episodes once the social podcast catalogue is connected.</p>
      </div>
    </main>
  );
}
