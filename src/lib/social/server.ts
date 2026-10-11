import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

type ConversationKind = "direct" | "group" | "class" | "study" | "community";

async function requireMember(userId: string, conversationId: string) {
  const sql = await getSql();
  const rows = await sql`select conversation_id from social_conversation_members
    where conversation_id = ${conversationId} and user_id = ${userId} limit 1`;
  if (!rows[0]) throw new Error("Conversation not found or access denied.");
}

export const createConversation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { memberIds: string[]; title?: string; kind?: ConversationKind }) => input)
  .handler(async ({ context, data }) => {
    const memberIds = [...new Set([context.userId, ...data.memberIds].filter((id) => typeof id === "string" && id.trim()).map((id) => id.trim()))];
    if (memberIds.length > 100) throw new Error("A conversation can have at most 100 members.");
    const kind = data.kind ?? "direct";
    if (!["direct", "group", "class", "study", "community"].includes(kind)) throw new Error("Invalid conversation type.");
    if (kind === "direct" && memberIds.length !== 2) throw new Error("A direct conversation requires two members.");
    if (memberIds.length < 2) throw new Error("Add at least one other member.");
    const title = (data.title ?? "").trim().slice(0, 120);
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql`insert into social_conversations (id, kind, title, created_by) values (${id}, ${kind}, ${title}, ${context.userId})`;
    for (const memberId of memberIds) {
      await sql`insert into social_conversation_members (conversation_id, user_id) values (${id}, ${memberId}) on conflict do nothing`;
    }
    return { id, kind, title, memberIds };
  });

export const listConversations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql`
      select c.id, c.kind, c.title, c.updated_at,
        (select m.body from social_messages m where m.conversation_id = c.id and m.deleted_at is null order by m.created_at desc limit 1) as last_message,
        (select m.created_at from social_messages m where m.conversation_id = c.id and m.deleted_at is null order by m.created_at desc limit 1) as last_message_at,
        (select count(*)::int from social_conversation_members cm where cm.conversation_id = c.id) as member_count
      from social_conversations c
      join social_conversation_members mine on mine.conversation_id = c.id and mine.user_id = ${context.userId}
      order by coalesce((select max(m.created_at) from social_messages m where m.conversation_id = c.id), c.updated_at) desc
      limit 100`;
    return rows.map((r) => ({ id: String(r.id), kind: String(r.kind) as ConversationKind, title: String(r.title), updatedAt: String(r.updated_at), lastMessage: r.last_message == null ? null : String(r.last_message), lastMessageAt: r.last_message_at == null ? null : String(r.last_message_at), memberCount: Number(r.member_count) }));
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { conversationId: string; body: string }) => input)
  .handler(async ({ context, data }) => {
    const body = data.body.trim();
    if (!body || body.length > 10000) throw new Error("Message must contain 1 to 10,000 characters.");
    await requireMember(context.userId, data.conversationId);
    const sql = await getSql();
    const id = crypto.randomUUID();
    const rows = await sql`insert into social_messages (id, conversation_id, sender_id, body)
      values (${id}, ${data.conversationId}, ${context.userId}, ${body})
      returning id, conversation_id, sender_id, body, created_at`;
    await sql`update social_conversations set updated_at = now() where id = ${data.conversationId}`;
    const r = rows[0];
    return { id: String(r.id), conversationId: String(r.conversation_id), senderId: String(r.sender_id), body: String(r.body), createdAt: String(r.created_at) };
  });

export const listMessages = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { conversationId: string; limit?: number }) => input)
  .handler(async ({ context, data }) => {
    await requireMember(context.userId, data.conversationId);
    const limit = Math.max(1, Math.min(100, Math.floor(data.limit ?? 50)));
    const sql = await getSql();
    const rows = await sql.query(
      `select id, conversation_id, sender_id, body, created_at, edited_at
       from social_messages where conversation_id = $1 and deleted_at is null
       order by created_at desc limit $2`,
      [data.conversationId, limit],
    );
    return rows.reverse().map((r) => ({ id: String(r.id), conversationId: String(r.conversation_id), senderId: String(r.sender_id), body: String(r.body), createdAt: String(r.created_at), editedAt: r.edited_at == null ? null : String(r.edited_at) }));
  });

export const markConversationRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((conversationId: string) => conversationId)
  .handler(async ({ context, data }) => {
    await requireMember(context.userId, data);
    const sql = await getSql();
    await sql`update social_conversation_members set last_read_at = now() where conversation_id = ${data} and user_id = ${context.userId}`;
    return { ok: true };
  });


/** Compatibility adapters for the existing Chat screens. */
export const openConversation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { handle: string }) => input)
  .handler(async ({ context, data }) => {
    const handle = typeof data.handle === "string" ? data.handle.trim().toLowerCase() : "";
    if (!/^[a-z0-9_]{2,32}$/.test(handle)) throw new Error("Choose a valid user handle.");
    const sql = await getSql();
    const peerRows = await sql`select user_id from student_profiles where lower(handle) = ${handle} limit 1`;
    if (!peerRows[0]) throw new Error("That person has not joined UNIBUD yet.");
    const peerId = String(peerRows[0].user_id);
    if (peerId === context.userId) throw new Error("You cannot start a conversation with yourself.");
    const found = await sql`
      select c.id from social_conversations c
      join social_conversation_members a on a.conversation_id = c.id and a.user_id = ${context.userId}
      join social_conversation_members b on b.conversation_id = c.id and b.user_id = ${peerId}
      where c.kind = 'direct'
        and (select count(*) from social_conversation_members x where x.conversation_id = c.id) = 2
      limit 1`;
    if (found[0]) return { id: String(found[0].id) };
    return createConversation({ data: { memberIds: [peerId], kind: "direct" } });
  });

export const getConversation = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    await requireMember(context.userId, id);
    const sql = await getSql();
    const c = await sql`select c.id, c.kind, c.title, c.updated_at,
      peer.handle as peer_handle, peer.display_name as peer_name
      from social_conversations c
      join social_conversation_members mine on mine.conversation_id = c.id and mine.user_id = ${context.userId}
      left join social_conversation_members other on other.conversation_id = c.id and other.user_id <> ${context.userId}
      left join student_profiles peer on peer.user_id = other.user_id
      where c.id = ${id} limit 1`;
    if (!c[0]) throw new Error("Conversation not found.");
    const rows = await sql`select id, sender_id, body, created_at from social_messages
      where conversation_id = ${id} and deleted_at is null order by created_at asc limit 100`;
    await sql`update social_conversation_members set last_read_at = now()
      where conversation_id = ${id} and user_id = ${context.userId}`;
    return {
      conversation: { id: String(c[0].id), kind: String(c[0].kind), peerHandle: String(c[0].peer_handle ?? ""), peerName: String(c[0].peer_name ?? ""), title: String(c[0].title ?? "") },
      messages: rows.map(m => ({ id: String(m.id), sender: String(m.sender_id) === context.userId ? "me" : "them", body: String(m.body), createdAt: String(m.created_at) })),
    };
  });
