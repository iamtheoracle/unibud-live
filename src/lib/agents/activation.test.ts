import test from 'node:test';
import assert from 'node:assert/strict';
import {
  activationAudit,
  AGENT_ACTIVATION_REGISTRY,
  assertAgentsReadyForActivation,
} from './activation.ts';

test('activation registry covers every registered role exactly once', () => {
  const audit = activationAudit();
  assert.equal(audit.total, 51);
  assert.equal(audit.ready, 51);
  assert.deepEqual(audit.blocked, []);
  assert.equal(audit.complete, true);

  const ids = AGENT_ACTIVATION_REGISTRY.map((record) => record.id);
  assert.equal(new Set(ids).size, 51);
  assert.equal(ids.filter((id) => id === 'bud').length, 1);
  assert.doesNotThrow(assertAgentsReadyForActivation);
});

test('every activated role has truthful execution, failure, context and verification paths', () => {
  for (const record of AGENT_ACTIVATION_REGISTRY) {
    assert.equal(record.state, 'ready', record.id);
    assert.equal(record.requestContract, 'structured', record.id);
    assert.equal(record.responseContract, 'structured', record.id);
    assert.equal(record.truthfulExecution, true, record.id);
    assert.equal(record.failureHandling, true, record.id);
    assert.equal(record.contextBoundary, true, record.id);
    assert.equal(record.verificationPath, true, record.id);
    assert.ok(record.collaborators.length > 0 || record.id === 'bud' || record.id === 'spark', record.id);
  }
});

test('only Bud crosses the public agent boundary', () => {
  const publicRoles = AGENT_ACTIVATION_REGISTRY.filter((record) => record.userFacing);
  assert.deepEqual(publicRoles.map((record) => record.id), ['bud']);
});
