/**
 * Guest browsing mode — Board only.
 * Stored in sessionStorage + localStorage so the guest can browse for an
 * extended session without being forced to register on every refresh.
 * Guests are never treated as authenticated users.
 */

const KEY = "unibud-guest-mode";

export function isGuestMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(KEY) === "1" || localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

/** Enter guest mode (Board-only). Call from welcome "Continue as Guest". */
export function enterGuestMode(): void {
  try {
    sessionStorage.setItem(KEY, "1");
    localStorage.setItem(KEY, "1");
  } catch {
    /* private mode */
  }
}

/** Clear guest mode after sign-in/sign-up or explicit exit. */
export function clearGuestMode(): void {
  try {
    sessionStorage.removeItem(KEY);
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Paths guests may open without signing in. */
export function isGuestAllowedPath(pathname: string): boolean {
  if (pathname === "/board" || pathname.startsWith("/board/")) return true;
  if (pathname === "/login" || pathname.startsWith("/login")) return true;
  if (pathname === "/welcome") return true;
  return false;
}

export function useGuestMode(): boolean {
  return isGuestMode();
}
