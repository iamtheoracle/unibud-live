import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/podcasts")({ component: Podcasts });

function Podcasts() {
  return (
    <main className="safe-bottom px-5 pt-6">
      <p className="kicker">Educational audio</p>
      <h1 className="mt-1 font-display text-4xl">Podcasts</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Published lecture recordings will appear here when an audio file and its playback access have been verified.
      </p>
      <section className="mt-6 rounded-2xl border border-border p-5">
        <h2 className="font-semibold">No published recordings yet</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Example episode titles are not presented as real lecturer recordings. This page will show playable lessons once a verified recording is available.
        </p>
        <Link to="/board" className="mt-4 inline-flex text-sm font-medium">
          Return to Board
        </Link>
      </section>
    </main>
  );
}
