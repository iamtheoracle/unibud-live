# UNIBUD Unified Integration Contract

## Product decision

UNIBUD is one application assembled from the strongest parts of the existing projects. Do not treat the source repositories as separate products and do not replace the established UNIBUD-live interface with a new redesign.

## Source-of-truth responsibilities

- **UI/UX reference and integration host:** `iamtheoracle/unibud-live`. Preserve its existing visual language, navigation, responsive behavior, and product identity. New modules must fit its established experience.
- **Unique product capabilities:** `iamtheoracle/arc-project-one` and `iamtheoracle/arc-project-one-v2`. Audit their code, domain models, feature notes, attachments, and documented requirements; port the useful capabilities into UNIBUD-live rather than swapping the UI.
- **Local AI and extensible tools:** `iamtheoracle/arc-project-two`. Review its Ollama/local inference, agent loop, plugin discovery, tools, and conversation-memory implementation. Integrate through a provider boundary so UNIBUD can still run when local AI is unavailable.
- **Starter foundations:** `iamtheoracle/next-platform-starter` is the connected repository that appears to correspond to Project Starter. Use only relevant, compatible patterns; do not import its example routes wholesale.
- **Existing product/backend work:** `iamtheoracle/unibud-app`, including the open `reconcile/unibud-production` work, must be reviewed for authentication, database persistence, ownership checks, migrations, and tests. Reuse the sound work after comparing it with UNIBUD-live; do not blindly overwrite either implementation.

## Integration principles

1. Keep UNIBUD-live's established UI/UX as the visual acceptance reference.
2. Preserve Arc Project One's differentiating functionality and intended upgrades; don't reduce the result to a generic campus social app.
3. Bring in Arc Project Two's useful AI/tooling as modular capabilities, not as a second competing app or second visible assistant.
4. Keep one visible Bud assistant. Spark and specialist capabilities remain internal services unless the existing product explicitly exposes them.
5. Integrate Studies, Board, social/community, messaging, discovery, marketplace/P2P, profiles, safety/trust, and AI tools through consistent navigation and shared identity where supported by the actual code.
6. Preserve authentication, per-user authorization, data ownership, migrations, and real persistence. Do not add fabricated production activity or seed fake users/listings/posts.
7. Reuse source code only after checking framework compatibility, dependencies, licenses, secrets, and tests. Prefer adapters and incremental ports over wholesale file copying.
8. Keep all work on this integration branch and use Deploy Preview/CI for verification. Do not merge or deploy to production without explicit approval.

## Required audit before feature porting

- Inventory routes, screens, components, domain types, database schemas/migrations, server functions, agent/tool interfaces, environment variables, tests, and deployment configuration in each source.
- Map each capability to its original source, target module, dependencies, migration needs, and acceptance tests.
- Identify duplicates and conflicts explicitly; resolve them without silently dropping a capability.
- Treat `next-platform-starter` as a candidate for reusable foundation only, not automatically as the canonical product.

## Definition of done

- UNIBUD-live's key flows remain recognizable and work on mobile and desktop.
- Arc Project One's verified unique features are available from the unified app.
- Selected Arc Project Two capabilities are integrated behind a stable provider/tool interface with graceful failure when optional local services are absent.
- Relevant reusable backend work from `unibud-app` is reconciled without breaking auth, ownership, or persistence.
- No dead-end navigation, fake production records, or duplicate competing assistant experiences are introduced.
- Typecheck, lint, tests, production build, auth/ownership checks, and key-flow browser checks pass.
- A reviewable pull request and Deploy Preview are available; production remains untouched.


## First code-audit findings (2026-10-29)

- The live marketplace already uses a single TanStack route, catalog query, category chips, and existing listing cards. Its query previously searched only title, description, and location; it now also searches seller handle and tags, and invalid category query parameters fall back to `all`.
- Arc Project One's listing domain model has been added at `src/lib/unibud/marketplace-domain.ts`. Draft validation is wired into the authenticated Creator Space service form. A separate runtime guard now validates the current persisted schema's listing kind/category, stay-category pairing, title/description, safe positive integer price, price note, and location before SQL writes. Arc's richer listing kinds remain blocked from the current create endpoint until the database schema and UI can represent them.
- Arc Project Two is a small Python/Ollama agent with a plugin loader. Its plugin execution model imports local Python modules and invokes named functions; do not expose that loader directly to web users or treat it as a secure multi-tenant runtime. Integration must go through the existing UNIBUD agent contracts/provider boundaries and enforce permissions server-side.
- Verification limitation: repository files were reviewed through GitHub; no local dependency install or browser run has been executed in this environment. GitHub Actions run `40792258092` was queued/in progress after the latest changes, so its typecheck/lint/tests have not yet been confirmed. Keep the branch unmerged until the run finishes and results are reviewed.


