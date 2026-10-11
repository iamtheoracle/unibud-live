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
    if (!["direct", "group", "study", "class", "community"].includes(kind)) throw new Error("Invalid conversation type.");
    // Class and community threads must be created through resource-aware flows
    // that can verify course enrollment or community membership. This generic
    // endpoint has no resource ID, so fail closed instead of creating orphaned
    // threads that bypass those boundaries.
    if (kind === "class" || kind === "community") {
      throw new Error("Class and community conversations must be opened from their course or community.");
    }
    if (kind === "direct" && memberIds.length !== 2) throw new Error("A direct conversation requires two members.");
    if (memberIds.length < 2) throw new Error("Add at least one other member.");
    const title = (data.title ?? "").trim().slice(0, 120);
    const sql = await getSql();
    // Only allow accounts with a real UNIBUD profile into member lists.
    // The current user may still be finishing profile setup.
    for (const memberId of memberIds) {
      if (memberId === context.userId) continue;
      const profile = await sql`select user_id from student_profiles where user_id = ${memberId} limit 1`;
      if (!profile[0]) throw new Error("One or more members have not joined UNIBUD yet.");
    }
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
        peer.handle as peer_handle,
        (select m.body from social_messages m where m.conversation_id = c.id and m.deleted_at is null order by m.created_at desc limit 1) as last_message,
        (select m.created_at from social_messages m where m.conversation_id = c.id and m.deleted_at is null order by m.created_at desc limit 1) as last_message_at,
        (select count(*)::int from social_conversation_members cm where cm.conversation_id = c.id) as member_count
      from social_conversations c
      join social_conversation_members mine on mine.conversation_id = c.id and mine.user_id = ${context.userId}
      left join lateral (
        select cm.user_id from social_conversation_members cm
        where cm.conversation_id = c.id and cm.user_id <> ${context.userId}
        order by cm.joined_at asc limit 1
      ) other on true
      left join student_profiles peer on peer.user_id = other.user_id
      order by coalesce((select max(m.created_at) from social_messages m where m.conversation_id = c.id), c.updated_at) desc
      limit 100`;
    return rows.map((r) => ({ id: String(r.id), kind: String(r.kind) as ConversationKind, title: String(r.title), peerHandle: String(r.peer_handle ?? ""), updatedAt: String(r.updated_at), lastBody: r.last_message == null ? "" : String(r.last_message), lastMessage: r.last_message == null ? null : String(r.last_message), lastMessageAt: r.last_message_at == null ? null : String(r.last_message_at), memberCount: Number(r.member_count) }));
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { conversationId: string; body: string; mediaId?: string; shareKind?: string; shareJson?: string }) => input)
  .handler(async ({ context, data }) => {
    const body = (data.body ?? "").trim();
    if ((!body && !data.mediaId && !data.shareJson) || body.length > 10000) throw new Error("Message must contain text or an attachment, up to 10,000 characters.");
    await requireMember(context.userId, data.conversationId);
    const sql = await getSql();
    const id = crypto.randomUUID();
    const rows = await sql`insert into social_messages (id, conversation_id, sender_id, body, media_id, share_kind, share_json)
      values (${id}, ${data.conversationId}, ${context.userId}, ${body || data.shareKind || "Attachment"}, ${data.mediaId ?? null}, ${data.shareKind ?? null}, ${data.shareJson ?? null})
      returning id, conversation_id, sender_id, body, created_at, media_id, share_kind, share_json`;
    await sql`update social_conversations set updated_at = now() where id = ${data.conversationId}`;
    const r = rows[0];
    return { id: String(r.id), conversationId: String(r.conversation_id), senderId: String(r.sender_id), body: String(r.body), createdAt: String(r.created_at), mediaId: r.media_id == null ? null : String(r.media_id), shareKind: r.share_kind == null ? null : String(r.share_kind), shareJson: r.share_json == null ? null : String(r.share_json) };
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


/** Create a persistent community post using the signed-in user's profile. */
export const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { communityId: string; body: string; image?: string; video?: string; kind?: string }) => input)
  .handler(async ({ context, data }) => {
    const communityId = data.communityId.trim();
    const body = data.body.trim();
    if (!communityId || !body || body.length > 10000) throw new Error("A post needs a community and text up to 10,000 characters.");
    const sql = await getSql();
    const community = await sql`select id, privacy from communities where id = ${communityId} limit 1`;
    if (!community[0]) throw new Error("Community not found.");
    const privacy = String(community[0].privacy ?? "public");
    if (privacy === "campus") {
      const [memberProfile, communityUniversity] = await Promise.all([
        sql`select university_id from student_profiles where user_id = ${context.userId} limit 1`,
        sql`select university_id from communities where id = ${communityId} limit 1`,
      ]);
      if (!memberProfile[0] || !communityUniversity[0]?.university_id || String(memberProfile[0].university_id) !== String(communityUniversity[0].university_id)) {
        throw new Error("This Quad is limited to its university community.");
      }
      const membership = await sql`select user_id from community_members where user_id = ${context.userId} and community_id = ${communityId} limit 1`;
      if (!membership[0]) throw new Error("Join this campus Quad before posting.");
    }
    if (privacy === "private") {
      const membership = await sql`select user_id from community_members where user_id = ${context.userId} and community_id = ${communityId} limit 1`;
      if (!membership[0]) throw new Error("You must be invited to this private community before posting.");
    }
    const profile = await sql`select handle from student_profiles where user_id = ${context.userId} limit 1`;
    if (!profile[0]) throw new Error("Finish setting up your UNIBUD profile before posting.");
    const id = `post_${crypto.randomUUID()}`;
    await sql`insert into posts (id, community_id, author_handle, body, image, video, kind) values (${id}, ${communityId}, ${profile[0].handle}, ${body}, ${data.image ?? null}, ${data.video ?? null}, ${data.kind === "reel" ? "reel" : "post"})`;
    return { id, communityId, body, handle: String(profile[0].handle) };
  });

export const joinCommunity = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((communityId: string) => communityId)
  .handler(async ({ context, data: communityId }) => {
    const sql = await getSql();
    const exists = await sql`select id, privacy from communities where id = ${communityId} limit 1`;
    if (!exists[0]) throw new Error("Community not found.");
    const privacy = String(exists[0].privacy ?? "public");
    if (privacy === "campus") {
      const [profile, community] = await Promise.all([
        sql`select university_id from student_profiles where user_id = ${context.userId} limit 1`,
        sql`select university_id from communities where id = ${communityId} limit 1`,
      ]);
      if (!profile[0] || !community[0]?.university_id || String(profile[0].university_id) !== String(community[0].university_id)) {
        throw new Error("This Quad is limited to its university community.");
      }
    }
    if (privacy === "private") {
      const membership = await sql`select user_id from community_members where user_id = ${context.userId} and community_id = ${communityId} limit 1`;
      if (!membership[0]) throw new Error("This community is private. Ask an admin to invite you.");
      return { joined: true, communityId };
    }
    await sql`insert into community_members (user_id, community_id) values (${context.userId}, ${communityId}) on conflict do nothing`;
    const count = await sql`select count(*)::int as count from community_members where community_id = ${communityId}`;
    await sql`update communities set members = ${Number(count[0]?.count ?? 0)} where id = ${communityId}`;
    return { joined: true, communityId };
  });

export const myCommunities = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql`select community_id from community_members where user_id = ${context.userId} order by created_at desc`;
    return rows.map((row) => String(row.community_id));
  });

/** Real, registered profiles for the direct-message picker. Never suggest fictional directory entries. */
export const listChatPeople = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql`
      select user_id, handle, display_name
      from student_profiles
      where user_id <> ${context.userId}
        and handle is not null and length(trim(handle)) > 0
      order by display_name asc nulls last, handle asc
      limit 30`;
    return rows.map((row) => ({
      userId: String(row.user_id),
      handle: String(row.handle),
      name: String(row.display_name ?? row.handle),
    }));
  });

/** Compatibility adapters for the existing Chat screens. */
export const openConversation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { handle: string; listingId?: string; seed?: string }) => input)
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
    if (found[0]) {
      const id = String(found[0].id);
      if (data.seed?.trim()) {
        const prior = await sql`select id from social_messages where conversation_id = ${id} and sender_id = ${context.userId} and body = ${data.seed.trim()} limit 1`;
        if (!prior[0]) {
          await sql`insert into social_messages (id, conversation_id, sender_id, body) values (${crypto.randomUUID()}, ${id}, ${context.userId}, ${data.seed.trim().slice(0, 10000)})`;
          await sql`update social_conversations set updated_at = now() where id = ${id}`;
        }
      }
      return { id };
    }
    const conversationId = crypto.randomUUID();
    await sql`insert into social_conversations (id, kind, title, created_by) values (${conversationId}, 'direct', '', ${context.userId})`;
    await sql`insert into social_conversation_members (conversation_id, user_id) values (${conversationId}, ${context.userId}), (${conversationId}, ${peerId})`;
    if (data.seed?.trim()) {
      await sql`insert into social_messages (id, conversation_id, sender_id, body) values (${crypto.randomUUID()}, ${conversationId}, ${context.userId}, ${data.seed.trim().slice(0, 10000)})`;
      await sql`update social_conversations set updated_at = now() where id = ${conversationId}`;
    }
    return { id: conversationId };
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
      left join lateral (
        select cm.user_id from social_conversation_members cm
        where cm.conversation_id = c.id and cm.user_id <> ${context.userId}
        order by cm.joined_at asc limit 1
      ) other on true
      left join student_profiles peer on peer.user_id = other.user_id
      where c.id = ${id} limit 1`;
    if (!c[0]) throw new Error("Conversation not found.");
    const rows = await sql`select id, sender_id, body, created_at, media_id, share_kind, share_json from social_messages
      where conversation_id = ${id} and deleted_at is null order by created_at asc limit 100`;
    await sql`update social_conversation_members set last_read_at = now()
      where conversation_id = ${id} and user_id = ${context.userId}`;
    return {
      conversation: { id: String(c[0].id), kind: String(c[0].kind), peerHandle: String(c[0].peer_handle ?? ""), peerName: String(c[0].peer_name ?? ""), title: String(c[0].title ?? "") },
      messages: rows.map(m => ({ id: String(m.id), sender: String(m.sender_id) === context.userId ? "me" : "them", body: String(m.body), createdAt: String(m.created_at), mediaId: m.media_id == null ? null : String(m.media_id), shareKind: m.share_kind == null ? null : String(m.share_kind), shareJson: m.share_json == null ? null : String(m.share_json) })),
    };
  });
