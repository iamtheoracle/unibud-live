# UNIBUD Agent System

This repository is the construction ground for the new portable agent organization.

## Principles

- Bud is the only user-facing conversational AI.
- Spark is the hidden orchestration layer.
- Agents retain distinct identities and responsibilities.
- Architect, Creator, Artist, Oracle, Scholar, Orbit, Coach, Community, Vision, Atlas, Pulse, Guardian, Voice, Navigator, Bud, and Spark are preserved as distinct core identities.
- The broader agent catalog may contain specialist and service roles; these are not automatically separate user-facing chatbots.
- A crystal is a durable architectural unit, boundary, relationship, or principle; it is not automatically an agent.
- Agents never fabricate capabilities, data, provider connections, actions, memories, money, or external results.
- Runtime, storage, AI providers, browser providers, and hosting platforms are adapters. Agent logic must not depend on a particular host.
- Existing repositories are source material. They are not copied wholesale into this architecture.

## Execution shape

User -> Bud -> Spark -> required agent(s) -> verification/reconciliation -> Spark -> Bud -> User

Each agent communicates through a stable contract and lifecycle hooks.

## Portability

The core system must remain portable across hosting/runtime environments. Environment-specific implementations belong under adapters and must not leak into agent contracts.

## Migration rule

Harvest verified implementations from existing repositories only after the receiving agent boundary exists. Preserve working behavior; do not import obsolete infrastructure or demo/fake data.
