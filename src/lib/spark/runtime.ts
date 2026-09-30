import type { AgentRequest, AgentResponse } from '../agents/core/contracts.ts';
import { executeAgent, type AgentExecutionContext } from '../agents/runtime.ts';
import { reconcileResponses, type ReconciliationRecord } from './orchestration/contract.ts';
import { routeByResponsibility, type RouteRequest } from './routing/responsibility.ts';

export interface SparkExecutionResult {
  status: AgentResponse['status'];
  budMessage: string;
  reconciliation: ReconciliationRecord;
  internalTrace: readonly string[];
}

export function executeThroughSpark(input: { request: AgentRequest; route: RouteRequest; authorizedContext?: Record<string, unknown>; availableCapabilities?: readonly string[]; network?: AgentExecutionContext['network']; authorization?: AgentExecutionContext['authorization']; }): SparkExecutionResult {
  const decision = routeByResponsibility(input.route);
  if (!decision) {
    const response: AgentResponse = { requestId: input.request.id, agent: 'spark', status: 'unavailable', reason: 'No registered responsibility matched the request.', next: ['bud'], traceId: input.request.traceId };
    return { status: response.status, budMessage: 'I need a little more detail to work out the right way to help with that.', reconciliation: reconcileResponses(input.request.id, [response]), internalTrace: ['Spark could not select a registered responsibility.'] };
  }

  const targets = [decision.primary.agent, ...(decision.primary.verifyWith ?? []), ...decision.supporting.map((candidate) => candidate.agent)];
  const uniqueTargets = [...new Set(targets)];
  const responses: AgentResponse[] = [];
  const trace: string[] = [];

  for (const target of uniqueTargets) {
    const context: AgentExecutionContext = {
      request: { ...input.request, target },
      authorizedContext: input.authorizedContext ?? {},
      availableCapabilities: input.availableCapabilities ?? [],
      network: input.network,
      authorization: input.authorization,
    };
    const result = executeAgent(context);
    responses.push(result.response);
    trace.push(target + ':' + result.outcome);
  }

  const reconciliation = reconcileResponses(input.request.id, responses);
  const primary = responses[0];
  let budMessage = 'I have the request. I can continue once the required information or capability is available.';
  if (primary?.status === 'blocked') budMessage = 'I need permission before I can safely continue with that.';
  else if (primary?.status === 'unavailable') budMessage = 'I cannot complete that part here yet. I can continue when the required capability is available.';
  else if (primary?.status === 'completed' && reconciliation.verified) budMessage = 'I have worked through that and can give you the result.';
  else if (primary?.status === 'partial') budMessage = 'I have started working through that. I need one more step before I can give you a reliable result.';
  return { status: reconciliation.finalStatus, budMessage, reconciliation, internalTrace: trace };
}