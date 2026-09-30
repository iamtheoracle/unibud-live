import type { OrganizationAgentId } from './specialists/definitions.ts';

export interface UserContext {
  explicitProfile?: Record<string, unknown>;
  conversationHistory?: readonly string[];
  userProvidedPreferences?: readonly string[];
  userChosenContent?: readonly string[];
  userAuthoredContent?: readonly string[];
  consentedPersonalization?: boolean;
}

export interface BudResponsePolicy {
  userFacingAgent: 'bud';
  orchestrationAgent: 'spark';
  maxSentenceWords: number;
  preferShortSentences: true;
  explainBeforeDetail: true;
  neverRoleplayInternalAgents: true;
  neverExposeInternalRouting: true;
  personalizeFromAuthorizedContextOnly: true;
  adaptToUserWithoutChangingTruth: true;
}

export const BUD_RESPONSE_POLICY: BudResponsePolicy = {
  userFacingAgent: 'bud',
  orchestrationAgent: 'spark',
  maxSentenceWords: 18,
  preferShortSentences: true,
  explainBeforeDetail: true,
  neverRoleplayInternalAgents: true,
  neverExposeInternalRouting: true,
  personalizeFromAuthorizedContextOnly: true,
  adaptToUserWithoutChangingTruth: true,
};

export interface PersonalizationSignals {
  explicitProfile: readonly string[];
  conversationPatterns: readonly string[];
  userProvidedPreferences: readonly string[];
  userChosenContent: readonly string[];
  userAuthoredContent: readonly string[];
}

export function collectAuthorizedPersonalizationSignals(
  context: UserContext,
): PersonalizationSignals {
  if (context.consentedPersonalization === false) {
    return {
      explicitProfile: [],
      conversationPatterns: [],
      userProvidedPreferences: [],
      userChosenContent: [],
      userAuthoredContent: [],
    };
  }

  return {
    explicitProfile: Object.entries(context.explicitProfile ?? {}).map(
      ([key, value]) => `${key}: ${String(value)}`,
    ),
    conversationPatterns: [...(context.conversationHistory ?? [])],
    userProvidedPreferences: [...(context.userProvidedPreferences ?? [])],
    userChosenContent: [...(context.userChosenContent ?? [])],
    userAuthoredContent: [...(context.userAuthoredContent ?? [])],
  };
}

export function personalizationInstructions(
  signals: PersonalizationSignals,
): string[] {
  const available = [
    ...signals.explicitProfile,
    ...signals.conversationPatterns,
    ...signals.userProvidedPreferences,
    ...signals.userChosenContent,
    ...signals.userAuthoredContent,
  ];

  return [
    'Adapt examples, vocabulary, pacing and depth to the user when the evidence supports it.',
    'Two users asking the same question may receive different explanations because their authorized context differs.',
    'Do not change factual content merely to please the user.',
    'Do not infer sensitive personal traits from behavior for personalization.',
    'Do not treat another person’s private conversation as available context.',
    available.length
      ? `Authorized personalization context is available: ${available.length} signal(s).`
      : 'No additional personalization context is available; answer from the current request.',
  ];
}

export function assertNoRoleplay(text: string): void {
  const forbidden = [
    /pretend (?:i am|we are|you are)/i,
    /roleplay/i,
    /as your (?:friend|classmate|coworker|teacher)/i,
    /the agents? (?:say|think|feel)/i,
  ];

  if (forbidden.some((pattern) => pattern.test(text))) {
    throw new Error('Internal agents must not be presented through fabricated roleplay.');
  }
}

export function buildBudPresentationContract(
  task: string,
  context: UserContext,
  collaboratingAgents: readonly OrganizationAgentId[],
): {
  task: string;
  agentsRemainInternal: true;
  policy: BudResponsePolicy;
  personalization: string[];
  collaboratingAgents: readonly OrganizationAgentId[];
} {
  return {
    task,
    agentsRemainInternal: true,
    policy: BUD_RESPONSE_POLICY,
    personalization: personalizationInstructions(
      collectAuthorizedPersonalizationSignals(context),
    ),
    collaboratingAgents,
  };
}
