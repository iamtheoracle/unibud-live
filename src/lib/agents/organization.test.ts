import test from 'node:test';
import assert from 'node:assert/strict';
import { ORGANIZATION_AGENTS, organizationHealth } from './organization';
import { validateAgentOrganization } from './implementation';

test('the complete organization is registered', () => {
  const health = organizationHealth();
  assert.equal(health.total, 51);
  assert.equal(health.core, 16);
  assert.equal(health.specialists, 35);
  assert.equal(health.userFacing, 1);
  assert.equal(health.complete, true);
});

test('every registered agent has an implementation boundary', () => {
  const validation = validateAgentOrganization();
  assert.equal(validation.complete, true);
  assert.deepEqual(validation.missing, []);
  assert.equal(validation.implemented, 51);
});

test('Bud is the only user-facing agent', () => {
  const userFacing = ORGANIZATION_AGENTS.filter((agent) => agent.userFacing);
  assert.deepEqual(userFacing.map((agent) => agent.id), ['bud']);
});
