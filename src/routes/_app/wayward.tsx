import { createFileRoute } from "@tanstack/react-router";
import { Flame } from "lucide-react";

export const Route = createFileRoute("/_app/wayward")({ component: Wayward });

function Wayward() {
  return (
    <main className="safe-bottom mx-auto max-w-lg bg-violet-50/50 px-5 py-8">
      <p className="text-xs font-medium uppercase tracking-wide text-violet-700">Wayward</p>
      <h1 className="mt-1 font-display text-4xl text-violet-950">Culture, trends, challenges.</h1>
      <p className="mt-2 text-sm text-violet-900/80">
        A separate life-discovery space. 18+. No fake engagement.
      </p>
      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <Flame className="size-5 text-violet-600" />
        <div>
          <p className="font-medium">Nothing here yet</p>
          <p className="text-sm text-muted-foreground">
            Real posts, creators, and challenges appear when people publish them. No seeded activity.
          </p>
        </div>
      </div>
    </main>
  );
}
