import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/logo";
import { useCampusStore, type LifeStage } from "@/lib/unibud/campus-store";
import { upsertMyProfile } from "@/lib/unibud/server";
import { useAuthReady } from "@/components/unibud/sign-in-gate";
import { enterGuestMode } from "@/lib/auth/guest";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/welcome")({ component: Welcome });

const SOCIAL = ["music", "football", "campus gist", "fashion", "tech", "faith", "hustle", "nightlife"];
const ACADEMIC = ["notes", "exams", "projects", "internships", "research"];

const ROOM_HINTS: Record<string, { to: string; id: string; label: string }[]> = {
  music: [{ to: "/communities/$id", id: "afrobeats", label: "Afrobeats & Campus DJ" }],
  football: [{ to: "/communities/$id", id: "five-aside", label: "Five-a-side" }],
  "campus gist": [{ to: "/communities/$id", id: "the-gist", label: "The Gist" }],
};

function Welcome() {
  const nav = useNavigate();
  const { user, isPending } = useAuthReady();
  const setOnboardingDone = useCampusStore((s) => s.setOnboardingDone);
  const setInterests = useCampusStore((s) => s.setInterests);
  const setAcademicInterests = useCampusStore((s) => s.setAcademicInterests);
  const setLifeStage = useCampusStore((s) => s.setLifeStage);
  const onboardingDone = useCampusStore((s) => s.onboardingDone);
  const [step, setStep] = useState(0);
  const [who, setWho] = useState<LifeStage>("student");
  const [social, setSocial] = useState<string[]>([]);
  const [academic, setAcademic] = useState<string[]>([]);

  useEffect(() => {
    if (user && onboardingDone) void nav({ to: "/" });
  }, [user, onboardingDone, nav]);

  function finish() {
    setInterests(social);
    setAcademicInterests(academic);
    setLifeStage(who);
    setOnboardingDone(true);
    if (user) void upsertMyProfile({ data: { onboardingDone: true } });
    void nav({ to: "/" });
  }

  const hints = social.flatMap((id) => ROOM_HINTS[id] ?? []);

  if (isPending) {
    return <div className="m-6 h-64 animate-pulse rounded-3xl bg-secondary" />;
  }

  if (!user) {
    return (
      <main className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-center overflow-hidden bg-[#0b0c12] px-6 text-white">
        <div className="mb-10"><Wordmark size="sm" className="max-w-[9rem]" /></div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">A social world by My Realm</p>
        <h1 className="mt-3 font-display text-5xl font-medium leading-[1.04] tracking-tight">More life. More people. More to explore.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Meet people, catch the conversation, find your corner, and talk to Bud when you need a hand.
        </p>
        <div className="mt-8 space-y-3">
          <Link to="/login" search={{ mode: "up" }}>
            <Button className="w-full rounded-full bg-white text-black hover:bg-white/90">Create account</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" className="w-full rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10">
              Sign in
            </Button>
          </Link>
        </div>
        <button
          type="button"
          className="mt-6 min-h-12 w-full rounded-full border border-violet-300/30 bg-violet-300/10 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-300/15"
          onClick={() => {
            enterGuestMode();
            void nav({ to: "/bud" });
          }}
        >
          Continue as Guest
        </button>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Guest access opens Bud directly. Create an account to use the rest of UNIBUD.
        </p>
      </main>
    );
  }

  return (
    <main className="safe-bottom px-5 pt-10">
      <p className="kicker">Welcome</p>
      <h1 className="mt-2 font-display text-4xl">A few things, so the mix is yours.</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Short questions. Skip anything. Nothing here grants extra permissions.
      </p>

      {step === 0 ? (
        <section className="mt-8">
          <p className="text-sm font-medium">You’re here as…</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(
              [
                ["student", "Student"],
                ["tutor", "Tutor"],
                ["both", "Both"],
                ["pre", "Pre-university"],
              ] as const
            ).map(([id, label]) => (
              <Chip key={id} on={who === id} onClick={() => setWho(id)}>
                {label}
              </Chip>
            ))}
          </div>
          {who === "tutor" || who === "both" ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Bud will remember you teach. Tutor Mode still needs lecturer verification — this does not grant it.
            </p>
          ) : null}
          <Button className="mt-8 w-full" onClick={() => setStep(1)}>
            Continue
          </Button>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="mt-8">
          <p className="text-sm font-medium">What do you actually want to see?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SOCIAL.map((id) => (
              <Chip
                key={id}
                on={social.includes(id)}
                onClick={() =>
                  setSocial((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
                }
              >
                {id}
              </Chip>
            ))}
          </div>
          {who === "tutor" || who === "both" || who === "student" ? (
            <>
              <p className="mt-6 text-sm font-medium">Learning, if you want it.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {ACADEMIC.map((id) => (
                  <Chip
                    key={id}
                    on={academic.includes(id)}
                    onClick={() =>
                      setAcademic((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
                    }
                  >
                    {id}
                  </Chip>
                ))}
              </div>
            </>
          ) : null}
          {hints.length ? (
            <div className="mt-6">
              <p className="text-xs text-muted-foreground">Rooms that match, if you want them later.</p>
              <ul className="mt-2 space-y-1">
                {hints.map((h) => (
                  <li key={h.id}>
                    <Link to="/communities/$id" params={{ id: h.id }} className="text-sm font-medium text-bud">
                      {h.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <Button className="mt-8 w-full" onClick={finish}>
            Take me to Square
          </Button>
        </section>
      ) : null}

      <button type="button" className="mt-4 w-full text-sm text-muted-foreground" onClick={finish}>
        Skip for now
      </button>
    </main>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-full px-4 text-sm capitalize",
        on ? "bg-ink text-paper" : "bg-card ring-1 ring-border",
      )}
    >
      {children}
    </button>
  );
}
