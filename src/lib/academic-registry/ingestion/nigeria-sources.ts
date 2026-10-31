import type { AcademicSourceDefinition } from "./contracts.ts";

/**
 * Initial Nigeria source inventory. These are source references, not connected
 * scrapers. Keep adapters disabled until their data formats, terms, update
 * cadence, and parsing/verification behavior have been reviewed and tested.
 */
export const NIGERIA_ACADEMIC_SOURCES: readonly AcademicSourceDefinition[] = [
  {
    id: "ng-nuc-university-system",
    countryCode: "NG",
    publisherName: "National Universities Commission (NUC)",
    sourceType: "regulator",
    officialUrl: "https://enuc.nuc.edu.ng/nus",
    licenceOrTerms: "Review NUC portal terms and access policy before automated collection.",
    expectedRefreshDays: 30,
    coverageDomains: ["institutions", "programmes", "affiliations", "quality_assurance"],
    reviewCaveats: [
      "Confirm each institution and programme record against the portal's own detail page and current regulator status.",
      "Do not infer that all programmes at a listed institution are approved or accredited.",
      "Review portal terms, access policy, and any API/export options before automated collection.",
    ],
    enabled: false,
  },
  {
    id: "ng-nuc-programme-accreditation",
    countryCode: "NG",
    publisherName: "National Universities Commission (NUC)",
    sourceType: "regulator",
    officialUrl: "https://www.nuc.edu.ng/accreditation-tech-report-view/",
    licenceOrTerms: "Review NUC portal terms and document reuse rules before automated collection.",
    expectedRefreshDays: 30,
    coverageDomains: ["programmes", "programme_accreditation", "quality_assurance"],
    reviewCaveats: [
      "Treat each programme approval as a scoped claim and retain its official reference and validity period.",
      "Confirm document version and reuse rights before extraction.",
    ],
    enabled: false,
  },
  {
    id: "ng-nbte-approved-institutions",
    countryCode: "NG",
    publisherName: "National Board for Technical Education (NBTE)",
    sourceType: "regulator",
    officialUrl: "https://www.nbte.gov.ng/nbte/approved%20institutions",
    licenceOrTerms: "Review NBTE site terms and source-specific access restrictions before collection.",
    expectedRefreshDays: 30,
    coverageDomains: ["institutions", "programmes", "accreditation"],
    reviewCaveats: [
      "Preserve NBTE's institution-type categories and federal/state/private distinctions.",
      "Treat programme accreditation as scoped and time-bound; preserve status, reference, and validity dates.",
      "Review site terms and document reuse rules before automated extraction.",
    ],
    enabled: false,
  },
  {
    id: "ng-nbte-digital-public-register",
    countryCode: "NG",
    publisherName: "National Board for Technical Education (NBTE)",
    sourceType: "regulator",
    officialUrl: "https://digitalnbte.nbte.gov.ng/Public",
    licenceOrTerms: "The public register states it is free and requires no sign-in; no explicit reuse licence or API terms have been confirmed. Review terms, robots/access policy, rate limits, and export/API availability before automation.",
    expectedRefreshDays: 14,
    coverageDomains: ["institutions", "programmes", "accreditation", "documents", "tvet"],
    reviewCaveats: [
      "Preserve NBTE's source-defined institution categories, programme statuses, accreditation labels, and expiry dates.",
      "The register's public availability is not itself a data-reuse licence.",
      "Check detail pages and source record timestamps; never convert missing results into a claim that an institution is unapproved.",
    ],
    enabled: false,
  },
  {
    id: "ng-nbte-accredited-programmes",
    countryCode: "NG",
    publisherName: "National Board for Technical Education (NBTE)",
    sourceType: "regulator",
    officialUrl: "https://web.nbte.gov.ng/node/114",
    licenceOrTerms: "Programme directory may be a downloadable document; review copyright, version, and parsing before collection.",
    expectedRefreshDays: 30,
    coverageDomains: ["programmes", "programme_accreditation"],
    reviewCaveats: [
      "Preserve edition, publication date, programme nomenclature, and source page references.",
      "Do not infer current accreditation from an old directory edition.",
      "Review copyright and reuse rules before extracting curriculum text.",
    ],
    enabled: false,
  },
  {
    id: "ng-nbte-curricula-and-standards",
    countryCode: "NG",
    publisherName: "National Board for Technical Education (NBTE)",
    sourceType: "regulator",
    officialUrl: "https://www.web.nbte.gov.ng/downloads",
    licenceOrTerms: "Review each curriculum/standard document's terms and version before extraction.",
    expectedRefreshDays: 60,
    coverageDomains: ["curricula", "courses", "standards"],
    reviewCaveats: [
      "Preserve each curriculum document's edition, academic session, local qualification labels, and programme scope.",
      "Do not treat an older published curriculum as the current version without confirming the applicable session.",
      "Review each document's terms and version before extraction.",
    ],
    enabled: false,
  },
  {
    id: "ng-ncce-accredited-colleges",
    countryCode: "NG",
    publisherName: "National Commission for Colleges of Education (NCCE)",
    sourceType: "regulator",
    officialUrl: "https://ncce.gov.ng/AccreditedColleges/Index",
    licenceOrTerms: "Review NCCE site terms and pagination/export options before automated collection.",
    expectedRefreshDays: 30,
    coverageDomains: ["institutions", "institution_types"],
    reviewCaveats: [
      "The directory includes polytechnics offering NCE and other NCE-awarding institutions; preserve NCCE's local category labels rather than flattening them into colleges of education.",
      "The page contains blank, placeholder, and malformed institution website values; validate each field independently and route conflicts for review.",
      "The page label 'Accredited Colleges' must not be interpreted as accreditation of every programme or award at each listed institution.",
    ],
    enabled: false,
  },
  {
    id: "ng-fme-federal-science-technical-colleges",
    countryCode: "NG",
    publisherName: "Federal Ministry of Education",
    sourceType: "government_dataset",
    officialUrl: "https://education.gov.ng/technology-science-education/",
    licenceOrTerms: "Review Ministry site terms and confirm the list is current before publication.",
    expectedRefreshDays: 60,
    coverageDomains: ["technical_colleges"],
    reviewCaveats: [
      "Confirm the current institutional list and any ownership/status fields with the Ministry before publication.",
      "Review source terms and update cadence before automated collection.",
    ],
    enabled: false,
  },
];

/** Every source remains disabled until a tested adapter is registered. */
export function enabledNigeriaAcademicSources(): AcademicSourceDefinition[] {
  return NIGERIA_ACADEMIC_SOURCES.filter((source) => source.enabled);
}
