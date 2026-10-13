import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { enterGuestMode } from "@/lib/auth/guest";
import { Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/start")({
  component: StartScreen,
});

function StartScreen() {
  const nav = useNavigate();

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-12">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <Wordmark size="hero" className="mb-8" />
        <p className="kicker">UNIBUD</p>
        <h1 className="mt-3 font-display text-3xl font-medium tracking-tight">
          Where people, ideas and discovery meet.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          A quiet assistant named Bud. Sign in to keep your place, or continue as a guest.
        </p>

        <div className="mt-10 flex w-full flex-col gap-3">
          <Button asChild className="w-full" size="lg">
            <Link to="/login">Sign In / Register</Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={() => {
              enterGuestMode();
              void nav({ to: "/bud" });
            }}
          >
            Continue as Guest
          </Button>
        </div>

        <p className="mt-6 text-[11px] text-muted-foreground">
          Guests can use Bud only. Chats are not saved. Sign in for Square, Connect, Quad, and Chat.
        </p>
      </div>
    </main>
  );
}
