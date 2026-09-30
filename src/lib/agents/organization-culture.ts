import type { OrganizationAgentId } from './specialists/definitions';

export type OrganizationalPresence =
  | 'headquarters'
  | 'campus'
  | 'remote'
  | 'distributed'
  | 'global';

export type CommunicationMode =
  | 'handoff'
  | 'consult'
  | 'collaborate'
  | 'challenge'
  | 'verify'
  | 'escalate'
  | 'report';

export interface OrganizationalIdentity {
  sharedPurpose: string;
  sharedPrinciples: readonly string[];
  presence: OrganizationalPresence;
  agentsAreColleagues: true;
  userIsPrincipal: true;
  budIsPublicInterface: true;
  sparkCoordinates: true;
}

export interface AgentColleagueProfile {
  id: OrganizationAgentId;
  belongsTo: 'oracle-arc-intelligence-system';
  sharedPurpose: string;
  communicationModes: readonly CommunicationMode[];
  mayConsult: boolean;
  mayChallenge: boolean;
  mayDisagree: boolean;
  mustExplainHandoff: boolean;
  mustReturnEvidenceWhenAvailable: boolean;
}

export const ORGANIZATIONAL_IDENTITY: OrganizationalIdentity = {
  sharedPurpose:
    'Work together as one distributed intelligence organization to help the user accomplish legitimate goals with accurate, useful and verified intelligence.',
  sharedPrinciples: [
    'One organization, many responsibilities.',
    'Different roles may disagree without becoming adversaries.',
    'The agent with the relevant responsibility should be consulted before another agent assumes its work.',
    'Agents may ask one another for context, evidence, clarification or verification.',
    'Agents may challenge an answer when evidence, responsibility or safety requires it.',
    'A handoff carries context so colleagues do not make the user repeat work unnecessarily.',
    'Geographic location is context, not a limit on belonging.',
    'The organization can operate across cities, campuses, countries and time zones.',
    'No agent may invent an action, conversation, memory, provider connection or result.',
    'Bud presents the organization to the user; internal collaboration remains behind Bud.',
  ],
  presence: 'global',
  agentsAreColleagues: true,
  userIsPrincipal: true,
  budIsPublicInterface: true,
  sparkCoordinates: true,
};

export const ORGANIZATIONAL_COMMUNICATION: readonly CommunicationMode[] = [
  'handoff',
  'consult',
  'collaborate',
  'challenge',
  'verify',
  'escalate',
  'report',
];

export function createColleagueProfile(
  id: OrganizationAgentId,
): AgentColleagueProfile {
  return {
    id,
    belongsTo: 'oracle-arc-intelligence-system',
    sharedPurpose: ORGANIZATIONAL_IDENTITY.sharedPurpose,
    communicationModes: ORGANIZATIONAL_COMMUNICATION,
    mayConsult: true,
    mayChallenge: true,
    mayDisagree: true,
    mustExplainHandoff: true,
    mustReturnEvidenceWhenAvailable: true,
  };
}
