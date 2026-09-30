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
