import { assessContentContext } from './content-context.ts';
import { canAccessContext } from './context-access.ts';
import { createAgentMessage, continueConversation } from './communication.ts';
import { executeThroughSpark } from '../spark/runtime.ts';
import type { AgentRequest } from './core/contracts.ts';
import type { OrganizationAgentId } from './specialists/definitions.ts';

export interface AcceptanceCase {
  name: string;
  request: AgentRequest;
  domain: string;
  requiredCapabilities?: readonly string[];
  availableCapabilities?: readonly string[];
  network?: 'online' | 'fluctuating' | 'offline' | 'unknown';
  authorization?: 'authorized' | 'not-authorized' | 'unknown';
  expectedStatus: string;
  expectedTargets: readonly OrganizationAgentId[];
}

export interface AcceptanceResult {
  name: string;
  passed: boolean;
  status: string;
  targets: readonly OrganizationAgentId[];
  budMessage: string;
  reason?: string;
}

function request(id: string, intent: string, input: string, target: OrganizationAgentId = 'spark'): AgentRequest {
  return { id, source: 'user', target, intent, input, traceId: 'acceptance-' + id };
}

export const AGENT_ACCEPTANCE_CASES: readonly AcceptanceCase[] = [
  {
    name: 'academic-research-collaboration',
    request: request('academic-research', 'Explain an academic topic using research', 'Explain this topic and support the explanation with reliable research.'),
    domain: 'academic',
    requiredCapabilities: [],
    availableCapabilities: ['learning'],
    expectedStatus: 'partial',
    expectedTargets: ['scholar', 'atlas'],
  },
  {
    name: 'discovery-to-academic-review',
    request: request('discovery-review', 'Browse and discover academic sources', 'Find relevant sources and assess their academic usefulness.'),
    domain: 'discovery',
    requiredCapabilities: [],
    availableCapabilities: ['web-browsing'],
    expectedStatus: 'partial',
    expectedTargets: ['orbit', 'scholar'],
  },
  {
    name: 'action-with-authorization',
    request: request('authorized-action', 'Execute an authorized action', 'Complete the requested workflow action.'),
    domain: 'action',
    requiredCapabilities: [],
    availableCapabilities: ['browser-actions'],
    authorization: 'authorized',
    expectedStatus: 'partial',
    expectedTargets: ['navigator', 'guardian'],
  },
  {
    name: 'action-without-authorization',
    request: request('blocked-action', 'Execute an action', 'Complete the requested workflow action.'),
    domain: 'action',
    requiredCapabilities: [],
    availableCapabilities: ['browser-actions'],
    authorization: 'not-authorized',
    expectedStatus: 'blocked',
    expectedTargets: ['navigator', 'guardian'],
  },
  {
    name: 'provider-capability-unavailable',
    request: request('missing-capability', 'Browse external information', 'Find the requested information.'),
    domain: 'discovery',
    requiredCapabilities: ['web-browsing'],
    availableCapabilities: [],
    expectedStatus: 'unavailable',
    expectedTargets: ['orbit', 'scholar'],
  },
  {
    name: 'network-timeout',
    request: request('network-timeout', 'Research current information', 'Find the current information.'),
    domain: 'research',
    requiredCapabilities: [],
    availableCapabilities: ['research'],
    network: 'fluctuating',
    expectedStatus: 'unavailable',
    expectedTargets: ['oracle', 'atlas', 'guardian'],
  },
];

export function runAcceptanceCase(input: AcceptanceCase): AcceptanceResult {
  const result = executeThroughSpark({
    request: input.request,
    route: {
      intent: input.request.intent,
      domain: input.domain,
      requiredCapabilities: input.requiredCapabilities ? [...input.requiredCapabilities] : [],
    },
    availableCapabilities: input.availableCapabilities ? [...input.availableCapabilities] : [],
    network: input.network,
    authorization: input.authorization,
  });

  const traceTargets = result.internalTrace.map((entry) => entry.split(':')[0] as OrganizationAgentId);
  const targetsPresent = input.expectedTargets.every((target) => traceTargets.includes(target));
  const passed = result.status === input.expectedStatus && targetsPresent;

  return {
    name: input.name,
    passed,
    status: result.status,
    targets: traceTargets,
    budMessage: result.budMessage,
    ...(passed ? {} : { reason: 'Expected status/target collaboration was not observed.' }),
  };
}

export function runAgentAcceptanceSuite(): readonly AcceptanceResult[] {
  return AGENT_ACCEPTANCE_CASES.map(runAcceptanceCase);
}

export function assertAgentAcceptanceSuite(): void {
  const results = runAgentAcceptanceSuite();
  const failures = results.filter((result) => !result.passed);
  if (failures.length) {
    throw new Error(failures.map((failure) => `${failure.name}: ${failure.reason}`).join('\n'));
  }
}

export function assertSafetyAndContextBoundaries(): void {
  const anatomy = assessContentContext({
    purpose: 'biology study',
    subject: 'human anatomy',
    requestedAction: 'explain reproductive anatomy for a lecture',
  });
  if (!anatomy.educational || anatomy.requiresSafetyReview) throw new Error('Legitimate educational anatomy was incorrectly escalated.');

  const sexual = assessContentContext({ purpose: 'sexual arousal', subject: 'explicit sexual act' });
  if (!sexual.requiresSafetyReview) throw new Error('Explicit sexual purpose did not trigger safety review.');

  if (canAccessContext({ agent: 'orbit', scope: 'private-content', authorized: true, source: 'atlas' }).allowed) {
    throw new Error('Orbit received unauthorized private-content access.');
  }
  if (canAccessContext({ agent: 'scholar', scope: 'memory', authorized: true, source: 'atlas' }).allowed) {
    throw new Error('Scholar received unrestricted memory access.');
  }
}

export function assertColleagueCommunication(): void {
  const first = createAgentMessage({
    from: 'orbit',
    to: 'scholar',
    mode: 'consult',
    subject: 'Source review',
    context: 'A discovered source needs academic evaluation.',
  });
  const second = createAgentMessage({
    from: 'scholar',
    to: 'orbit',
    mode: 'report',
    subject: 'Academic evaluation',
    context: 'The source should be reviewed before presentation.',
  });
  const conversation = continueConversation(
    { messages: [first], sharedGoal: first.sharedGoal, resolved: false },
    second,
  );
  if (conversation.messages.length !== 2) throw new Error('Colleague communication did not persist through Spark mediation.');

  let blocked = false;
  try {
    createAgentMessage({
      from: 'orbit',
      to: 'payment_service',
      mode: 'consult',
      subject: 'Invalid route',
      context: 'This is intentionally outside the declared graph.',
    });
  } catch {
    blocked = true;
  }
  if (!blocked) throw new Error('Undeclared colleague communication was not blocked.');
}
