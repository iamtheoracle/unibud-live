import type { AcademicSourceType, OwnershipType } from "../types.ts";

export interface AcademicSourceDefinition {
  id: string;
  countryCode: string;
  publisherName: string;
  sourceType: AcademicSourceType;
  officialUrl: string;
  licenceOrTerms?: string;
  expectedRefreshDays?: number;
  coverageDomains?: string[];
  reviewCaveats?: string[];
  automationPermission: "not_reviewed" | "approved" | "prohibited";
  adapterStatus: "not_implemented" | "configured" | "verified";
  enabled: boolean;
}

export interface RawAcademicSourceRecord {
  externalId: string;
  entityType: "institution" | "programme" | "course" | "qualification_level" | "standard" | "accreditation";
  sourceUrl: string;
  retrievedAt: string;
  contentHash?: string;
  payload: Record<string, unknown>;
}

export interface InstitutionCandidate {
  /** Stable ID of the registered source; external IDs are only unique within this source. */
  sourceId: string;
  externalId: string;
  countryCode: string;
  institutionTypeCode: string;
  institutionTypeLabel: string;
  name: string;
  legalName?: string | null;
  ownershipType?: OwnershipType;
  fundingOrGovernanceLabel?: string | null;
  officialWebsite?: string | null;
  establishedYear?: number | null;
  operationalStatus?: "active" | "inactive" | "merged" | "closed" | "unknown";
  sourceUrl: string;
  sourceRetrievedAt: string;
  sourceContentHash?: string;
}

export interface NormalizedInstitutionCandidate extends InstitutionCandidate {
  normalizedName: string;
  identityKey: string;
  slug: string;
  verificationStatus: "pending_review";
  warnings: string[];
}

export interface AcademicSourceAdapter {
  definition: AcademicSourceDefinition;
  fetchRecords(options?: { cursor?: string; updatedSince?: string }): Promise<{
    records: RawAcademicSourceRecord[];
    nextCursor?: string;
    sourceVersion?: string;
  }>;
  mapInstitution?(record: RawAcademicSourceRecord): InstitutionCandidate | null;
}

/** A source is importable only when terms, adapter, and explicit enablement agree. */
export function canImportAcademicSource(source: AcademicSourceDefinition): boolean {
  return source.enabled &&
    source.automationPermission === "approved" &&
    source.adapterStatus === "verified";
}
