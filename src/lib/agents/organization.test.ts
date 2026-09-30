import test from 'node:test';
import assert from 'node:assert/strict';
import { ORGANIZATION_AGENTS, organizationHealth } from './organization';
import { validateAgentOrganization } from './implementation';
import { collaborationAudit, collaboratorsOf } from './collaboration';
import { activationAudit } from './activation';

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

test('every agent participates in the organization collaboration graph', () => {
  const audit = collaborationAudit();
  assert.equal(audit.complete, true);
  assert.equal(audit.connected, audit.total);
  assert.deepEqual(audit.isolated, []);
  assert.deepEqual(audit.unknownTargets, []);
  assert.deepEqual(audit.onlyUserFacing, ['bud']);
  assert.equal(audit.activeReady.length, audit.total);
});

test('Orbit and Navigator retain distinct operational responsibilities', () => {
  const orbit = ORGANIZATION_AGENTS.find((agent) => agent.id === 'orbit');
  const navigator = ORGANIZATION_AGENTS.find((agent) => agent.id === 'navigator');
  assert.ok(orbit);
  assert.ok(navigator);
  assert.match(orbit.mission, /discovery|navigation/i);
  assert.match(navigator.mission, /action|navigation/i);
  assert.ok(collaboratorsOf('orbit').length > 0);
  assert.ok(collaboratorsOf('navigator').length > 0);
});

test('every agent is ready for activation at the organization boundary', () => {
  const audit = activationAudit();
  assert.equal(audit.complete, true);
  assert.equal(audit.ready, audit.total);
  assert.deepEqual(audit.blocked, []);
});
