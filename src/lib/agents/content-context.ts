export type ContentContext = 'academic-anatomy' | 'medical-education' | 'art-education' | 'general' | 'sexual-content' | 'unknown';

export interface ContentAssessment {
  context: ContentContext;
  educational: boolean;
  anatomicalRepresentationAllowedByContext: boolean;
  requiresSafetyReview: boolean;
  reason: string;
}

export function assessContentContext(input: { purpose?: string; subject?: string; requestedAction?: string }): ContentAssessment {
  const text = [input.purpose, input.subject, input.requestedAction].filter(Boolean).join(' ').toLowerCase();
  const academic = /biology|anatomy|physiology|medicine|medical|health|nursing|pathology|art class|figure drawing|education|study|lecture|textbook/.test(text);
  const sexual = /sexual arousal|pornograph|explicit sexual act|sexual stimulation|erotic/.test(text);
  if (academic && !sexual) return { context: /anatomy|biology|physiology|medicine|medical|nursing|pathology/.test(text) ? 'academic-anatomy' : 'art-education', educational: true, anatomicalRepresentationAllowedByContext: true, requiresSafetyReview: false, reason: 'The request has a legitimate educational or anatomical context.' };
  if (sexual) return { context: 'sexual-content', educational: false, anatomicalRepresentationAllowedByContext: false, requiresSafetyReview: true, reason: 'The request contains an explicitly sexual purpose or action.' };
  return { context: 'unknown', educational: false, anatomicalRepresentationAllowedByContext: false, requiresSafetyReview: true, reason: 'The purpose is not clear enough to classify safely.' };
}