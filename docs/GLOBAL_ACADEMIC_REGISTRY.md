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
| Shared schema | `migrations/0030_global_academic_registry.sql` | Durable global reference tables, foreign keys, checks, and indexes. Apply only after migration-number collision review and isolated database testing. |
| Domain contracts | `src/lib/academic-registry/types.ts` | Typed country, authority, institution, campus, framework, level, programme, curriculum, course, syllabus, standard, source, import, and query-filter contracts. |
| Public read handlers | `src/lib/academic-registry/server.ts` | Parameterized country-scoped search and verified institution detail reads, including programmes, courses, syllabus topics, accreditations, and accepted standards. No writes or import execution are exposed here. |
| Ingestion contracts | `src/lib/academic-registry/ingestion/contracts.ts` | Contract for country/source-specific adapters and source record envelopes. |
| Source normalization | `src/lib/academic-registry/ingestion/normalize.ts` | Normalize candidate institution records, preserve source-scoped IDs, produce stable slugs, and force imported candidates into review. |
| Contract tests | `src/lib/academic-registry/types.test.ts` and `src/lib/academic-registry/ingestion/normalize.test.ts` | Country-code normalization, source-record validation, slugging, and review-state tests. |
| Server data access (next implementation step) | `src/lib/academic-registry/server.ts` | Authenticated/authorized server functions for search, detail pages, evidence review, and imports. Never expose raw database access in client components. |
| Source adapter contracts | `src/lib/academic-registry/ingestion/contracts.ts` | Define the contract for source-specific import adapters and source record envelopes. |
| Initial source inventory | `src/lib/academic-registry/ingestion/nigeria-sources.ts` | Lists official Nigerian source endpoints for NUC, NBTE, NCCE, and the Federal Ministry of Education. All remain disabled until a tested adapter and source-terms review exist. |
| Ingestion adapters (next implementation step) | `src/lib/academic-registry/ingestion/` | Implement one adapter per official regulator/government source or documented public dataset. Every adapter records source, retrieval time, source hash, and import-run statistics. |
| Registry UI (next implementation step) | `src/routes/_app/academics/` or the established route structure after route-tree inspection | Country selector, institution search, institution detail, programme/curriculum view, source citations, and review queue. Must follow existing auth and route conventions. |
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

This branch establishes the schema, TypeScript contracts, public read handlers, and source-record normalization foundation. It does **not** yet implement live country/regulator ingestion adapters, verified country coverage datasets, import persistence/orchestration, an admin review interface, or user-facing registry routes. The server read handlers and SQL migration also have not passed a clean install/typecheck/build/database test yet. Those gaps must be closed before the feature is called complete.

The schema migration number `0030` is deliberately conservative because this repository has multiple active branches and migration history has not yet been reconciled. Before merge, compare all migrations on the selected consolidated branch, verify that no migration number/name conflicts, apply it to a disposable isolated PostgreSQL/PGlite database, and test upgrade behavior. Do not run it against production as part of this work.

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
