# UNIBUD whole-product completion ledger

This ledger is the implementation and acceptance gate for issue #3. A screen, route, fixture, local-store action, or named agent is not accepted as a working feature by itself.

## Status vocabulary
- **Not audited**: implementation has not been examined end-to-end.
- **Partial**: some implementation exists, but one or more required paths are missing or unverified.
- **Blocked**: requires a product decision, external credentials, approved provider, institutional authority, or integration not currently available.
- **Verified**: implementation, authorization, persistence, failure behavior, and tests have all passed the relevant acceptance checks.
- Never mark a row verified based only on route presence, a successful static build, fixture data, or a UI interaction.

## Release gates
1. Preserve the approved navigation: bottom bar is Square → Connect → Quad → Chat. The Guild is a right-side/menu entry, not a bottom tab. Spark Calendar remains inside Board.
2. No production deploy, database mutation, auth switch, payment rail activation, or external paid action from this implementation branch.
3. No fake activity, demo balance, fixture person, pretend booking, invented provider, unverified trend, or AI-generated grade may be represented as real.
4. Every private server action must derive identity from a verified session and authorize the specific resource and role. Hiding a control in the UI is not authorization.
5. Every user-owned feature needs persistence, ownership scoping, deletion/correction policy, error handling, and tests.
6. External actions that spend money, book a service, send messages to third parties, or publish content require a clear user confirmation at the point of action.
7. If an external integration is missing, show a clear unavailable/blocked state and keep the rest of the product usable.

## Whole-product ledger

| Area | Required acceptance scope | Initial status |
|---|---|---|
| Identity and access | UNIBUD and Bud journeys, shared identity with consented linking, secure sign-in, sessions, recovery, role scopes, teen protections, guest mode limited to Bud and five text questions | Partial; production auth/database configuration must be verified |
| Core navigation | Square → Connect → Quad → Chat bottom navigation; swipe/right-side identity menu; Guild entry in menu | Partial; Guild is on a draft PR, not merged |
| Square | Feed, posts, stories/status, Drop creation, media upload, replies, reactions, reporting, moderation, privacy, notifications, persisted activity | Partial; server-backed pieces exist, end-to-end verification pending |
| Connect | People discovery, profiles, follow/connection actions, direct messages, privacy and block/report enforcement | Not audited end-to-end |
| Quad | Persistent interest groups, membership, privacy, roles, join/leave, moderation and group conversations | Partial; server functions exist, permission and UI coverage need verification |
| Chat | Direct, group, class/study conversations, delivery state, media, blocking/reporting, notification links, authorization | Not audited end-to-end |
| Bud conversation core | Provider reliability, conversation history, academic context, voice/media boundaries, retry/error handling, user-owned memory and deletion | Partial; conversation service and provider routing exist |
| Bud study tools | Explanations, quizzes, flashcards, mock exams, spaced repetition, revision plans, tutoring, progress/goals, accessible and low-bandwidth behavior | Not audited end-to-end |
| Bud files and research | PDF/image/document uploads, source-grounded summaries/citations, concept maps, research/project workspace, source evaluation, academic integrity | Not audited end-to-end |
| Bud discovery | Scholarships, admissions, courses, internships, competitions, awards, research, deadlines, academic news and institution announcements with source/provenance labels | Partial; current discovery sources need audit |
| Board classroom model | Institution → school/community → department/year/course/combined community → controlled teaching group → assessment session | Partial; current routes/data model do not yet prove full institutional lifecycle |
| Board teaching and learning | Classrooms, live sessions, recorded lessons, podcasts/audio, discussions, lecturer materials, participation, teaching permissions | Partial; UI/data fixtures and real session state need separation and verification |
| Board attendance | Authorized physical/live attendance, lecturer register, scoped QR/session check-in, reports, absence explanations, corrections and audit trail | Partial; current event functions need resource-level authorization review |
| Board assessments | Authoring, scheduling, deadlines, attempts, autosave, offline/network failure behavior, objective marking, rubric support, independent checks, lecturer review, release states, corrections/audit, verified lecturer notifications | Not implemented/verified as a complete lifecycle |
| Spark Calendar | Tutoring, classes, activities, community service, Google Calendar integration, conflict prevention, cancel/reschedule, permissions and durable sync | Partial; calendar foundations exist, end-to-end sync pending |
| The Guild | Clear umbrella experience with Quarter, Concierge and Board as siblings; no duplicated underlying systems | Partial; Guild overview exists on draft PR |
| Quarter | Listings, shopping, seller tools, cart, orders, checkout, rentals/hostels, auctions, P2P, service payments, refunds, transaction ledger, approved finance application pathway | Partial; marketplace and simulated wallet exist; real commerce/payment rails are not connected |
| Concierge | Compare options, budgets, coordinate plans, real booking/order execution, shared Quarter state, approval before paid actions, cancellation/failure/refund handling | Not implemented/verified end-to-end |
| SouLync | Separate romantic discovery, consent-based mutual interest, dedicated chat, age/safety rules, pause/unmatch/block/report and privacy | Partial; schema exists, service and UI need end-to-end verification |
| Wayward | Separate youth culture/trends/events discovery using permitted public sources/APIs, source dates, age-appropriate controls, saves/interactions and feedback | Partial; schema exists, verified content integrations need review |
| Fixer | Personal support, consent-based anonymized human handoff, disclosed professional prices, boundaries, crisis safety, no forced paid referral | Partial; current UI contains local/demo peer behavior; must not be represented as a real peer connection |
| Agent organization | Preserve identities; mission/duties/boundaries/capabilities/permissions/contracts/hooks/collaborators; honest blocked/unavailable outcomes; traceable orchestration | Partial; registry and tests exist, all named agents need capability-by-capability audit |
| Orbit and internal intelligence | Keep internal unless explicitly approved; separate from Fixer; route only to authorized capabilities; no exposure of internal traces to users | Partial |
| Institutional administration | Institutions, departments, programmes, course registration/prerequisites/credits, timetables, lecturer assignments, terms, grades, transcripts, progression and graduation | Not implemented/verified as a complete lifecycle |
| Campus services | Fees/receipts/aid through authorized integration, digital library, venues/rooms, substitute lecturers, student support and auditable records | Blocked pending institutional data and provider agreements |
| Safety and moderation | Reports, block lists, abuse handling, minors' safeguards, escalation, privacy boundaries, consent and audit trails | Not audited end-to-end |
| Notifications and search | Reliable in-app/email/push as configured, permission-aware search, links to correct destination, preferences, deduplication and retry behavior | Partial |
| Shared platform foundations | PostgreSQL persistence, ordered migrations, backup/recovery, observability, rate limits, secure uploads, accessibility, performance, integration and regression tests | Partial; production repo/deploy/database provenance remains unverified |
| Production operations | Verify exact Netlify site → repo → branch → commit, runtime env/secrets, database, migrations, auth, build, browser smoke and rollback before release | Blocked pending verified deployment provenance and production configuration |

