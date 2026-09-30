import { ORGANIZATION_AGENTS, type OrganizationAgent } from './organization.ts';
import { collaborationAudit, collaboratorsOf } from './collaboration.ts';
import { validateAgentOrganization } from './implementation.ts';
import type { OrganizationAgentId } from './specialists/definitions.ts';

export type AgentActivationState = 'ready' | 'blocked';

export interface AgentActivationRecord {
  id: OrganizationAgentId;
  state: AgentActivationState;
  userFacing: boolean;
  lifecycle: 'organization-lifecycle';
  collaborators: OrganizationAgentId[];
  reason?: string;
}

export interface ActivationAudit {
  total: number;
  ready: number;
  blocked: OrganizationAgentId[];
  complete: boolean;
}

function readyRecord(agent: OrganizationAgent): AgentActivationRecord {
  const collaborators = collaboratorsOf(agent.id);
  const blockedReasons: string[] = [];

  if (!agent.mission) blockedReasons.push('missing mission');
  if (!agent.duties.length) blockedReasons.push('missing duties');
  if (!agent.capabilities.length) blockedReasons.push('missing capabilities');
  if (!agent.boundaries.length) blockedReasons.push('missing boundaries');
  if (!collaborators.length) blockedReasons.push('missing collaboration');

  return {
    id: agent.id,
    state: blockedReasons.length ? 'blocked' : 'ready',
    userFacing: agent.userFacing,
    lifecycle: 'organization-lifecycle',
    collaborators,
    ...(blockedReasons.length ? { reason: blockedReasons.join('; ') } : {}),
  };
}

export const AGENT_ACTIVATION_REGISTRY: readonly AgentActivationRecord[] =
  ORGANIZATION_AGENTS.map(readyRecord);

export function activationAudit(): ActivationAudit {
  const implementation = validateAgentOrganization();
  const collaboration = collaborationAudit();
  const blocked = AGENT_ACTIVATION_REGISTRY
    .filter((record) => record.state !== 'ready')
    .map((record) => record.id);

  const complete =
    implementation.complete &&
    collaboration.complete &&
    blocked.length === 0;

  return {
    total: AGENT_ACTIVATION_REGISTRY.length,
    ready: AGENT_ACTIVATION_REGISTRY.filter((record) => record.state === 'ready').length,
    blocked,
    complete,
  };
}

export function assertAgentsReadyForActivation(): void {
  const audit = activationAudit();
  if (!audit.complete) {
    throw new Error(
      `Agent activation readiness failed: ready=${audit.ready}/${audit.total}; blocked=${audit.blocked.join(',')}`,
    );
  }
}
