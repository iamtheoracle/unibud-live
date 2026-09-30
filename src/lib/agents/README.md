# Agent organization

The agent system is organized into:

- core: preserved primary identities
- specialists: domain intelligence roles
- services: operational/capability roles
- contracts: stable communication types
- hooks: lifecycle entry points
- relationships: routing/delegation graph
- registry: discoverable definitions
- organization: unified registration of every actually implemented identity
- spark: routing, handoff and reconciliation

## Implementation standard

A named agent is not executable merely because it appears in historical architecture.

Every implemented agent must have:
1. stable identity
2. mission
3. duties
4. pre-routing knowledge requirements
5. boundaries and non-assumptions
6. declared capabilities
7. lifecycle hooks
8. collaborator relationships
9. a stable request/response or service contract
10. registration in the organization

If a required provider, capability, permission or data source is absent, the agent must return an honest unavailable or blocked state. It must never simulate the missing capability.

Bud remains the only user-facing conversational AI. Internal agents work through Spark.

The older 52-role/crystal records remain historical architectural material until each role has a real implementation boundary.
