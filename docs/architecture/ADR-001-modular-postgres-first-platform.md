# ADR-001: Modular, PostgreSQL-First UNIBUD Platform

- **Status:** Proposed
- **Date:** 2026-10-16
- **Decision owners:** UNIBUD engineering
- **Scope:** Application architecture and delivery discipline

## Context

UNIBUD combines social interaction, messaging, academic data, communities, financial and marketplace journeys, service coordination, and Bud orchestration. A wholesale rewrite or premature split into microservices would increase migration risk and operational burden before the current baseline is fully verified.

The current repository already uses a modern React/TanStack/Vite stack, PostgreSQL-oriented data access, typed application code, and an agent runtime. The next step should strengthen boundaries and verification rather than replace these technologies for novelty alone.

## Decision

1. Evolve the current application as a **modular monolith** with explicit domain boundaries and typed contracts.
2. Use **PostgreSQL as the production source of truth**. Embedded PGlite may not be a production fallback; any local-only database mode must be explicit, isolated, and unable to activate in production.
3. Use versioned migrations, authorization checks at the server boundary, idempotent commands, auditable security events, and a transactional outbox where durable asynchronous delivery is required.
4. Make third-party integrations explicit adapters with verified connection state, contract tests, server-side secrets, and failure-safe user experience.
5. Build the global academic registry around source provenance, country-specific classification, temporal validity, and visible confidence/freshness states.
6. Keep Bud's execution tools governed by typed contracts, least privilege, explicit confirmation for consequential actions, evidence tracking, and regression evaluations.
7. Require isolated staging and reproducible verification before production changes.
8. Preserve product naming and the established primary navigation. Technical infrastructure must not dictate unnecessary product relabeling.

## Consequences

### Benefits

- Lower migration risk than a rewrite.
- Easier domain-level testing and ownership.
- Better support for country-specific education systems without flattening differences.
- Fewer false-success states and safer retries across providers.
- A clearer path to service extraction when measurable requirements justify it.
- Improved ability to diagnose failures and verify what is actually operational.

### Costs and trade-offs

- Strong module boundaries and migrations require discipline.
- Auditability, source provenance, and contract tests add implementation work.
- A modular monolith still requires careful scaling and isolation of expensive jobs.
- Offline synchronization must be limited to actions with well-defined conflict semantics.
- Data provenance and freshness require ongoing maintenance, not a one-time import.

## Rejected alternatives

- **Rewrite from scratch:** rejected until a verified baseline identifies a blocker that cannot be addressed incrementally.
- **Microservices immediately:** rejected because they add network, deployment, and operational complexity before clear isolation or scale needs exist.
- **One universal education taxonomy:** rejected because national systems have distinct classifications and equivalencies.
- **Mock success for incomplete integrations:** rejected because it misleads users and hides integration gaps.
- **Production embedded database fallback:** rejected because production persistence must be durable and operationally controlled.

## Acceptance criteria

- CI can distinguish a passing check from a blocked or unrun check.
- Production database selection is explicit and cannot silently fall back to embedded storage.
- Every external integration exposes an honest connection state and has contract tests.
- Imported academic records retain source provenance and verification state.
- Consequential operations enforce authorization and idempotency on the server.
- Product and navigation invariants remain covered by tests or a review checklist.
- Production changes require isolated staging verification and a rollback plan.

## Revisit when

Revisit the modular-monolith decision only when measured scaling, security isolation, availability, or team-ownership requirements justify a separately deployed service. Revisit storage choices only through an explicit ADR supported by migration and recovery evidence.
