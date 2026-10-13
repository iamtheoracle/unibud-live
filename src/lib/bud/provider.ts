/** Canonical Bud model adapter. Providers are replaceable and capability-aware. */

export type ProviderMessage = { role: "system" | "user" | "assistant"; content: string };
export type ProviderCapability = "text" | "vision" | "audio-input" | "audio-output" | "image-generation" | "video-generation";
export type ProviderResult =
  | { ok: true; text: string; providerId: string }
  | { ok: false; error: string; providerId: string };
export type AIProvider = {
  id: string;
  kind: "remote" | "free";
  capabilities: ProviderCapability[];
  complete: (messages: ProviderMessage[], opts?: { maxTokens?: number; signal?: AbortSignal }) => Promise<ProviderResult>;
};

function offlineReply(messages: ProviderMessage[]): string {
  const userMessages = messages.filter((m) => m.role === "user");
  const prompt = (userMessages.at(-1)?.content ?? "").trim();
  const p = prompt.toLowerCase().replace(/[.!?]+$/, "");
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|how far|how are you)$/.test(p)) {
    return "Hi! I’m Bud, your study buddy in UNIBUD. What’s on your mind today? We can talk, work through a question, or plan what you want to study.";
  }
  if (/^(thanks|thank you|thx)$/.test(p)) return "You’re welcome! What else can I help you with?";
  if (/^(bye|goodbye|see you)$/.test(p)) return "See you later. I’ll be here when you want to continue.";
  if (/who are you|what can you do|what are you able to do/.test(p)) {
    return "I’m Bud, your study buddy in UNIBUD. I can help explain concepts, brainstorm, plan study sessions, and work through questions. In this no-model mode, my answers are limited and I can’t do live web research. A connected AI provider is needed for deeper open-ended reasoning.";
  }
  if (/\b(2\s*\+\s*2|what is 2 plus 2)\b/.test(p)) return "2 + 2 = 4.";
  if (/what is photosynthesis/.test(p)) return "Photosynthesis is how plants use light energy to turn water and carbon dioxide into sugars, releasing oxygen as a by-product.";
  if (/what is gravity/.test(p)) return "Gravity is the attraction between objects that have mass. On Earth, it pulls objects toward the planet’s centre.";
  if (/what is inflation/.test(p)) return "Inflation is a general rise in prices over time, which means the same amount of money buys less than before.";
  if (/what is an algorithm/.test(p)) return "An algorithm is a set of steps for solving a problem or completing a task.";
  if (/what is ai|what is artificial intelligence/.test(p)) return "Artificial intelligence (AI) is technology that performs tasks associated with human intelligence, such as understanding language, finding patterns, or generating content.";
  if (userMessages.length > 1) return "I can follow this conversation, but the full AI model isn’t connected, so I can’t reliably reason through that yet. Connect an AI provider for a proper answer, or try asking me a simple definition or greeting.";
  return "I received your message, but Bud’s full AI model isn’t connected right now. I can handle a few basic prompts in offline mode, but I can’t give a reliable open-ended answer or search the live internet without a connected model and search tool.";
}

const freeProvider: AIProvider = {
  id: "offline",
  kind: "free",
  capabilities: ["text"],
  async complete(messages) {
    return { ok: true, text: offlineReply(messages), providerId: "offline" };
  },
};

function canUseOfflineFallback(messages: ProviderMessage[]): boolean {
  const prompt = messages.filter((m) => m.role === "user").at(-1)?.content?.trim().toLowerCase().replace(/[.!?]+$/, "") ?? "";
  return /^(hi|hello|hey|good morning|good afternoon|good evening|how far|how are you|thanks|thank you|thx|bye|goodbye|see you|who are you|what can you do|what are you able to do|what is photosynthesis|what is gravity|what is inflation|what is an algorithm|what is ai|what is artificial intelligence|2\s*\+\s*2|what is 2 plus 2)$/.test(prompt);
}

function remoteProvider(id: "xai" | "openai", apiKey: string): AIProvider {
  const isXai = id === "xai";
  return {
    id,
    kind: "remote",
    capabilities: ["text", ...(isXai ? [] : ["vision" as const])],
    async complete(messages, opts) {
      try {
        const res = await fetch(isXai ? "https://api.x.ai/v1/chat/completions" : "https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          signal: opts?.signal,
          body: JSON.stringify({ model: isXai ? "grok-4.5" : "gpt-4o-mini", max_tokens: opts?.maxTokens ?? 700, messages }),
        });
        if (!res.ok) {
          if (canUseOfflineFallback(messages)) return freeProvider.complete(messages);
          return { ok: false, error: res.status >= 500 ? "Bud couldn’t reach the model. Try again in a moment." : "Bud couldn’t reply just now. Check the model connection and try again.", providerId: id };
        }
        const body = (await res.json()) as { choices?: { message?: { content?: string | null } }[] };
        const text = body.choices?.[0]?.message?.content;
        if (!text?.trim()) return { ok: false, error: "Bud received an empty reply. Try again.", providerId: id };
        return { ok: true, text, providerId: id };
      } catch (err) {
        if (canUseOfflineFallback(messages)) return freeProvider.complete(messages);
        if (err instanceof Error && err.name === "AbortError") return { ok: false, error: "The request timed out before Bud could finish. Try again.", providerId: id };
        return { ok: false, error: "Looks like the connection dropped. Check your network and try again.", providerId: id };
      }
    },
  };
}

export function getAIProvider(): AIProvider {
  const xai = typeof process !== "undefined" ? process.env.XAI_API_KEY : undefined;
  if (xai?.trim()) return remoteProvider("xai", xai.trim());
  const openai = typeof process !== "undefined" ? process.env.OPENAI_API_KEY : undefined;
  if (openai?.trim()) return remoteProvider("openai", openai.trim());
  return freeProvider;
}
