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
          body: JSON.stringify({
            model: "gpt-4o-mini",
            max_tokens: opts?.maxTokens ?? 700,
            messages,
          }),
        });
        if (!res.ok) {
          const error =
            res.status >= 500
              ? "Bud couldn’t reach the model. Try again in a moment."
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

/**
 * Try providers in order, giving each its own timeout budget. A timed-out first
 * provider must not poison the fallback with an already-aborted shared signal.
 * A caller cancellation still stops the chain immediately.
 */
export function createFallbackProvider(providers: AIProvider[], timeoutMs = 10_000): AIProvider {
  if (providers.length === 0) return freeProvider;
  if (providers.length === 1) return providers[0];

  return {
    id: providers.map((provider) => provider.id).join("->"),
    kind: "remote",
    capabilities: [...new Set(providers.flatMap((provider) => provider.capabilities))],
    async complete(messages, opts) {
      let lastResult: ProviderResult | undefined;
      for (const provider of providers) {
        if (opts?.signal?.aborted) {
          return lastResult ?? { ok: false, error: "The request was cancelled before Bud could finish the reply.", providerId: provider.id };
        }
        const controller = new AbortController();
        let timedOut = false;
        const abortFromCaller = () => controller.abort(opts?.signal?.reason);
        opts?.signal?.addEventListener("abort", abortFromCaller, { once: true });
        const timeout = setTimeout(() => {
          timedOut = true;
          controller.abort();
        }, timeoutMs);
        let result: ProviderResult;
        try {
          result = await provider.complete(messages, { ...opts, signal: controller.signal });
        } catch {
          result = { ok: false, error: "The model provider failed unexpectedly. Trying the next available model.", providerId: provider.id };
        } finally {
          clearTimeout(timeout);
          opts?.signal?.removeEventListener("abort", abortFromCaller);
        }
        if (result.ok) return result;
        lastResult = result;
        // A caller cancellation is different from a provider-specific timeout:
        // do not start another network request after the caller has cancelled.
        if (opts?.signal?.aborted) return lastResult;
        if (timedOut) {
          lastResult = {
            ok: false,
            error: "The request timed out before Bud could finish the reply. Trying the next available model.",
            providerId: provider.id,
          };
        }
      }
      // Keep the final real provider error. Never turn a failed model call into fake success.
      return lastResult ?? freeProvider.complete(messages, opts);
    },
  };
}

export function getAIProvider(): AIProvider {
  const xai = typeof process !== "undefined" ? process.env.XAI_API_KEY : undefined;
  const openai = typeof process !== "undefined" ? process.env.OPENAI_API_KEY : undefined;
  const providers: AIProvider[] = [];

  // Prefer xAI, then fall back to OpenAI if both are configured.
  if (xai && xai.trim()) providers.push(xaiProvider(xai.trim()));
  if (openai && openai.trim()) providers.push(openaiProvider(openai.trim()));
  return createFallbackProvider(providers);
}
