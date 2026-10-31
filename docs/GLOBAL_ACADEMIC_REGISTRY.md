# Global Academic Registry: implementation map

## Purpose

Build a country-by-country, source-backed directory of higher-education and post-secondary institutions and their actual academic offerings. It must represent the local system in each country rather than forcing every country into one assumed taxonomy.

The registry covers, where present in a country's system:
- federal/national, state/provincial, municipal, private, faith-based, community, international, and other governance/ownership models;
- universities, polytechnics, colleges of education, technical/vocational schools, institutes, professional schools, colleges, and country-specific institution types;
- main campuses, satellite campuses, branch campuses, and parent/affiliated institutions;
- regulators and authorities, recognition status, institutional and programme accreditation, accreditation periods and reference numbers;
- qualifications frameworks and country-local levels, stage/year/term labels, award titles, entry requirements, durations, credit systems, and delivery modes;
- programmes/awards, curriculum versions by academic session, courses/modules, prerequisites, credits/contact hours, syllabus topics, learning outcomes, and assessment methods;
- official source URLs, retrieval timestamps, content hashes, review decisions, data-import runs, and change history.

## Exact source-code placement

| Concern | Canonical path | Responsibility |
| --- | --- | --- |
| Shared schema | `migrations/0030_global_academic_registry.sql` | Durable global reference tables, foreign keys, checks, and indexes. |
| Evidence publication gates | `migrations/0031_academic_registry_evidence_hardening.sql` | Require source identity and review timestamps for published catalogue records; keep legacy rows hidden until evidence is remediated. |
| Ingestion integrity | `migrations/0032_academic_registry_ingestion_integrity.sql` | Source-scoped external identifiers, idempotent import keys, per-record outcomes, and reviewed cross-source match proposals. |
| Domain contracts | `src/lib/academic-registry/types.ts` | Typed country, authority, institution, campus, framework, level, programme, curriculum, course, syllabus, standard, source, import, and query-filter contracts. |
| Public read handlers | `src/lib/academic-registry/server.ts` | Parameterized country-scoped search and verified institution detail reads, including programmes, courses, syllabus topics, accreditations, and accepted standards. No writes or import execution are exposed here. |
| Ingestion contracts | `src/lib/academic-registry/ingestion/contracts.ts` | Contract for country/source-specific adapters and source record envelopes. |
| Source normalization | `src/lib/academic-registry/ingestion/normalize.ts` | Validate untrusted fields and outbound URLs, preserve source-scoped IDs, produce Unicode-safe slugs, and force imported candidates into review. |
| Contract and schema tests | `src/lib/academic-registry/types.test.ts`, `src/lib/academic-registry/ingestion/normalize.test.ts`, and `scripts/academic-registry-schema.test.mjs` | ISO country-code validation, source-record validation, multilingual slugging, publication constraints, idempotency, and SQL compatibility against isolated PGlite. |
| Server data access | `src/lib/academic-registry/server.ts` | Public verified-only search/details plus reviewer-only institution review queue and atomic audited approve/reject decision. Imports and other entity review mutations remain future work. Never expose raw database access in client components. |
| Reviewer authorization | `src/lib/academic-registry/review-auth.server.ts` | Fail-closed exact user-ID allowlist using server-only `ACADEMIC_REGISTRY_REVIEWER_IDS`; no client-supplied reviewer identity or status. |
| Source adapter contracts | `src/lib/academic-registry/ingestion/contracts.ts` | Define the contract for source-specific import adapters and source record envelopes. |
| Initial source inventory | `src/lib/academic-registry/ingestion/nigeria-sources.ts` | Lists official Nigerian source endpoints for NUC, NBTE, NCCE, and the Federal Ministry of Education. All remain disabled until a tested adapter and source-terms review exist. |
| West Africa coverage scope | `src/lib/academic-registry/ingestion/west-africa-scope.ts` | Tracks source-discovery status for 16 countries, with official ministry/regulator source leads for 14 and discovery still required for Guinea-Bissau and Niger. This is not an imported directory. |
| Ingestion adapters (next implementation step) | `src/lib/academic-registry/ingestion/` | Implement one adapter per official regulator/government source or documented public dataset. Every adapter records source, retrieval time, source hash, and import-run statistics. |
| Registry UI | `src/routes/_app/academics.tsx` | Global 249-code country selector, verified search, institution details, and linked source-evidence list. Country selection does not imply source coverage or imported records. |
| Spark responsibility routing | `src/lib/spark/routing/responsibility.ts` | Route institution/academic-catalog requests to Nova/Institution Service and Scholar/Academic Service as appropriate. Do not let a routing definition imply a connected data provider. |
| Agent responsibility metadata | `src/lib/agents/catalog.ts` and `src/lib/agents/specialists/definitions.ts` | Declare roles, scopes, and boundaries only. These files are not the institution database or a source ingestion engine. |
| Personal study data | `src/lib/studies/server.ts` and existing study migrations | Keep a student's private enrolled courses, notes, materials, and sessions separate from the shared official institution catalogue. |
| Data quality/release gates | tests + CI workflow | Reject invented records, unsupported accreditation claims, duplicate source imports, and unreviewed data presented as verified. |

## Core modelling rules

