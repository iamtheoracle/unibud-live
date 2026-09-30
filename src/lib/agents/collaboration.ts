import {
  ORGANIZATION_AGENTS,
  type OrganizationAgent,
} from './organization';
import {
  CORE_RELATIONSHIPS,
  type AgentRelationship,
} from './core/relationships';
import {
  SPECIALIST_AGENTS,
  type OrganizationAgentId,
} from './specialists/definitions';

export interface CollaborationEdge {
  from: OrganizationAgentId;
  to: OrganizationAgentId;
  reason: string;
  mode: AgentRelationship['mode'] | 'collaborate';
}

export interface CollaborationAudit {
  total: number;
  connected: number;
  isolated: OrganizationAgentId[];
  unknownTargets: OrganizationAgentId[];
  invalidSources: OrganizationAgentId[];
  onlyUserFacing: OrganizationAgentId[];
  activeReady: OrganizationAgentId[];
  complete: boolean;
}

const specialistEdges: CollaborationEdge[] = SPECIALIST_AGENTS.flatMap((agent) =>
  agent.collaborators.map((to) => ({
    from: agent.id,
    to,
    reason: agent.role,
    mode: 'collaborate' as const,
  })),
);

export const ORGANIZATION_COLLABORATION: readonly CollaborationEdge[] = [
  ...CORE_RELATIONSHIPS,
  ...specialistEdges,
];

const known = new Set<OrganizationAgentId>(
  ORGANIZATION_AGENTS.map((agent) => agent.id),
);

function edgesFor(id: OrganizationAgentId): CollaborationEdge[] {
  return ORGANIZATION_COLLABORATION.filter(
    (edge) => edge.from === id || edge.to === id,
  );
}

export function collaboratorsOf(id: OrganizationAgentId): OrganizationAgentId[] {
  const result = new Set<OrganizationAgentId>();
  for (const edge of edgesFor(id)) {
    if (edge.from === id) result.add(edge.to);
    if (edge.to === id) result.add(edge.from);
  }
  return [...result];
}

export function collaborationAudit(): CollaborationAudit {
  const isolated = ORGANIZATION_AGENTS
    .filter((agent) => collaboratorsOf(agent.id).length === 0)
    .map((agent) => agent.id);

  const unknownTargets = ORGANIZATION_COLLABORATION
    .filter((edge) => !known.has(edge.to))
    .map((edge) => edge.to);

  const invalidSources = ORGANIZATION_COLLABORATION
    .filter((edge) => !known.has(edge.from))
    .map((edge) => edge.from);

  const onlyUserFacing = ORGANIZATION_AGENTS
    .filter((agent) => agent.userFacing)
    .map((agent) => agent.id);

  const activeReady = ORGANIZATION_AGENTS
    .filter((agent) =>
      agent.mission.length > 0 &&
      agent.duties.length > 0 &&
      agent.capabilities.length > 0 &&
      agent.boundaries.length > 0 &&
      collaboratorsOf(agent.id).length > 0,
    )
    .map((agent) => agent.id);

  return {
    total: ORGANIZATION_AGENTS.length,
    connected: activeReady.length,
    isolated,
    unknownTargets: [...new Set(unknownTargets)],
    invalidSources: [...new Set(invalidSources)],
    onlyUserFacing,
    activeReady,
    complete:
      isolated.length === 0 &&
      unknownTargets.length === 0 &&
      invalidSources.length === 0 &&
      onlyUserFacing.length === 1 &&
      activeReady.length === ORGANIZATION_AGENTS.length,
  };
}

export function assertOrganizationCollaboration(): void {
  const audit = collaborationAudit();
  if (!audit.complete) {
    throw new Error(
      [
        'Agent collaboration audit failed.',
        audit.isolated.length ? `isolated=${audit.isolated.join(',')}` : '',
        audit.unknownTargets.length ? `unknownTargets=${audit.unknownTargets.join(',')}` : '',
        audit.invalidSources.length ? `invalidSources=${audit.invalidSources.join(',')}` : '',
        audit.onlyUserFacing.length !== 1 ? `userFacing=${audit.onlyUserFacing.join(',')}` : '',
        `activeReady=${audit.activeReady.length}/${audit.total}`,
      ].filter(Boolean).join(' '),
    );
  }
}
