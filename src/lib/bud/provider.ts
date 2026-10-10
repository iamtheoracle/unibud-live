/** Canonical Bud model adapter. Providers are replaceable and capability-aware. */

export type ProviderMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

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

const FREE_REPLY = "I’m here, but the live model isn’t connected right now. The rest of UNIBUD is still here. Try again when the model connection is available.";

const freeProvider: AIProvider = {
  id: "free",
  kind: "free",
  capabilities: [],
  async complete() {
    return { ok: false, error: FREE_REPLY, providerId: "free" };
  },
};

function xaiProvider(apiKey: string): AIProvider {
  return {
    id: "xai",
    kind: "remote",
    capabilities: ["text"],
    async complete(messages, opts) {
      try {
        const res = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          signal: opts?.signal,
          body: JSON.stringify({ model: "grok-4.5", max_tokens: opts?.maxTokens ?? 700, messages }),
        });
        if (!res.ok) {
          const error =
            res.status === 401 || res.status === 403
              ? "Bud’s model key was rejected. Check the server configuration."
              : res.status === 429
                ? "Bud is rate-limited right now. Wait a moment and try again."
                : res.status >= 500
                  ? "Bud couldn’t reach the model. Try again in a moment."
                  : "Bud couldn’t reply just now. Try again.";
          return { ok: false, error, providerId: "xai" };
        }
        const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const text = body.choices?.[0]?.message?.content;
        if (!text) return { ok: false, error: "Bud received an empty reply. Try again.", providerId: "xai" };
        return { ok: true, text, providerId: "xai" };
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return { ok: false, error: "The request timed out before Bud could finish the reply. Try again when the connection is stable.", providerId: "xai" };
        return { ok: false, error: "Looks like the connection dropped. Check your network and try again.", providerId: "xai" };
      }
    },
  };
}

function openaiProvider(apiKey: string): AIProvider {
  return {
    id: "openai",
    kind: "remote",
    capabilities: ["text", "vision"],
    async complete(messages, opts) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          signal: opts?.signal,
          body: JSON.stringify({
            model: "gpt-4o-mini",
            max_tokens: opts?.maxTokens ?? 700,
            messages,
          }),
        });
        if (!res.ok) {
          const error =
            res.status === 401 || res.status === 403
              ? "Bud’s OpenAI key was rejected. Check OPENAI_API_KEY on the server."
              : res.status === 429
                ? "Bud is rate-limited by OpenAI right now. Wait a moment and try again."
                : res.status >= 500
                  ? "Bud couldn’t reach OpenAI. Try again in a moment."
                  : "Bud couldn’t reply just now. Try again.";
          return { ok: false, error, providerId: "openai" };
        }
        const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const text = body.choices?.[0]?.message?.content;
        if (!text) return { ok: false, error: "Bud received an empty reply. Try again.", providerId: "openai" };
        return { ok: true, text, providerId: "openai" };
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return {
            ok: false,
            error: "The request timed out before Bud could finish the reply. Try again when the connection is stable.",
            providerId: "openai",
          };
        }
        return {
          ok: false,
          error: "Looks like the connection dropped. Check your network and try again.",
          providerId: "openai",
        };
      }
    },
  };
}

export function getAIProvider(): AIProvider {
  const xai = typeof process !== "undefined" ? process.env.XAI_API_KEY : undefined;
  if (xai && xai.trim()) return xaiProvider(xai.trim());
  const openai = typeof process !== "undefined" ? process.env.OPENAI_API_KEY : undefined;
  if (openai && openai.trim()) return openaiProvider(openai.trim());
  return freeProvider;
}
