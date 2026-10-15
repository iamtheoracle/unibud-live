/**
 * Geographic coverage plan for the West African academic registry.
 *
 * This is a source-discovery manifest, not an institution dataset or scraper.
 * "source_identified" means an official ministry/regulator page was located;
 * it does not mean the source has been imported, its contents are complete, or
 * records are verified. "discovery_required" countries remain explicitly
 * uncovered until a suitable official source is reviewed.
 *
 * Source adapters remain disabled until access terms, format, freshness, and
 * verification behavior have been reviewed and tested.
 */
export type WestAfricaSourceDiscoveryStatus = "source_identified" | "discovery_required";

export interface WestAfricaCountryScope {
  countryCode: string;
  countryName: string;
  sourceDiscoveryStatus: WestAfricaSourceDiscoveryStatus;
  officialSourceUrl?: string;
  sourcePublisher?: string;
  sourceNotes: string;
  importedRecords: 0;
}

export const WEST_AFRICA_COUNTRY_SCOPE: readonly WestAfricaCountryScope[] = [
  {
    countryCode: "BJ",
    countryName: "Benin",
    sourceDiscoveryStatus: "source_identified",
    officialSourceUrl: "https://enseignementsuperieur.gouv.bj/enseignement/superieur/universite",
    sourcePublisher: "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique",
    sourceNotes: "Official ministry pages list public universities and private higher-education institutions. Separate programme and technical/vocational sources still need review.",
    importedRecords: 0,
  },
  {
    countryCode: "BF",
    countryName: "Burkina Faso",
    sourceDiscoveryStatus: "discovery_required",
    sourceNotes: "Locate and review the current official ministry/regulator institution, accreditation, programme, and curriculum directories.",
    importedRecords: 0,
  },
  {
    countryCode: "CV",
    countryName: "Cabo Verde",
    sourceDiscoveryStatus: "source_identified",
    officialSourceUrl: "https://ses.gov.cv/instituicoes",
    sourcePublisher: "Direção Geral do Ensino Superior (DGES)",
    sourceNotes: "Official higher-education institution search. Source language is Portuguese; technical and vocational coverage needs separate review.",
    importedRecords: 0,
  },
  {
    countryCode: "CI",
    countryName: "Côte d'Ivoire",
    sourceDiscoveryStatus: "source_identified",
    officialSourceUrl: "https://inscription.mesrs-ci.net/website/search",
    sourcePublisher: "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique",
    sourceNotes: "Official portal includes a recognized-institution directory and accredited training lookup. Confirm source terms and export/access options.",
    importedRecords: 0,
  },
  {
    countryCode: "GM",
    countryName: "The Gambia",
    sourceDiscoveryStatus: "source_identified",
    officialSourceUrl: "https://naqaa.gm/",
    sourcePublisher: "National Accreditation and Quality Assurance Authority (NAQAA)",
    sourceNotes: "Official regulator publishes accreditation and institution information. Review current institution lists and coverage of TVET providers.",
    importedRecords: 0,
  },
  {
    countryCode: "GH",
    countryName: "Ghana",
    sourceDiscoveryStatus: "source_identified",
    officialSourceUrl: "https://www.gtec.edu.gh/download/file/GHANA%20TERTIARY%20EDUCATION%20COMMISSION%20CURRENT%20INSTITUTIONS%20.pdf",
    sourcePublisher: "Ghana Tertiary Education Commission (GTEC)",
    sourceNotes: "Official active-accreditation institutions document. Review document freshness, terms, and complementary technical/professional regulator sources.",
    importedRecords: 0,
  },
  {
    countryCode: "GN",
    countryName: "Guinea",
    sourceDiscoveryStatus: "discovery_required",
    sourceNotes: "Locate and review current official ministry/regulator directories; do not substitute third-party directories for official recognition evidence.",
    importedRecords: 0,
  },
  {
    countryCode: "GW",
    countryName: "Guinea-Bissau",
    sourceDiscoveryStatus: "discovery_required",
    sourceNotes: "Locate and review current official ministry/regulator institution and programme sources, including Portuguese-language records.",
    importedRecords: 0,
  },
  {
    countryCode: "LR",
    countryName: "Liberia",
    sourceDiscoveryStatus: "source_identified",
    officialSourceUrl: "https://nche.info/about-us/",
    sourcePublisher: "National Commission on Higher Education (NCHE)",
    sourceNotes: "Regulator describes its recognition and accreditation mandate. Locate its current institution-level directory and source-specific records before import.",
    importedRecords: 0,
  },
  {
    countryCode: "ML",
    countryName: "Mali",
    sourceDiscoveryStatus: "discovery_required",
    sourceNotes: "Locate and review current official ministry/regulator directories, including institution types, accreditation, programmes, and curriculum sources.",
    importedRecords: 0,
  },
  {
    countryCode: "MR",
    countryName: "Mauritania",
    sourceDiscoveryStatus: "source_identified",
    officialSourceUrl: "https://www.mesrs.gov.mr/fr/etablissements",
    sourcePublisher: "Ministère de l'Enseignement Supérieur et de la Recherche Scientifique",
    sourceNotes: "Official ministry page lists public and private higher-education institutions. Review technical/vocational and programme-level sources separately.",
    importedRecords: 0,
  },
  {
    countryCode: "NE",
    countryName: "Niger",
    sourceDiscoveryStatus: "discovery_required",
    sourceNotes: "Locate and review current official ministry/regulator directories and document the responsible authority before importing records.",
    importedRecords: 0,
  },
  {
    countryCode: "NG",
    countryName: "Nigeria",
    sourceDiscoveryStatus: "source_identified",
    officialSourceUrl: "https://enuc.nuc.edu.ng/nus",
    sourcePublisher: "National Universities Commission (NUC)",
    sourceNotes: "Existing Nigeria inventory also includes NBTE, NCCE, and Federal Ministry of Education sources. All adapters remain disabled pending review.",
    importedRecords: 0,
  },
  {
    countryCode: "SN",
    countryName: "Senegal",
    sourceDiscoveryStatus: "source_identified",
    officialSourceUrl: "https://anaqsup.sn/",
    sourcePublisher: "Autorité Nationale d'Assurance Qualité de l'Enseignement Supérieur (ANAQ-Sup)",
    sourceNotes: "Official quality-assurance portal provides information on recognized institutions and accredited programmes. Review current source structure and terms.",
    importedRecords: 0,
  },
  {
    countryCode: "SL",
    countryName: "Sierra Leone",
    sourceDiscoveryStatus: "source_identified",
    officialSourceUrl: "https://www.mothe.gov.sl/directorate-of-higher-education/",
    sourcePublisher: "Ministry of Technical and Higher Education",
    sourceNotes: "Official ministry describes higher-education oversight and names TEC and NCTVE. Locate the current institution and programme directories for each body.",
    importedRecords: 0,
  },
  {
    countryCode: "TG",
    countryName: "Togo",
    sourceDiscoveryStatus: "source_identified",
    officialSourceUrl: "https://edusup.gouv.tg/documentation/liste-des-etablissements-denseignement-superieur-reconnus-par-le-ministere-de-lenseignement-superieur-et-de-la-recherche-pour-le-compte-de-lannee-academique-2025-2026/",
    sourcePublisher: "Ministère de l'Enseignement Supérieur et de la Recherche",
    sourceNotes: "Official recognized-institution list for academic year 2025–2026. Treat the list as session-specific and verify newer editions before refresh.",
    importedRecords: 0,
  },
];

/** Country coverage is not equivalent to imported or verified records. */
export function getWestAfricaSourceDiscoverySummary() {
  const identified = WEST_AFRICA_COUNTRY_SCOPE.filter(
    (country) => country.sourceDiscoveryStatus === "source_identified",
  ).length;
  return {
    totalCountries: WEST_AFRICA_COUNTRY_SCOPE.length,
    sourceIdentifiedCountries: identified,
    discoveryRequiredCountries: WEST_AFRICA_COUNTRY_SCOPE.length - identified,
    importedRecords: WEST_AFRICA_COUNTRY_SCOPE.reduce(
      (total, country) => total + country.importedRecords,
      0,
    ),
  };
}
