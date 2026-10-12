/**
 * Client-side guest session. Guests may use Bud only — not Square, Connect,
 * Quad, Chat, Board, or other protected surfaces. Server APIs must still
 * reject unauthenticated writes independently of this flag.
 */

export const GUEST_MODE_KEY = "unibud-guest-mode";
export const GUEST_BROWSE_LEGACY_KEY = "unibud-guest-browse";

export function isGuestMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      sessionStorage.getItem(GUEST_MODE_KEY) === "1" ||
      sessionStorage.getItem(GUEST_BROWSE_LEGACY_KEY) === "1"
    );
  } catch {
    return false;
  }
}

export function enterGuestMode(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(GUEST_MODE_KEY, "1");
    sessionStorage.setItem(GUEST_BROWSE_LEGACY_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function clearGuestMode(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(GUEST_MODE_KEY);
    sessionStorage.removeItem(GUEST_BROWSE_LEGACY_KEY);
  } catch {
    /* ignore */
  }
}

export function isGuestAllowedPath(pathname: string): boolean {
  if (pathname === "/bud" || pathname.startsWith("/bud/")) return true;
  if (pathname === "/welcome" || pathname.startsWith("/welcome")) return true;
  if (pathname === "/login" || pathname.startsWith("/login")) return true;
  if (pathname === "/help" || pathname.startsWith("/help")) return true;
  return false;
}

export function guestHomePath(): "/bud" {
  return "/bud";
}
