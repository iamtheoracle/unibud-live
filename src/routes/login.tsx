import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authClient, authEnabled } from "@/lib/auth/client";
import { clearGuestMode } from "@/lib/auth/guest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wordmark, ArcAttribution } from "@/components/brand/logo";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({
          email,
          password,
          name: name.trim() || "Member",
        });
        if (err) throw new Error(err.message);
        clearGuestMode();
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message);
        clearGuestMode();
      }
      await authClient.getSession();
      await router.invalidate();
      const done = useCampusStore.getState().onboardingDone;
      await router.navigate({ to: done ? "/" : "/welcome" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-black lg:block">
        <div className="relative flex h-full flex-col justify-between p-10">
          <Link to="/" className="block max-w-[9rem]">
            <Wordmark size="sm" />
          </Link>
          <div className="max-w-md">
            <p className="kicker">UNIBUD</p>
            <h1 className="mt-3 font-display text-4xl font-medium text-paper">
              Where people, ideas and discovery meet.
            </h1>
            <p className="mt-4 text-sm text-paper/70">
              UNIBUD · University Buddy — connect, share, discover, and talk with Bud.
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <Link to="/" className="mb-10 lg:hidden">
          <Wordmark size="sm" />
        </Link>
        <h2 className="font-display text-3xl font-medium">Sign in</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Email and password. That’s it. You can still try Bud or Riff as a guest.
        </p>

        {authEnabled ? (
          <>
            <div className="my-6 h-px bg-border" aria-hidden="true" />

            <div className="mb-4 flex gap-2">
              <button
                type="button"
                onClick={() => setMode("in")}
                className={mode === "in" ? "text-sm font-medium" : "text-sm text-muted-foreground"}
              >
                Sign in
              </button>
              <span className="text-muted-foreground">/</span>
              <button
                type="button"
                onClick={() => setMode("up")}
                className={mode === "up" ? "text-sm font-medium" : "text-sm text-muted-foreground"}
              >
                Create account
              </button>
            </div>

            <form onSubmit={onEmail} className="space-y-3">
              {mode === "up" ? (
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    autoComplete="name"
                  />
                </div>
              ) : null}
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  autoComplete="email"
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
              </div>
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Working…" : mode === "up" ? "Create account" : "Sign in"}
              </Button>
              <p className="text-center text-[11px] text-muted-foreground">
                Use a password of at least 8 characters.
              </p>
            </form>
          </>
        ) : null}
        <ArcAttribution variant="compact" className="mt-10" />
      </section>
    </main>
  );
}
