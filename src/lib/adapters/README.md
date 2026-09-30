# Runtime-neutral adapters

Agents must not import hosting-provider SDKs, database clients, model SDKs, or browser implementations directly.

Adapters provide those capabilities behind stable interfaces.

Examples:

- AI/model adapter
- database adapter
- storage adapter
- search adapter
- browser adapter
- messaging adapter
- notification adapter
- payment adapter

A deployment may implement these adapters differently without changing the agent contracts.
