import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { isSafeShareSource, parseShareJson } from "@/lib/media/share";
import { courseByCode } from "@/lib/unibud/academic";
import { canTeach, type CampusRole } from "@/lib/unibud/roles";
import { resolveStoredQuadPrivacy } from "@/lib/unibud/quad-privacy";
import { isAudioAvailableForSharing } from "@/lib/music/audio-policy";

type ConversationKind = "direct" | "group" | "class" | "study" | "community";

export async function assertConversationMember(userId: string, conversationId: string) {
  await requireMember(userId, conversationId);
}

async function requireMember(userId: string, conversationId: string) {
  const sql = await getSql();
  const rows = await sql`
    select c.id, c.kind, c.course_code
    from social_conversations c
    join social_conversation_members scm
      on scm.conversation_id = c.id and scm.user_id = ${userId}
    left join community_members cm
      on cm.community_id = c.community_id and cm.user_id = ${userId}
    where c.id = ${conversationId}
      and (c.kind <> 'community' or (c.community_id is not null and cm.user_id is not null))
    limit 1
  `;
  if (!rows[0]) throw new Error("Conversation not found or access denied.");
  if (String(rows[0].kind) === "class") {
    const code = String(rows[0].course_code ?? "");
    const course = courseByCode(code);
    if (!course) throw new Error("Course conversation is no longer available.");
    const profiles = await sql`select campus_role, handle from student_profiles where user_id = ${userId} limit 1`;
    const profile = profiles[0];
    const assigned = Boolean(profile && canTeach(String(profile.campus_role) as CampusRole) && String(profile.handle) === course.lecturerHandle);
    const enrollment = await sql`select id from enrollments where user_id = ${userId} and course_code = ${code} limit 1`;
    if (!assigned && !enrollment[0]) throw new Error("You must be enrolled in this course to access its class chat.");
  }
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
    // Keep the conversation and its initial membership in one atomic statement.
    // If any membership insert fails, the conversation insert rolls back too.
    const createdMembers = await sql`
      with new_conversation as (
        insert into social_conversations (id, kind, title, created_by)
        values (${id}, ${kind}, ${title}, ${context.userId})
        returning id
      )
      insert into social_conversation_members (conversation_id, user_id)
      select new_conversation.id, members.user_id
      from new_conversation
      cross join unnest(${memberIds}::text[]) as members(user_id)
      on conflict (conversation_id, user_id) do nothing
      returning user_id
    `;
    if (createdMembers.length !== memberIds.length) {
      throw new Error("Conversation membership could not be initialized. Please retry.");
    }
    return { id, kind, title, memberIds };
  });

