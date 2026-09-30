import type { AgentHook, AgentRequest, AgentResponse } from '../../agents/core/contracts';
import type { OrganizationAgentId } from '../../agents/specialists/definitions';

export interface Handoff {
  from: OrganizationAgentId;
  to: OrganizationAgentId;
  reason: string;
  requiredCapabilities: string[];
  context: Record<string, unknown>;
}

export interface ReconciliationRecord {
  requestId: string;
  responses: AgentResponse[];
  verified: boolean;
  conflicts: string[];
  evidence: unknown[];
  finalStatus: AgentResponse['status'];
}

export interface SparkExecution {
  request: AgentRequest;
  currentAgent: OrganizationAgentId;
  hook: AgentHook;
  handoffs: Handoff[];
  reconciliation?: ReconciliationRecord;
}

export function createHandoff(
  from: OrganizationAgentId,
  to: OrganizationAgentId,
  reason: string,
  requiredCapabilities: string[] = [],
  context: Record<string, unknown> = {},
): Handoff {
  return { from, to, reason, requiredCapabilities, context };
}

export function reconcileResponses(
  requestId: string,
  responses: AgentResponse[],
): ReconciliationRecord {
  const conflicts: string[] = [];
  const evidence = responses.flatMap((response) => response.evidence ?? []);
  const usable = responses.filter(
    (response) => response.status === 'completed' || response.status === 'partial',
  );

  if (usable.length === 0) {
    return {
      requestId,
      responses,
      verified: false,
      conflicts,
      evidence,
      finalStatus: responses.some((r) => r.status === 'blocked') ? 'blocked' : 'unavailable',
    };
  }

  const outputs = usable.map((response) => JSON.stringify(response.output));
  if (new Set(outputs).size > 1 && usable.length > 1) {
    conflicts.push('Multiple agent responses differ; Spark must resolve the discrepancy before return.');
  }

  return {
    requestId,
    responses,
    verified: conflicts.length === 0,
    conflicts,
    evidence,
    finalStatus: conflicts.length === 0 ? 'completed' : 'partial',
  };
}

export interface ReconciliationNextStep {
  state: 'resolved' | 'needs-more-evidence' | 'needs-user-input' | 'needs-permission' | 'needs-retry';
  action: string;
  userMessage: string;
}

export function determineNextStep(record: ReconciliationRecord): ReconciliationNextStep {
  if (record.finalStatus === 'blocked') return { state: 'needs-permission', action: 'Request the missing authorization through Guardian.', userMessage: 'I need permission before I can safely continue with that.' };
  if (record.responses.some((response) => response.reason === 'missing-user-input')) return { state: 'needs-user-input', action: 'Ask Bud for the missing information.', userMessage: 'I need one small detail from you before I can continue.' };
  if (record.responses.some((response) => response.reason && /timeout|connection/i.test(response.reason))) return { state: 'needs-retry', action: 'Retry after the connection stabilizes.', userMessage: 'The connection timed out before I could finish. Try again when it is stable, and I can continue.' };
  if (record.conflicts.length) return { state: 'needs-more-evidence', action: 'Request verification from the relevant responsibility and compare evidence before returning a result.', userMessage: 'I found information that does not line up yet. I need to check it before giving you a reliable answer.' };
  if (!record.verified) return { state: 'needs-more-evidence', action: 'Gather the missing evidence and reconcile again.', userMessage: 'I need to verify one more part before I give you the answer.' };
  return { state: 'resolved', action: 'Return the reconciled result to Bud.', userMessage: 'I have what I need to continue.' };
}