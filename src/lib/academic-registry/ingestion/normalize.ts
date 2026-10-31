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
export function normalizeInstitutionCandidate(
  input: InstitutionCandidate,
): NormalizedInstitutionCandidate {
  const countryCode = normalizeCountryCode(input.countryCode);
  const name = input.name.trim().replace(/\s+/g, " ");
  const sourceId = input.sourceId.trim();
  const externalId = input.externalId.trim();
  const institutionTypeCode = input.institutionTypeCode.trim();
  const institutionTypeLabel = input.institutionTypeLabel.trim();
  const sourceUrl = input.sourceUrl.trim();
  const warnings: string[] = [];

  if (!sourceId) throw new Error("A registered source ID is required.");
  if (!externalId) throw new Error("A source-specific external ID is required.");
  if (!name) throw new Error("Institution name is required.");
  if (!institutionTypeCode || !institutionTypeLabel) {
    throw new Error("The source institution category and original label are required.");
  }

  let parsedSourceUrl: URL;
  try {
    parsedSourceUrl = new URL(sourceUrl);
  } catch {
    throw new Error("A valid source URL is required.");
  }
  if (parsedSourceUrl.protocol !== "https:" && parsedSourceUrl.protocol !== "http:") {
    throw new Error("Source URL must use HTTP or HTTPS.");
  }
  if (parsedSourceUrl.username || parsedSourceUrl.password) {
    throw new Error("Source URL must not contain embedded credentials.");
  }

  const retrievedAt = Date.parse(input.sourceRetrievedAt);
  if (!Number.isFinite(retrievedAt)) {
    throw new Error("A valid source retrieval timestamp is required.");
  }

  if (!input.officialWebsite) warnings.push("Official website not supplied by source.");
  if (!input.sourceContentHash) warnings.push("Source content hash is missing; change detection may be weaker.");
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
    officialWebsite: input.officialWebsite?.trim() || null,
    sourceUrl: parsedSourceUrl.toString(),
    sourceRetrievedAt: new Date(retrievedAt).toISOString(),
    normalizedName,
    identityKey: countryCode + ":" + encodeURIComponent(sourceId) + ":" + encodeURIComponent(externalId),
    slug,
    verificationStatus: "pending_review",
    warnings,
  };
}
