import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { OrbitMark } from "@/components/brand/identity-marks";
import { Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/start")({
  component: Welcome,
});

function Welcome() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void navigate({ to: "/login" });
    }, 1350);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 py-12">
      <div className="flex w-full max-w-sm flex-col items-center text-center">
        <Wordmark size="hero" className="mb-8" />
        <p className="font-display text-2xl font-medium tracking-tight">Welcome to UNIBUD</p>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Your people. Your ideas. Your next chapter.
        </p>
        <div className="mt-8" aria-label="Loading UNIBUD">
          <OrbitMark size={44} spinning />
        </div>
        <p className="sr-only" role="status" aria-live="polite">Getting UNIBUD ready</p>
        <Button asChild variant="ghost" className="mt-6">
          <Link to="/login">Continue now</Link>
        </Button>
      </div>
    </main>
  );
}
