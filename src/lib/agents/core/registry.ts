import { CORE_AGENTS } from './definitions';
import type { AgentDefinition, AgentId } from './contracts';

const byId = new Map<AgentId, AgentDefinition>(
  CORE_AGENTS.map((agent) => [agent.id, agent]),
);

export const agentRegistry = {
  all(): readonly AgentDefinition[] {
    return CORE_AGENTS;
  },
  get(id: AgentId): AgentDefinition | undefined {
    return byId.get(id);
  },
  has(id: AgentId): boolean {
    return byId.has(id);
  },
};
