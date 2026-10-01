import test from 'node:test';
import assert from 'node:assert/strict';
import { inferSparkDomain } from './spark.ts';
import { executeThroughSpark } from '../spark/runtime.ts';
import type { AgentRequest } from '../agents/core/contracts.ts';

test('Bud boundary maps common student requests into canonical Spark domains', () => {
  assert.equal(inferSparkDomain('Look up current scholarship opportunities'), 'scholarships');
  assert.equal(inferSparkDomain('Take me to my timetable'), 'action');
  assert.equal(inferSparkDomain('Explain this biology topic'), 'academic');
});

test('Bud boundary executes through Spark without exposing internal routing in the returned message', () => {
  const request: AgentRequest = {
    id: 'bud-boundary-test',
    source: 'user',
    target: 'spark',
    intent: 'Explain an academic topic',
    input: 'Explain photosynthesis',
    traceId: 'bud-boundary-test',
  };
  const result = executeThroughSpark({
    request,
    route: { intent: request.intent, domain: inferSparkDomain(request.intent) },
    availableCapabilities: ['learning'],
    authorization: 'unknown',
  });
  assert.equal(result.status, 'partial');
  assert.doesNotMatch(result.budMessage, /Spark|Scholar|Atlas|Oracle|Navigator/);
});
