import type { ReactNode } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { OrbitLoading } from "@/components/brand/identity-marks";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <OrbitLoading label="Loading" className="min-h-[40vh]" />;
  }
  if (!user) return <RedirectToSignIn />;
  return <>{children}</>;
}
