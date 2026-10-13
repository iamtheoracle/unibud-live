import { createServerFn } from "@tanstack/react-start";
import { getAIProvider } from "./provider";
import { assertBudUserFacingText } from "@/lib/agents/response-policy.ts";

const SYSTEM = `You are Bud. You are the student's study buddy and companion inside UNIBUD.
Talk like a calm friend. Use short sentences. Never invent grades, bookings, or account history.
Never claim a capability is working if it is not connected. Guests have no saved history.`;

const guestHits = new Map<string, { n: number; t: number }>();

function guestRateOk(key: string, limit = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const cur = guestHits.get(key);
  if (!cur || now - cur.t > windowMs) {
    guestHits.set(key, { n: 1, t: now });
    return true;
  }
  if (cur.n >= limit) return false;
  cur.n += 1;
  return true;
}

/** Guest path: no auth, no persistence. Conversations are not saved. */
export const askBudGuest = createServerFn({ method: "POST" })
  .validator((input: { prompt: string; history?: { role: "user" | "assistant"; content: string }[] }) => input)
  .handler(async ({ data }) => {
    const prompt = (data.prompt || "").trim();
    if (!prompt) return { ok: false as const, error: "Say something first." };
    if (prompt.length > 2000) return { ok: false as const, error: "Keep it shorter for guest mode." };
    // Coarse rate limit: bucket by prompt length + first chars to avoid a single global key
    // Shared serverless instances still need a distributed limiter; this is a best-effort guard.
    const rateKey = `guest:${prompt.slice(0, 24).length}:${Math.floor(Date.now() / 60_000)}`;
    if (!guestRateOk(rateKey, 30, 60_000)) {
      return { ok: false as const, error: "Too many guest requests. Wait a moment, or sign in." };
    }
    const history = (data.history ?? [])
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-6)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));

    const provider = getAIProvider();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20_000);
    try {
      const result = await provider.complete(
        [
          { role: "system", content: SYSTEM },
          { role: "system", content: "This visitor is a guest. Do not claim prior account history. Be helpful and brief." },
          ...history,
          { role: "user", content: prompt },
        ],
        { maxTokens: 400, signal: controller.signal },
      );
      clearTimeout(timer);
      if (!result.ok) return { ok: false as const, error: result.error };
      try {
        assertBudUserFacingText(result.text);
      } catch {
        return { ok: false as const, error: "I couldn't safely prepare that reply. Try again." };
      }
      return { ok: true as const, text: result.text };
    } catch {
      clearTimeout(timer);
      return { ok: false as const, error: "Bud is unavailable right now. Try again in a moment." };
    }
  });
