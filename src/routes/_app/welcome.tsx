import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/logo";
import { useCampusStore } from "@/lib/unibud/campus-store";
import { upsertMyProfile } from "@/lib/unibud/server";
import { useAuthReady } from "@/components/unibud/sign-in-gate";
import { enterGuestMode } from "@/lib/auth/guest";

export const Route = createFileRoute("/_app/welcome")({ component: Welcome });

function Welcome() {
  const nav = useNavigate();
  const { user, isPending } = useAuthReady();
  const setOnboardingDone = useCampusStore((s) => s.setOnboardingDone);
  const onboardingDone = useCampusStore((s) => s.onboardingDone);

  useEffect(() => {
    if (user && onboardingDone) void nav({ to: "/" });
  }, [user, onboardingDone, nav]);

  function finish() {
    setOnboardingDone(true);
    if (user) void upsertMyProfile({ data: { onboardingDone: true } });
    void nav({ to: "/" });
  }

  if (isPending) {
    return <div className="m-6 h-64 animate-pulse rounded-3xl bg-secondary" />;
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
        <Wordmark size="sm" className="mb-10 max-w-[9rem]" />
        <p className="kicker">UNIBUD · University Buddy</p>
        <h1 className="mt-3 font-display text-4xl font-medium">Connect, share, and discover.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Create an account to join Square, Connect, Quad, and Chat. Guests can talk with Bud and read
          public Riff.
        </p>
        <div className="mt-8 space-y-3">
          <Link to="/login" search={{ mode: "up" }}>
            <Button className="w-full">Create account</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="w-full">
              Sign in
            </Button>
          </Link>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              enterGuestMode();
              void nav({ to: "/bud" });
            }}
          >
            Continue as Guest
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
      <p className="kicker">Welcome</p>
      <h1 className="mt-3 font-display text-4xl font-medium">You are in.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Square, Connect, Quad, and Chat are ready. Optional profile details live in Profile — nothing
        extra is required to start.
      </p>
      <Button className="mt-8 w-full" onClick={finish}>
        Enter Square
      </Button>
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Public discovery:{" "}
        <Link to="/riff" className="font-medium text-ink underline">
          Open Riff
        </Link>
      </p>
    </main>
  );
}
