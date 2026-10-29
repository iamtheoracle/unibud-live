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
  kind: "remote" | "local" | "free";
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

function unavailableOracleArcProvider(message: string): AIProvider {
  return {
    id: "oracle-arc",
    kind: "local",
    capabilities: [],
    async complete() {
      return { ok: false, error: message, providerId: "oracle-arc" };
    },
  };
}

function oracleArcProvider(baseUrl: string, apiKey: string, ownerId: string): AIProvider {
  const endpoint = baseUrl.replace(/\/+$/, "") + "/v1/chat/completions";
  return {
    id: "oracle-arc",
    kind: "local",
    capabilities: ["text"],
    async complete(messages, opts) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          signal: opts?.signal,
          body: JSON.stringify({
            model: "oracle-arc-local",
            user: ownerId,
            max_tokens: opts?.maxTokens ?? 700,
            messages,
          }),
        });
        if (!res.ok) {
          const error = res.status === 401 || res.status === 403
            ? "Oracle Arc rejected this private connection. Check the owner ID and server credentials."
            : res.status >= 500
              ? "Oracle Arc or its local model is unavailable. Check the private service and model status."
              : "Oracle Arc could not process this request.";
          return { ok: false, error, providerId: "oracle-arc" };
        }
        const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const text = body.choices?.[0]?.message?.content;
        if (typeof text !== "string" || !text.trim()) {
          return { ok: false, error: "Oracle Arc returned an empty response.", providerId: "oracle-arc" };
        }
        return { ok: true, text, providerId: "oracle-arc" };
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return { ok: false, error: "Oracle Arc timed out before the local model finished. Try again.", providerId: "oracle-arc" };
        }
        return { ok: false, error: "Oracle Arc could not be reached over its configured private connection.", providerId: "oracle-arc" };
      }
    },
  };
}

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
          const error = res.status >= 500 ? "Bud couldn’t reach the model. Try again in a moment." : "Bud couldn’t reply just now. Try again.";
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
          body: JSON.stringify({ model: "gpt-4o-mini", max_tokens: opts?.maxTokens ?? 700, messages }),
        });
        if (!res.ok) {
          const error = res.status >= 500 ? "Bud couldn’t reach the model. Try again in a moment." : "Bud couldn’t reply just now. Try again.";
          return { ok: false, error, providerId: "openai" };
        }
        const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const text = body.choices?.[0]?.message?.content;
        if (!text) return { ok: false, error: "Bud received an empty reply. Try again.", providerId: "openai" };
        return { ok: true, text, providerId: "openai" };
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return { ok: false, error: "The request timed out before Bud could finish the reply. Try again when the connection is stable.", providerId: "openai" };
        }
        return { ok: false, error: "Looks like the connection dropped. Check your network and try again.", providerId: "openai" };
      }
    },
  };
}

/**
 * Personal Oracle Arc is fail-closed: once any Oracle Arc setting is present,
 * do not silently fall back to a cloud provider or share memory across users.
 */
export function getAIProvider(userId?: string): AIProvider {
  const env = typeof process !== "undefined" ? process.env : undefined;
  const oracleUrl = env?.ORACLE_ARC_URL?.trim();
  const oracleKey = env?.ORACLE_ARC_API_KEY?.trim();
  const oracleOwner = env?.ORACLE_ARC_OWNER_ID?.trim();
  const oracleConfigured = Boolean(oracleUrl || oracleKey || oracleOwner);

  if (oracleConfigured) {
    if (!oracleUrl || !oracleKey || !oracleOwner) {
      return unavailableOracleArcProvider("Oracle Arc is not fully configured. Set its URL, API key, and owner ID on the server.");
    }
    if (!userId || userId !== oracleOwner) {
      return unavailableOracleArcProvider("Oracle Arc is private to its configured owner. This account is not authorized to use the personal instance.");
    }
    return oracleArcProvider(oracleUrl, oracleKey, oracleOwner);
  }

  const xai = env?.XAI_API_KEY;
  if (xai && xai.trim()) return xaiProvider(xai.trim());
  const openai = env?.OPENAI_API_KEY;
  if (openai && openai.trim()) return openaiProvider(openai.trim());
  return freeProvider;
}
