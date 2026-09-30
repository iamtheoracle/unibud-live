import test from 'node:test';
import assert from 'node:assert/strict';
import { ORGANIZATION_AGENTS } from './organization.ts';
import { canAccessContext, filterContextForAgent } from './context-access.ts';

test('every registered agent has a defined context boundary', () => {
  for (const agent of ORGANIZATION_AGENTS) {
    const result = canAccessContext({ agent: agent.id, scope: 'request', authorized: true, source: 'user' });
    assert.equal(result.allowed, true, agent.id);
  }
});

test('Orbit cannot access private user content merely because it browses', () => {
  const result = canAccessContext({ agent: 'orbit', scope: 'private-content', authorized: true, source: 'atlas' });
  assert.equal(result.allowed, false);
});

test('memory access is controlled by the continuity boundary', () => {
  assert.equal(canAccessContext({ agent: 'atlas', scope: 'memory', authorized: true, source: 'atlas' }).allowed, true);
  assert.equal(canAccessContext({ agent: 'orbit', scope: 'memory', authorized: true, source: 'atlas' }).allowed, false);
});

test('unauthorized context never passes through', () => {
  const result = filterContextForAgent('scholar', { request: 'ok', profile: 'private', memory: 'private' }, ['request']);
  assert.deepEqual(result, { request: 'ok' });
});