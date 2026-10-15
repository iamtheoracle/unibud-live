# UNIBUD Next-Era Technology Programme

**Status:** Proposed engineering programme, grounded in the current repository  
**Scope:** Evolve the existing application in controlled, reviewable increments. This is not a greenfield rewrite and does not authorize a production deployment.

## Product and engineering invariants

- Preserve the established primary navigation: **Square, Connect, Quad, Chat**.
- **Bud** is the only assistant identity presented as an assistant. Describe other products, services, and agents by their own names and jobs, not as generic AI products.
- PostgreSQL is the production system of record. Never use embedded PGlite or an in-memory database as a production fallback.
- No invented users, posts, institutions, balances, loan offers, bookings, verification statuses, or agent activity.
- An integration is unavailable until its configuration, authorization, health, and contract have been verified.
- A user-facing success state must be backed by a durable write or an authoritative provider response.
- No secrets, private user content, or sensitive data in source control, client bundles, logs, analytics, or test fixtures.
- Changes ship through isolated previews and explicit verification gates. Production is not the test environment.

## Centuries-ahead engineering principles

The horizon is long-term adaptability, not a claim that today's technology can predict centuries of change. UNIBUD should preserve its core purpose while allowing its interfaces, models, vendors, protocols, and infrastructure to change without destabilizing the whole platform.

- **Speed is a feature.** Measure user-perceived performance, server latency, database query time, queue delay, and payload size. Set budgets, profile real bottlenecks, and prevent regressions in CI.
- **Intelligence belongs in the workflow.** Use context, verified evidence, explicit rules, ranking, personalization controls, and bounded orchestration to reduce effort and help users make better decisions. Do not add a conversational layer where a direct, faster interface is better.
- **Small core, expandable capabilities.** Keep a dependable core and attach capabilities through typed contracts, versioned APIs, events, and replaceable adapters. Avoid tight coupling to any single model, cloud, database vendor, or external provider.
- **Async by design where waiting adds no value.** Move imports, notifications, media processing, indexing, and long-running provider operations to durable jobs with idempotency, bounded retries, dead-letter handling, and visible status. Keep interactive paths short.
- **Cache deliberately.** Use measured, invalidation-aware caching for public reference data and safe read paths. Never trade correctness, authorization, or private-data isolation for a faster response.
- **Design for graceful degradation.** When a provider, network, or optional capability fails, preserve the rest of the product and clearly identify what is unavailable. No silent data loss or pretend success.
- **Make change reversible.** Use backward-compatible migrations, feature flags, staged rollouts, exportable data, documented rollback, and tested recovery. A future replacement should not require a platform-wide rewrite.
- **Learn from evidence, not hype.** Instrument real user journeys and evaluate quality, latency, reliability, privacy, and cost before adopting a new technique or infrastructure layer.

### Initial performance budgets to validate

These are proposed starting guardrails, not claims about current production performance. Record a baseline first, test on representative mid-range phones and weak networks, then ratify targets using real measurements.

| Measure | Initial target |
|---|---|
| Cached/read API response, p95 | 300 ms or less, excluding external-provider time |
| First meaningful interaction | Within 2.5 seconds on a representative mobile 4G profile |
| Core route transition | 200 ms or less for local interaction feedback; network completion measured separately |
| User-facing write acknowledgement | 500 ms or less when the durable write completes locally on the server; long work returns a truthful pending state |
| Repeated submission | No duplicate effect when the same idempotency key is retried |
| Failure recovery | Every queued job has bounded retries, observable status, and a defined terminal failure path |

Targets must be segmented by journey and device class. External-provider latency must be measured separately rather than hidden inside an application metric. Any budget change should include the baseline, rationale, and regression impact.

## Target architecture

Build a **modular, PostgreSQL-first platform** before considering distributed services. Modules have explicit contracts and ownership, but remain in the existing deployable application until operational evidence justifies separation.

### 1. Domain modules with explicit boundaries

Organize code around product and business capabilities rather than one shared catch-all layer:

- Identity, authentication, sessions, consent, and account recovery
- Social graph, posts, reactions, moderation, and messaging
- Academic registry, institution identities, programmes, credentials, and source evidence
- Communities and shared spaces
- Marketplace, payments, education finance, and purchase credit
- Concierge and service requests
- Bud orchestration, approved tools, policy checks, and evaluations
- Notifications, user preferences, audit events, and integration health

