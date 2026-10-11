export type QuadPrivacy = "public" | "campus" | "private";

/**
 * Resolve untrusted input at the server boundary. Only an omitted value keeps
 * the documented public default; explicitly supplied unknown values are denied.
 */
export function resolveQuadPrivacy(value: unknown): QuadPrivacy {
  if (value === undefined || value === "public") return "public";
  if (value === "campus" || value === "private") return value;
  throw new Error("Choose a supported Quad privacy setting.");
}
