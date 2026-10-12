import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapBud, mapConversation, mapCourse, mapProfile } from "@/lib/unibud/map";
import { formatStudentContext } from "./context";
import { queryOracleLayer } from "./oracle-layer";
import { getAIProvider } from "./provider";
import { buildBudBrief, type AtlasSnap } from "./brief";
import { advanceMilestone, parseMilestone } from "./milestones";
import { communicationInstruction } from "./communication";
import { inferSparkDomain, sparkSystemNotes } from "./spark";
import { executeThroughSpark } from "@/lib/spark/runtime";
import type { AgentRequest } from "@/lib/agents/core/contracts.ts";
import { assertBudUserFacingText } from "@/lib/agents/response-policy.ts";
import { canReadMedia } from "@/lib/media/access.server";
import { assertConversationMember } from "@/lib/social/server";
import { isSafeShareSource } from "@/lib/media/share";

const SYSTEM = `You are Bud. You are the student's study buddy and companion inside UNIBUD. You are part of a real internal system, but never expose internal agents, routing, providers, or notes.

HOW YOU TALK
Talk like a calm friend who actually understands the person. Use short sentences and everyday words. Simple is not childish. Accuracy still matters. Adapt to the student's language and style naturally. If they use Pidgin or mixed language, you may naturally meet them there. Do not force it.

EXPLANATION
When useful, start with the types or parts, then explain them one by one. Use **bold** only for important words. If the student is confused, try a different explanation instead of repeating the same words. Use a familiar example only when it genuinely helps. Ask whether they understand after a teaching explanation when useful.

CONVERSATION
Do not sound like a customer-service bot. Do not over-explain simple questions. If the student asks for a time, date, route, or other direct fact, answer directly. If they are frustrated, make the next step easier. Do not pretend to have done something that the system did not actually do.

TRUTH
Never invent syllabus topics, grades, attendance, exam dates, memories, messages, bookings, purchases, reminders, trends, generated media, or agent activity. A capability is either actually connected and executed, or it is unavailable. Never describe skipped or failed internal work as completed.

ACADEMIC
Use enrolled syllabus data for course questions. Do not invent topics. Help students learn and reason rather than submitting work dishonestly for them.

NAVIGATION
Do not create duplicate UNIBUD spaces inside Bud. When a real navigation action is available, use the real route supplied by the application. Never invent a route.

The goal is for the student to feel understood, not managed.`;

function titleFrom(prompt: string) {
  const t = prompt.replace(/\s+/g, " ").trim();
  return t.length > 42 ? `${t.slice(0, 42).trim()}…` : t || "New conversation";
}

const inflight = new Map<string, number>();

// Bound user-controlled payloads before they are persisted or sent to a provider.
const MAX_BUD_PROMPT_CHARS = 20_000;
const MAX_ATTACHMENT_EXCERPT_CHARS = 12_000;
const MAX_MEDIA_SRC_CHARS = 2_048;

async function backfillLegacy(sql: Awaited<ReturnType<typeof getSql>>, userId: string) {
  const orphans = await sql<{ id: string }>`select id from bud_messages where user_id = ${userId} and conversation_id is null limit 1`;
  if (!orphans.length) return;
  const id = crypto.randomUUID();
  const first = await sql<{ content: string }>`select content from bud_messages where user_id = ${userId} and conversation_id is null and role = 'user' order by created_at asc limit 1`;
  await sql`insert into bud_conversations (id, user_id, title) values (${id}, ${userId}, ${titleFrom(first[0]?.content ?? "Earlier conversation")})`;
  await sql`update bud_messages set conversation_id = ${id} where user_id = ${userId} and conversation_id is null`;
}

export const listBudConversations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(async ({ context }) => {
  const sql = await getSql();
  await backfillLegacy(sql, context.userId);
  const rows = await sql<{ id: string; title: string; updated_at: string; preview: string | null }>`
    select c.id, c.title, c.updated_at, (select m.content from bud_messages m where m.conversation_id = c.id and m.user_id = c.user_id order by m.created_at desc limit 1) as preview
    from bud_conversations c where c.user_id = ${context.userId} order by c.updated_at desc limit 40`;
  return rows.map(mapConversation);
});

