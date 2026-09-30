import test from 'node:test';
import assert from 'node:assert/strict';
import {
  runAgentAcceptanceSuite,
  assertSafetyAndContextBoundaries,
  assertColleagueCommunication,
} from './acceptance.ts';

test('real-work acceptance scenarios pass through Spark', () => {
  const results = runAgentAcceptanceSuite();
  assert.equal(results.length, 8);
  assert.ok(results.every((result) => result.passed), results.map((result) => `${result.name}: ${result.reason ?? result.status}`).join('\n'));
});

test('safety and context boundaries hold under acceptance conditions', () => {
  assert.doesNotThrow(assertSafetyAndContextBoundaries);
});

test('colleague consultation and graph enforcement hold', () => {
  assert.doesNotThrow(assertColleagueCommunication);
});
