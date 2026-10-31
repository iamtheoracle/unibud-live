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
  sourceId?: string | null;
  verifiedAt?: string | null;
}

export interface AcademicAuthority {
  id: string;
  countryCode: string;
  name: string;
  authorityType: string;
  jurisdiction?: string | null;
  officialWebsite?: string | null;
  sourceStatus: "unverified" | "partially_verified" | "verified";
  sourceId?: string | null;
  verifiedAt?: string | null;
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
  verificationStatus: "unverified" | "pending_review" | "verified" | "stale";
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
  idempotencyKey?: string | null;
  adapterVersion?: string | null;
  sourceSnapshotHash?: string | null;
  heartbeatAt?: string | null;
  leaseExpiresAt?: string | null;
  requestedBy?: string | null;
}

export interface AcademicExternalIdentifier {
  id: string;
  sourceId: string;
  countryCode: string;
  entityType: "authority" | "institution_type" | "institution" | "campus" | "accreditation" | "framework" | "level" | "programme" | "curriculum" | "course" | "syllabus_topic" | "standard";
  entityId: string;
  externalId: string;
  sourceRecordUrl: string;
  sourceContentHash?: string | null;
  firstSeenAt: string;
  lastSeenAt: string;
  lastImportRunId?: string | null;
}

export interface AcademicImportRecordResult {
  id: string;
  importRunId: string;
  sourceId: string;
  entityType: string;
  externalId: string;
  entityId?: string | null;
  outcome: "created" | "updated" | "unchanged" | "rejected" | "skipped" | "failed";
  sourceRecordUrl?: string | null;
  sourceContentHash?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  processedAt: string;
}

export interface AcademicEntityMatchReview {
  id: string;
  countryCode: string;
  entityType: "institution" | "campus" | "programme" | "course";
  leftEntityId: string;
  rightEntityId: string;
  matchMethod: "official_identifier" | "exact_name" | "normalized_name" | "manual" | "other";
  confidence?: number | null;
  evidenceSourceId?: string | null;
  evidenceNote?: string | null;
  reviewStatus: "pending_review" | "accepted" | "rejected" | "superseded";
  reviewerId?: string | null;
  reviewedAt?: string | null;
}

/** ISO 3166-1 alpha-2 assigned country and territory codes. */
export const ISO_ALPHA2_COUNTRY_CODES = new Set(
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(" "),
);

/** Normalize ISO country codes without silently guessing a country. */
export function normalizeCountryCode(value: string): string {
  const normalized = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(normalized) || !ISO_ALPHA2_COUNTRY_CODES.has(normalized)) {
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
