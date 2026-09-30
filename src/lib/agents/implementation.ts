import type { AgentHook } from './core/contracts.ts';
import { ORGANIZATION_AGENTS, organizationHealth } from './organization.ts';
import { ORGANIZATION_LIFECYCLE } from '../spark/orchestration/lifecycle.ts';
import { collaboratorsOf, collaborationAudit } from './collaboration.ts';
import { BUD_RESPONSE_POLICY } from './response-policy.ts';

export interface AgentImplementation {
  id: string;
  hooks: readonly AgentHook[];
  contract: 'core-request-response' | 'specialist-contract';
  registered: boolean;
  communicationContract: true;
  noRoleplayBoundary: true;
  collaborationReady: boolean;
}

export const AGENT_IMPLEMENTATIONS: readonly AgentImplementation[] =
  ORGANIZATION_AGENTS.map((agent) => ({
    id: agent.id,
    hooks: ORGANIZATION_LIFECYCLE,
    contract: agent.category === 'core' ? 'core-request-response' : 'specialist-contract',
    registered: true,
    communicationContract: true,
    noRoleplayBoundary: true,
    collaborationReady: collaboratorsOf(agent.id).length > 0,
  }));

export function validateAgentOrganization(): {
  total: number;
  implemented: number;
  missing: string[];
  complete: boolean;
} {
  const collaboration = collaborationAudit();

  const missing = ORGANIZATION_AGENTS
    .filter((agent) =>
      !agent.mission ||
      agent.duties.length === 0 ||
      agent.capabilities.length === 0 ||
      agent.boundaries.length === 0 ||
      !AGENT_IMPLEMENTATIONS.some((implementation) => implementation.id === agent.id) ||
      !AGENT_IMPLEMENTATIONS.find((implementation) => implementation.id === agent.id)?.communicationContract ||
      !AGENT_IMPLEMENTATIONS.find((implementation) => implementation.id === agent.id)?.noRoleplayBoundary ||
      !AGENT_IMPLEMENTATIONS.find((implementation) => implementation.id === agent.id)?.collaborationReady,
    )
    .map((agent) => agent.id);

  const health = organizationHealth();
  const budContract =
    BUD_RESPONSE_POLICY.userFacingAgent === 'bud' &&
    BUD_RESPONSE_POLICY.orchestrationAgent === 'spark' &&
    BUD_RESPONSE_POLICY.neverRoleplayInternalAgents &&
    BUD_RESPONSE_POLICY.neverExposeInternalRouting;

  return {
    total: health.total,
    implemented: AGENT_IMPLEMENTATIONS.length - missing.length,
    missing,
    complete: missing.length === 0 && health.complete && collaboration.complete && budContract,
  };
}
