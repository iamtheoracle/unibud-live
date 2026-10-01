/** Stable contracts for UNIBUD's internal living agent system. */

export type AgentId =
  | "bud" | "spark" | "oracle" | "scholar" | "orbit" | "coach" | "community"
  | "vision" | "creator" | "atlas" | "pulse" | "guardian" | "voice" | "navigator"
  | "architect" | "artist" | "sage" | "nova" | "nexus" | "sentinel"
  | "quad" | "study" | "campus" | "career" | "library" | "search"
  | "academic_service" | "admissions_service" | "exam_service" | "lecturer_service"
  | "live_class_service" | "institution_service" | "wellness_service" | "community_service"
  | "personalization_service" | "scholarship_service" | "career_service" | "research_service"
  | "library_service" | "marketplace_service" | "housing_service" | "transport_service"
  | "events_service" | "moderation_service" | "security_service" | "analytics_service"
  | "integration_service" | "notification_service" | "outreach_service" | "payment_service"
  | "communication_service";

export type AgentActivityState = "idle" | "queued" | "working" | "waiting" | "completed" | "failed";

export type AgentInput = {
  requestId: string;
  userId: string;
  prompt: string;
  context?: Record<string, unknown>;
};

export type AgentOutput = {
  ok: boolean;
  summary?: string;
  data?: Record<string, unknown>;
  error?: string;
};

export type AgentRuntimeContext = {
  requestId: string;
  now: string;
  userId: string;
  prompt: string;
  context: Record<string, unknown>;
};

export type AgentHandler = (input: AgentInput, context: AgentRuntimeContext) => Promise<AgentOutput>;

export type AgentDefinition = {
  id: AgentId;
  role: string;
  responsibility: string;
  contextScope: string[];
  memoryScope: string[];
  permissions: string[];
  collaborators: AgentId[];
  handler?: AgentHandler;
};

export type AgentActivityEvent = {
  requestId: string;
  userId: string;
  agentId: AgentId;
  state: AgentActivityState;
  event: "queued" | "started" | "waiting" | "completed" | "failed" | "skipped";
  detail?: string;
  createdAt: string;
};
