import type { AgentHook, AgentRequest, AgentResponse } from '../core/contracts';
import type { OrganizationAgentId } from '../specialists/definitions';

export interface ExecutionEnvelope {
  request: AgentRequest;
  agent: OrganizationAgentId;
  hook: AgentHook;
  location?: Record<string, unknown>;
  runtime?: Record<string, unknown>;
  provider?: Record<string, unknown>;
}

export const ORGANIZATION_LIFECYCLE: readonly AgentHook[] = [
  'receive',
  'understand',
  'classify',
  'plan',
  'request',
  'execute',
  'verify',
  'handoff',
  'review',
  'return',
];

/**
 * The location/provider/runtime fields are deliberately optional and late-bound.
 * They describe where/how an already-selected responsibility is executed.
 */
export function assertRoutingPreconditions(
  request: AgentRequest,
  selectedAgent: OrganizationAgentId,
): void {
  if (!request.intent.trim()) throw new Error('Routing requires an intent.');
  if (!selectedAgent) throw new Error('Routing requires an identified responsibility owner.');
}

/**
 * A successful specialist result is not automatically user-facing.
 * Spark reconciles it before Bud presents the result.
 */
export function requiresSparkReconciliation(response: AgentResponse): boolean {
  return response.status !== 'failed' && response.status !== 'blocked';
}