export const getBudThread = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input?: { conversationId?: string }) => input ?? {}).handler(async ({ context, data }) => {
  const sql = await getSql();
  await backfillLegacy(sql, context.userId);
  if (data.conversationId) {
    const rows = await sql`select * from bud_messages where user_id = ${context.userId} and conversation_id = ${data.conversationId} order by created_at asc limit 120`;
    return rows.map((r) => mapBud(r as Parameters<typeof mapBud>[0]));
  }
  const rows = await sql`select * from bud_messages where user_id = ${context.userId} order by created_at asc limit 80`;
  return rows.map((r) => mapBud(r as Parameters<typeof mapBud>[0]));
});

export const createBudConversation = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(async ({ context }) => {
  const sql = await getSql();
  const id = crypto.randomUUID();
  await sql`insert into bud_conversations (id, user_id, title) values (${id}, ${context.userId}, ${"New conversation"})`;
  return { id, title: "New conversation", updatedAt: new Date().toISOString(), preview: "" };
});

export const deleteBudConversation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input: { id: string }) => input).handler(async ({ context, data }) => {
  const sql = await getSql();
  await sql`delete from bud_messages where user_id = ${context.userId} and conversation_id = ${data.id}`;
  await sql`delete from bud_conversations where user_id = ${context.userId} and id = ${data.id}`;
  return { ok: true as const };
});

export const retryBud = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input: { conversationId: string }) => input).handler(async ({ context, data }) => {
  const sql = await getSql();
  // Retry must target a conversation owned by this user, not merely a matching message row.
  const ownedConversation = await sql<{ id: string }>`select id from bud_conversations where id = ${data.conversationId} and user_id = ${context.userId} limit 1`;
  if (!ownedConversation.length) {
    return { ok: false as const, error: "Conversation not found.", conversationId: data.conversationId };
  }
  const last = await sql<{ content: string }>`select content from bud_messages where user_id = ${context.userId} and conversation_id = ${data.conversationId} and role = 'user' order by created_at desc limit 1`;
  const prompt = last[0]?.content;
  if (!prompt) return { ok: false as const, error: "Nothing to retry." };
  return runAsk(sql, context.userId, prompt, data.conversationId);
});

export const askBudGuest = createServerFn({ method: "POST" })
  .validator((input: { prompt: string; history?: { role: "user" | "assistant"; content: string }[] }) => input)
  .handler(async ({ data }) => {
    const { runGuestBud } = await import("./guest.server");
    return runGuestBud(data);
  });

