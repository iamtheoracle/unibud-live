/**
 * Country-aware academic registry contracts.
 *
 * These types model official reference data. They are intentionally separate
 * from a student's private study courses in src/lib/studies.
 * Runtime reads/writes must be implemented server-side and source-backed.
 */

export type VerificationStatus =
  | "unverified"
  | "pending_review"
  | "verified"
  | "rejected"
  | "stale";

export type OwnershipType =
  | "public"
  | "private"
  | "faith_based"
  | "community"
  | "international"
  | "mixed"
  | "unknown";

export type AcademicSourceType =
  | "regulator"
  | "government_dataset"
  | "institution_website"
  | "official_document"
  | "international_body"
  | "research"
  | "other";

export interface AcademicCountry {
  code: string;
  iso3Code?: string | null;
  name: string;
  officialName?: string | null;
  sourceStatus: "unverified" | "partially_verified" | "verified";
}

export interface AcademicAuthority {
  id: string;
  countryCode: string;
  name: string;
  authorityType: string;
  jurisdiction?: string | null;
  officialWebsite?: string | null;
  sourceStatus: VerificationStatus | "partially_verified";
}

export interface AcademicInstitutionType {
  id: string;
  countryCode?: string | null;
  code: string;
  label: string;
  description?: string | null;
  parentTypeId?: string | null;
  isTertiary: boolean;
  metadata: Record<string, unknown>;
}

export interface AcademicInstitution {
  id: string;
  countryCode: string;
  institutionTypeId: string;
  name: string;
  legalName?: string | null;
  slug: string;
  ownershipType: OwnershipType;
  fundingOrGovernanceLabel?: string | null;
  parentInstitutionId?: string | null;
  officialWebsite?: string | null;
  establishedYear?: number | null;
  operationalStatus: "active" | "inactive" | "merged" | "closed" | "unknown";
  verificationStatus: VerificationStatus;
  description?: string | null;
  metadata: Record<string, unknown>;
}

export interface AcademicCampus {
  id: string;
  institutionId: string;
  name: string;
  campusType: string;
  locality?: string | null;
  administrativeRegion?: string | null;
  officialWebsite?: string | null;
}

export interface AcademicQualificationFramework {
  id: string;
  countryCode: string;
  authorityId?: string | null;
  name: string;
  shortName?: string | null;
  versionLabel?: string | null;
  officialSourceUrl?: string | null;
  verificationStatus: VerificationStatus;
}

export interface AcademicQualificationLevel {
  id: string;
  frameworkId: string;
  levelCode: string;
  levelLabel: string;
  sequenceNumber?: number | null;
  description?: string | null;
  officialSourceUrl?: string | null;
}

export interface AcademicProgramme {
  id: string;
  institutionId: string;
  campusId?: string | null;
  qualificationLevelId?: string | null;
  code?: string | null;
  name: string;
  awardTitle?: string | null;
  studyMode?: string | null;
  attendanceMode?: string | null;
  durationValue?: number | null;
  durationUnit?: "weeks" | "months" | "years" | "semesters" | "terms" | null;
  totalCredits?: number | null;
  admissionRequirements: Record<string, unknown>;
  verificationStatus: VerificationStatus;
}

export interface AcademicCurriculumVersion {
  id: string;
  programmeId: string;
  versionLabel: string;
  academicSession?: string | null;
  effectiveFrom?: string | null;
  effectiveUntil?: string | null;
  status: "draft" | "pending_review" | "published" | "superseded" | "withdrawn";
  officialSourceUrl?: string | null;
}

export interface AcademicCourse {
  id: string;
  institutionId: string;
  programmeId?: string | null;
  curriculumVersionId?: string | null;
  code?: string | null;
  title: string;
  stageLabel?: string | null;
  yearOrLevel?: number | null;
  termLabel?: string | null;
  creditValue?: number | null;
  contactHours?: number | null;
  prerequisites: unknown[];
  learningOutcomes: unknown[];
  verificationStatus: VerificationStatus;
}

export interface AcademicSyllabusTopic {
  id: string;
  courseId: string;
  parentTopicId?: string | null;
  sequenceNumber?: number | null;
  title: string;
  description?: string | null;
  expectedHours?: number | null;
  learningOutcomes: unknown[];
  assessmentMethods: unknown[];
  sourceUrl?: string | null;
}

export interface AcademicSource {
  id: string;
  countryCode?: string | null;
  publisherName: string;
  sourceType: AcademicSourceType;
  title?: string | null;
  sourceUrl: string;
  retrievedAt: string;
  contentHash?: string | null;
  reliabilityStatus: "unreviewed" | "official" | "reviewed" | "rejected" | "stale";
}

export interface AcademicRegistryFilters {
  countryCode: string;
  institutionTypeId?: string;
  ownershipType?: OwnershipType;
  administrativeRegion?: string;
  search?: string;
  verificationStatus?: VerificationStatus;
  programmeLevelId?: string;
  subjectAreaCode?: string;
}

/** Normalize ISO country codes without silently guessing a country. */
export function normalizeCountryCode(value: string): string {
  const normalized = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized)) {
    throw new Error("Country code must be a two-letter ISO 3166-1 alpha-2 code.");
  }
  return normalized;
}

/** Country-local taxonomies remain intact; equivalence requires reviewed evidence. */
export interface AcademicLevelEquivalenceClaim {
  fromLevelId: string;
  toLevelId: string;
  relationship: "equivalent" | "comparable" | "prerequisite_for" | "not_equivalent";
  sourceId: string;
  reviewStatus: "pending_review" | "accepted" | "rejected";
}
