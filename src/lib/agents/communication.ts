import type { OrganizationAgentId } from './specialists/definitions.ts';
import { getOrganizationAgent } from './organization.ts';
import { ORGANIZATIONAL_COMMUNICATION, type CommunicationMode } from './organization-culture.ts';

export interface AgentMessage {
  from: OrganizationAgentId;
  to: OrganizationAgentId;
  mediatedBy: 'spark';
  mode: CommunicationMode;
  subject: string;
  context: string;
  request?: string;
  evidence?: readonly string[];
  expectedReturn?: string;
  sharedGoal: string;
}

export interface AgentConversation {
  messages: readonly AgentMessage[];
  sharedGoal: string;
  resolved: boolean;
}

function areDeclaredColleagues(from: OrganizationAgentId, to: OrganizationAgentId): boolean {
  const source = getOrganizationAgent(from);
  const target = getOrganizationAgent(to);
  if (!source || !target) return false;
  return source.collaborators.includes(to) || target.collaborators.includes(from);
}

export function createAgentMessage(input: {
  from: OrganizationAgentId;
  to: OrganizationAgentId;
  mode: CommunicationMode;
  subject: string;
  context: string;
  request?: string;
  evidence?: readonly string[];
  expectedReturn?: string;
}): AgentMessage {
  if (input.from === 'bud' && input.to !== 'spark') throw new Error('Bud sends internal work through Spark.');
  if (input.to === 'bud' && input.from !== 'spark') throw new Error('Only Spark may return internal work to Bud.');
  if (input.from === input.to) throw new Error('An agent cannot create a colleague handoff to itself.');
  if (!areDeclaredColleagues(input.from, input.to)) {
    throw new Error('The handoff is outside the declared organizational collaboration graph.');
  }
  if (!ORGANIZATIONAL_COMMUNICATION.includes(input.mode)) {
    throw new Error(`Unsupported organizational communication mode: ${input.mode}`);
  }
  if (!input.subject.trim() || !input.context.trim()) {
    throw new Error('Internal communication requires a subject and context.');
  }
  return {
    ...input,
    mediatedBy: 'spark',
    sharedGoal: 'Solve the user-authorized objective accurately, safely and without fabrication.',
  };
}

export function continueConversation(conversation: AgentConversation, message: AgentMessage): AgentConversation {
  if (message.mediatedBy !== 'spark') throw new Error('Internal colleague communication must be mediated by Spark.');
  if (message.sharedGoal !== conversation.sharedGoal) throw new Error('Colleagues cannot silently change the shared goal during a handoff.');
  return { ...conversation, messages: [...conversation.messages, message] };
}
