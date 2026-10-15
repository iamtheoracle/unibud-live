import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapBud } from "./map";

const SYSTEM = `You are Bud, the campus assistant inside UNIBUD, a student operating environment for universities and colleges.

You help with learning, study planning, campus life, communities, and navigating UNIBUD. Explain complex things in simple, clear language while preserving real depth. Be concise, specific, and respectful.

Safety and honesty:
- Never claim an action happened unless the app confirms it.
- Never invent campus policies, people, institutions, prices, or current facts. Say when you are unsure and point to official sources.
- Never write an assignment or exam answer for a student to submit as their own. Teach the idea and help them improve their attempt.
- Do not present medical, legal, or financial guidance as professional advice.
- Money inside UNIBUD is a demo ledger only. Never imply real money, bank transfers, cards, or NELFUND disbursements moved.
- If a feature is unavailable, say so plainly.
- Prefer short paragraphs and tight lists.`;

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const MODEL_UNAVAILABLE =
  "Bud couldn’t complete that reply just now. Please try again in a moment. Your message is saved.";

async function requestCompletion(
  endpoint: string,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
): Promise<string | null> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: AbortSignal.timeout(25_000),
      body: JSON.stringify({
        model,
        max_tokens: 700,
        messages,
      }),
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as {
      choices?: { message?: { content?: string | null } }[];
    };
    const text = payload.choices?.[0]?.message?.content?.trim();
    return text || null;
  } catch {
    // A provider timeout, network error, or malformed response should not
    // prevent trying the next configured provider.
    return null;
  }
}

/**
 * Use server-owned credentials only. Bud presents one consistent product
 * experience; provider names and credentials are never sent to the browser.
 * Configure at least one provider key in the hosting environment.
 */
async function completeWithFallback(messages: ChatMessage[]): Promise<string> {
  const xaiKey = process.env.XAI_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();

  const providers: Array<() => Promise<string | null>> = [];
  if (xaiKey) {
    providers.push(() =>
      requestCompletion(
        "https://api.x.ai/v1/chat/completions",
        xaiKey,
        process.env.XAI_MODEL?.trim() || "grok-4.5",
        messages,
      ),
    );
  }
  if (openaiKey) {
    providers.push(() =>
      requestCompletion(
        "https://api.openai.com/v1/chat/completions",
        openaiKey,
        process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
        messages,
      ),
    );
  }

  for (const complete of providers) {
    const text = await complete();
    if (text) return text;
  }

  if (providers.length === 0) {
    return "Bud is temporarily unavailable because its AI service is not configured in this environment. Please try again later.";
  }
  return MODEL_UNAVAILABLE;
}

export const listBudMessages = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql`select * from bud_messages where user_id = ${context.userId} order by created_at asc limit 40`;
    return rows.map(mapBud);
  });

export const sendBudMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((content: string) => content.trim().slice(0, 2000))
  .handler(async ({ context, data: content }) => {
    if (!content) throw new Error("Write something first");

    const sql = await getSql();
    await sql`insert into bud_messages (id, user_id, role, content)
      values (${crypto.randomUUID()}, ${context.userId}, ${"user"}, ${content})`;

    const history = await sql<{ role: string; content: string }>`
      select role, content from bud_messages
      where user_id = ${context.userId}
      order by created_at desc
      limit 12`;

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM },
      ...history.reverse().map((row) => ({
        role: row.role as "user" | "assistant",
        content: row.content,
      })),
    ];

    let reply: string;
    try {
      reply = await completeWithFallback(messages);
    } catch {
      // Keep the chat usable even if the provider routing layer unexpectedly
      // fails. Do not leak provider errors, URLs, or credential details.
      reply = MODEL_UNAVAILABLE;
    }

    await sql`insert into bud_messages (id, user_id, role, content)
      values (${crypto.randomUUID()}, ${context.userId}, ${"assistant"}, ${reply})`;

    const rows = await sql`select * from bud_messages where user_id = ${context.userId} order by created_at asc limit 40`;
    return rows.map(mapBud);
  });