1. **Country-first, not Nigeria-only.** Use ISO 3166-1 alpha-2 country codes and allow local labels, alternate spellings, aliases, and jurisdiction-specific types.
2. **Do not flatten taxonomies.** A polytechnic diploma, a university degree, a technical certificate, and a professional qualification may use different local structures. Preserve original labels and record cross-framework equivalence only as a reviewed, source-backed claim.
3. **Institution is not programme; programme is not course; course is not syllabus topic.** Model each separately and connect them with foreign keys.
4. **Keep curriculum history.** Syllabi change by session/version. Never silently overwrite an older official curriculum.
5. **Accreditation is dated and scoped.** Institution accreditation and programme accreditation can differ. A claim must carry authority, status, validity dates, reference/source, and verification timestamp.
6. **Evidence is first-class.** Every imported or corrected fact should be traceable to a publisher/source URL and a review decision. A missing source means unverified, not verified by default.
7. **No invented completeness.** Do not fill the directory with sample universities, fabricated courses, assumed accreditation, or guessed syllabi. A country can be marked partial until its official sources have been enumerated and checked.
8. **Source permission and terms matter.** Respect source licences, terms of use, rate limits, and robots/access policies. Prefer official open data, official downloadable registries, and documented APIs.
9. **Idempotent ingestion.** Re-running a source import must not create duplicate institutions/programmes. Use stable external identifiers when the authority provides them; otherwise use reviewed identity matching and aliases.
10. **Security and audit.** Public catalogue reads can be public if the product policy permits, but source imports, edits, accreditation review, and publication require server-side authorization and audit trails. Do not use a client-supplied `review_status` as proof of approval.

## Ingestion lifecycle

1. Discover the country's education ministries, national/regional regulators, accreditation agencies, qualifications authorities, official institution directories, and open-data portals.
2. Register each source with its publisher, official URL, licence/terms, retrieval timestamp, and expected update cadence.
3. Download/import only from permitted sources; retain the source file/hash or stable source record where permitted.
4. Normalize the country and official institution identifier; preserve the source's original names, classifications, local terminology, and identifiers.
5. Validate required fields and cross-references. Flag conflicts, duplicates, missing accreditation evidence, stale records, and impossible dates.
6. Queue records for review where authoritative automated validation is insufficient.
7. Publish only accepted/verified claims. Keep unverified and pending data clearly labelled.
8. Schedule source-specific refresh jobs only after a real permitted source and deployment scheduler are configured. The existing deployment must not claim scheduled ingestion until a real job is deployed and observed succeeding.
9. Track counts seen/created/updated/rejected and errors per import run; alert on unexpected drops or source schema changes.

## Current scope and honest status

The current branch contains the initial registry schema (`0030`), evidence-backed publication gates (`0031`), source identity/idempotency/audit tables (`0032`), TypeScript contracts, verified-only public reads, a fail-closed reviewer allowlist, an atomic audited institution approve/reject endpoint and reviewer queue, hardened normalization, a global 249-code country selector, source-evidence display, and West Africa source discovery. The West Africa manifest covers 16 countries and identifies official source leads for 14; Guinea-Bissau and Niger still need source discovery. The global selector is a navigation capability, not proof of global source coverage. No institution records have been imported.

The new PGlite test applies migrations `0030`–`0032`, checks evidence and idempotency constraints, and compiles the public search/detail SQL against the isolated schema. The CI workflow also runs registry lint, contract tests, and a production application build. Live country-specific ingestion adapters, durable import orchestration, protected evidence-review/publication mutations, source-coverage refresh jobs, and staging browser smoke tests remain incomplete. Netlify's latest deploy-preview check is pending and must be observed to completion. The reviewer endpoints fail closed for development identities and until `ACADEMIC_REGISTRY_REVIEWER_IDS` is configured with exact authenticated user IDs. The current Netlify configuration has `VITE_AUTH_ENABLED=false`, so reviewer actions must remain unavailable there until the app's real authentication is enabled and verified. Do not call the feature complete until those gaps and the full release gates are closed.

Migration-number review on the current main branch found no filename collision for `0030`, `0031`, or `0032`; the existing main migration files currently end at `0018`. Main has two later commits with no net file changes relative to the merge base. The three registry migrations have passed the disposable PGlite migration test. A fresh consolidated-branch comparison and staging upgrade test are still required before merge. Never run these migrations against production as part of this work.

## Acceptance criteria

- Search works by country, institution name/alias, institution type, governance label, region, programme, level, and subject.
- The catalogue can represent all categories a given country's official sources use without requiring code changes for each new label.
- Every published institution, programme, accreditation, level equivalence, and syllabus has inspectable provenance and verification status.
- Importing the same source twice is idempotent and does not create duplicate entities.
- Historical curriculum versions remain available.
- Private student study data remains separate and scoped by existing authentication.
- All server mutations are authorization-checked; public clients cannot self-approve data.
- Tests cover schema constraints, imports, duplicate matching, permissions, stale-source behavior, and country-specific classification.
- A source-coverage report distinguishes verified, partial, stale, and unavailable data by country and source.
- The feature is not considered complete until clean install, typecheck, full lint, tests, production build, isolated database migration, and staging smoke tests pass.
