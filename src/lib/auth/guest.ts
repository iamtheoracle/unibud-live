const GUEST_KEY = "unibud-guest-mode";

/** Client-side guest session flag. Server still enforces real auth on protected APIs. */
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
  } catch {
    /* ignore */
  }
}

export function clearGuestMode(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(GUEST_KEY);
  } catch {
    /* ignore */
  }
}

/** Paths guests may visit. Member-only actions remain server-enforced. */
export function isGuestAllowedPath(pathname: string): boolean {
  // Guests: Bud + public Riff read. Member-only actions are enforced on the server.
  const allowed = ["/start", "/login", "/bud", "/help", "/riff"];
  return allowed.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

export function guestHomePath(): "/bud" {
  return "/bud";
}
