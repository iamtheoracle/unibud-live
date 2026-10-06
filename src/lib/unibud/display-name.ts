/**
 * Social surfaces use preferred display name.
 * Academic/official contexts may still use full/legal name where required.
 */
export function socialDisplayName(opts: {
  displayName?: string | null;
  name?: string | null;
  handle?: string | null;
}): string {
  const preferred = (opts.displayName || opts.name || "").trim();
  if (preferred) return preferred;
  const h = (opts.handle || "").trim().replace(/^@/, "");
  return h || "Student";
}

/** Academic/official contexts may show full name when identity matters. */
export function officialDisplayName(opts: {
  legalName?: string | null;
  displayName?: string | null;
  name?: string | null;
}): string {
  const legal = (opts.legalName || "").trim();
  if (legal) return legal;
  return socialDisplayName(opts);
}
