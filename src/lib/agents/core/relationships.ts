import type { OrganizationAgentId } from '../specialists/definitions.ts';

export interface AgentRelationship {
  from: OrganizationAgentId;
  to: OrganizationAgentId;
  reason: string;
  mode: 'route' | 'delegate' | 'verify' | 'handoff' | 'review';
}

export const CORE_RELATIONSHIPS: readonly AgentRelationship[] = [
  { from: 'bud', to: 'spark', reason: 'Bud delegates internal work to the orchestration layer', mode: 'route' },
  { from: 'spark', to: 'oracle', reason: 'Research and broad intelligence', mode: 'delegate' },
  { from: 'spark', to: 'architect', reason: 'System structure and architecture', mode: 'delegate' },
  { from: 'spark', to: 'scholar', reason: 'Academic and learning work', mode: 'delegate' },
  { from: 'spark', to: 'orbit', reason: 'Discovery and navigation', mode: 'delegate' },
  { from: 'spark', to: 'coach', reason: 'Guidance and progress', mode: 'delegate' },
  { from: 'spark', to: 'community', reason: 'Community context', mode: 'delegate' },
  { from: 'spark', to: 'vision', reason: 'Visual understanding', mode: 'delegate' },
  { from: 'spark', to: 'creator', reason: 'Content creation', mode: 'delegate' },
  { from: 'spark', to: 'artist', reason: 'Visual creative work', mode: 'delegate' },
  { from: 'spark', to: 'atlas', reason: 'Memory and consent', mode: 'delegate' },
  { from: 'spark', to: 'pulse', reason: 'Measurement and signals', mode: 'delegate' },
  { from: 'spark', to: 'guardian', reason: 'Safety and authorization review', mode: 'verify' },
  { from: 'spark', to: 'voice', reason: 'Speech and audio', mode: 'delegate' },
  { from: 'spark', to: 'navigator', reason: 'External or application actions', mode: 'delegate' },
  { from: 'orbit', to: 'scholar', reason: 'Discovery findings may require academic interpretation', mode: 'review' },
  { from: 'scholar', to: 'library', reason: 'Academic reasoning may require authoritative research resources', mode: 'review' },
  { from: 'navigator', to: 'guardian', reason: 'Authorized actions require security review when sensitive', mode: 'verify' },
  { from: 'guardian', to: 'spark', reason: 'Security review returns authorization state', mode: 'verify' },
  { from: 'atlas', to: 'spark', reason: 'Memory/context returns only authorized continuity', mode: 'handoff' },
  { from: 'spark', to: 'bud', reason: 'Only Bud presents the user-facing result', mode: 'handoff' },
];
