import type { CampusRole } from "./roles";

/** Profile edits may remove privileges, but never grant them. */
export function resolveProfileRole(requested: CampusRole | undefined, existing: CampusRole = "student"): CampusRole {
  return requested === "student" ? "student" : existing;
}
