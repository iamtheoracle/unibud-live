import test from 'node:test';
import assert from 'node:assert/strict';
import { BUD_RESPONSE_POLICY, BUD_SUPPORT_LANGUAGE, assertNoRoleplay, assertBudUserFacingText, buildBudPresentationContract, collectAuthorizedPersonalizationSignals } from './response-policy.ts';

test('Bud and Spark own the simplification boundary', () => {
  assert.equal(BUD_RESPONSE_POLICY.userFacingAgent, 'bud');
  assert.equal(BUD_RESPONSE_POLICY.orchestrationAgent, 'spark');
  assert.equal(BUD_RESPONSE_POLICY.neverRoleplayInternalAgents, true);
  assert.equal(BUD_RESPONSE_POLICY.neverExposeInternalRouting, true);
  assert.equal(BUD_RESPONSE_POLICY.maxSentenceWords, 18);
});

test('personalization uses authorized user context and can be disabled', () => {
  const signals = collectAuthorizedPersonalizationSignals({
    explicitProfile: { level: '200' },
    conversationHistory: ['Explain this simply.'],
    userAuthoredContent: ['My goal is to build.'],
    consentedPersonalization: true,
  });
  assert.equal(signals.explicitProfile.length, 1);
  assert.equal(signals.conversationPatterns.length, 1);
  assert.equal(signals.userAuthoredContent.length, 1);

  const disabled = collectAuthorizedPersonalizationSignals({
    explicitProfile: { level: '200' },
    conversationHistory: ['private context'],
    consentedPersonalization: false,
  });
  assert.deepEqual(disabled.explicitProfile, []);
  assert.deepEqual(disabled.conversationPatterns, []);
});

test('internal agents are never presented as roleplay characters', () => {
  assert.doesNotThrow(() => assertNoRoleplay('Here is the simple answer.'));
  assert.throws(() => assertNoRoleplay('Pretend we are classmates.'));
  assert.throws(() => assertNoRoleplay('The agents say this is correct.'));
});

test('Bud presentation keeps collaborators internal', () => {
  const contract = buildBudPresentationContract('Explain this topic.', { userProvidedPreferences: ['short explanations'] }, ['spark', 'scholar']);
  assert.equal(contract.agentsRemainInternal, true);
  assert.deepEqual(contract.collaboratingAgents, ['spark', 'scholar']);
});

test('Bud user-facing text hides internal organization and does not call itself AI', () => {
  assert.doesNotThrow(() => assertBudUserFacingText('I checked that for you. Here is the next step.'));
  assert.throws(() => assertBudUserFacingText('Spark found the answer.'));
  assert.throws(() => assertBudUserFacingText('As an AI, I can help.'));
  assert.equal(BUD_SUPPORT_LANGUAGE.neverExposeAgentNames, true);
  assert.equal(BUD_SUPPORT_LANGUAGE.neverCallSelfAI, true);
});