export const askBud = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input: {
  prompt: string;
  conversationId?: string;
  attachment?: { name: string; kind: string; excerpt?: string };
  media?: { kind: "audio" | "image" | "gif" | "file" | "voice"; mediaId?: string; src?: string; name?: string };
  fromPath?: string;
  atlas?: AtlasSnap;
}) => input).handler(async ({ context, data }) => {
  const prompt = data.prompt.trim() || (data.media?.kind === "voice" ? "Voice note" : data.media ? `Sent ${data.media.kind}` : "");
  if (!prompt && !data.media) return { ok: false as const, error: "Say something first." };
  if (prompt.length > MAX_BUD_PROMPT_CHARS) {
    return { ok: false as const, error: "That message is too long. Keep it under 20,000 characters." };
  }
  if (data.attachment) {
    if (data.attachment.name.length > 255 || data.attachment.kind.length > 80) {
      return { ok: false as const, error: "Attachment details are too long." };
    }
    if ((data.attachment.excerpt?.length ?? 0) > MAX_ATTACHMENT_EXCERPT_CHARS) {
      return { ok: false as const, error: "That attachment excerpt is too long. Attach the file and ask Bud to summarize a section." };
    }
  }
  if (data.media) {
    if ((data.media.name?.length ?? 0) > 255 || (data.media.mediaId?.length ?? 0) > 200) {
      return { ok: false as const, error: "Media details are invalid or too long." };
    }
    if ((data.media.src?.length ?? 0) > MAX_MEDIA_SRC_CHARS) {
      return { ok: false as const, error: "This media needs to finish uploading before you send it to Bud." };
    }
    if (data.media.src !== undefined && !isSafeShareSource(data.media.src)) {
      return { ok: false as const, error: "That media source is not a supported URL. Finish uploading the file and try again." };
    }
  }
  const sql = await getSql();
  if (data.media?.mediaId) {
    const mediaRows = await sql`select owner_id, status, visibility, conversation_id, room_id
      from media_assets where id = ${data.media.mediaId} and status = ${"ready"} limit 1`;
    const mediaRow = mediaRows[0];
    if (!mediaRow) {
      return { ok: false as const, error: "Media item not found or access denied." };
    }
    const allowed = await canReadMedia({
      userId: context.userId,
      row: mediaRow,
      assertConversationMember,
      isRoomMember: async (memberId, roomId) => {
        const membership = await sql`select r.id, r.community_id from campus_rooms r
          join campus_room_members m on m.room_id = r.id and m.user_id = ${memberId}
          where r.id = ${roomId} limit 1`;
        if (!membership[0]) return false;
        if (membership[0].community_id) {
          const communityMember = await sql`select user_id from community_members
            where community_id = ${String(membership[0].community_id)} and user_id = ${memberId} limit 1`;
          if (!communityMember[0]) return false;
        }
        return true;
      },
    });
    if (!allowed) {
      return { ok: false as const, error: "Media item not found or access denied." };
    }
  }
  let conversationId = data.conversationId;
  if (conversationId) {
    // A caller must own the target conversation before any message is written.
    // Without this check, a user could attach their message rows to another user's conversation ID.
    const ownedConversation = await sql<{ id: string }>`select id from bud_conversations where id = ${conversationId} and user_id = ${context.userId} limit 1`;
    if (!ownedConversation.length) {
      return { ok: false as const, error: "Conversation not found.", conversationId };
    }
  } else {
    conversationId = crypto.randomUUID();
    await sql`insert into bud_conversations (id, user_id, title) values (${conversationId}, ${context.userId}, ${titleFrom(prompt)})`;
  }
  const attached = data.attachment ? `\n\n[Attached: ${data.attachment.name} (${data.attachment.kind})${data.attachment.excerpt ? `\n${data.attachment.excerpt}` : ""}]` : "";
  return runAsk(sql, context.userId, prompt + attached, conversationId, titleFrom(prompt), { fromPath: data.fromPath, atlas: data.atlas, media: data.media });
});

