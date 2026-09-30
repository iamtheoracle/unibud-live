import test from 'node:test';
import assert from 'node:assert/strict';
import { executeThroughSpark } from './runtime.ts';

test('Spark can coordinate a real multi-role execution without exposing the organization', () => {
  const result = executeThroughSpark({
    request: { id: 'r2', source: 'bud', target: 'spark', intent: 'research', input: 'Find academic information', traceId: 't2' },
    route: { domain: 'research', intent: 'research' },
    availableCapabilities: ['research', 'knowledge'],
  });
  assert.ok(result.internalTrace.length > 0);
  assert.equal(typeof result.budMessage, 'string');
  assert.doesNotMatch(result.budMessage, /Spark|Scholar|Orbit|Oracle/);
});

test('Spark gives Bud a supportive timeout state', () => {
  const result = executeThroughSpark({
    request: { id: 'r3', source: 'bud', target: 'spark', intent: 'discovery', input: 'Find this', traceId: 't3' },
    route: { domain: 'discovery', intent: 'browse' },
    availableCapabilities: ['web-browsing'],
    network: 'fluctuating',
  });
  assert.match(result.budMessage, /connection|timed|continue/i);
  assert.doesNotMatch(result.budMessage, /Orbit|Spark/);
});