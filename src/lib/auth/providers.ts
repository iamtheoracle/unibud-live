/**
 * The upstream identity providers this app offers for sign-in (via the broker).
 *
 * Source of truth for BOTH the server (`server.ts`, one `genericOAuth` provider
 * per entry) and the client (`client.ts` / sign-in buttons). Kept in its own
 * dependency-free module so the client can import it without pulling the
 * server-only Better Auth instance (and `pg`) into the browser bundle.
 *
 * Each app federates to the shared auth broker (`GROK_AUTH_ISSUER`), which
 * holds the upstream provider secrets. The app never sees them directly.
 */
export type GrokProvider = {
  /** This app's local provider id; also the callback path segment. */
  providerId: string;
  /** Upstream hint the broker forwards to (Better Auth social id). */
  idp: string;
  /** Human label for the sign-in button. */
  label: string;
};

/**
 * Keep only the providers currently approved for the UNIBUD sign-in UI.
 * X is intentionally omitted per the product requirements. Provider
 * availability must still be verified against the auth broker before launch.
 */
export const GROK_PROVIDERS: readonly GrokProvider[] = [
  { providerId: "grok-apple", idp: "apple", label: "Apple" },
  { providerId: "grok-google", idp: "google", label: "Google" },
];
