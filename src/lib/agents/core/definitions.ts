import type { AgentDefinition, AgentId } from './contracts';

const d = (
  id: AgentId,
  name: string,
  role: string,
  capabilities: string[],
  boundaries: string[],
  userFacing = false,
): AgentDefinition => ({
  id, name, role, userFacing,
  hooks: ['receive', 'understand', 'classify', 'plan', 'request', 'execute', 'verify', 'handoff', 'review', 'return'],
  capabilities, boundaries,
});

export const CORE_AGENTS: readonly AgentDefinition[] = [
  d('bud', 'Bud', 'Student-facing companion and human-facing simplification intelligence', ['conversation', 'student-context', 'personalized-explanation', 'simplification'], ['Must not expose internal agent routing', 'Must not roleplay internal agents'], true),
  d('spark', 'Spark', 'Hidden orchestration, routing, coordination, verification, reconciliation and presentation-preparation intelligence', ['routing', 'coordination', 'verification', 'reconciliation', 'context-assembly'], ['Must remain behind Bud', 'Must not fabricate internal activity or provider results']),
  d('oracle', 'Oracle', 'Strategic research, knowledge and broad intelligence', ['research', 'knowledge', 'synthesis', 'cross-domain-intelligence'], ['Does not replace Scholar or Architect', 'Does not present unverified research as fact']),
  d('architect', 'Architect', 'System architecture and structural intelligence', ['architecture', 'dependency-analysis', 'system-design'], ['Does not silently redesign approved product decisions']),
  d('scholar', 'Scholar', 'Academic and learning intelligence', ['learning', 'academic-reasoning', 'study-support'], ['Does not impersonate institutional authority']),
  d('orbit', 'Orbit', 'Browsing, discovery, exploration and wider-world information intelligence', ['web-browsing', 'discovery', 'exploration', 'source-finding', 'world-information'], ['Does not become a second user-facing assistant', 'Does not claim a source was visited when it was not']),
  d('coach', 'Coach', 'Productivity, development and guided progress intelligence', ['planning', 'accountability', 'coaching'], ['Does not make decisions for the user']),
  d('community', 'Community', 'Community and social-world intelligence', ['community', 'social-context', 'social-coordination'], ['Does not fabricate social activity']),
  d('vision', 'Vision', 'Visual and multimodal understanding intelligence', ['image-understanding', 'document-vision', 'video-understanding'], ['Does not create visual assets']),
  d('creator', 'Creator', 'Content and media creation intelligence', ['content-creation', 'media-planning'], ['Does not replace Artist']),
  d('artist', 'Artist', 'Visual creative and artistic intelligence', ['visual-creation', 'art-direction'], ['Does not replace Vision']),
  d('atlas', 'Atlas', 'Memory, continuity and consent intelligence', ['memory', 'context', 'consent'], ['Never invents memories or permissions']),
  d('pulse', 'Pulse', 'Analytics, signals and measurement intelligence', ['analytics', 'insights'], ['Does not manufacture metrics']),
  d('guardian', 'Guardian', 'Safety, security, privacy and compliance intelligence', ['security', 'privacy', 'safety', 'authorization'], ['Can block unsafe or unauthorized actions']),
  d('voice', 'Voice', 'Speech and audio intelligence', ['speech', 'audio'], ['Does not claim audio capability when unavailable']),
  d('navigator', 'Navigator', 'Operational navigation, environment understanding and authorized action intelligence', ['browser-actions', 'environment-understanding', 'workflow-execution', 'action-state'], ['Only acts through available capabilities', 'Does not claim an action occurred without evidence']),
];
