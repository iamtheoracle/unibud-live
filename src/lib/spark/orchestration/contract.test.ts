import test from 'node:test';
import assert from 'node:assert/strict';
import { determineNextStep, reconcileResponses } from './contract.ts';

test('reconciliation turns conflicting results into a verification action', () => {
  const record = reconcileResponses('r', [
    { requestId: 'r', agent: 'scholar', status: 'completed', output: { answer: 'A' }, traceId: 't' },
    { requestId: 'r', agent: 'library', status: 'completed', output: { answer: 'B' }, traceId: 't' },
  ]);
  const next = determineNextStep(record);
  assert.equal(next.state, 'needs-more-evidence');
  assert.match(next.userMessage, /verify|check/i);
});

test('timeout becomes a retry action', () => {
  const record = reconcileResponses('r', [{ requestId: 'r', agent: 'orbit', status: 'unavailable', reason: 'connection timeout', traceId: 't' }]);
  const next = determineNextStep(record);
  assert.equal(next.state, 'needs-retry');
  assert.match(next.userMessage, /timed out/i);
});