## Verification required for every row
- Trace the user journey from entry point through completion and failure/retry.
- Trace every write through the server boundary to durable storage.
- Verify ownership, role, membership, consent, and resource-level permissions on the server.
- Identify fixture/demo/local-only state and label it honestly.
- Add unit and integration tests for success, unauthorized access, invalid input, duplicates, concurrency, and failure recovery.
- Run typecheck, full lint, unit tests, production build, route checks, and browser smoke tests.
- Record external dependencies and exact blockers rather than inventing credentials or real-world state.

## First confirmed audit findings (2026-10-11)
- `src/lib/social/server.ts` contains only `PLACEHOLDER`; it cannot be counted as an implemented social server module.
- `src/lib/money/server.ts` explicitly describes its wallet ledger as demo-only and states no real money moved.
- `src/routes/_app/board.tsx` uses `BOARD_SESSIONS` and a client campus store for some live/recording attendance display; this is not proof of a durable authoritative session/attendance lifecycle.
- `src/lib/academic/server.ts` exposes attendance/question reads and writes with sign-in middleware, but the inspected handlers do not visibly enforce session membership or lecturer/owner scope. These must be fixed before institutional use.
- `netlify.toml` currently sets `VITE_AUTH_ENABLED=false` for build and production. `src/lib/auth/verify.server.ts` rejects authenticated data operations if a real database is configured while auth remains disabled. Do not simply flip this flag: verify the actual production database and broker credentials first.
- `.github/workflows/unibud-ci.yml` has not passed the current PR gate; the latest observed result was `action_required`. A green lockfile install is not a passing product verification.
- The production Netlify site, repository, deployed branch and commit are not yet proven to match each other.

This ledger is intentionally conservative. Reclassify status only when evidence and tests justify it.
