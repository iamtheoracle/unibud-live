import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/logo";
import {
  clearGuestMode,
  enterGuestMode,
  guestHomePath,
  isGuestAllowedPath,
  isGuestMode,
} from "@/lib/auth/guest";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

/** Client shell enforcement for guests. Does not replace server authMiddleware. */
export function AccessGate({ children }: { children: React.ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (isPending) return;
    setReady(true);

    if (user) {
      clearGuestMode();
      setBlocked(false);
      return;
    }

    const guest = isGuestMode();
    const allowed = isGuestAllowedPath(pathname);

    if (guest && allowed) {
      setBlocked(false);
      return;
    }

    if (guest && !allowed) {
      setBlocked(true);
      return;
    }

    if (allowed) {
      setBlocked(false);
      return;
    }

    void nav({ to: "/welcome" });
  }, [user, isPending, pathname, nav]);

  if (isPending || !ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-10 w-40 animate-pulse rounded-full bg-secondary" />
      </div>
    );
  }

  if (blocked && !user) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
        <Wordmark size="sm" className="mb-8 max-w-[9rem]" />
        <p className="kicker">Account required</p>
        <h1 className="mt-2 font-display text-3xl font-medium">Sign in to open this part of UNIBUD.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Guests can use Bud only. Square, Connect, Quad, Chat, Board, and the rest need an account.
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
            variant="ghost"
            className="w-full"
            onClick={() => {
              enterGuestMode();
              setBlocked(false);
              void nav({ to: guestHomePath() });
            }}
          >
            Back to Bud
          </Button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
