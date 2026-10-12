import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/logo";
import { useCampusStore } from "@/lib/unibud/campus-store";
import { upsertMyProfile } from "@/lib/unibud/server";
import { useAuthReady } from "@/components/unibud/sign-in-gate";

export const Route = createFileRoute("/_app/welcome")({ component: Welcome });

function Welcome() {
  const nav = useNavigate();
  const { user, isPending } = useAuthReady();
  const setOnboardingDone = useCampusStore((s) => s.setOnboardingDone);

  useEffect(() => {
    if (isPending || !user) return;
    // Keep sign-up simple: no profile questionnaire or university selection.
    setOnboardingDone(true);
    void upsertMyProfile({ data: { onboardingDone: true } });
    void nav({ to: "/" });
  }, [isPending, user, setOnboardingDone, nav]);

  if (isPending || user) {
    return (
      <main className="flex min-h-dvh items-center justify-center px-6">
        <div className="text-center">
          <Wordmark size="sm" className="mx-auto mb-6 max-w-[9rem]" />
          <p className="text-sm text-muted-foreground">Getting your UNIBUD space ready…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
      <Wordmark size="sm" className="mb-10 max-w-[9rem]" />
      <p className="kicker">Welcome</p>
      <h1 className="mt-3 font-display text-4xl font-medium">Your space. Your people. Your pace.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Connect, discover, learn, and explore UNIBUD. Create an account or sign in to get started.
      </p>
      <div className="mt-8 space-y-3">
        <Link to="/login" search={{ mode: "up" }}>
          <Button className="w-full">Create account</Button>
        </Link>
        <Link to="/login">
          <Button variant="outline" className="w-full">Sign in</Button>
        </Link>
      </div>
      <button
        type="button"
        className="mt-6 text-sm text-muted-foreground"
        onClick={() => {
          try {
            sessionStorage.setItem("unibud-guest-browse", "1");
          } catch {
            // Guest browsing should still work when session storage is unavailable.
          }
          void nav({ to: "/" });
        }}
      >
        Look around first
      </button>
    </main>
  );
}
