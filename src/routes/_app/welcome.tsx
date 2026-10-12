import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthReady } from "@/components/unibud/sign-in-gate";

export const Route = createFileRoute("/_app/welcome")({ component: Welcome });

function Welcome() {
  const nav = useNavigate();
  const { user, isPending } = useAuthReady();

  useEffect(() => {
    if (isPending) return;

    // Returning members skip the splash and go straight into UNIBUD.
    if (user) {
      void nav({ to: "/" , replace: true });
      return;
    }

    // No button or carousel: show the branded splash briefly, then open sign-in.
    const timeout = window.setTimeout(() => {
      void nav({ to: "/login", search: { mode: "in" }, replace: true });
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [isPending, user, nav]);

  return (
    <main
      aria-label="UNIBUD loading"
      className="fixed inset-0 flex min-h-dvh items-center justify-center overflow-hidden bg-white text-black"
    >
      <div className="flex w-full max-w-3xl items-center justify-center gap-4 px-6">
        <div
          className="select-none text-center text-5xl font-black uppercase leading-none tracking-[-0.07em] sm:text-7xl"
          style={{ fontFamily: 'Rockwell, "Roboto Slab", Georgia, serif' }}
          aria-label="UNIBUD"
        >
          UNIBUD
        </div>
        <div className="self-end pb-1 text-right text-[9px] font-semibold uppercase leading-tight tracking-[0.16em] text-neutral-600 sm:text-xs">
          ORACLE
          <br />
          ARC
        </div>
      </div>
      <div
        className="absolute bottom-14 size-5 animate-spin rounded-full border-2 border-neutral-200 border-t-neutral-800 motion-reduce:animate-none"
        role="status"
        aria-label="Loading"
      />
    </main>
  );
}
