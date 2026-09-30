import type { AgentId } from './core/contracts';
import { CORE_AGENTS } from './core/definitions';
import { SPECIALIST_AGENTS, type OrganizationAgentId, type SpecialistDefinition } from './specialists/definitions';

export interface OrganizationAgent {
  id: OrganizationAgentId;
  name: string;
  category: 'core' | 'specialist';
  role: string;
  mission: string;
  duties: string[];
  mustKnowBeforeRouting: string[];
  mustNotAssume: string[];
  capabilities: string[];
  boundaries: string[];
  collaborators: OrganizationAgentId[];
  userFacing: boolean;
}

const core = CORE_AGENTS.map((agent) => ({
  ...agent,
  category: 'core' as const,
  mission: agent.role,
  duties: [] as string[],
  mustKnowBeforeRouting: [] as string[],
  mustNotAssume: agent.boundaries,
  collaborators: [] as OrganizationAgentId[],
  boundaries: agent.boundaries,
}));

const specialist = SPECIALIST_AGENTS.map((agent: SpecialistDefinition) => ({
  id: agent.id,
  name: agent.name,
  category: 'specialist' as const,
  role: agent.role,
  mission: agent.mission,
  duties: agent.duties,
  mustKnowBeforeRouting: agent.mustKnowBeforeRouting,
  mustNotAssume: agent.mustNotAssume,
  capabilities: agent.capabilities,
  boundaries: agent.mustNotAssume,
  collaborators: agent.collaborators,
  userFacing: false,
}));

export const ORGANIZATION_AGENTS: readonly OrganizationAgent[] = [
  ...core.map((agent) => ({ ...agent, capabilities: agent.capabilities })),
  ...specialist,
];

const byId = new Map<OrganizationAgentId, OrganizationAgent>(
  ORGANIZATION_AGENTS.map((agent) => [agent.id, agent]),
);

export function getOrganizationAgent(id: OrganizationAgentId): OrganizationAgent | undefined {
  return byId.get(id);
}

export function hasOrganizationAgent(id: string): id is OrganizationAgentId {
  return byId.has(id as OrganizationAgentId);
}
