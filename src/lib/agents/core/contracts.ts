export type AgentId =
  | 'bud'
  | 'spark'
  | 'oracle'
  | 'architect'
  | 'scholar'
  | 'orbit'
  | 'coach'
  | 'community'
  | 'vision'
  | 'creator'
  | 'artist'
  | 'atlas'
  | 'pulse'
  | 'guardian'
  | 'voice'
  | 'navigator';

import type { OrganizationAgentId } from '../specialists/definitions.ts';

export type AgentHook =
  | 'receive'
  | 'understand'
  | 'classify'
  | 'plan'
  | 'request'
  | 'execute'
  | 'verify'
  | 'handoff'
  | 'review'
  | 'return';

export interface AgentRequest {
  id: string;
  source: OrganizationAgentId | 'user' | 'system';
  target: OrganizationAgentId;
  intent: string;
  input: unknown;
  context?: Record<string, unknown>;
  requiredCapabilities?: string[];
  traceId: string;
}

export interface AgentResponse {
  requestId: string;
  agent: OrganizationAgentId;
  status: 'completed' | 'partial' | 'blocked' | 'unavailable' | 'failed';
  output?: unknown;
  evidence?: unknown[];
  next?: OrganizationAgentId[];
  reason?: string;
  traceId: string;
}

export interface AgentDefinition {
  id: AgentId;
  name: string;
  role: string;
  userFacing: boolean;
  hooks: AgentHook[];
  capabilities: string[];
  boundaries: string[];
}
