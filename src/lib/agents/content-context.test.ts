import test from 'node:test';
import assert from 'node:assert/strict';
import { assessContentContext } from './content-context.ts';

test('legitimate anatomy study is not automatically classified as sexual content', () => {
  const result = assessContentContext({ purpose: 'study biology', subject: 'human reproductive anatomy', requestedAction: 'label the anatomical structures' });
  assert.equal(result.educational, true);
  assert.equal(result.anatomicalRepresentationAllowedByContext, true);
  assert.equal(result.context, 'academic-anatomy');
});

test('explicit sexual purpose is distinguished from academic anatomy', () => {
  const result = assessContentContext({ purpose: 'sexual arousal', subject: 'human body' });
  assert.equal(result.educational, false);
  assert.equal(result.requiresSafetyReview, true);
});

test('unclear purpose is escalated for safety review rather than guessed', () => {
  const result = assessContentContext({ subject: 'human body' });
  assert.equal(result.context, 'unknown');
  assert.equal(result.requiresSafetyReview, true);
});