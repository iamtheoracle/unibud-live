import type { AgentId } from '../core/contracts';
import type { OrganizationAgentId } from '../specialists/definitions';

/**
 * Routing is responsibility-first.
 *
 * Spark chooses an agent because its declared mission/duties fit the intent.
 * Location, runtime, provider and transport are later execution metadata.
 */
export interface RouteRequest {
  intent: string;
  domain?: string;
  requiredCapabilities?: string[];
  context?: Record<string, unknown>;
}

export interface RouteCandidate {
  agent: OrganizationAgentId;
  reason: string;
  requiredCapabilities: string[];
  verifyWith?: OrganizationAgentId[];
}

export interface RouteDecision {
  primary: RouteCandidate;
  supporting: RouteCandidate[];
  blockedBy?: string[];
}

const primaryRoutes: Record<string, OrganizationAgentId> = {
  academic: 'scholar',
  study: 'study',
  lecturer: 'sage',
  institution: 'nova',
  campus: 'campus',
  research: 'oracle',
  library: 'library',
  discovery: 'orbit',
  search: 'search',
  social: 'community',
  community: 'community',
  career: 'career',
  scholarships: 'nexus',
  events: 'quad',
  visual_understanding: 'vision',
  visual_creation: 'artist',
  content_creation: 'creator',
  memory: 'atlas',
  analytics: 'pulse',
  security: 'guardian',
  speech: 'voice',
  action: 'navigator',
  admissions: 'admissions_service',
  examinations: 'exam_service',
  academic_operations: 'academic_service',
  lecturer_operations: 'lecturer_service',
  live_class: 'live_class_service',
  institution_operations: 'institution_service',
  wellness: 'wellness_service',
  community_operations: 'community_service',
  personalization: 'personalization_service',
  scholarship_operations: 'scholarship_service',
  career_operations: 'career_service',
  research_operations: 'research_service',
  library_operations: 'library_service',
  marketplace: 'marketplace_service',
  housing: 'housing_service',
  transport: 'transport_service',
  events_operations: 'events_service',
  moderation: 'moderation_service',
  security_operations: 'security_service',
  analytics_operations: 'analytics_service',
  integration: 'integration_service',
  notifications: 'notification_service',
  outreach: 'outreach_service',
  payments: 'payment_service',
  communication: 'communication_service',
};

const verificationPartners: Partial<Record<OrganizationAgentId, OrganizationAgentId[]>> = {
  oracle: ['atlas', 'guardian'],
  scholar: ['atlas'],
  navigator: ['guardian'],
  creator: ['artist', 'vision'],
  artist: ['vision', 'guardian'],
  community: ['guardian', 'atlas'],
  marketplace_service: ['payment_service', 'sentinel'],
  payment_service: ['guardian', 'sentinel'],
  security_service: ['guardian', 'sentinel'],
  moderation_service: ['guardian', 'sentinel'],
  integration_service: ['guardian', 'navigator'],
  communication_service: ['guardian', 'notification_service'],
};

export function routeByResponsibility(request: RouteRequest): RouteDecision | undefined {
  if (!request.domain) return undefined;

  const agent = primaryRoutes[request.domain];
  if (!agent) return undefined;

  const supportingIds = verificationPartners[agent] ?? [];
  return {
    primary: {
      agent,
      reason: 'The agent is assigned this domain by declared responsibility.',
      requiredCapabilities: request.requiredCapabilities ?? [],
      verifyWith: supportingIds,
    },
    supporting: supportingIds.map((supportAgent) => ({
      agent: supportAgent,
      reason: 'Supporting or verification responsibility declared by the organization.',
      requiredCapabilities: [],
    })),
  };
}

export function isCoreAgent(agent: OrganizationAgentId): agent is AgentId {
  return ['bud','spark','oracle','architect','scholar','orbit','coach','community','vision','creator','artist','atlas','pulse','guardian','voice','navigator']
    .includes(agent);
}
