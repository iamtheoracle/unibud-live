import { getRequest } from "@tanstack/react-start/server";
import { getAIProvider } from "./provider";
import { assertBudUserFacingText } from "@/lib/agents/response-policy";
import { assertSameSiteRequest } from "@/lib/auth/isolation.server";

type GuestTurn = { role: "user" | "assistant"; content: string };
type Bucket = { startedAt: number; count: number };
const buckets = new Map<string, Bucket>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;
const MAX_PROMPT_CHARS = 2_000;

export async function runGuestBud(input: { prompt: string; history?: GuestTurn[] }) {
  assertSameSiteRequest();
  const prompt = input.prompt.trim();
  if (!prompt) return { ok: false as const, error: "Write a question first." };
  if (prompt.length > MAX_PROMPT_CHARS) {
    return { ok: false as const, error: "Guest messages must be 2,000 characters or fewer. Sign in for longer study sessions." };
  }
  const history = (input.history ?? []).slice(-6);
  if (history.some((turn) => !turn || !["user", "assistant"].includes(turn.role) || typeof turn.content !== "string" || turn.content.length > MAX_PROMPT_CHARS)) {
    return { ok: false as const, error: "That conversation could not be processed. Please try again." };
  }
  const request = getRequest();
  const ip = request?.headers.get("x-nf-client-connection-ip")?.trim()
    || request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (!ip) return { ok: false as const, error: "Guest chat is temporarily unavailable. Sign in to continue." };
  const now = Date.now();
  const current = buckets.get(ip);
  if (!current || now - current.startedAt >= WINDOW_MS) {
    buckets.set(ip, { startedAt: now, count: 1 });
  } else if (current.count >= MAX_REQUESTS) {
    return { ok: false as const, error: "Guest chat is taking a short break. Sign in for a saved conversation, or try again in a few minutes." };
  } else {
    current.count += 1;
  }
  // Keep the in-memory limiter bounded on long-lived instances.
  if (buckets.size > 2_000) {
    for (const [key, value] of buckets) {
      if (now - value.startedAt >= WINDOW_MS) buckets.delete(key);
      if (buckets.size <= 1_500) break;
    }
  }
  const provider = getAIProvider();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 22_000);
  try {
    const result = await provider.complete([
      { role: "system", content: "You are Bud, a study companion. Give accurate, clear help in everyday language. Do not invent course records, grades, attendance, deadlines, or personal memories. You have no account, enrollment, or saved-history context for this guest. If a request needs private academic data or an account-only feature, say so plainly. Do not claim to save this conversation. Keep replies useful and concise." },
      ...history,
      { role: "user", content: prompt },
    ], { maxTokens: 450, signal: controller.signal });
    if (!result.ok) return { ok: false as const, error: result.error };
    try {
      assertBudUserFacingText(result.text);
    } catch {
      return { ok: false as const, error: "I couldn’t safely prepare that reply. Please try again." };
    }
    return { ok: true as const, text: result.text };
  } catch {
    return { ok: false as const, error: "Bud couldn’t reply just now. Try again when the connection is available." };
  } finally {
    clearTimeout(timer);
  }
}
