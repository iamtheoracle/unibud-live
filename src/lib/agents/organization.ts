import { CORE_AGENTS } from './core/definitions.ts';
import { CORE_DUTIES } from './core/duties.ts';
import { CORE_RELATIONSHIPS } from './core/relationships.ts';
import { SPECIALIST_AGENTS, type OrganizationAgentId, type SpecialistDefinition } from './specialists/definitions.ts';

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

const dutyById = new Map(CORE_DUTIES.map((duty) => [duty.id, duty]));
const collaboratorById = new Map<OrganizationAgentId, OrganizationAgentId[]>();
for (const relationship of CORE_RELATIONSHIPS) {
  const current = collaboratorById.get(relationship.from) ?? [];
  if (!current.includes(relationship.to)) current.push(relationship.to);
  collaboratorById.set(relationship.from, current);
}

const core: OrganizationAgent[] = CORE_AGENTS.map((agent) => {
  const duty = dutyById.get(agent.id);
  return {
    ...agent,
    category: 'core',
    mission: duty?.mission ?? agent.role,
    duties: [...(duty?.duties ?? [])],
    mustKnowBeforeRouting: [...(duty?.mustKnowBeforeRouting ?? [])],
    mustNotAssume: [...(duty?.mustNotAssume ?? [])],
    boundaries: [...agent.boundaries],
    collaborators: [...(collaboratorById.get(agent.id) ?? [])],
  };
});

const specialist: OrganizationAgent[] = SPECIALIST_AGENTS.map((agent: SpecialistDefinition) => ({
  id: agent.id,
  name: agent.name,
  category: 'specialist',
  role: agent.role,
  mission: agent.mission,
  duties: [...agent.duties],
  mustKnowBeforeRouting: [...agent.mustKnowBeforeRouting],
  mustNotAssume: [...agent.mustNotAssume],
  capabilities: [...agent.capabilities],
  boundaries: [...agent.mustNotAssume],
  collaborators: [...agent.collaborators],
  userFacing: false,
}));

export const ORGANIZATION_AGENTS: readonly OrganizationAgent[] = [...core, ...specialist];

const byId = new Map<OrganizationAgentId, OrganizationAgent>(
  ORGANIZATION_AGENTS.map((agent) => [agent.id, agent]),
);

export function getOrganizationAgent(id: OrganizationAgentId): OrganizationAgent | undefined {
  return byId.get(id);
}

export function hasOrganizationAgent(id: string): id is OrganizationAgentId {
  return byId.has(id as OrganizationAgentId);
}

export function organizationHealth(): { total: number; core: number; specialists: number; userFacing: number; complete: boolean } {
  const complete = ORGANIZATION_AGENTS.every((agent) =>
    Boolean(agent.mission && agent.duties.length && agent.capabilities.length && agent.boundaries.length)
  );
  return {
    total: ORGANIZATION_AGENTS.length,
    core: core.length,
    specialists: specialist.length,
    userFacing: ORGANIZATION_AGENTS.filter((agent) => agent.userFacing).length,
    complete,
  };
}
