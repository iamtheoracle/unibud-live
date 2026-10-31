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
  sourceStatus: "unverified" | "partially_verified" | "verified";
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
  verificationStatus: VerificationStatus;
  sourceId?: string | null;
  verifiedAt?: string | null;
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
  sourceId?: string | null;
  verifiedAt?: string | null;
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
  verificationStatus: VerificationStatus;
  sourceId?: string | null;
  verifiedAt?: string | null;
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
  sourceId?: string | null;
  verifiedAt?: string | null;
}

export interface AcademicQualificationLevel {
  id: string;
  frameworkId: string;
  levelCode: string;
  levelLabel: string;
  sequenceNumber?: number | null;
  description?: string | null;
  officialSourceUrl?: string | null;
  verificationStatus: VerificationStatus;
  sourceId?: string | null;
  verifiedAt?: string | null;
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
  sourceId?: string | null;
  verifiedAt?: string | null;
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
  sourceId?: string | null;
  verifiedAt?: string | null;
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
  sourceId?: string | null;
  verifiedAt?: string | null;
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
  verificationStatus: VerificationStatus;
  sourceId?: string | null;
  verifiedAt?: string | null;
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

export interface AcademicInstitutionAlias {
  id: string;
  institutionId: string;
  alias: string;
  aliasType: "former_name" | "abbreviation" | "local_name" | "alternate_spelling" | "other";
  sourceId?: string | null;
  verificationStatus: VerificationStatus;
  verifiedAt?: string | null;
}

export interface AcademicAccreditation {
  id: string;
  institutionId: string;
  authorityId?: string | null;
  programmeId?: string | null;
  accreditationType: string;
  status: "accredited" | "provisional" | "suspended" | "withdrawn" | "expired" | "not_accredited" | "unknown";
  referenceNumber?: string | null;
  validFrom?: string | null;
  validUntil?: string | null;
  officialSourceUrl?: string | null;
  verifiedAt?: string | null;
  sourceId?: string | null;
}

export interface AcademicStandard {
  id: string;
  countryCode?: string | null;
  authorityId?: string | null;
  code?: string | null;
  title: string;
  standardType: string;
  versionLabel?: string | null;
  effectiveFrom?: string | null;
  effectiveUntil?: string | null;
  officialSourceUrl?: string | null;
  verificationStatus: "unverified" | "pending_review" | "verified" | "stale";
  sourceId?: string | null;
  verifiedAt?: string | null;
}

export interface AcademicStandardMapping {
  id: string;
  standardId: string;
  entityType: "institution" | "campus" | "accreditation" | "framework" | "level" | "programme" | "curriculum" | "course" | "syllabus_topic";
  entityId: string;
  complianceStatus: "meets" | "partially_meets" | "does_not_meet" | "not_assessed" | "unknown";
  sourceId?: string | null;
  evidenceNote?: string | null;
  assessedAt?: string | null;
  reviewStatus: "pending_review" | "accepted" | "rejected" | "superseded";
  reviewerId?: string | null;
}

export interface AcademicSourceAssertion {
  id: string;
  sourceId: string;
  entityType: "country" | "authority" | "institution" | "campus" | "accreditation" | "framework" | "level" | "programme" | "curriculum" | "course" | "syllabus_topic";
  entityId: string;
  fieldName: string;
  assertedValue: unknown;
  reviewStatus: "pending_review" | "accepted" | "rejected" | "superseded";
  reviewedAt?: string | null;
  reviewerId?: string | null;
}

export interface AcademicSourceCoverage {
  id: string;
  countryCode: string;
  sourceId?: string | null;
  coverageDomain: "institutions" | "campuses" | "accreditation" | "qualification_frameworks" | "programmes" | "courses" | "syllabi" | "standards";
  status: "discovered" | "configured" | "importing" | "partial" | "verified" | "stale" | "unavailable";
  lastCheckedAt?: string | null;
  lastSuccessAt?: string | null;
  expectedRefreshDays?: number | null;
  recordsExpected?: number | null;
  recordsVerified: number;
  coverageNotes?: string | null;
}

export interface AcademicImportRun {
  id: string;
  countryCode?: string | null;
  sourceId?: string | null;
  importerName: string;
  sourceVersion?: string | null;
  startedAt: string;
  finishedAt?: string | null;
  status: "queued" | "running" | "succeeded" | "partial" | "failed" | "cancelled";
  recordsSeen: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsRejected: number;
  errorSummary?: string | null;
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
