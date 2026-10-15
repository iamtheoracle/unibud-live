import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/_app/soulync")({ component: SouLync });

function SouLync() {
  return (
    <main className="safe-bottom mx-auto max-w-lg bg-rose-50/50 px-5 py-8">
      <p className="text-xs font-medium uppercase tracking-wide text-rose-700">SouLync</p>
      <h1 className="mt-1 font-display text-4xl text-rose-950">Intentional connections.</h1>
      <p className="mt-2 text-sm text-rose-900/80">
        Adult-only. Private by default. Nothing is shared until you choose.
      </p>
      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm">
        <Heart className="size-5 text-rose-600" />
        <div>
          <p className="font-medium">Dating profile</p>
          <p className="text-sm text-muted-foreground">
            Not set up. When you open SouLync the first time, it will ask about your dating life. Academic and social profiles stay separate.
          </p>
        </div>
      </div>
      <p className="mt-6 text-xs text-muted-foreground">
        Location, photos, and preferences are never shown without your permission. Block and report are required before matching is enabled.
      </p>
    </main>
  );
}
