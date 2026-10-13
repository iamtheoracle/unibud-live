import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/logo";
import { useAuthReady } from "@/components/unibud/sign-in-gate";

export const Route = createFileRoute("/_app/welcome")({ component: Welcome });

function Welcome() {
  const nav = useNavigate();
  const { user, isPending } = useAuthReady();

  useEffect(() => {
    if (!isPending && user) void nav({ to: "/" });
  }, [user, isPending, nav]);

  if (isPending) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <Wordmark size="sm" className="max-w-[10rem]" />
      </main>
    );
  }

  if (user) return null;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-10">
      <Wordmark size="sm" className="mb-10 max-w-[10rem]" />
      <p className="kicker">Welcome to UNIBUD</p>
      <h1 className="mt-3 font-display text-4xl font-medium">
        Your people. Your ideas. Your world.
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Connect, discover, and learn in one place. Create an account to use the full UNIBUD experience.
      </p>
      <div className="mt-8 space-y-3">
        <Link to="/login" search={{ mode: "up" }} className="block">
          <Button className="w-full">Create account</Button>
        </Link>
        <Link to="/login" search={{ mode: "in" }} className="block">
          <Button variant="outline" className="w-full">Sign in</Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => void nav({ to: "/bud" })}
        >
          Continue as Guest
        </Button>
      </div>
      <p className="mt-5 text-center text-xs text-muted-foreground">
        Guest access is limited to Bud. Sign in for the full UNIBUD experience.
      </p>
    </main>
  );
}