export const listConversations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql`
      select c.id, c.kind, c.title, c.course_code, c.updated_at,
        peer.handle as peer_handle,
        (select m.body from social_messages m where m.conversation_id = c.id and m.deleted_at is null order by m.created_at desc limit 1) as last_message,
        (select m.created_at from social_messages m where m.conversation_id = c.id and m.deleted_at is null order by m.created_at desc limit 1) as last_message_at,
        (select count(*)::int from social_conversation_members cm where cm.conversation_id = c.id) as member_count
      from social_conversations c
      join social_conversation_members mine on mine.conversation_id = c.id and mine.user_id = ${context.userId}
      left join community_members current_community_member
        on current_community_member.community_id = c.community_id
        and current_community_member.user_id = ${context.userId}
      left join lateral (
        select cm.user_id from social_conversation_members cm
        where cm.conversation_id = c.id and cm.user_id <> ${context.userId}
        order by cm.joined_at asc limit 1
      ) other on true
      left join student_profiles peer on peer.user_id = other.user_id
      where (c.kind <> 'community' or (c.community_id is not null and current_community_member.user_id is not null))
      order by coalesce((select max(m.created_at) from social_messages m where m.conversation_id = c.id), c.updated_at) desc
      limit 100`;
    const visible = [];
    for (const row of rows) {
      if (String(row.kind) === "class") {
        const code = String(row.course_code ?? "");
        const course = courseByCode(code);
        if (!course) continue;
        const [profileRows, enrollmentRows] = await Promise.all([
          sql`select campus_role, handle from student_profiles where user_id = ${context.userId} limit 1`,
          sql`select id from enrollments where user_id = ${context.userId} and course_code = ${code} limit 1`,
        ]);
        const profile = profileRows[0];
        const assigned = Boolean(profile && canTeach(String(profile.campus_role) as CampusRole) && String(profile.handle) === course.lecturerHandle);
        if (!assigned && !enrollmentRows[0]) continue;
      }
      visible.push(row);
    }
    return visible.map((r) => ({ id: String(r.id), kind: String(r.kind) as ConversationKind, title: String(r.title), peerHandle: String(r.peer_handle ?? ""), updatedAt: String(r.updated_at), lastBody: r.last_message == null ? "" : String(r.last_message), lastMessage: r.last_message == null ? null : String(r.last_message), lastMessageAt: r.last_message_at == null ? null : String(r.last_message_at), memberCount: Number(r.member_count) }));
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { conversationId: string; body: string; mediaId?: string; shareKind?: string; shareJson?: string }) => input)
  .handler(async ({ context, data }) => {
    const body = (data.body ?? "").trim();
    if ((!body && !data.mediaId && !data.shareJson) || body.length > 10000) throw new Error("Message must contain text or an attachment, up to 10,000 characters.");
    const allowedShareKinds = new Set(["audio", "video", "photo", "bud", "file"]);
    if (data.shareKind && !allowedShareKinds.has(data.shareKind)) throw new Error("Unsupported attachment type.");
    if (data.shareKind && !data.mediaId && !data.shareJson) {
      throw new Error("Attachment details are required when an attachment type is selected.");
    }
    const shared = data.shareJson ? parseShareJson(data.shareJson) : undefined;
    if (data.shareJson && !shared) {
      throw new Error("Invalid attachment details.");
    }
    if (shared && data.shareKind && shared.kind !== data.shareKind) {
      throw new Error("Attachment type does not match its details.");
    }
    await requireMember(context.userId, data.conversationId);
    const sql = await getSql();
    const conversationMediaIds = [data.mediaId, shared?.mediaId].filter((id): id is string => Boolean(id));
    for (const mediaId of new Set(conversationMediaIds)) {
      const media = await sql`select id from media_assets
        where id = ${mediaId}
          and owner_id = ${context.userId}
          and conversation_id = ${data.conversationId}
          and room_id is null
          and visibility = ${"conversation"}
          and status = ${"ready"}
        limit 1`;
      if (!media[0]) throw new Error("Attachment is not ready, not owned by you, or does not belong to this conversation.");
    }
    if (shared?.budMediaId) {
      const budMedia = await sql`select id from bud_media where id = ${shared.budMediaId}
        and owner_id = ${context.userId}
        and status = ${"ready"}
        and media_id is not null
        limit 1`;
      if (!budMedia[0]) throw new Error("Bud attachment not found or access denied.");
    }
    if (shared?.audioId) {
      const audio = await sql`select audio_id, status from audio_objects where audio_id = ${shared.audioId} limit 1`;
      if (!audio[0] || !isAudioAvailableForSharing(audio[0].status)) throw new Error("Audio attachment not found or is unavailable.");
    }
    const id = crypto.randomUUID();
    // Recheck membership in the same statement that persists the message.
    // FOR KEY SHARE makes a concurrent membership deletion wait until this
    // insert finishes, closing the authorization-check/insert race.
    const rows = await sql`
      with current_community_member as (
        select cm.user_id, cm.community_id
        from community_members cm
        join social_conversations community_chat on community_chat.community_id = cm.community_id
        where community_chat.id = ${data.conversationId} and cm.user_id = ${context.userId}
        for key share of cm
      ),
      authorized_member as (
        select scm.user_id
        from social_conversation_members scm
        join social_conversations c on c.id = scm.conversation_id
        where scm.conversation_id = ${data.conversationId}
          and scm.user_id = ${context.userId}
          and (c.kind <> 'community' or exists (
            select 1 from current_community_member cm
            where cm.community_id = c.community_id and cm.user_id = scm.user_id
          ))
        for key share of scm, c
      )
      inserted_message as (
        insert into social_messages (id, conversation_id, sender_id, body, media_id, share_kind, share_json)
        select ${id}, ${data.conversationId}, authorized_member.user_id,
          ${body || data.shareKind || "Attachment"}, ${data.mediaId ?? null},
          ${data.shareKind ?? null}, ${data.shareJson ?? null}
        from authorized_member
        returning id, conversation_id, sender_id, body, created_at, media_id, share_kind, share_json
      ),
      updated_conversation as (
        update social_conversations c
        set updated_at = now()
        from inserted_message m
        where c.id = m.conversation_id
        returning c.id
      )
      select m.* from inserted_message m
      join updated_conversation c on c.id = m.conversation_id
    `;
    if (!rows[0]) throw new Error("You are no longer a member of this conversation.");
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
      `select id, conversation_id, sender_id, body, created_at, edited_at, media_id, share_kind, share_json
       from social_messages where conversation_id = $1 and deleted_at is null
       order by created_at desc limit $2`,
      [data.conversationId, limit],
    );
    return rows.reverse().map((r) => ({
      id: String(r.id),
      conversationId: String(r.conversation_id),
      senderId: String(r.sender_id),
      body: String(r.body),
      createdAt: String(r.created_at),
      editedAt: r.edited_at == null ? null : String(r.edited_at),
      mediaId: r.media_id == null ? null : String(r.media_id),
      shareKind: r.share_kind == null ? null : String(r.share_kind),
      shareJson: r.share_json == null ? null : String(r.share_json),
    }));
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
    if (data.image !== undefined && (data.image.length > 2048 || !isSafeShareSource(data.image))) {
      throw new Error("Post image must be a supported web URL or uploaded media path.");
    }
    if (data.video !== undefined && (data.video.length > 2048 || !isSafeShareSource(data.video))) {
      throw new Error("Post video must be a supported web URL or uploaded media path.");
    }
    const sql = await getSql();
    const community = await sql`select id, privacy from communities where id = ${communityId} limit 1`;
    if (!community[0]) throw new Error("Community not found.");
    const privacy = resolveStoredQuadPrivacy(community[0].privacy);
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
    // Posting requires current membership for every visibility level. The UI
    // hides the composer from non-members, but server authorization must stand
    // on its own because callers can invoke this endpoint directly.
    const membership = await sql`select user_id from community_members where user_id = ${context.userId} and community_id = ${communityId} limit 1`;
    if (!membership[0]) {
      if (privacy === "private") {
        throw new Error("You must be invited to this private community before posting.");
      }
      if (privacy === "campus") {
        throw new Error("Join this campus Quad before posting.");
      }
      throw new Error("Join this community before posting.");
    }
    const id = `post_${crypto.randomUUID()}`;
    // Re-authorize membership, privacy, and campus scope in the same statement
    // that creates the post. Row locks make concurrent membership removal or
    // privacy changes wait until this write completes.
    const created = await sql`
      with authorized_member as (
        select cm.user_id, sp.handle
        from community_members cm
        join communities c on c.id = cm.community_id
        join student_profiles sp on sp.user_id = cm.user_id
        where cm.user_id = ${context.userId}
          and cm.community_id = ${communityId}
          and c.privacy in ('public', 'campus', 'private')
          and (c.privacy <> 'campus' or (
            sp.university_id is not null
            and c.university_id is not null
            and sp.university_id = c.university_id
          ))
        for share of cm, c
      )
      insert into posts (id, community_id, author_handle, body, image, video, kind)
      select ${id}, ${communityId}, authorized_member.handle, ${body},
        ${data.image ?? null}, ${data.video ?? null},
        ${data.kind === "reel" ? "reel" : "post"}
      from authorized_member
      returning id, author_handle
    `;
    if (!created[0]) {
      throw new Error("You must have an active profile and current permission to post in this Quad.");
    }
    return { id, communityId, body, handle: String(created[0].author_handle) };
  });

