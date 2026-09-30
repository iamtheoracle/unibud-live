import type { OrganizationAgentId } from './specialists/definitions';
import {
  ORGANIZATIONAL_COMMUNICATION,
  type CommunicationMode,
} from './organization-culture';

export interface AgentMessage {
  from: OrganizationAgentId;
  to: OrganizationAgentId;
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
  if (!ORGANIZATIONAL_COMMUNICATION.includes(input.mode)) {
    throw new Error(`Unsupported organizational communication mode: ${input.mode}`);
  }

  return {
    ...input,
    sharedGoal:
      'Solve the user-authorized objective accurately, safely and without fabrication.',
  };
}

export function continueConversation(
  conversation: AgentConversation,
  message: AgentMessage,
): AgentConversation {
  if (message.sharedGoal !== conversation.sharedGoal) {
    throw new Error('Colleagues cannot silently change the shared goal during a handoff.');
  }

  return {
    ...conversation,
    messages: [...conversation.messages, message],
  };
}
