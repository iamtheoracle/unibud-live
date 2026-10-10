import type { ReactNode } from "react";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { isGuestAllowedPath, isGuestMode } from "@/lib/auth/guest";
import { AuthRequiredPrompt } from "@/components/unibud/auth-required-prompt";
import { OrbitLoading } from "@/components/brand/identity-marks";

export function AccessGate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();

  if (isPending) {
    return <OrbitLoading label="Loading" className="min-h-[50vh]" />;
  }

  if (user) return <>{children}</>;

  const guest = isGuestMode();

  if (pathname === "/welcome" || pathname === "/login" || pathname.startsWith("/login")) {
    return <>{children}</>;
  }

  if (guest && isGuestAllowedPath(pathname)) {
    return <>{children}</>;
  }

  if (guest) {
    return <AuthRequiredPrompt />;
  }

  return <Navigate to="/welcome" />;
}
