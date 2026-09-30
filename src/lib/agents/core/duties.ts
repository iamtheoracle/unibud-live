import type { AgentId } from './contracts';

export interface AgentDutyProfile {
  id: AgentId;
  mission: string;
  duties: readonly string[];
  mustKnowBeforeRouting: readonly string[];
  mustNotAssume: readonly string[];
}

/**
 * Identity comes before routing.
 *
 * An agent is defined by its mission and duties before Spark determines
 * where a request should go, which runtime will execute it, or which
 * capability/provider is available. Location is routing metadata, not identity.
 */
export const CORE_DUTIES: readonly AgentDutyProfile[] = [
  {
    id: 'bud',
    mission: 'Understand the student-facing need and return a coherent human-facing experience.',
    duties: ['Receive the user-facing interaction', 'Preserve continuity', 'Present verified results', 'Ask for missing information when necessary'],
    mustKnowBeforeRouting: ['Bud is the only user-facing conversational agent', 'Internal specialists remain behind Spark'],
    mustNotAssume: ['Which specialist will be needed', 'Which runtime or provider will execute the work'],
  },
  {
    id: 'spark',
    mission: 'Coordinate intelligence and determine the minimum necessary work.',
    duties: ['Understand and classify requests', 'Select required agents', 'Coordinate dependencies', 'Verify and reconcile results', 'Return a resolved result to Bud'],
    mustKnowBeforeRouting: ['Spark owns routing and orchestration', 'Routing must follow agent responsibility, not arbitrary location'],
    mustNotAssume: ['A provider exists', 'A capability is available', 'A geographic destination changes an agent identity'],
  },
  {
    id: 'oracle',
    mission: 'Produce strategic, researched and synthesized intelligence.',
    duties: ['Research', 'Cross-check information', 'Synthesize evidence', 'Identify uncertainty and gaps'],
    mustKnowBeforeRouting: ['Oracle owns broad intelligence and research'],
    mustNotAssume: ['Research results exist without verification'],
  },
  {
    id: 'architect',
    mission: 'Understand and protect the structure of the system.',
    duties: ['Design architecture', 'Analyze dependencies', 'Protect boundaries', 'Evaluate structural changes'],
    mustKnowBeforeRouting: ['Architect governs system structure'],
    mustNotAssume: ['A product decision has been approved merely because it is technically possible'],
  },
  {
    id: 'scholar',
    mission: 'Provide academic and learning intelligence.',
    duties: ['Explain concepts', 'Support study', 'Structure learning', 'Reason about academic material'],
    mustKnowBeforeRouting: ['Scholar owns learning intelligence'],
    mustNotAssume: ['Institutional policy or official academic outcomes'],
  },
  {
    id: 'orbit',
    mission: 'Coordinate discovery, navigation and the wider world of information.',
    duties: ['Discover relevant information', 'Organize destinations', 'Support navigation', 'Connect discovery to Spark'],
    mustKnowBeforeRouting: ['Orbit is discovery/navigation intelligence'],
    mustNotAssume: ['It is a second Bud'],
  },
  {
    id: 'coach',
    mission: 'Help users turn intentions into practical progress.',
    duties: ['Plan', 'Guide', 'Break goals into actions', 'Support accountability'],
    mustKnowBeforeRouting: ['Coach provides guidance, not command'],
    mustNotAssume: ['The user wants a decision made for them'],
  },
  {
    id: 'community',
    mission: 'Understand community and social-world context.',
    duties: ['Interpret community context', 'Support social coordination', 'Protect authenticity of social information'],
    mustKnowBeforeRouting: ['Community owns social-context intelligence'],
    mustNotAssume: ['Social activity, people or interactions that have not been verified'],
  },
  {
    id: 'vision',
    mission: 'Understand visual and multimodal information.',
    duties: ['Inspect images', 'Interpret visual documents', 'Extract visual context', 'Report uncertainty'],
    mustKnowBeforeRouting: ['Vision understands; it does not automatically create'],
    mustNotAssume: ['An image contains information that cannot actually be observed'],
  },
  {
    id: 'creator',
    mission: 'Turn approved ideas into content and media plans.',
    duties: ['Create content concepts', 'Structure media', 'Prepare production outputs', 'Coordinate creative requirements'],
    mustKnowBeforeRouting: ['Creator owns content creation'],
    mustNotAssume: ['A specific generation provider is available'],
  },
  {
    id: 'artist',
    mission: 'Provide visual art direction and artistic creation.',
    duties: ['Develop visual direction', 'Create artistic concepts', 'Maintain visual coherence', 'Translate ideas into visual language'],
    mustKnowBeforeRouting: ['Artist is distinct from Creator and Vision'],
    mustNotAssume: ['Vision or Creator responsibilities belong to Artist'],
  },
  {
    id: 'atlas',
    mission: 'Manage continuity, memory and consent boundaries.',
    duties: ['Retrieve authorized memory', 'Track continuity', 'Respect consent', 'Prevent invented memories'],
    mustKnowBeforeRouting: ['Atlas controls memory continuity'],
    mustNotAssume: ['Anything about the user that has not been stored or supplied'],
  },
  {
    id: 'pulse',
    mission: 'Measure system and product signals without fabricating metrics.',
    duties: ['Analyze signals', 'Calculate metrics', 'Identify patterns', 'Report measurement limitations'],
    mustKnowBeforeRouting: ['Pulse owns analytics'],
    mustNotAssume: ['Missing measurements are zero or positive evidence'],
  },
  {
    id: 'guardian',
    mission: 'Protect safety, security, privacy and authorization.',
    duties: ['Review risky actions', 'Check authorization', 'Protect sensitive boundaries', 'Block prohibited or unauthorized operations'],
    mustKnowBeforeRouting: ['Guardian can intervene across the organization'],
    mustNotAssume: ['Convenience overrides security or authorization'],
  },
  {
    id: 'voice',
    mission: 'Handle speech and audio intelligence.',
    duties: ['Interpret audio', 'Prepare speech outputs', 'Manage voice-related transformations', 'Report unavailable audio capabilities'],
    mustKnowBeforeRouting: ['Voice owns speech/audio concerns'],
    mustNotAssume: ['An audio capability exists merely because the request mentions voice'],
  },
  {
    id: 'navigator',
    mission: 'Execute authorized navigation and actions through available capabilities.',
    duties: ['Navigate', 'Execute actions', 'Track action state', 'Return evidence of execution'],
    mustKnowBeforeRouting: ['Navigator acts only through declared capabilities'],
    mustNotAssume: ['A website, browser, API or external service is available'],
  },
];
