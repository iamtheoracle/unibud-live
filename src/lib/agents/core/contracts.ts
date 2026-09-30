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
  source: AgentId | 'user' | 'system';
  target: AgentId;
  intent: string;
  input: unknown;
  context?: Record<string, unknown>;
  requiredCapabilities?: string[];
  traceId: string;
}

export interface AgentResponse {
  requestId: string;
  agent: AgentId;
  status: 'completed' | 'partial' | 'blocked' | 'unavailable' | 'failed';
  output?: unknown;
  evidence?: unknown[];
  next?: AgentId[];
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
