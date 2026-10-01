import type { OrganizationAgentId } from './specialists/definitions.ts';
import { getAgentDefinition } from './registry.ts';
import type { AgentInput as LegacyAgentInput, AgentId as LegacyAgentId, AgentActivityState, AgentOutput as LegacyAgentOutput } from './contracts';
import type { ActivitySink } from './activity.ts';
import { activityEvent } from './activity';
import { getOrganizationAgent } from './organization.ts';
import type { AgentRequest, AgentResponse } from './core/contracts.ts';

export type AgentOutcome =
  | 'completed'
  | 'needs-input'
  | 'needs-routing'
  | 'needs-verification'
  | 'blocked'
  | 'unavailable'
  | 'timed-out'
  | 'failed';

export interface AgentExecutionContext {
  request: AgentRequest;
  authorizedContext: Record<string, unknown>;
  availableCapabilities: readonly string[];
  network?: 'online' | 'fluctuating' | 'offline' | 'unknown';
  authorization?: 'authorized' | 'not-authorized' | 'unknown';
}

export interface AgentExecutionResult {
  agent: OrganizationAgentId;
  outcome: AgentOutcome;
  message: string;
  nextActions: readonly string[];
  requiredAgents: readonly OrganizationAgentId[];
  evidence: readonly unknown[];
  userSafe: boolean;
  response: AgentResponse;
}

const capabilityAliases: Record<string, string[]> = {
  browse: ['web-browsing', 'discovery', 'exploration'],
  research: ['research', 'research-discovery', 'knowledge'],
  academic: ['learning', 'academic-reasoning', 'study-support'],
  action: ['browser-actions', 'workflow-execution', 'action-state'],
  visual: ['image-understanding', 'document-vision', 'video-understanding', 'visual-creation'],
  audio: ['speech', 'audio'],
};

function hasRequiredCapabilities(required: readonly string[], available: readonly string[]): boolean {
  if (!required.length) return true;
  return required.every((needed) =>
    available.includes(needed) ||
    (capabilityAliases[needed] ?? []).some((alias) => available.includes(alias)),
  );
}

export interface AgentWorkPlan {
  agent: OrganizationAgentId;
  responsibility: string;
  selectedDuties: readonly string[];
  requiredKnowledge: readonly string[];
  stopConditions: readonly string[];
  verificationAgents: readonly OrganizationAgentId[];
}

export function buildAgentWorkPlan(
  agentId: OrganizationAgentId,
  intent: string,
  requiredCapabilities: readonly string[] = [],
): AgentWorkPlan {
  const agent = getOrganizationAgent(agentId);
  if (!agent) throw new Error('Unregistered agent: ' + agentId);
  const normalizedIntent = intent.toLowerCase();
  const selectedDuties = agent.duties.filter((duty) =>
    normalizedIntent.split(/\s+/).some((word) => word.length > 3 && duty.toLowerCase().includes(word)),
  );
  return {
    agent: agent.id,
    responsibility: agent.mission,
    selectedDuties: selectedDuties.length ? selectedDuties : agent.duties.slice(0, Math.min(3, agent.duties.length)),
    requiredKnowledge: agent.mustKnowBeforeRouting,
    stopConditions: agent.mustNotAssume,
    verificationAgents: agent.collaborators.filter((id) =>
      requiredCapabilities.length === 0 ||
      requiredCapabilities.some((capability) => (getOrganizationAgent(id)?.capabilities ?? []).includes(capability)),
    ),
  };
}

function timeoutResult(agent: OrganizationAgentId, request: AgentRequest): AgentExecutionResult {
  const message = request.context?.['networkIssue']
    ? 'The connection fluctuated before the request could finish.'
    : 'The request timed out before the work could finish.';
  return {
    agent,
    outcome: 'timed-out',
    message,
    nextActions: ['Retry when the connection is stable.'],
    requiredAgents: ['spark'],
    evidence: [],
    userSafe: true,
    response: {
      requestId: request.id,
      agent,
      status: 'unavailable',
      reason: message,
      next: ['spark'],
      traceId: request.traceId,
    },
  };
}