export const joinCommunity = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((communityId: string) => communityId)
  .handler(async ({ context, data: communityId }) => {
    const sql = await getSql();
    const exists = await sql`select id, privacy from communities where id = ${communityId} limit 1`;
    if (!exists[0]) throw new Error("Community not found.");
    const privacy = resolveStoredQuadPrivacy(exists[0].privacy);
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
    // Insert membership and update the denormalized count in one statement:
    // no duplicate increment and no committed membership without its count update.
    await sql`
      with inserted as (
        insert into community_members (user_id, community_id)
        values (${context.userId}, ${communityId})
        on conflict do nothing
        returning community_id
      )
      update communities c
      set members = coalesce(c.members, 0) + 1
      from inserted
      where c.id = inserted.community_id
    `;
    return { joined: true, communityId };
  });

/** Open the persistent chat for a Quad only after verifying current membership. */
export const openCommunityConversation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((communityId: string) => communityId)
  .handler(async ({ context, data: communityId }) => {
    const sql = await getSql();
    const access = await sql`
      select c.id, c.name, c.privacy, c.university_id
      from communities c
      join community_members cm on cm.community_id = c.id and cm.user_id = ${context.userId}
      where c.id = ${communityId}
      limit 1
    `;
    if (!access[0]) throw new Error("Join this Quad before opening its chat.");
    const privacy = resolveStoredQuadPrivacy(access[0].privacy);
    if (privacy === "campus") {
      const profile = await sql`select university_id from student_profiles where user_id = ${context.userId} limit 1`;
      if (!profile[0]?.university_id || !access[0].university_id ||
          String(profile[0].university_id) !== String(access[0].university_id)) {
        throw new Error("This Quad is limited to its university community.");
      }
    }
    // Create-or-load the unique Quad conversation and synchronize current
    // members in one statement. If membership synchronization fails, the chat
    // operation rolls back instead of leaving a partially initialized room.
    // Removed members are not re-added, so revocation remains effective.
    const opened = await sql`
      with community_conversation as (
        insert into social_conversations (id, kind, title, created_by, community_id)
        select ${crypto.randomUUID()}, 'community', c.name, ${context.userId}, c.id
        from communities c
        join community_members current_member
          on current_member.community_id = c.id and current_member.user_id = ${context.userId}
        where c.id = ${communityId}
        on conflict (community_id) where kind = 'community' and community_id is not null
        do update set title = excluded.title
        returning id
      ),
      synchronized_members as (
        insert into social_conversation_members (conversation_id, user_id)
        select community_conversation.id, cm.user_id
        from community_conversation
        cross join community_members cm
        where cm.community_id = ${communityId}
        on conflict (conversation_id, user_id) do nothing
        returning user_id
      )
      select id from community_conversation limit 1
    `;
    if (!opened[0]) throw new Error("Could not open this Quad chat. Please retry.");
    return { id: String(opened[0].id) };
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

function connectProfile(row: Record<string, unknown>) {
  return {
    userId: String(row.user_id),
    handle: String(row.handle),
    name: String(row.display_name ?? row.handle),
    universityId: String(row.university_id ?? ""),
    program: String(row.program ?? ""),
    year: String(row.year ?? ""),
    bio: String(row.bio ?? ""),
  };
}

/** Real registered profiles only. Search is server-side and excludes the current user. */
export const listConnectPeople = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { query?: string }) => input)
  .handler(async ({ context, data }) => {
    if (data.query !== undefined && typeof data.query !== "string") throw new Error("Invalid profile search query.");
    const query = (data.query ?? "").trim().slice(0, 100);
    const sql = await getSql();
    const rows = await sql`
      select user_id, handle, display_name, university_id, program, year, bio
      from student_profiles
      where user_id <> ${context.userId}
        and handle is not null and length(trim(handle)) > 0
        and (
          ${query} = ''
          or handle ilike ${'%' + query + '%'}
          or display_name ilike ${'%' + query + '%'}
          or program ilike ${'%' + query + '%'}
          or university_id ilike ${'%' + query + '%'}
        )
      order by display_name asc nulls last, handle asc
      limit 50`;
    return rows.map((row) => connectProfile(row as Record<string, unknown>));
  });