async function runAsk(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
  prompt: string,
  conversationId: string,
  title?: string,
  extra?: { fromPath?: string; atlas?: AtlasSnap; media?: { kind: "audio" | "image" | "gif" | "file" | "voice"; mediaId?: string; src?: string; name?: string } },
): Promise<{ ok: true; text: string; conversationId: string } | { ok: false; error: string; conversationId: string }> {
  const dupKey = `${userId}:${conversationId}:${prompt.slice(0, 80)}`;
  const now = Date.now();
  const last = inflight.get(dupKey) ?? 0;
  if (now - last < 2500) return { ok: false, error: "Give Bud a second — that just went out.", conversationId };
  inflight.set(dupKey, now);

  const mediaJson = extra?.media ? JSON.stringify({ ...extra.media, status: "ready" }) : null;
  try {
    await sql`insert into bud_messages (id, user_id, role, content, conversation_id, media_json) values (${crypto.randomUUID()}, ${userId}, ${"user"}, ${prompt}, ${conversationId}, ${mediaJson})`;
  } catch {
    await sql`insert into bud_messages (id, user_id, role, content, conversation_id) values (${crypto.randomUUID()}, ${userId}, ${"user"}, ${prompt}, ${conversationId})`;
  }
  if (title) await sql`update bud_conversations set title = ${title}, updated_at = now() where id = ${conversationId} and user_id = ${userId} and title = 'New conversation'`;
  else await sql`update bud_conversations set updated_at = now() where id = ${conversationId} and user_id = ${userId}`;

  const requestId = crypto.randomUUID();

  const history = (await sql`select role, content from bud_messages where user_id = ${userId} and conversation_id = ${conversationId} order by created_at desc limit 12`).reverse().map((r) => ({ role: r.role as "user" | "assistant", content: String(r.content) }));
  const profileRows = await sql`select * from student_profiles where user_id = ${userId} limit 1`;
  const courseRows = await sql`select * from courses where user_id = ${userId}`;
  const courses = courseRows.map((r) => mapCourse(r as Parameters<typeof mapCourse>[0]));
  let enrolledCodes: string[] = [];
  try {
    const en = await sql<{ course_code: string }>`select course_code from enrollments where user_id = ${userId}`;
    enrolledCodes = en.map((r) => r.course_code);
  } catch { enrolledCodes = []; }
  const profile = profileRows[0] ? mapProfile(profileRows[0] as Parameters<typeof mapProfile>[0]) : null;
  const contextLine = formatStudentContext(profile, courses, enrolledCodes, prompt);
  const sparkRequest: AgentRequest = {
    id: requestId,
    source: "user",
    target: "spark",
    intent: prompt,
    input: prompt,
    context: { fromPath: extra?.fromPath, media: extra?.media, atlas: extra?.atlas },
    traceId: requestId,
  };
  const sparkExecution = executeThroughSpark({
    request: sparkRequest,
    route: { intent: prompt, domain: inferSparkDomain(prompt) },
    authorizedContext: { userId },
    availableCapabilities: [],
    authorization: "unknown",
  });
  const executionLine = `Spark orchestration result: ${sparkExecution.budMessage}`;

  let milestoneJson: string | null = null;
  try {
    const mileRows = await sql<{ milestone_json?: string | null }>`select milestone_json from bud_conversations where id = ${conversationId} and user_id = ${userId} limit 1`;
    milestoneJson = mileRows[0]?.milestone_json ?? null;
  } catch { milestoneJson = null; }
  const milestone = advanceMilestone(parseMilestone(milestoneJson), prompt);
  try { await sql`update bud_conversations set milestone_json = ${JSON.stringify(milestone)} where id = ${conversationId} and user_id = ${userId}`; } catch { /* optional migration */ }

  const brief = buildBudBrief({ prompt, milestone, atlas: extra?.atlas, fromPath: extra?.fromPath });
  const oracle = await queryOracleLayer({ query: prompt, studentId: userId });
  const oracleLine = oracle ? `Verified internal context: ${oracle.summary}` : null;
  const sparkNotes = sparkSystemNotes(prompt).join("\n");
  const communication = communicationInstruction(prompt);

  const provider = getAIProvider();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 22_000);
  let result = await provider.complete([
    { role: "system", content: SYSTEM },
    { role: "system", content: contextLine },
    { role: "system", content: brief },
    { role: "system", content: sparkNotes },
    { role: "system", content: communication },
    { role: "system", content: executionLine },
    ...(oracleLine ? [{ role: "system" as const, content: oracleLine }] : []),
    ...history,
  ], { maxTokens: 500, signal: controller.signal });
  clearTimeout(timer);

  let reply = result.ok ? result.text : result.error;
  if (result.ok) {
    try {
      assertBudUserFacingText(reply);
    } catch {
      reply = "I couldn’t safely prepare that reply. Try again and I’ll keep it clear.";
      result = { ok: false, error: reply, providerId: result.providerId };
    }
  }
  try {
    await sql`insert into bud_messages (id, user_id, role, content, conversation_id) values (${crypto.randomUUID()}, ${userId}, ${"assistant"}, ${reply}, ${conversationId})`;
  } catch {
    await sql`insert into bud_messages (id, user_id, role, content, conversation_id) values (${crypto.randomUUID()}, ${userId}, ${"assistant"}, ${reply}, ${conversationId})`;
  }
  if (!result.ok) return { ok: false, error: result.error, conversationId };
  return { ok: true, text: reply, conversationId };
}