export function executeAgent(context: AgentExecutionContext): AgentExecutionResult {
  const agent = getOrganizationAgent(context.request.target);
  if (!agent) {
    return {
      agent: context.request.target,
      outcome: 'failed',
      message: 'The requested responsibility is not registered.',
      nextActions: ['Route the request back through Spark for correction.'],
      requiredAgents: ['spark'],
      evidence: [],
      userSafe: false,
      response: {
        requestId: context.request.id,
        agent: context.request.target,
        status: 'failed',
        reason: 'unregistered-agent',
        next: ['spark'],
        traceId: context.request.traceId,
      },
    };
  }

  if (context.network === 'fluctuating' || context.network === 'offline') {
    return timeoutResult(agent.id, context.request);
  }

  if (context.authorization === 'not-authorized') {
    return {
      agent: agent.id,
      outcome: 'blocked',
      message: 'This action needs permission before it can continue.',
      nextActions: ['Request the required permission from the user or authorized system.'],
      requiredAgents: ['guardian'],
      evidence: [],
      userSafe: true,
      response: {
        requestId: context.request.id,
        agent: agent.id,
        status: 'blocked',
        reason: 'authorization-required',
        next: ['guardian'],
        traceId: context.request.traceId,
      },
    };
  }

  if (!hasRequiredCapabilities(context.request.requiredCapabilities ?? [], context.availableCapabilities)) {
    return {
      agent: agent.id,
      outcome: 'unavailable',
      message: 'The capability needed for this task is not available here.',
      nextActions: ['Route to another available capability or tell the user what capability is required.'],
      requiredAgents: ['spark'],
      evidence: [],
      userSafe: true,
      response: {
        requestId: context.request.id,
        agent: agent.id,
        status: 'unavailable',
        reason: 'required-capability-unavailable',
        next: ['spark'],
        traceId: context.request.traceId,
      },
    };
  }

  const inputText = typeof context.request.input === 'string'
    ? context.request.input.trim()
    : '';

  if (!inputText && context.request.intent !== 'execute') {
    return {
      agent: agent.id,
      outcome: 'needs-input',
      message: 'A small piece of information is needed before this can continue.',
      nextActions: ['Ask Bud to request the missing information from the user.'],
      requiredAgents: ['bud'],
      evidence: [],
      userSafe: true,
      response: {
        requestId: context.request.id,
        agent: agent.id,
        status: 'partial',
        next: ['bud'],
        reason: 'missing-user-input',
        traceId: context.request.traceId,
      },
    };
  }

  const workPlan = buildAgentWorkPlan(
    agent.id,
    context.request.intent,
    context.request.requiredCapabilities ?? [],
  );
  const requiredCollaborators = agent.collaborators.filter((id) =>
    (context.request.requiredCapabilities ?? []).some((capability) =>
      (getOrganizationAgent(id)?.capabilities ?? []).includes(capability),
    ),
  );
  const needsCollaboration =
    agent.id !== 'bud' &&
    agent.id !== 'spark' &&
    requiredCollaborators.length > 0;

  const completionMessage = agent.id === 'bud'
    ? 'Prepare the result in simple, supportive language for the student.'
    : 'The ' + agent.role.toLowerCase() + ' responsibility has been prepared; Spark can now verify, combine or continue the work.';

  const evidence = [{
    kind: 'execution-record',
    agent: agent.id,
    responsibility: workPlan.responsibility,
    selectedDuties: workPlan.selectedDuties,
    requiredKnowledge: workPlan.requiredKnowledge,
    requestId: context.request.id,
  }];

  return {
    agent: agent.id,
    outcome: needsCollaboration ? 'needs-verification' : 'needs-routing',
    message: completionMessage,
    nextActions: ['Return the result to Spark for verification, reconciliation or the next required step.'],
    requiredAgents: needsCollaboration ? ['spark', ...requiredCollaborators] : ['spark'],
    evidence,
    userSafe: agent.id === 'bud',
    response: {
      requestId: context.request.id,
      agent: agent.id,
      status: 'partial',
      output: {
        message: completionMessage,
        responsibility: workPlan.responsibility,
        selectedDuties: workPlan.selectedDuties,
        requiredKnowledge: workPlan.requiredKnowledge,
      },
      evidence,
      next: needsCollaboration ? ['spark', ...requiredCollaborators] : ['spark'],
      traceId: context.request.traceId,
    },
  };
}

export function toBudMessage(result: AgentExecutionResult): string {
  if (result.outcome === 'timed-out') return result.message;
  if (result.outcome === 'blocked') return (result.message + ' ' + (result.nextActions[0] ?? '')).trim();
  if (result.outcome === 'needs-input') return result.message;
  if (result.outcome === 'unavailable') return (result.message + ' ' + (result.nextActions[0] ?? '')).trim();
  return result.message;
}


/** Compatibility bridge for the existing Bud server while the application migrates to Spark's organization runtime. */
export type SpecialistExecution = {
  agentId: LegacyAgentId;
  status: AgentActivityState;
  output?: LegacyAgentOutput;
  error?: string;
};

export async function executeSpecialists(
  specialistIds: readonly LegacyAgentId[],
  input: LegacyAgentInput,
  sink: ActivitySink,
): Promise<SpecialistExecution[]> {
  const results: SpecialistExecution[] = [];
  for (const agentId of specialistIds) {
    await sink(activityEvent(input.requestId, input.userId, agentId, 'queued', 'queued'));
    const definition = getAgentDefinition(agentId);
    if (!definition?.handler) {
      const error = 'No executable provider-backed handler is registered for this responsibility.';
      await sink(activityEvent(input.requestId, input.userId, agentId, 'waiting', 'waiting', error));
      results.push({ agentId, status: 'waiting', error });
      continue;
    }
    await sink(activityEvent(input.requestId, input.userId, agentId, 'working', 'started'));
    try {
      const output = await definition.handler(input, {
        requestId: input.requestId,
        now: new Date().toISOString(),
        userId: input.userId,
        prompt: input.prompt,
        context: input.context ?? {},
      });
      const status: AgentActivityState = output.ok ? 'completed' : 'failed';
      await sink(activityEvent(input.requestId, input.userId, agentId, status, output.ok ? 'completed' : 'failed', output.error ?? output.summary));
      results.push({ agentId, status, output, error: output.error });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Specialist execution failed.';
      await sink(activityEvent(input.requestId, input.userId, agentId, 'failed', 'failed', message));
      results.push({ agentId, status: 'failed', error: message });
    }
  }
  return results;
}
