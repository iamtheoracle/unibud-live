import { createFileRoute } from "@tanstack/react-router";
import { EmptyState } from "@/components/unibud/empty";

export const Route = createFileRoute("/_app/live")({ component: LivePage });

function LivePage() {
  return (
    <main className="safe-bottom mx-auto max-w-3xl px-5 pt-6">
      <p className="kicker">Live</p>
      <h1 className="font-display text-3xl font-medium tracking-tight">Live</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Student broadcasts when someone is actually on air. Nothing is simulated here.
      </p>
      <div className="mt-8">
        <EmptyState
          title="No one is broadcasting"
          body="When a student goes live, their session will appear here. There is no mock stream."
        />
      </div>
    </main>
  );
}
