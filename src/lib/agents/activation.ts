import { ORGANIZATION_AGENTS, type OrganizationAgent } from './organization.ts';
import { collaborationAudit, collaboratorsOf } from './collaboration.ts';
import { validateAgentOrganization } from './implementation.ts';
import { executeAgent } from './runtime.ts';
import type { OrganizationAgentId } from './specialists/definitions.ts';

export type AgentActivationState = 'ready' | 'blocked';

export interface AgentActivationRecord {
  id: OrganizationAgentId;
  state: AgentActivationState;
  userFacing: boolean;
  lifecycle: 'organization-lifecycle';
  collaborators: OrganizationAgentId[];
  requestContract: 'structured';
  responseContract: 'structured';
  truthfulExecution: boolean;
  failureHandling: boolean;
  contextBoundary: boolean;
  verificationPath: boolean;
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
  if (!agent.mustKnowBeforeRouting.length) blockedReasons.push('missing routing knowledge');
  if (!agent.mustNotAssume.length) blockedReasons.push('missing stop conditions');
  if (!agent.capabilities.length) blockedReasons.push('missing capabilities');
  if (!agent.boundaries.length) blockedReasons.push('missing boundaries');
  if (!collaborators.length) blockedReasons.push('missing collaboration');

  const probe = executeAgent({
    request: {
      id: 'activation-probe',
      source: 'spark',
      target: agent.id,
      intent: 'activation readiness check',
      input: 'Validate the responsibility contract.',
      traceId: 'activation-probe',
      requiredCapabilities: [],
    },
    authorizedContext: {},
    availableCapabilities: agent.capabilities,
    network: 'online',
    authorization: 'authorized',
  });

  const truthfulExecution =
    probe.outcome !== 'failed' &&
    probe.response.agent === agent.id &&
    probe.response.traceId === 'activation-probe';

  const failureHandling =
    probe.outcome === 'needs-routing' ||
    probe.outcome === 'needs-verification' ||
    probe.outcome === 'needs-input' ||
    probe.outcome === 'unavailable' ||
    probe.outcome === 'blocked' ||
    probe.outcome === 'timed-out' ||
    probe.outcome === 'completed';

  const contextBoundary = agent.boundaries.length > 0 && agent.mustNotAssume.length > 0;
  const verificationPath = agent.id === 'bud' || agent.id === 'spark' || collaborators.length > 0;

  if (!truthfulExecution) blockedReasons.push('runtime execution probe failed');
  if (!failureHandling) blockedReasons.push('failure state has no supported next path');
  if (!contextBoundary) blockedReasons.push('context boundary incomplete');
  if (!verificationPath) blockedReasons.push('verification/collaboration path incomplete');

  return {
    id: agent.id,
    state: blockedReasons.length ? 'blocked' : 'ready',
    userFacing: agent.userFacing,
    lifecycle: 'organization-lifecycle',
    collaborators,
    requestContract: 'structured',
    responseContract: 'structured',
    truthfulExecution,
    failureHandling,
    contextBoundary,
    verificationPath,
    ...(blockedReasons.length ? { reason: blockedReasons.join('; ') } : {}),
  };
}

export function buildActivationRegistry(): readonly AgentActivationRecord[] {
  return ORGANIZATION_AGENTS.map(readyRecord);
}

export const AGENT_ACTIVATION_REGISTRY: readonly AgentActivationRecord[] =
  buildActivationRegistry();

export function activationAudit(): ActivationAudit {
  const implementation = validateAgentOrganization();
  const collaboration = collaborationAudit();
  const registry = buildActivationRegistry();
  const blocked = registry.filter((record) => record.state !== 'ready').map((record) => record.id);

  const exactlyOnePublicBoundary =
    registry.filter((record) => record.userFacing).map((record) => record.id).join(',') === 'bud';

  const contractsComplete = registry.every((record) =>
    record.requestContract === 'structured' &&
    record.responseContract === 'structured' &&
    record.truthfulExecution &&
    record.failureHandling &&
    record.contextBoundary &&
    record.verificationPath,
  );

  const complete =
    implementation.complete &&
    collaboration.complete &&
    exactlyOnePublicBoundary &&
    contractsComplete &&
    blocked.length === 0;

  return {
    total: registry.length,
    ready: registry.filter((record) => record.state === 'ready').length,
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
