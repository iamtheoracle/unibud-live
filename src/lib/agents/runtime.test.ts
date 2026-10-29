import test from 'node:test';
import assert from 'node:assert/strict';
import { executeAgent, toBudMessage, buildAgentWorkPlan } from './runtime.ts';
import { ORGANIZATION_AGENTS } from './organization.ts';

const request = (target: any, input: unknown = 'Help with this', extra: any = {}) => ({ id: 'r1', source: 'spark', target, intent: 'support', input, traceId: 't1', ...extra });

test('Oracle is a registered operational intelligence role', () => {
  const result = executeAgent({ request: request('oracle'), authorizedContext: {}, availableCapabilities: ['research', 'knowledge'] });
  assert.equal(result.agent, 'oracle');
  assert.notEqual(result.outcome, 'failed');
  assert.ok(result.requiredAgents.includes('spark'));
});

test('all 51 registered agents have an executable behavior path', () => {
  for (const agent of ORGANIZATION_AGENTS) {
    const result = executeAgent({ request: request(agent.id), authorizedContext: {}, availableCapabilities: agent.capabilities });
    assert.notEqual(result.outcome, 'failed', agent.id);
    assert.equal(result.response.agent, agent.id);
  }
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

test('execute intent is blocked when authorization is unknown', () => {
  const result = executeAgent({
    request: request('navigator', 'Submit this action', { intent: 'execute' }),
    authorizedContext: {},
    availableCapabilities: ['workflow-execution'],
  });
  assert.equal(result.outcome, 'blocked');
  assert.equal(result.response.reason, 'authorization-unverified');
  assert.ok(result.requiredAgents.includes('guardian'));
});

test('action capabilities require explicit authorization even when intent is not execute', () => {
  const result = executeAgent({
    request: request('navigator', 'Open and submit', { requiredCapabilities: ['browser-actions'] }),
    authorizedContext: {},
    availableCapabilities: ['browser-actions'],
  });
  assert.equal(result.outcome, 'blocked');
  assert.equal(result.response.reason, 'authorization-unverified');
});

test('explicitly authorized execute intent can proceed to the execution planning stage', () => {
  const result = executeAgent({
    request: request('navigator', 'Submit this action', { intent: 'execute' }),
    authorizedContext: {},
    availableCapabilities: ['workflow-execution'],
    authorization: 'authorized',
  });
  assert.notEqual(result.outcome, 'blocked');
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