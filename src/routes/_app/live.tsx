import { createFileRoute, Link } from "@tanstack/react-router";
import { Headphones, Mic2, Radio, ShieldCheck, Users, Video } from "lucide-react";

export const Route = createFileRoute("/_app/live")({ component: Live });

const modes = [
  { title: "Video rooms", detail: "Meet face-to-face when everyone opts in.", icon: Video, status: "In development" },
  { title: "Audio rooms", detail: "Talk live without turning on your camera.", icon: Mic2, status: "In development" },
  { title: "Text rooms", detail: "Join the conversation without camera or microphone access.", icon: Users, status: "In development" },
  { title: "Random match", detail: "Opt in to meet someone new. Skip or leave whenever you want.", icon: Radio, status: "Safety and matching build" },
];

function Live() {
  return (
    <main className="safe-bottom px-4 pb-8 pt-6 md:px-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="kicker">UNIBUD SOCIAL</p>
          <h1 className="mt-1 font-display text-4xl">Live</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Drop into conversations, discover creators and meet people around shared interests.
          </p>
        </div>
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-bud/10 text-bud">
          <Radio className="size-6" />
        </span>
      </div>

      <section className="mt-6 rounded-3xl bg-card p-5 ring-1 ring-border">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Radio className="size-4 text-bud" /> Live experiences
        </div>
        <h2 className="mt-2 text-xl font-semibold">Your next conversation starts here.</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Video, audio and text-first rooms will live together here. Random matching will always require your consent.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {modes.map((mode) => {
            const Icon = mode.icon;
            return (
              <article key={mode.title} className="rounded-2xl bg-background p-4 ring-1 ring-border">
                <div className="flex items-center justify-between gap-2">
                  <Icon className="size-5 text-bud" />
                  <span className="rounded-full bg-secondary px-2 py-1 text-[10px] font-medium text-muted-foreground">{mode.status}</span>
                </div>
                <h3 className="mt-3 text-sm font-semibold">{mode.title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{mode.detail}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-4 rounded-3xl border border-border p-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-bud" />
          <h2 className="font-semibold">Your safety comes first</h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          No camera or microphone starts without permission. You will be able to leave, skip, block and report from inside every room.
        </p>
      </section>

      <section className="mt-4 rounded-3xl bg-secondary/60 p-5">
        <div className="flex items-center gap-2">
          <Headphones className="size-5" />
          <h2 className="font-semibold">Prefer listening?</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Explore creator shows and recorded conversations.</p>
        <Link to="/podcasts" className="mt-4 inline-flex h-10 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background">
          Explore podcasts
        </Link>
      </section>
    </main>
  );
}
