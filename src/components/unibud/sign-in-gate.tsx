import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function useAuthReady() {
  return useCurrentUserState();
}

import { useCurrentUserState } from "@/lib/auth/use-current-user";

export function SignInCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl bg-card p-6 ring-1 ring-border">
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      <Link
        to="/login"
        className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        Sign in to continue
      </Link>
    </div>
  );
}