Each module owns its rules and public contracts. Cross-module changes go through typed application services or documented events, not imports into another module's private database implementation.

### 2. Data foundation and integrity

- Keep PostgreSQL as the production source of truth, with reviewed migrations and backward-compatible expand/migrate/contract changes.
- Define tenant and user ownership explicitly; enforce authorization on the server for every read and write.
- Add durable audit records for security-sensitive actions and administrative changes, with actor, target, action, timestamp, and safe metadata.
- Use idempotency keys for retryable commands such as payments, applications, message submission, and provider callbacks.
- Use a transactional outbox for events that must not be lost between a database commit and downstream processing.
- Add indexes and query budgets based on measured workloads; use keyset pagination for large timelines and registries.
- Keep provider data, user-entered data, and derived data distinguishable, with source, retrieval time, verification state, and expiry where relevant.
- Backups are not considered adequate until restoration is tested against documented recovery-time and recovery-point objectives.

### 3. Global academic knowledge fabric

Treat the institution and programme registry as a long-lived, source-backed data product, not a static directory.

- Use country-specific adapters for different education systems, institution types, accreditation authorities, qualifications frameworks, and academic calendars.
- Preserve the source's original classification alongside normalized fields. Never force every country's system into a single misleading taxonomy.
- Model institutions, campuses, providers, programmes, awards, levels, stages, subjects, syllabi, standards, and accreditation as related, versioned entities.
- Record source provenance, effective dates, retrieval timestamps, review status, and conflicts for every imported claim.
- Distinguish **officially verified**, **source-reported**, **community-submitted**, **under review**, and **outdated** records.
- Design imports as repeatable, idempotent pipelines with validation, deduplication, change detection, and human review for ambiguous identity matches.
- Support multilingual names, local identifiers, aliases, and time-valid relationships.
- Do not claim global completeness. Publish country-by-country coverage and source freshness so gaps are visible.

### 4. Resilient client experience

- Treat progressive web app installation and offline behavior as capabilities with explicit support boundaries, not a promise that every workflow works offline.
- Cache only public or appropriately authorized content. Never place session secrets or sensitive records in a public cache.
- For eligible actions, use a durable client outbox with unique operation IDs, retry limits, expiry, and visible pending/failed/synced states.
- Define conflict rules per domain. Do not silently overwrite profile, academic, financial, or messaging data during synchronization.
- Make loading, empty, stale, offline, permission-denied, and provider-unavailable states distinct.
- Measure real-user performance on mid-range mobile devices and weak networks, with budgets for initial load, interaction readiness, and route transitions.
- Preserve accessible keyboard, screen-reader, reduced-motion, and contrast behavior.

### 5. Bud as a governed orchestration layer

Bud can coordinate specialized capabilities, but every operation remains bounded by user intent, permissions, and evidence.

- Separate planning from execution. Require explicit confirmation for consequential or externally visible actions.
- Give tools typed input/output contracts, least-privilege scopes, timeouts, idempotency, and bounded retries.
- Check authorization at execution time, not only when a plan is created.
- Label outcomes precisely: completed, needs input, needs verification, unavailable, blocked, timed out, or failed.
- Keep a trace of tool calls and evidence references without retaining unnecessary private prompt content.
- Require source-backed answers for changing academic, financial, legal, or provider data.
- Test prompt-injection resistance, cross-user data isolation, tool authorization, refusal boundaries, and recovery from partial failure.
- Maintain versioned evaluations for task success, groundedness, latency, cost, and policy compliance before changing orchestration behavior.
- Never fabricate a completed action, provider response, source, or agent activity.

### 6. Integration and API architecture

- Use versioned internal contracts and explicit provider adapters for identity, email, payments, education finance, storage, and external registries.
- Define connection states such as not configured, awaiting authorization, connected, degraded, expired, and revoked.
- Verify webhook signatures, replay protection, event ordering, and idempotent processing.
- Keep secrets server-side and rotate them without code changes.
- Add contract tests and sandbox tests before a provider is exposed in the product.
- Prefer standards-based interoperability and exportable user data over proprietary coupling.
- Extract a service into a separately deployed component only when scale, security isolation, team ownership, or availability requirements justify the operational cost.

### 7. Security and privacy as architecture