/** Load a profile from the real registered-member directory, never from fixture people. */
export const getPublicProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((handle: string) => handle)
  .handler(async ({ context, data: rawHandle }) => {
    if (typeof rawHandle !== "string") throw new Error("Choose a valid user handle.");
    const handle = rawHandle.trim().toLowerCase();
    if (!/^[a-z0-9_]{2,32}$/.test(handle)) throw new Error("Choose a valid user handle.");
    const sql = await getSql();
    const rows = await sql`
      select user_id, handle, display_name, university_id, program, year, bio, campus_role
      from student_profiles where lower(handle) = ${handle} limit 1`;
    if (!rows[0]) return null;
    const profile = rows[0] as Record<string, unknown>;
    return {
      userId: String(profile.user_id),
      handle: String(profile.handle),
      name: String(profile.display_name ?? profile.handle),
      universityId: String(profile.university_id ?? ""),
      program: String(profile.program ?? ""),
      year: String(profile.year ?? ""),
      bio: String(profile.bio ?? ""),
      role: String(profile.campus_role ?? "student"),
      isSelf: String(profile.user_id) === context.userId,
    };
  });

/** Public-profile post feed with community privacy checked against the viewing account. */
export const listPublicProfilePosts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((handle: string) => handle)
  .handler(async ({ context, data: rawHandle }) => {
    if (typeof rawHandle !== "string") throw new Error("Choose a valid user handle.");
    const handle = rawHandle.trim().toLowerCase();
    if (!/^[a-z0-9_]{2,32}$/.test(handle)) throw new Error("Choose a valid user handle.");
    const sql = await getSql();
    const rows = await sql`
      select p.id, p.body, p.kind, p.created_at, c.id as community_id, c.name as community_name
      from posts p
      join communities c on c.id = p.community_id
      where lower(p.author_handle) = ${handle}
        and (
          c.privacy = 'public'
          or (
            c.privacy = 'campus'
            and exists (
              select 1 from student_profiles viewer
              where viewer.user_id = ${context.userId}
                and viewer.university_id = c.university_id
            )
            and exists (
              select 1 from community_members cm
              where cm.user_id = ${context.userId} and cm.community_id = c.id
            )
          )
          or (
            c.privacy = 'private'
            and exists (
              select 1 from community_members cm
              where cm.user_id = ${context.userId} and cm.community_id = c.id
            )
          )
        )
      order by p.created_at desc
      limit 30`;
    return rows.map((row) => ({
      id: String(row.id),
      body: String(row.body),
      kind: String(row.kind ?? "post"),
      createdAt: String(row.created_at),
      communityId: String(row.community_id),
      communityName: String(row.community_name),
    }));
  });

