import type { AgentHook } from './core/contracts';
import { ORGANIZATION_AGENTS, organizationHealth } from './organization';
import { ORGANIZATION_LIFECYCLE } from '../spark/orchestration/lifecycle';

export interface AgentImplementation {
  id: string;
  hooks: readonly AgentHook[];
  contract: 'core-request-response' | 'specialist-contract';
  registered: boolean;
}

export const AGENT_IMPLEMENTATIONS: readonly AgentImplementation[] =
  ORGANIZATION_AGENTS.map((agent) => ({
    id: agent.id,
    hooks: ORGANIZATION_LIFECYCLE,
    contract: agent.category === 'core' ? 'core-request-response' : 'specialist-contract',
    registered: true,
  }));

export function validateAgentOrganization(): {
  total: number;
  implemented: number;
  missing: string[];
  complete: boolean;
} {
  const missing = ORGANIZATION_AGENTS
    .filter((agent) =>
      !agent.mission ||
      agent.duties.length === 0 ||
      agent.capabilities.length === 0 ||
      agent.boundaries.length === 0 ||
      !AGENT_IMPLEMENTATIONS.some((implementation) => implementation.id === agent.id),
    )
    .map((agent) => agent.id);

  const health = organizationHealth();
  return {
    total: health.total,
    implemented: AGENT_IMPLEMENTATIONS.length - missing.length,
    missing,
    complete: missing.length === 0 && health.complete,
  };
}
