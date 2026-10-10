import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/logo";
import { useCampusStore, type LifeStage } from "@/lib/unibud/campus-store";
import { upsertMyProfile } from "@/lib/unibud/server";
import { useAuthReady } from "@/components/unibud/sign-in-gate";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/welcome")({ component: Welcome });

const ROLES: { id: LifeStage; label: string; hint: string }[] = [
  { id: "student", label: "Student", hint: "You’re on a programme now" },
  { id: "tutor", label: "Tutor", hint: "You teach or support learning" },
  { id: "both", label: "Both", hint: "You study and teach" },
  { id: "pre", label: "Pre-university", hint: "Not yet enrolled" },
];

function Welcome() {
  const nav = useNavigate();
  const { user, isPending } = useAuthReady();
  const setOnboardingDone = useCampusStore((s) => s.setOnboardingDone);
  const setLifeStage = useCampusStore((s) => s.setLifeStage);
  const onboardingDone = useCampusStore((s) => s.onboardingDone);
  const [who, setWho] = useState<LifeStage>("student");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user && onboardingDone) void nav({ to: "/" });
  }, [user, onboardingDone, nav]);

  async function finish() {
    setBusy(true);
    try {
      setLifeStage(who);
      setOnboardingDone(true);
      if (user) {
        try {
          await upsertMyProfile({ data: { onboardingDone: true } });
        } catch {
          /* local progress still saved */
        }
      }
      await nav({ to: "/" });
    } finally {
      setBusy(false);
    }
  }

  if (isPending) {
    return <div className="m-6 h-64 animate-pulse rounded-3xl bg-secondary" />;
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
        <Wordmark size="sm" className="mb-10 max-w-[9rem]" />
        <p className="kicker">Welcome</p>
        <h1 className="mt-3 font-display text-4xl font-medium">Sign in to start</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Create an account or sign in. Your role and campus setup take one step after that.
        </p>
        <Button asChild className="mt-8 w-full">
          <Link to="/login" search={{ mode: "up" }}>
            Create account
          </Link>
        </Button>
        <Button asChild variant="outline" className="mt-3 w-full">
          <Link to="/login" search={{ mode: "in" }}>
            Sign in
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-10">
      <Wordmark size="sm" className="mb-8 max-w-[9rem]" />
      <p className="kicker">Almost there</p>
      <h1 className="mt-2 font-display text-4xl font-medium">How do you use UNIBUD?</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        One choice. You can change this later in settings.
      </p>

      <ul className="mt-8 space-y-2">
        {ROLES.map((r) => (
          <li key={r.id}>
            <button
              type="button"
              onClick={() => setWho(r.id)}
              className={cn(
                "flex w-full flex-col items-start rounded-2xl px-4 py-3.5 text-left ring-1 transition-colors",
                who === r.id ? "bg-ink text-paper ring-ink" : "bg-card ring-border hover:bg-secondary/60",
              )}
            >
              <span className="text-[15px] font-semibold">{r.label}</span>
              <span className={cn("mt-0.5 text-xs", who === r.id ? "text-paper/70" : "text-muted-foreground")}>
                {r.hint}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {who === "tutor" || who === "both" ? (
        <p className="mt-4 text-xs text-muted-foreground">
          Tutor Mode still needs verification for live class tools. This does not grant lecturer access by itself.
        </p>
      ) : null}

      <Button className="mt-8 w-full" disabled={busy} onClick={() => void finish()}>
        {busy ? "Opening…" : "Enter Square"}
      </Button>
    </main>
  );
}
