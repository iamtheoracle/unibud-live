export type QuadPrivacy = "public" | "campus" | "private";

/**
 * Resolve untrusted creation input. Only an omitted value keeps the documented
 * creation default; explicitly supplied unknown values are denied.
 */
export function resolveQuadPrivacy(value: unknown): QuadPrivacy {
  if (value === undefined || value === "public") return "public";
  if (value === "campus" || value === "private") return value;
  throw new Error("Choose a supported Quad privacy setting.");
}

/** Stored privacy is authorization data, so missing or unknown values fail closed. */
export function resolveStoredQuadPrivacy(value: unknown): QuadPrivacy {
  if (value === "public" || value === "campus" || value === "private") return value;
  throw new Error("This Quad has an invalid privacy setting and is unavailable until reviewed.");
}
