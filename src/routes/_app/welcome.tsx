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
  const onboardingDone = useCampusStore((s) => s.onboardingDone);

  useEffect(() => {
    if (!user || onboardingDone) return;
    setOnboardingDone(true);
    void upsertMyProfile({ data: { onboardingDone: true } }).catch(() => {});
    void nav({ to: "/" });
  }, [user, onboardingDone, setOnboardingDone, nav]);

  if (isPending || (user && !onboardingDone)) {
    return <main className="min-h-dvh p-6"><div className="h-48 animate-pulse rounded-3xl bg-secondary" /></main>;
  }

  if (user) {
    return <main className="min-h-dvh p-6"><p className="text-sm text-muted-foreground">Opening UNIBUD…</p></main>;
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-10">
      <Wordmark size="sm" className="mb-10 max-w-[9rem]" />
      <p className="kicker">Welcome to UNIBUD</p>
      <h1 className="mt-3 font-display text-4xl font-medium">Your world. Your people. Your pace.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Connect with people, discover campus life, and learn with Bud. You can complete your profile later, whenever you choose.
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
        className="mt-6 w-full py-3 text-sm font-medium text-muted-foreground"
        onClick={() => {
          try {
            sessionStorage.setItem("unibud-guest-browse", "1");
          } catch {
            /* Storage may be unavailable in private browsing. */
          }
          void nav({ to: "/" });
        }}
      >
        Continue as Guest
      </button>
    </main>
  );
}
