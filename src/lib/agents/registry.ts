import type { AgentDefinition, AgentId, AgentInput, AgentOutput, AgentRuntimeContext } from "./contracts";
import { EXTENDED_AGENT_DEFINITIONS } from "./catalog.ts";
import { getAIProvider } from "../bud/provider.ts";

const definitions: AgentDefinition[] = [
  { id: "bud", role: "student companion", responsibility: "Own the student's visible conversation and expression.", contextScope: ["conversation", "student", "academic", "world"], memoryScope: ["conversation", "preferences", "learning"], permissions: ["respond"], collaborators: ["spark", "navigator", "scholar", "coach", "voice"] },
  { id: "spark", role: "coordinator", responsibility: "Coordinate only the specialists actually required for the request.", contextScope: ["request", "agent-state", "world-state"], memoryScope: ["task-state"], permissions: ["route", "coordinate"], collaborators: ["bud", "oracle", "scholar", "orbit", "coach", "community", "vision", "creator", "atlas", "pulse", "guardian", "voice", "navigator"] },
  { id: "oracle", role: "research and verification", responsibility: "Verify external or current facts when verification is required.", contextScope: ["web", "sources", "verification"], memoryScope: ["source-history"], permissions: ["research", "verify"], collaborators: ["spark", "scholar", "orbit"] },
  { id: "scholar", role: "academic specialist", responsibility: "Work with course material, explanations, research, revision and academic reasoning.", contextScope: ["courses", "syllabus", "academic"], memoryScope: ["learning"], permissions: ["academic-read"], collaborators: ["spark", "oracle", "coach"] },
  { id: "orbit", role: "browsing and discovery specialist", responsibility: "Explore real information environments, discover sources and return provenance-aware findings.", contextScope: ["web", "discovery", "world"], memoryScope: ["source-history"], permissions: ["browse", "discover"], collaborators: ["spark", "oracle", "scholar"] },
  { id: "coach", role: "planning partner", responsibility: "Help structure study, planning and execution without taking over the student's work.", contextScope: ["planning", "learning"], memoryScope: ["goals", "progress"], permissions: ["plan"], collaborators: ["spark", "scholar", "orbit"] },
  { id: "community", role: "campus community specialist", responsibility: "Handle real campus/community context and social discovery.", contextScope: ["campus", "community", "social"], memoryScope: ["community-context"], permissions: ["community-read"], collaborators: ["spark", "pulse", "orbit"] },
  { id: "vision", role: "visual specialist", responsibility: "Interpret or structure visual explanations when visual reasoning is actually needed.", contextScope: ["images", "diagrams", "visuals"], memoryScope: ["task-state"], permissions: ["vision"], collaborators: ["spark", "creator"] },
  { id: "creator", role: "creative media specialist", responsibility: "Handle real media creation workflows when a generation provider exists.", contextScope: ["media", "creation"], memoryScope: ["creative-context"], permissions: ["generate"], collaborators: ["spark", "vision", "voice"] },
  { id: "atlas", role: "continuity specialist", responsibility: "Recover relevant known context and ongoing task state.", contextScope: ["memory", "history"], memoryScope: ["conversation", "learning", "task-state"], permissions: ["memory-read"], collaborators: ["spark", "bud"] },
  { id: "pulse", role: "current activity specialist", responsibility: "Surface real current campus or discovery activity when available.", contextScope: ["current", "campus", "discovery"], memoryScope: ["activity-history"], permissions: ["current-read"], collaborators: ["spark", "oracle", "community", "orbit"] },
  { id: "guardian", role: "safety specialist", responsibility: "Handle safety, abuse, scam and harmful-content concerns.", contextScope: ["safety"], memoryScope: ["safety-state"], permissions: ["safety-review"], collaborators: ["spark", "bud"] },
  { id: "voice", role: "voice specialist", responsibility: "Handle real speech recognition and synthesis when voice providers are connected.", contextScope: ["audio", "voice"], memoryScope: ["voice-preferences"], permissions: ["voice"], collaborators: ["spark", "creator"] },
  { id: "navigator", role: "UNIBUD navigator", responsibility: "Navigate students to real UNIBUD surfaces without duplicating them inside Bud.", contextScope: ["navigation", "routes"], memoryScope: ["navigation-preferences"], permissions: ["navigate"], collaborators: ["spark", "bud"] },
];

const needsExternalTools = new Set<AgentId>([
  "oracle", "orbit", "browser", "pulse", "search", "library", "nexus",
  "scholarship_service", "research_service", "admissions_service", "housing_service",
  "transport_service", "events_service", "analytics_service", "integration_service",
]);

const needsConnectedAction = new Set<AgentId>([
  "navigator", "voice", "vision", "creator", "artist", "live_class_service",
  "payment_service", "communication_service", "notification_service", "lecturer_service",
  "academic_service", "institution_service", "marketplace_service",
]);

function handlerFor(definition: Omit<AgentDefinition, "handler">): AgentDefinition["handler"] {
  return async (input: AgentInput, context: AgentRuntimeContext): Promise<AgentOutput> => {
    const id = definition.id;
    if (needsExternalTools.has(id)) {
      return { ok: false, error: `${definition.role} needs a connected search/data tool to verify real-world information. No source lookup was performed.` };
    }
    if (needsConnectedAction.has(id)) {
      return { ok: false, error: `${definition.role} needs its authorized service provider connected before it can perform that action. No action was performed.` };
    }
    const provider = getAIProvider();
    const result = await provider.complete([
      { role: "system", content: `You are the internal UNIBUD ${definition.role}. Responsibility: ${definition.responsibility} Work only on this responsibility. Do not claim web searches, external actions, account access, or data retrieval unless the supplied context contains actual evidence. Return a concise useful contribution for Spark to review, not a user-facing message. If context is insufficient, say what is missing.` },
      { role: "user", content: `Task: ${input.prompt}\nContext: ${JSON.stringify(context.context ?? input.context ?? {})}\nRequest ID: ${context.requestId}` },
    ], { maxTokens: 500 });
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, summary: result.text, data: { providerId: result.providerId, agentId: id } };
  };
}

const coreWithHandlers: AgentDefinition[] = definitions.map((definition) => ({
  ...definition,
  handler: handlerFor(definition),
}));

const extendedWithHandlers: AgentDefinition[] = EXTENDED_AGENT_DEFINITIONS.map((definition) => ({
  ...definition,
  handler: handlerFor(definition),
}));

const allDefinitions: AgentDefinition[] = [...coreWithHandlers, ...extendedWithHandlers];
const byId = new Map(allDefinitions.map((definition) => [definition.id, definition]));

export function getAgentDefinition(id: AgentId): AgentDefinition {
  const definition = byId.get(id);
  if (!definition) throw new Error("Unregistered agent: " + id);
  return definition;
}

export function listAgentDefinitions(): AgentDefinition[] {
  return [...allDefinitions];
}
