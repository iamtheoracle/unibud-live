# UNIBUD Agent System

This repository is the construction ground for the new portable agent organization.

## Principles

- Bud is the only user-facing conversational AI.
- Spark is the hidden orchestration layer.
- Agents retain distinct identities and responsibilities.
- Architect, Creator, Artist, Oracle, Scholar, Orbit, Coach, Community, Vision, Atlas, Pulse, Guardian, Voice, Navigator, Bud, and Spark are preserved as distinct core identities.
- The broader organization contains specialist and service roles. They are internal responsibility owners, not automatically separate user-facing chatbots.
- The current organization register contains 51 distinct role identities: 16 core identities plus 35 additional specialist/service identities. The older catalog's 37 entries include Architect and Artist, so those two are not double-counted here.
- A crystal is a durable architectural unit, boundary, relationship, or principle; it is not automatically an agent.
- Agents never fabricate capabilities, data, provider connections, actions, memories, money, or external results.
- Runtime, storage, AI providers, browser providers, and hosting platforms are adapters. Agent logic must not depend on a particular host.
- Existing repositories are source material. They are not copied wholesale into this architecture.

## Identity before routing

An agent's identity is established by its mission, duties, boundaries and capabilities before Spark routes work to it.

The order is:

Identity -> Mission -> Duties -> Boundaries -> Capabilities -> Hooks -> Relationships -> Routing -> Location/context -> Runtime/provider execution -> Verification -> Reconciliation

Location is execution metadata. It does not create an agent's identity or change its responsibility.

## Execution shape

User -> Bud -> Spark -> required agent(s) -> verification/reconciliation -> Spark -> Bud -> User

Each agent communicates through a stable contract and lifecycle hooks.

## Portability

The core system must remain portable across hosting/runtime environments. Environment-specific implementations belong under adapters and must not leak into agent contracts.

## Migration rule

Harvest verified implementations from existing repositories only after the receiving agent boundary exists. Preserve working behavior; do not import obsolete infrastructure or demo/fake data.