## Follow-up implementation pass

- Wired Arc listing draft validation into the authenticated Creator Space form before it calls `createListing`.
- Added a shared runtime guard used by `createListing`. It rejects unsupported persisted listing kinds/categories, invalid stay-category combinations, malformed title/description, non-positive or unsafe prices, blank/overlong price notes, and invalid locations. Server-side enforcement matters because client-side checks can be bypassed.
- Added tests for the runtime guard's accepted schema and invalid enum/category/price-note/price cases.
- Added `src/lib/unibud/marketplace-domain.test.ts` coverage for valid drafts, unsafe image URLs, used-item defect requirements, accommodation fields, and currency formatting.
- Additional Arc Project Two security finding: `plugins/files.py` accepts arbitrary absolute or relative filesystem paths and reads them. That plugin is acceptable only as a trusted local tool in its current intended local setting; it must not be exposed to a hosted multi-user UNIBUD runtime without a strict workspace allowlist and authorization layer.
- Arc Project Two README describes persistent conversation memory, but the inspected tree has no `core/memory.py`; its agent stores messages only in the live in-process `self.messages` list. Do not advertise durable memory from this source until persistence is implemented and tested.
- CI workflow lookup for the latest commit returned no workflow runs. Checks remain unverified.


## CI wiring follow-up

- Added `npm run test:marketplace` using Node 22's TypeScript stripping test runner.
- Added the marketplace-domain test step to `.github/workflows/unibud-ci.yml` so the new validation tests are part of the pull-request verification gate.
- GitHub Actions run `40792258092` (`UNIBUD Pre-UI Verification Gate`) is in progress for the latest integration branch commit. The workflow runs typecheck, the agent/Spark test suite, and marketplace domain tests; it does not run a full production build or browser tests. No pass is claimed until its final conclusion is observed.


## Navigation and demo-surface audit follow-up

- The current primary navigator is the intended four-space set: Square, Connect, Quad/Communities, and Chat. It already hides while scrolling down and reappears while scrolling up; selecting a destination now also collapses it immediately, matching the contextual-navigation requirement more closely.
- The shared `DemoCallout` is already used on marketplace listing details and the demo wallet. It now exposes a semantic note role and accessible label, keeping demo-only money behavior explicit to assistive technology as well as visually.
- Removed the unsupported “Active now” claim from direct chat headers and stopped rendering the hard-coded `ROOM_SEED` message examples as if they were real room history. Room threads now show persisted messages only. This aligns the live UI with the no-fabricated-activity rule.
- The current repository tree includes `migrations/0016_soulync_wayward.sql` and the Board routes/data, but the connected GitHub repository list and branch search did not surface standalone repositories or branches named `soulync` or `board-workspace`. Their referenced snapshots therefore remain unverified until the exact source refs/archives are accessible.
- The v2 UI prototype ZIP is present in the Git tree, but this connector cannot retrieve binary repository downloads for direct ZIP inspection. Do not claim its contents have been audited yet.


## CI blocker discovered and attempted repair

- GitHub Actions run `40792258092` failed during `npm ci`, before typecheck, lint, or tests. The exact error is that the lockfile is out of sync around `ajv`, `json-schema-traverse`, `fast-uri`, `require-from-string`, and `lru-cache`; no code checks ran.
- The lockfile includes `@hookform/resolvers` with optional peer dependencies that are not installed in this app, while the current dependency tree includes ESLint's Ajv 6 line. Added project-level `.npmrc` with `legacy-peer-deps=true` to match the existing lockfile's optional-peer installation strategy.
- This is an attempted repair, not a verified fix. A new Actions run must confirm `npm ci` succeeds. If it still fails, regenerate and commit `package-lock.json` with the repository's intended npm settings rather than weakening the verification gate.
