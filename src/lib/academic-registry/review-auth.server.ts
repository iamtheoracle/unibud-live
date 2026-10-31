/**
 * Registry review authorization is fail-closed.
 *
 * The authenticated user ID comes only from authMiddleware. Reviewers are
 * provisioned by deployment configuration, never by client-supplied flags.
 */
export function isAcademicRegistryReviewer(
  userId: string,
  configuredIds = process.env.ACADEMIC_REGISTRY_REVIEWER_IDS ?? "",
): boolean {
  if (typeof userId !== "string" || !userId.trim()) return false;
  if (userId === "dev-user" || userId === process.env.DEV_USER_ID) return false;
  const allowlist = new Set(configuredIds.split(",").map((id) => id.trim()).filter(Boolean));
  return allowlist.has(userId);
}

export function assertAcademicRegistryReviewer(
  userId: string,
  configuredIds = process.env.ACADEMIC_REGISTRY_REVIEWER_IDS ?? "",
): void {
  if (!isAcademicRegistryReviewer(userId, configuredIds)) {
    throw new Error("Forbidden: this account is not authorized to review academic registry evidence.");
  }
}
