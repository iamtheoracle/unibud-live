import test from 'node:test';
import assert from 'node:assert/strict';
import { executeAgent, toBudMessage, buildAgentWorkPlan } from './runtime.ts';
import { ORGANIZATION_AGENTS } from './organization.ts';
import { listAgentDefinitions } from './registry.ts';

const request = (target: any, input: unknown = 'Help with this', extra: any = {}) => ({ id: 'r1', source: 'spark', target, intent: 'support', input, traceId: 't1', ...extra });

test('Oracle is a registered operational intelligence role', () => {
  const result = executeAgent({ request: request('oracle'), authorizedContext: {}, availableCapabilities: ['research', 'knowledge'] });
  assert.equal(result.agent, 'oracle');
  assert.notEqual(result.outcome, 'failed');
  assert.ok(result.requiredAgents.includes('spark'));
});

test('all registered agents have a structured runtime behavior path', () => {
  for (const agent of ORGANIZATION_AGENTS) {
    const result = executeAgent({ request: request(agent.id), authorizedContext: {}, availableCapabilities: agent.capabilities });
    assert.notEqual(result.outcome, 'failed', agent.id);
    assert.equal(result.response.agent, agent.id);
  }
});

test('every registry entry has an attached executable handler', () => {
  const definitions = listAgentDefinitions();
  assert.ok(definitions.length >= ORGANIZATION_AGENTS.length);
  const missing = definitions.filter((definition) => typeof definition.handler !== 'function').map((definition) => definition.id);
  assert.deepEqual(missing, [], 'agents must not be registered as names only');
});

test('external research agents do not claim to search without a connected tool', async () => {
  const definition = listAgentDefinitions().find((agent) => agent.id === 'orbit');
  assert.equal(typeof definition?.handler, 'function');
  const result = await definition!.handler!({ requestId: 'r-search', userId: 'test-user', prompt: 'Find current news' }, {
    requestId: 'r-search', now: new Date(0).toISOString(), userId: 'test-user', prompt: 'Find current news', context: {},
  });
  assert.equal(result.ok, false);
  assert.match(result.error ?? '', /connected search\/data tool/i);
  assert.match(result.error ?? '', /No source lookup was performed/i);
});

test('fluctuating connectivity is reported as a timeout, not ignorance', () => {
  const result = executeAgent({ request: request('orbit'), authorizedContext: {}, availableCapabilities: ['web-browsing'], network: 'fluctuating' });
  assert.equal(result.outcome, 'timed-out');
  assert.match(toBudMessage(result), /connection|timed out/i);
});

test('missing capability becomes a truthful next step', () => {
  const result = executeAgent({ request: request('navigator', 'Open the page', { requiredCapabilities: ['browser-actions'] }), authorizedContext: {}, availableCapabilities: [] });
  assert.equal(result.outcome, 'unavailable');
  assert.ok(result.nextActions.length > 0);
});

test('authorization failure is explicit and routes to Guardian', () => {
  const result = executeAgent({ request: request('payment_service', 'Make the payment', { requiredCapabilities: ['payments'] }), authorizedContext: {}, availableCapabilities: ['payments'], authorization: 'not-authorized' });
  assert.equal(result.outcome, 'blocked');
  assert.ok(result.requiredAgents.includes('guardian'));
});

test('Bud remains the only user-facing presentation boundary', () => {
  const nonBud = ORGANIZATION_AGENTS.filter((agent) => agent.id !== 'bud');
  assert.ok(nonBud.every((agent) => agent.userFacing === false));
});

test('every registered role produces a concrete work plan from its mission and duties', () => {
  for (const agent of ORGANIZATION_AGENTS) {
    const plan = buildAgentWorkPlan(agent.id, 'support the student request', agent.capabilities);
    assert.equal(plan.agent, agent.id);
    assert.ok(plan.selectedDuties.length > 0, agent.id);
    assert.ok(plan.requiredKnowledge.length > 0, agent.id);
    assert.ok(plan.stopConditions.length > 0, agent.id);
  }
});
