import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authClient, authEnabled } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wordmark } from "@/components/brand/logo";
import { useCampusStore } from "@/lib/unibud/campus-store";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { mode?: "in" | "up" } => ({
    mode: s.mode === "up" ? "up" : s.mode === "in" ? "in" : undefined,
  }),
  component: Login,
});

function Login() {
  const router = useRouter();
  const search = Route.useSearch();
  const [mode, setMode] = useState<"in" | "up">(search.mode ?? "in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!authEnabled) {
      setError("Account access is not enabled on this deployment yet. You can still explore Bud and Riff.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email: email.trim().toLowerCase(),
          password,
          name: "New member",
        });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signIn.email({
          email: email.trim().toLowerCase(),
          password,
        });
        if (err) throw new Error(err.message);
      }
      await authClient.getSession();
      await router.invalidate();
      const done = useCampusStore.getState().onboardingDone;
      await router.navigate({ to: done ? "/" : "/welcome" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not complete account access");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-5 py-8">
      <section className="w-full max-w-sm">
        <Link to="/start" className="inline-flex" aria-label="UNIBUD welcome">
          <Wordmark size="md" className="max-w-[9rem]" />
        </Link>

        <div className="mt-10">
          <p className="kicker">Your space, your pace</p>
          <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
            Come in as you are.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            You don’t need an account to roast, rizz, gossip or gist. Start with Riff, or try Bud.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-1">
          <button
            type="button"
            onClick={() => { setMode("in"); setError(null); }}
            aria-pressed={mode === "in"}
            className={mode === "in" ? "rounded-xl bg-card px-3 py-2.5 text-sm font-medium shadow-sm" : "rounded-xl px-3 py-2.5 text-sm text-muted-foreground"}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => { setMode("up"); setError(null); }}
            aria-pressed={mode === "up"}
            className={mode === "up" ? "rounded-xl bg-card px-3 py-2.5 text-sm font-medium shadow-sm" : "rounded-xl px-3 py-2.5 text-sm text-muted-foreground"}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={onEmail} className="mt-5 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "up" ? "new-password" : "current-password"}
            />
            {mode === "up" ? (
              <p className="text-xs text-muted-foreground">At least 8 characters. You’ll choose your name and username next.</p>
            ) : null}
          </div>
          {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={busy || !authEnabled}>
            {busy ? "Working…" : mode === "up" ? "Create account" : "Sign in"}
          </Button>
          {!authEnabled ? (
            <p className="text-xs text-muted-foreground">
              Account access is currently switched off on this deployment. This message is shown instead of pretending sign-in is working.
            </p>
          ) : null}
        </form>

        <div className="my-7 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          Or explore without an account
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          <Button asChild variant="outline" className="w-full">
            <Link to="/riff">Join the Riff</Link>
          </Button>
          <Button asChild className="w-full">
            <Link to="/bud">Try Bud as a guest</Link>
          </Button>
        </div>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Your account is optional for exploring. You can add profile details when you’re ready.
        </p>
      </section>
    </main>
  );
}
