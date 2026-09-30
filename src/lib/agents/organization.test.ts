import test from 'node:test';
import assert from 'node:assert/strict';
import { ORGANIZATION_AGENTS, organizationHealth } from './organization.ts';
import { validateAgentOrganization } from './implementation.ts';
import { collaborationAudit, collaboratorsOf } from './collaboration.ts';
import { activationAudit } from './activation.ts';
import { ORGANIZATIONAL_IDENTITY, createColleagueProfile } from './organization-culture.ts';
import { createAgentMessage, continueConversation } from './communication.ts';

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
  assert.deepEqual(audit.invalidSources, []);
  assert.deepEqual(audit.onlyUserFacing, ['bud']);
  assert.equal(audit.activeReady.length, audit.total);
});

test('Orbit and Navigator retain distinct operational responsibilities', () => {
  const orbit = ORGANIZATION_AGENTS.find((agent) => agent.id === 'orbit');
  const navigator = ORGANIZATION_AGENTS.find((agent) => agent.id === 'navigator');
  assert.ok(orbit);
  assert.ok(navigator);
  assert.match(orbit.mission, /discovery|browse/i);
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

test('agents belong to one distributed organization with one shared purpose', () => {
  assert.equal(ORGANIZATIONAL_IDENTITY.agentsAreColleagues, true);
  assert.equal(ORGANIZATIONAL_IDENTITY.userIsPrincipal, true);
  assert.equal(ORGANIZATIONAL_IDENTITY.presence, 'global');

  const orbit = createColleagueProfile('orbit');
  const navigator = createColleagueProfile('navigator');
  assert.equal(orbit.sharedPurpose, navigator.sharedPurpose);
  assert.equal(orbit.mayConsult, true);
  assert.equal(orbit.mayChallenge, true);
  assert.equal(orbit.mayDisagree, true);
});

test('colleagues can communicate without becoming user-facing agents', () => {
  const first = createAgentMessage({
    from: 'orbit',
    to: 'scholar',
    mode: 'consult',
    subject: 'Discovery context',
    context: 'A discovered source may contain academic information.',
    request: 'Review the academic relevance.',
  });

  const second = createAgentMessage({
    from: 'scholar',
    to: 'orbit',
    mode: 'report',
    subject: 'Academic relevance',
    context: 'The source should be evaluated for academic relevance before presentation.',
    evidence: ['source-review-required'],
  });

  const conversation = continueConversation(
    { messages: [first], sharedGoal: first.sharedGoal, resolved: false },
    second,
  );

  assert.equal(conversation.messages.length, 2);
  assert.equal(conversation.messages[1].from, 'scholar');
});
