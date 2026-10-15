import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wordmark } from "@/components/brand/logo";
import { useCampusStore } from "@/lib/unibud/campus-store";
import { getMyProfile, upsertMyProfile } from "@/lib/unibud/server";
import { useAuthReady } from "@/components/unibud/sign-in-gate";
import { cn } from "@/lib/utils";
import { useCatalog } from "@/lib/unibud/queries";

export const Route = createFileRoute("/_app/welcome")({ component: Welcome });

const SOCIAL = ["music", "football", "campus gist", "fashion", "tech", "faith", "hustle", "nightlife"];
const ACADEMIC = ["notes", "exams", "projects", "internships", "research"];

function Welcome() {
  const nav = useNavigate();
  const { user, isPending } = useAuthReady();
  const { data: catalog } = useCatalog();
  const setOnboardingDone = useCampusStore((s) => s.setOnboardingDone);
  const setInterests = useCampusStore((s) => s.setInterests);
  const setAcademicInterests = useCampusStore((s) => s.setAcademicInterests);
  const setLegalName = useCampusStore((s) => s.setLegalName);
  const [step, setStep] = useState<0 | 1>(0);
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [social, setSocial] = useState<string[]>([]);
  const [academic, setAcademic] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    let active = true;
    if (!user) {
      setCheckingProfile(false);
      return;
    }
    void getMyProfile()
      .then((profile) => {
        if (!active) return;
        if (profile?.onboardingDone) void nav({ to: "/" });
        setCheckingProfile(false);
      })
      .catch(() => {
        if (active) setCheckingProfile(false);
      });
    return () => { active = false; };
  }, [user, nav]);

  function continueToInterests() {
    setError(null);
    const cleanName = displayName.trim().replace(/\s+/g, " ");
    const cleanHandle = handle.trim().replace(/^@/, "").toLowerCase();
    if (cleanName.length < 2) {
      setError("Add your name so people know what to call you.");
      return;
    }
    if (!/^[a-z0-9_]{3,20}$/.test(cleanHandle)) {
      setError("Choose a username with 3–20 letters, numbers or underscores.");
      return;
    }
    setDisplayName(cleanName);
    setHandle(cleanHandle);
    setStep(1);
  }

  async function finish() {
    setError(null);
    setSaving(true);
    try {
      setInterests(social);
      setAcademicInterests(academic);
      setLegalName(displayName.trim());
      if (user) {
        await upsertMyProfile({
          data: {
            displayName: displayName.trim(),
            handle: handle.trim().replace(/^@/, "").toLowerCase(),
            onboardingDone: true,
          },
        });
        setOnboardingDone(true);
        await nav({ to: "/" });
      } else {
        await nav({ to: "/riff" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your profile. Try again.");
    } finally {
      setSaving(false);
    }
  }

  const keywordMap: Record<string, string[]> = {
    "campus gist": ["gist", "campus", "culture", "social"],
    football: ["football", "sports", "pitch"],
    music: ["music", "sound", "afrobeats"],
    fashion: ["fashion", "style"],
    tech: ["tech", "coding", "build", "career"],
    faith: ["faith", "religion"],
    hustle: ["career", "business", "build"],
    nightlife: ["event", "nightlife", "social"],
    notes: ["study", "class", "academic"],
    exams: ["study", "class", "exam"],
    projects: ["project", "research", "build"],
    internships: ["career", "internship"],
    research: ["research", "academic", "study"],
  };
  const selected = [...social, ...academic];
  const hints = (catalog?.communities ?? [])
    .filter((community) => {
      const text = [community.name, community.description, community.kind].join(" ").toLowerCase();
      return selected.some((interest) =>
        (keywordMap[interest] ?? [interest]).some((keyword) => text.includes(keyword)),
      );
    })
    .sort((a, b) => b.members - a.members || a.name.localeCompare(b.name))
    .slice(0, 3);

  if (isPending || checkingProfile) {
    return <div className="mx-auto mt-8 h-48 max-w-md animate-pulse rounded-3xl bg-secondary" />;
  }

  if (!user) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
        <Wordmark size="sm" className="mb-8 max-w-[9rem]" />
        <h1 className="font-display text-3xl font-medium">Make it yours, when you’re ready.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          No long form. You can explore Riff anonymously, or create an account to keep your profile.
        </p>
        <Button asChild className="mt-7 w-full">
          <Link to="/login" search={{ mode: "up" }}>Create account</Link>
        </Button>
        <Button asChild variant="outline" className="mt-3 w-full">
          <Link to="/riff">Explore Riff</Link>
        </Button>
        <Button asChild variant="ghost" className="mt-2 w-full">
          <Link to="/bud">Try Bud as a guest</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="safe-bottom mx-auto max-w-xl px-5 pb-10 pt-8">
      <Wordmark size="sm" className="mb-8 max-w-[9rem]" />
      <p className="kicker">Welcome to UNIBUD</p>
      <h1 className="mt-2 font-display text-4xl tracking-tight">
        {step === 0 ? "What should we call you?" : "Tune your corner."}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {step === 0
          ? "Just your name and username. The rest can wait."
          : "Pick what you’re into, or skip it. You can change these any time."}
      </p>

      {step === 0 ? (
        <section className="mt-8 space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="display-name">Full name</Label>
            <Input
              id="display-name"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              maxLength={80}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              autoComplete="username"
              value={handle}
              onChange={(e) => setHandle(e.target.value.replace(/[^a-zA-Z0-9_]/g, "").slice(0, 20))}
              placeholder="yourname"
              maxLength={20}
              required
              aria-describedby="username-help"
            />
            <p id="username-help" className="text-xs text-muted-foreground">
              Use 3–20 letters, numbers or underscores. This is how people can mention you.
            </p>
          </div>
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          <Button className="w-full" onClick={continueToInterests}>Continue</Button>
        </section>
      ) : (
        <section className="mt-8">
          <p className="text-sm font-medium">What do you actually want to see?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SOCIAL.map((id) => (
              <Chip
                key={id}
                on={social.includes(id)}
                onClick={() => setSocial((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))}
              >
                {id}
              </Chip>
            ))}
          </div>
          <p className="mt-6 text-sm font-medium">Learning, if you want it.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {ACADEMIC.map((id) => (
              <Chip
                key={id}
                on={academic.includes(id)}
                onClick={() => setAcademic((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))}
              >
                {id}
              </Chip>
            ))}
          </div>
          {hints.length ? (
            <div className="mt-6">
              <p className="text-xs text-muted-foreground">Communities that match your interests</p>
              <ul className="mt-2 space-y-2">
                {hints.map((community) => (
                  <li key={community.id}>
                    <Link to="/communities/$id" params={{ id: community.id }} className="flex items-center justify-between gap-3 rounded-xl bg-card px-3 py-3 ring-1 ring-border">
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">{community.name}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{community.members.toLocaleString()} members</span>
                      </span>
                      <span className="text-xs font-medium text-bud">View</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {error ? <p role="alert" className="mt-4 text-sm text-destructive">{error}</p> : null}
          <Button className="mt-8 w-full" onClick={() => void finish()} disabled={saving}>
            {saving ? "Saving…" : "Take me to UNIBUD"}
          </Button>
          <button type="button" className="mt-4 w-full text-sm text-muted-foreground" onClick={() => void finish()} disabled={saving}>
            Skip interests for now
          </button>
          <button type="button" className="mt-3 w-full text-sm text-muted-foreground" onClick={() => { setError(null); setStep(0); }}>
            Back to name
          </button>
        </section>
      )}
    </main>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={cn(
        "h-9 rounded-full px-4 text-sm capitalize",
        on ? "bg-ink text-paper" : "bg-card ring-1 ring-border",
      )}
    >
      {children}
    </button>
  );
}
