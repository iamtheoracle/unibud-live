import { normalizeCountryCode } from "../types.ts";
import type { InstitutionCandidate, NormalizedInstitutionCandidate } from "./contracts.ts";

function normalizeName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function slugifyInstitutionName(value: string): string {
  return normalizeName(value).replace(/\s+/g, "-");
}

/**
 * Identity keys are scoped to a source because two regulators may use different
 * identifiers. Cross-source matching must use reviewed matching, not a guessed
 * global ID. Candidates always enter review; ingestion cannot self-verify.
 */
function requiredText(value: unknown, label: string): string {
  if (typeof value !== "string") throw new Error(label + " must be text.");
  const normalized = value.trim();
  if (!normalized) throw new Error(label + " is required.");
  return normalized;
}

export function normalizeInstitutionCandidate(
  input: InstitutionCandidate,
): NormalizedInstitutionCandidate {
  if (!input || typeof input !== "object") {
    throw new Error("An institution source record is required.");
  }

  const countryCode = normalizeCountryCode(requiredText(input.countryCode, "Country code"));
  const name = requiredText(input.name, "Institution name").replace(/\\s+/g, " ");
  const sourceId = requiredText(input.sourceId, "Registered source ID");
  const externalId = requiredText(input.externalId, "Source-specific external ID");
  const institutionTypeCode = requiredText(input.institutionTypeCode, "Institution type code");
  const institutionTypeLabel = requiredText(input.institutionTypeLabel, "Institution type label");
  const sourceUrl = requiredText(input.sourceUrl, "Source URL");
  const sourceRetrievedAt = requiredText(input.sourceRetrievedAt, "Source retrieval timestamp");
  const warnings: string[] = [];

  if (sourceId.length > 160 || externalId.length > 240) {
    throw new Error("Source and external identifiers must be 160 and 240 characters or fewer.");
  }
  if (name.length > 300) throw new Error("Institution name must be 300 characters or fewer.");
  if (institutionTypeCode.length > 120 || institutionTypeLabel.length > 200) {
    throw new Error("Institution type identifiers and labels exceed supported lengths.");
  }
  if (input.legalName != null && typeof input.legalName !== "string") {
    throw new Error("Legal institution name must be text.");
  }
  if (input.officialWebsite != null && typeof input.officialWebsite !== "string") {
    throw new Error("Official website must be text.");
  }
  if (input.sourceContentHash != null && typeof input.sourceContentHash !== "string") {
    throw new Error("Source content hash must be text.");
  }
  if (input.establishedYear != null &&
    (!Number.isInteger(input.establishedYear) || input.establishedYear < 1000 || input.establishedYear > 2200)) {
    throw new Error("Established year must be a valid four-digit year.");
  }
  if (input.ownershipType &&
    !["public", "private", "faith_based", "community", "international", "mixed", "unknown"].includes(input.ownershipType)) {
    throw new Error("Unsupported ownership type.");
  }
  if (input.operationalStatus &&
    !["active", "inactive", "merged", "closed", "unknown"].includes(input.operationalStatus)) {
    throw new Error("Unsupported operational status.");
  }

  let parsedSourceUrl: URL;
  try {
    parsedSourceUrl = new URL(sourceUrl);
  } catch {
    throw new Error("A valid source URL is required.");
  }
  if ((parsedSourceUrl.protocol !== "https:" && parsedSourceUrl.protocol !== "http:") ||
    !parsedSourceUrl.hostname || parsedSourceUrl.username || parsedSourceUrl.password) {
    throw new Error("Source URL must use HTTP or HTTPS and contain no embedded credentials.");
  }

  const retrievedAt = Date.parse(sourceRetrievedAt);
  if (!Number.isFinite(retrievedAt)) {
    throw new Error("A valid source retrieval timestamp is required.");
  }

  let officialWebsite: string | null = null;
  if (input.officialWebsite?.trim()) {
    let parsedWebsite: URL;
    try {
      parsedWebsite = new URL(input.officialWebsite.trim());
    } catch {
      throw new Error("Official website must be a valid HTTP or HTTPS URL.");
    }
    if ((parsedWebsite.protocol !== "https:" && parsedWebsite.protocol !== "http:") ||
      !parsedWebsite.hostname || parsedWebsite.username || parsedWebsite.password) {
      throw new Error("Official website must use HTTP or HTTPS and contain no embedded credentials.");
    }
    officialWebsite = parsedWebsite.toString();
  } else {
    warnings.push("Official website not supplied by source.");
  }
  if (!input.sourceContentHash) warnings.push("Source content hash is missing; change detection may be weaker.");
  if (input.sourceContentHash && input.sourceContentHash.length > 256) {
    throw new Error("Source content hash must be 256 characters or fewer.");
  }
  if (!input.ownershipType || input.ownershipType === "unknown") {
    warnings.push("Ownership/governance is not verified.");
  }
  if (!input.establishedYear) warnings.push("Established year is unknown.");
  if (!input.operationalStatus || input.operationalStatus === "unknown") {
    warnings.push("Operational status is unknown.");
  }

  const normalizedName = normalizeName(name);
  const slug = slugifyInstitutionName(name);
  if (!normalizedName || !slug) {
    throw new Error("Institution name must contain at least one letter or number.");
  }

  return {
    ...input,
    sourceId,
    countryCode,
    externalId,
    institutionTypeCode,
    institutionTypeLabel,
    name,
    legalName: input.legalName?.trim() || null,
    officialWebsite,
    sourceUrl: parsedSourceUrl.toString(),
    sourceRetrievedAt: new Date(retrievedAt).toISOString(),
    normalizedName,
    identityKey: countryCode + ":" + encodeURIComponent(sourceId) + ":" + encodeURIComponent(externalId),
    slug,
    verificationStatus: "pending_review",
    warnings,
  };
}
