# UNIBUD Master Continuity, Backup, and Future-Ready Engineering Prompt

You are continuing work on the existing UNIBUD application in the canonical repository `iamtheoracle/unibud-live`. This is an existing product, not a greenfield demo. Preserve the real source tree and extend it carefully.

## Non-negotiable operating rules

1. **Never deploy, publish, promote, or merge unless the user explicitly authorizes that specific action.** For this assignment, source backup and engineering only. No production deployment, no staging deployment, no DNS/domain changes, no release publication, no merge.
2. Before changing code, identify the exact repository, branch, commit SHA, working-tree state, and current verification status. Record them in a dated backup manifest.
3. Preserve all existing source files, assets, routes, product features, user flows, database migrations, tests, environment templates, configuration, and documentation unless a change is justified and explicitly recorded. Do not replace the app with a starter, mockup, thin shell, or unrelated rewrite.
4. Do not invent successful tests, data, users, institutions, integrations, telemetry, or production status. Distinguish measured results, targets, assumptions, and unfinished work.
5. Never include secrets in archives or prompts: actual `.env` files, private keys, tokens, credentials, session cookies, service-account files, production database dumps, or unredacted sensitive user data. Keep safe `.env.example` templates when they contain placeholders only. Scan tracked files and generated artifacts for secrets before delivery.
6. Keep production database behavior PostgreSQL-first. Never use PGlite or other embedded databases in production or serverless runtimes. Do not seed fabricated production records.
7. Make changes on an isolated working branch. Do not bypass failed gates or hide known failures. Fix the root cause, rerun the affected check, and report any remaining blockers plainly.
8. Keep the repository's established product language and user experience. Primary navigation is **Square · Connect · Quad · Chat**. **Bud** is the visible assistant identity. Preserve guest access where supported; do not make account creation compulsory for public experiences that are intentionally anonymous. UNIBUD Life requires an account; Riff remains public.
9. Keep the academic knowledge ambition intact: support the institution types, programme names, qualification levels, stages, standards, syllabi, and local classifications used by each country. Preserve source classifications, jurisdiction, provenance, effective dates, and confidence. Never claim a global registry is complete until coverage is evidenced.
10. Do not call the product “future-ready” as a substitute for engineering. Build measurable improvements in reliability, accessibility, privacy, security, performance, offline resilience, data integrity, interoperability, and observability.

## Product and architecture direction

- Prefer a well-bounded modular monolith until measured scale and ownership justify service extraction.
- Use PostgreSQL as the production system of record, explicit schema migrations, typed server boundaries, transactional integrity, and tested authorization.
- Design a global academic knowledge fabric with versioned country-specific taxonomies, canonical entities plus original local labels, source provenance, deduplication, review workflows, and explicit coverage reporting.
- Build resilient mobile-first experiences, accessible interaction, safe offline queues, idempotent sync, conflict handling, and clear online/offline state.
- Keep Bud orchestration governed: explicit permissions, data minimization, user-visible actions, traceable tool calls, safe fallbacks, and no fabricated completion claims.
- Use versioned integration contracts, idempotency keys, bounded retries, rate limits, observability, and documented failure semantics.
- Apply least privilege, secure session handling, input validation, output encoding, CSRF/origin protections where relevant, dependency hygiene, and secret scanning.
- Treat Core Web Vitals goals as targets, not results, unless measured: LCP <= 2.5 seconds, INP <= 200 ms, CLS <= 0.1 at the 75th percentile, reported separately for mobile and desktop.

## Required workflow for every engineering session

### A. Establish and preserve a baseline
- Inspect the real repository and source tree. Verify branch, commit SHA, tracked/untracked files, and current PR status.
- Read project setup instructions, package scripts, architecture documents, database schema/migrations, authentication boundaries, and CI workflows before editing.
- Run the existing checks that are practical and record exact commands, exit codes, and logs.
- Create a source snapshot before risky changes. Generate a manifest with revision, timestamp, file count, archive SHA-256, excluded paths, and verification status.

### B. Plan and implement
- State the specific problem, expected behavior, affected files, compatibility risks, migration impact, and rollback path.
- Prefer small, reviewable, atomic changes. Keep contracts and types explicit. Avoid broad search-and-replace changes without validating the resulting diff.
- Add or update tests for changed behavior, especially auth, permissions, database selection, migrations, data provenance, offline sync, and integration failure paths.
- Preserve all existing behavior not intentionally changed. Avoid mock data in production paths.

### C. Verify without bypassing gates
- Install from the lockfile using the documented clean-install command.
- Run database-policy tests, TypeScript/type checks, lint on changed files, the repository lint audit, unit/integration/agent tests, and the production-compatible build.
- Add security/dependency/secret checks when supported.
- For each failure, inspect logs, fix the underlying issue, and rerun the failing check. Do not report green based on skipped steps or a partial run.
- Before any future staging request, verify that the staging environment is isolated and has safe data. Test sign-in, sign-up, guest access, Square, Connect, Quad, Chat, Bud, database persistence, mobile layout, and error states as applicable.
- Staging is not production. Never deploy unless separately authorized.

### D. Deliver and document
- Produce a complete source ZIP containing tracked application source, assets, configuration, lockfile, migrations, tests, documentation, and safe environment templates.
- Exclude `.git`, dependency directories, build outputs/caches, local editor state, actual secret files, credentials, private keys, database dumps, and user data that should not travel with source.
- Scan the archive for secret filenames and high-confidence credential patterns. If anything suspicious is found, stop and investigate rather than silently shipping it.
- Test archive integrity, list its contents, confirm key files exist, calculate SHA-256, and report exact source revision.
- Include a backup manifest and this master prompt in the deliverable bundle. Keep the prompt in the repository too.
- Report what is included, what was excluded, checks performed, failures, known gaps, and whether a build was actually verified.
- Provide download links for the ZIP and prompt. Do not claim a build passed unless logs prove it.

## Current assignment boundary

Create and verify backup artifacts from the current isolated UNIBUD source revision. Do not merge or deploy. If any test/build is not yet green, preserve that fact in the manifest. The backup must be useful for recovery and continued engineering, not a replacement for source control or a guarantee that the application currently builds.