- Threat-model account takeover, insecure direct object references, cross-tenant access, scraping, spam, impersonation, prompt injection, malicious uploads, and provider webhook abuse.
- Enforce server-side access checks and deny-by-default permissions.
- Use short-lived, scoped authorization where supported; rotate sessions and invalidate them reliably on logout, credential changes, or revocation.
- Minimize data collection. Make consent purpose-specific and revocable, and make retention/deletion behavior explicit.
- Separate dating, academic, social, and financial profile data according to purpose and access policy.
- Use redacted structured logs, abuse-rate limits, security alerts, dependency scanning, secret scanning, and tested incident procedures.
- Financial products must clearly identify the responsible lender, decision authority, fees, repayment terms, and confirmed status. Do not imply guaranteed credit or a guarantee by UNIBUD without a real, approved legal arrangement.

### 8. Operability and measurable reliability

Instrument the platform around user journeys, not vanity dashboards.

- Structured logs, request correlation IDs, traces across internal services, and actionable error reporting.
- Service-level indicators for availability, latency, error rate, queue age, provider failures, and database saturation.
- Alert on user-impacting conditions with documented owners and runbooks.
- Separate operational telemetry from user content; define retention and access restrictions.
- Feature flags and kill switches for risky integrations, with server-side enforcement and audit history.
- Test database restoration, provider outage, expired credentials, slow networks, duplicate webhooks, queue retries, and partial deployments.

## Delivery sequence

### Phase 0: establish a trustworthy baseline

1. Pin the exact branch and commit under review.
2. Inventory routes, migrations, environment variables, dependencies, scheduled tasks, integrations, and existing tests.
3. Verify that production uses PostgreSQL only and remove any accidental production fallback to embedded storage.
4. Run typecheck, lint, unit tests, agent tests, production build, dependency/security scans, and secret scan.
5. Test authentication, guest access, ownership enforcement, core navigation, and migration behavior in isolated staging.
6. Publish a machine-readable verification report. Unknown or unrun checks are not reported as passing.

**Exit gate:** the baseline is reproducible and blockers are documented before architectural expansion.

### Phase 1: safe platform seams

- Document module ownership and add contract tests.
- Standardize request validation, error envelopes, authorization helpers, audit events, and idempotency.
- Introduce feature flags and integration-health states.
- Establish database migration and rollback procedures.
- Add performance and security budgets to CI.

**Exit gate:** new work can be added without bypassing auth, persistence, or verification controls.

### Phase 2: academic knowledge fabric

- Define versioned canonical entities and source-provenance schemas.
- Build country adapters and repeatable import pipelines.
- Add deduplication review, freshness reporting, and source-quality checks.
- Start with a measured pilot; expand only when the pipeline preserves local classifications and provenance.

**Exit gate:** imported records can be traced to evidence, updated safely, and audited.

### Phase 3: resilient, connected experience

- Add offline support to low-risk reading and drafting flows first.
- Introduce a durable sync outbox for explicitly supported actions.
- Add provider adapters and webhook processing with idempotency.
- Expand observability and failure-recovery tests.

**Exit gate:** online/offline transitions and provider failures do not create silent data loss or false success.

### Phase 4: governed intelligence and optimization

- Version Bud tool contracts and evaluation suites.
- Add evidence-aware retrieval over verified academic and product sources.
- Use privacy-preserving personalization with user controls and purpose limits.
- Optimize based on production-like measurements, not assumptions.

**Exit gate:** measurable quality improvements without regressions in privacy, authorization, reliability, or cost.

## Mandatory release gate

A change is not release-ready until applicable checks pass:

- [ ] TypeScript typecheck
- [ ] Lint and formatting check
- [ ] Unit and integration tests
- [ ] Agent policy and tool-authorization tests
- [ ] Production build
- [ ] Database migration compatibility
- [ ] Dependency and secret scanning
- [ ] Authentication and authorization smoke tests
- [ ] Mobile viewport and accessibility smoke tests
- [ ] Provider sandbox/contract tests for changed integrations
- [ ] Isolated staging verification
- [ ] Rollback plan and deployment artifact identity

Mark each check **passed**, **failed**, **blocked**, or **not run**. Do not turn an unavailable check into a pass.

## Architecture decision rule

Prefer the smallest change that creates a durable capability. Avoid a rewrite, premature microservices, speculative infrastructure, unverified vendor dependencies, and new complexity without a measurable user or operational benefit. "Ahead of its time" means easier to extend, safer to operate, and more trustworthy under real-world conditions.
