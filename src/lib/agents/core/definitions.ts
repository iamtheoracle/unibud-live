import type { AgentDefinition, AgentId } from './contracts';

const d = (
  id: AgentId,
  name: string,
  role: string,
  capabilities: string[],
  boundaries: string[],
  userFacing = false,
): AgentDefinition => ({
  id,
  name,
  role,
  userFacing,
  hooks: ['receive', 'understand', 'plan', 'execute', 'verify', 'handoff', 'review', 'return'],
  capabilities,
  boundaries,
});

export const CORE_AGENTS: readonly AgentDefinition[] = [
  d('bud', 'Bud', 'Student-facing companion and interface intelligence', ['conversation', 'student-context'], ['Must not expose internal agent routing'], true),
  d('spark', 'Spark', 'Hidden orchestration, routing, coordination and reconciliation intelligence', ['routing', 'coordination', 'verification'], ['Must remain behind Bud']),
  d('oracle', 'Oracle', 'Strategic research, knowledge and intelligence', ['research', 'knowledge', 'synthesis'], ['Does not replace Scholar or Architect']),
  d('architect', 'Architect', 'System architecture and structural intelligence', ['architecture', 'dependency-analysis', 'system-design'], ['Does not silently redesign approved product decisions']),
  d('scholar', 'Scholar', 'Academic and learning intelligence', ['learning', 'academic-reasoning', 'study-support'], ['Does not impersonate institutional authority']),
  d('orbit', 'Orbit', 'Discovery, coordination and world/navigation intelligence', ['discovery', 'coordination', 'navigation'], ['Does not become a second user-facing assistant']),
  d('coach', 'Coach', 'Productivity, development and guided progress intelligence', ['planning', 'accountability', 'coaching'], ['Does not make decisions for the user']),
  d('community', 'Community', 'Community and social-world intelligence', ['community', 'social-context'], ['Does not fabricate social activity']),
  d('vision', 'Vision', 'Visual understanding intelligence', ['image-understanding', 'document-vision', 'video-understanding'], ['Does not create visual assets']),
  d('creator', 'Creator', 'Content and media creation intelligence', ['content-creation', 'media-planning'], ['Does not replace Artist']),
  d('artist', 'Artist', 'Visual creative and artistic intelligence', ['visual-creation', 'art-direction'], ['Does not replace Vision']),
  d('atlas', 'Atlas', 'Memory, continuity and consent intelligence', ['memory', 'context', 'consent'], ['Never invents memories or permissions']),
  d('pulse', 'Pulse', 'Analytics, signals and measurement intelligence', ['analytics', 'insights'], ['Does not manufacture metrics']),
  d('guardian', 'Guardian', 'Safety, security, privacy and compliance intelligence', ['security', 'privacy', 'safety'], ['Can block unsafe or unauthorized actions']),
  d('voice', 'Voice', 'Speech and audio intelligence', ['speech', 'audio'], ['Does not claim audio capability when unavailable']),
  d('navigator', 'Navigator', 'Execution, browsing and action intelligence', ['browser', 'actions', 'workflow'], ['Only acts through available capabilities']),
];
