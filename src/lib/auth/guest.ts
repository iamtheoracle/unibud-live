/** Client-side guest session helpers. Not a substitute for server auth. */

const GUEST_KEY = "unibud-guest-mode";

export function isGuestMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(GUEST_KEY) === "1";
  } catch {
    return false;
  }
}

export function enterGuestMode(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(GUEST_KEY, "1");
    sessionStorage.setItem("unibud-guest-browse", "1");
  } catch {
    /* private mode */
  }
}

export function clearGuestMode(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(GUEST_KEY);
    sessionStorage.removeItem("unibud-guest-browse");
  } catch {
    /* private mode */
  }
}

/** Paths guests may open without an account. */
export function isGuestAllowedPath(pathname: string): boolean {
  const allowed = ["/start", "/login", "/bud", "/help"];
  return allowed.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function guestHomePath(): "/bud" {
  return "/bud";
}
