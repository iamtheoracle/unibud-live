import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { enterGuestMode } from "@/lib/auth/guest";
import { Wordmark, ArcAttribution } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/start")({
  component: StartScreen,
});

function StartScreen() {
  const nav = useNavigate();
  const [phase, setPhase] = useState<"splash" | "entry">("splash");

  useEffect(() => {
    const t = window.setTimeout(() => setPhase("entry"), 1600);
    return () => window.clearTimeout(t);
  }, []);

  if (phase === "splash") {
    return (
      <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-6">
        <Wordmark size="hero" className="mb-10 max-w-xs animate-pulse" />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block size-2 animate-bounce rounded-full bg-ink [animation-delay:-0.3s]" />
          <span className="inline-block size-2 animate-bounce rounded-full bg-ink [animation-delay:-0.15s]" />
          <span className="inline-block size-2 animate-bounce rounded-full bg-ink" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-between bg-background px-6 py-8">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <Wordmark size="hero" className="mb-6 max-w-xs" />
        <p className="kicker">UNIBUD · University Buddy</p>
        <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">
          Roast, rizz, gossip, gist.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You don’t need an account to drop a Riff or talk with Bud. Sign in when you want Square, Connect, Quad, and Chat.
        </p>

        <div className="mt-8 flex w-full flex-col gap-2.5">
          <Button
            type="button"
            className="w-full"
            size="lg"
            onClick={() => {
              enterGuestMode();
              void nav({ to: "/riff" });
            }}
          >
            Join the Riff
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => {
              enterGuestMode();
              void nav({ to: "/bud" });
            }}
          >
            Try Bud as guest
          </Button>
          <Button asChild variant="secondary" className="w-full" size="lg">
            <Link to="/login" search={{ mode: "up" }}>
              Create account
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full" size="lg">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground">
          Guest Riffs and Bud chats stay on this device. Create an account to keep them.
        </p>
        <ArcAttribution variant="compact" className="mt-6" />
      </div>
    </main>
  );
}