/** Durable incoming/outgoing requests, accepted connections, follows and followers. */
export const getMyConnectState = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const [incoming, outgoing, connections, following, followers] = await Promise.all([
      sql`select p.user_id, p.handle, p.display_name, p.university_id, p.program, p.year, p.bio
          from social_connection_requests r join student_profiles p on p.user_id = r.requester_id
          where r.recipient_id = ${context.userId} and r.status = 'pending'
          order by r.created_at desc`,
      sql`select p.user_id, p.handle, p.display_name, p.university_id, p.program, p.year, p.bio
          from social_connection_requests r join student_profiles p on p.user_id = r.recipient_id
          where r.requester_id = ${context.userId} and r.status = 'pending'
          order by r.created_at desc`,
      sql`select p.user_id, p.handle, p.display_name, p.university_id, p.program, p.year, p.bio
          from social_connection_requests r
          join student_profiles p on p.user_id = case when r.requester_id = ${context.userId} then r.recipient_id else r.requester_id end
          where r.status = 'accepted'
            and (r.requester_id = ${context.userId} or r.recipient_id = ${context.userId})
          order by r.updated_at desc`,
      sql`select p.user_id, p.handle, p.display_name, p.university_id, p.program, p.year, p.bio
          from social_follows f join student_profiles p on p.user_id = f.followed_id
          where f.follower_id = ${context.userId}
          order by f.created_at desc`,
      sql`select p.user_id, p.handle, p.display_name, p.university_id, p.program, p.year, p.bio
          from social_follows f join student_profiles p on p.user_id = f.follower_id
          where f.followed_id = ${context.userId}
          order by f.created_at desc`,
    ]);
    return {
      incoming: incoming.map((row) => connectProfile(row as Record<string, unknown>)),
      outgoing: outgoing.map((row) => connectProfile(row as Record<string, unknown>)),
      connections: connections.map((row) => connectProfile(row as Record<string, unknown>)),
      following: following.map((row) => connectProfile(row as Record<string, unknown>)),
      followers: followers.map((row) => connectProfile(row as Record<string, unknown>)),
    };
  });

