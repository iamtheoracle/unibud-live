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
    enabled: false,
  },
];

/** Every source remains disabled until a tested adapter is registered. */
export function enabledNigeriaAcademicSources(): AcademicSourceDefinition[] {
  return NIGERIA_ACADEMIC_SOURCES.filter((source) => source.enabled);
}
