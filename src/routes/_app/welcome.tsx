import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Wordmark } from "@/components/brand/logo";
import { useAuthReady } from "@/components/unibud/sign-in-gate";

export const Route = createFileRoute("/_app/welcome")({ component: Welcome });

function Welcome() {
  const nav = useNavigate();
  const { user, isPending } = useAuthReady();

  useEffect(() => {
    if (isPending) return;

    // Returning members skip the splash and go straight into UNIBUD.
    if (user) {
      void nav({ to: "/", replace: true });
      return;
    }

    // Show the actual approved brand artwork briefly, then open sign-in.
    const timeout = window.setTimeout(() => {
      void nav({ to: "/login", search: { mode: "in" }, replace: true });
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [isPending, user, nav]);

  return (
    <main
      aria-label="UNIBUD welcome"
      className="fixed inset-0 flex min-h-dvh items-center justify-center overflow-hidden bg-white text-black"
    >
      <div className="flex w-full flex-col items-center justify-center gap-8 px-6">
        <Wordmark
          size="hero"
          className="max-w-[min(82vw,32rem)] animate-[welcomeLogoIn_500ms_ease-out_both]"
        />
        <div
          className="size-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-800 motion-reduce:animate-none"
          role="status"
          aria-label="Loading sign-in"
        />
      </div>
      <style>{`
        @keyframes welcomeLogoIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[welcomeLogoIn_500ms_ease-out_both\\] { animation: none; }
        }
      `}</style>
    </main>
  );
}