export const requestConnection = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { handle: string }) => input)
  .handler(async ({ context, data }) => {
    if (typeof data.handle !== "string") throw new Error("Choose a valid user handle.");
    const handle = data.handle.trim().toLowerCase();
    if (!/^[a-z0-9_]{2,32}$/.test(handle)) throw new Error("Choose a valid user handle.");
    const sql = await getSql();
    const peers = await sql`select user_id from student_profiles where lower(handle) = ${handle} limit 1`;
    if (!peers[0]) throw new Error("That person has not joined UNIBUD yet.");
    const peerId = String(peers[0].user_id);
    if (peerId === context.userId) throw new Error("You cannot connect with yourself.");
    const accepted = await sql`select requester_id from social_connection_requests
      where status = 'accepted'
        and ((requester_id = ${context.userId} and recipient_id = ${peerId})
          or (requester_id = ${peerId} and recipient_id = ${context.userId}))
      limit 1`;
    if (accepted[0]) throw new Error("You are already connected.");
    const incoming = await sql`select requester_id from social_connection_requests
      where requester_id = ${peerId} and recipient_id = ${context.userId} and status = 'pending' limit 1`;
    if (incoming[0]) throw new Error("This person has already sent you a request. Accept it from Requests.");
    const existing = await sql`select status from social_connection_requests
      where requester_id = ${context.userId} and recipient_id = ${peerId} limit 1`;
    if (existing[0] && String(existing[0].status) === "pending") return { ok: true, alreadyPending: true };
    await sql`insert into social_connection_requests (requester_id, recipient_id, status)
      values (${context.userId}, ${peerId}, 'pending')
      on conflict (requester_id, recipient_id) do update
      set status = 'pending', updated_at = now()
      where social_connection_requests.status in ('declined', 'cancelled', 'removed')`;
    return { ok: true, alreadyPending: false };
  });

