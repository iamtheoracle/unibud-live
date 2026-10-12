import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/live")({ component: Live });

/**
 * Live is not connected to a real broadcast pipeline on this branch.
 * Do not show mock streams, simulated viewers, or invented chat.
 */
function Live() {
  return (
    <main className="safe-bottom mx-auto max-w-3xl px-5 pt-8">
      <p className="kicker">Broadcast</p>
      <h1 className="mt-2 font-display text-4xl">Live</h1>
      <div className="mt-8 rounded-2xl bg-card p-6 ring-1 ring-border">
        <p className="font-medium">Live is not available yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          There is no active broadcast system connected. Nothing is streaming, and no chat is simulated.
          When Live is wired to real sessions, this screen will show them honestly.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/">
            <Button variant="outline">Back to Square</Button>
          </Link>
          <Link to="/bud">
            <Button variant="outline">Talk to Bud</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