export const respondToConnectionRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { handle: string; accept: boolean }) => input)
  .handler(async ({ context, data }) => {
    if (typeof data.handle !== "string" || typeof data.accept !== "boolean") throw new Error("Invalid connection response.");
    const handle = data.handle.trim().toLowerCase();
    const sql = await getSql();
    const peers = await sql`select user_id from student_profiles where lower(handle) = ${handle} limit 1`;
    if (!peers[0]) throw new Error("That person has not joined UNIBUD yet.");
    const peerId = String(peers[0].user_id);
    const rows = await sql`update social_connection_requests
      set status = ${data.accept ? "accepted" : "declined"}, updated_at = now()
      where requester_id = ${peerId} and recipient_id = ${context.userId} and status = 'pending'
      returning requester_id`;
    if (!rows[0]) throw new Error("That connection request is no longer pending.");
    return { ok: true };
  });

export const cancelConnectionRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { handle: string }) => input)
  .handler(async ({ context, data }) => {
    if (typeof data.handle !== "string") throw new Error("Choose a valid user handle.");
    const handle = data.handle.trim().toLowerCase();
    const sql = await getSql();
    const peers = await sql`select user_id from student_profiles where lower(handle) = ${handle} limit 1`;
    if (!peers[0]) throw new Error("That person has not joined UNIBUD yet.");
    const rows = await sql`update social_connection_requests
      set status = 'cancelled', updated_at = now()
      where requester_id = ${context.userId} and recipient_id = ${String(peers[0].user_id)} and status = 'pending'
      returning requester_id`;
    if (!rows[0]) throw new Error("That connection request is no longer pending.");
    return { ok: true };
  });

export const removeConnection = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { handle: string }) => input)
  .handler(async ({ context, data }) => {
    if (typeof data.handle !== "string") throw new Error("Choose a valid user handle.");
    const handle = data.handle.trim().toLowerCase();
    const sql = await getSql();
    const peers = await sql`select user_id from student_profiles where lower(handle) = ${handle} limit 1`;
    if (!peers[0]) throw new Error("That person has not joined UNIBUD yet.");
    const peerId = String(peers[0].user_id);
    const rows = await sql`update social_connection_requests
      set status = 'removed', updated_at = now()
      where status = 'accepted'
        and ((requester_id = ${context.userId} and recipient_id = ${peerId})
          or (requester_id = ${peerId} and recipient_id = ${context.userId}))
      returning requester_id`;
    if (!rows.length) throw new Error("You are not connected to that person.");
    return { ok: true };
  });

export const setFollow = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { handle: string; following: boolean }) => input)
  .handler(async ({ context, data }) => {
    if (typeof data.handle !== "string" || typeof data.following !== "boolean") throw new Error("Invalid follow action.");
    const handle = data.handle.trim().toLowerCase();
    const sql = await getSql();
    const peers = await sql`select user_id from student_profiles where lower(handle) = ${handle} limit 1`;
    if (!peers[0]) throw new Error("That person has not joined UNIBUD yet.");
    const peerId = String(peers[0].user_id);
    if (peerId === context.userId) throw new Error("You cannot follow yourself.");
    if (data.following) {
      await sql`insert into social_follows (follower_id, followed_id)
        values (${context.userId}, ${peerId}) on conflict do nothing`;
    } else {
      await sql`delete from social_follows where follower_id = ${context.userId} and followed_id = ${peerId}`;
    }
    return { ok: true };
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
    // Atomically create the direct conversation with both members. Seed-message
    // persistence remains a follow-up, but cannot leave an ownerless conversation.
    const createdMembers = await sql`
      with new_conversation as (
        insert into social_conversations (id, kind, title, created_by)
        values (${conversationId}, 'direct', '', ${context.userId})
        returning id
      )
      insert into social_conversation_members (conversation_id, user_id)
      select new_conversation.id, members.user_id
      from new_conversation
      cross join (values (${context.userId}::text), (${peerId}::text)) as members(user_id)
      on conflict (conversation_id, user_id) do nothing
      returning user_id
    `;
    if (createdMembers.length !== 2) {
      throw new Error("Direct conversation membership could not be initialized. Please retry.");
    }
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
