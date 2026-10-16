import type { Sql } from "@/lib/db";

export type RiffReportReason = "spam" | "harassment" | "hate" | "violence" | "sexual_content" | "self_harm" | "other";
const reasons = new Set<RiffReportReason>(["spam", "harassment", "hate", "violence", "sexual_content", "self_harm", "other"]);
const textValue = (value: unknown, label: string) => {
  if (typeof value !== "string") throw new Error(`${label} is required.`);
  const valueTrimmed = value.trim();
  if (!valueTrimmed || valueTrimmed.length > 10000) throw new Error(`${label} must be between 1 and 10,000 characters.`);
  return valueTrimmed;
};
const idValue = (value: unknown, label = "ID") => {
  if (typeof value !== "string" || !value.trim() || value.length > 200) throw new Error(`Invalid ${label}.`);
  return value.trim();
};
const postDto = (r: Record<string, unknown>) => ({
  id: String(r.id), authorHandle: String(r.author_handle ?? "member"), body: String(r.body),
  liked: Boolean(r.liked), following: Boolean(r.following), canInteract: Boolean(r.can_interact ?? true),
  communityId: r.community_id == null ? null : String(r.community_id),
  quotePostId: r.quote_post_id == null ? null : String(r.quote_post_id),
  mediaId: r.media_id == null ? null : String(r.media_id),
  createdAt: String(r.created_at), updatedAt: String(r.updated_at),
  replyCount: Number(r.reply_count ?? 0), likeCount: Number(r.like_count ?? 0), followCount: Number(r.follow_count ?? 0),
});
const replyDto = (r: Record<string, unknown>) => ({
  id: String(r.id), postId: String(r.post_id), parentReplyId: r.parent_reply_id == null ? null : String(r.parent_reply_id),
  authorHandle: String(r.author_handle ?? "member"), body: String(r.body), createdAt: String(r.created_at),
});

type RiffListInput = { cursorCreatedAt?: string; cursorId?: string; limit?: number };

function normalizeRiffListInput(input: unknown): RiffListInput {
  if (input === undefined) return {};
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Invalid feed input.");
  }
  const value = input as Record<string, unknown>;
  const cursorCreatedAt = value.cursorCreatedAt;
  const cursorId = value.cursorId;
  const limit = value.limit;

  if (cursorCreatedAt !== undefined &&
      (typeof cursorCreatedAt !== "string" || !cursorCreatedAt.trim() || Number.isNaN(Date.parse(cursorCreatedAt)))) {
    throw new Error("Invalid feed cursor.");
  }
  if (cursorId !== undefined &&
      (typeof cursorId !== "string" || !cursorId.trim() || cursorId.length > 200)) {
    throw new Error("Invalid feed cursor.");
  }
  if ((cursorCreatedAt === undefined) !== (cursorId === undefined)) {
    throw new Error("Both cursor fields are required.");
  }
  if (limit !== undefined && (typeof limit !== "number" || !Number.isInteger(limit) || limit < 1)) {
    throw new Error("Invalid feed limit.");
  }

  return {
    ...(cursorCreatedAt === undefined ? {} : { cursorCreatedAt }),
    ...(cursorId === undefined ? {} : { cursorId }),
    ...(limit === undefined ? {} : { limit }),
  };
}

export function createRiffService(sql: Sql, sessionUserId: string | null) {
  const actor = typeof sessionUserId === "string" && sessionUserId.trim() ? sessionUserId.trim() : null;
  const requireActor = () => {
    if (!actor) throw new Error("Authentication required.");
    return actor;
  };

  async function assertCommunityMembership(tx: Sql, communityId: unknown) {
    const actorId = requireActor();
    if (communityId == null) return;
    const membership = await tx.query(
      "select user_id from community_members where community_id = $1 and user_id = $2 for key share",
      [String(communityId), actorId],
    );
    if (!membership[0]) throw new Error("Riff not found.");
  }

  async function lockVisiblePost(tx: Sql, postId: string) {
    const rows = await tx.query(
      "select id, community_id from riff_posts where id = $1 and deleted_at is null for update",
      [postId],
    );
    if (!rows[0]) throw new Error("Riff not found.");
    await assertCommunityMembership(tx, rows[0].community_id);
    return rows[0] as Record<string, unknown>;
  }

  async function inTransaction<T>(operation: (tx: Sql) => Promise<T>): Promise<T> {
    if (!sql.transaction) throw new Error("Riff requires database transaction support for this action.");
    return sql.transaction(operation);
  }

  async function postById(postId: string) {
    const rows = await sql.query(`select p.id, p.body, p.community_id, p.quote_post_id, p.media_id,
      p.created_at, p.updated_at, coalesce(sp.handle, 'member') as author_handle,
      (p.community_id is null or exists (select 1 from community_members own_member where own_member.community_id = p.community_id and own_member.user_id = $2)) as can_interact,
      exists(select 1 from riff_reactions own_like where own_like.post_id = p.id and own_like.user_id = $2) as liked,
      exists(select 1 from riff_follows own_follow where own_follow.post_id = p.id and own_follow.user_id = $2) as following,
      (select count(*)::int from riff_replies r where r.post_id = p.id and r.deleted_at is null) as reply_count,
      (select count(*)::int from riff_reactions x where x.post_id = p.id) as like_count,
      (select count(*)::int from riff_follows f where f.post_id = p.id) as follow_count
      from riff_posts p left join student_profiles sp on sp.user_id = p.author_user_id
      where p.id = $1 and p.deleted_at is null
      and (
        p.community_id is null
        or exists (select 1 from communities c where c.id = p.community_id and c.privacy = 'public')
        or ($2::text is not null and exists (
          select 1 from community_members cm where cm.community_id = p.community_id and cm.user_id = $2
        ))
      ) limit 1`, [postId, actor]);
    if (!rows[0]) throw new Error("Riff not found.");
    return postDto(rows[0] as Record<string, unknown>);
  }

  return {
    async listRiffs(input: { cursorCreatedAt?: string; cursorId?: string; limit?: number } = {}) {
      const normalized = normalizeRiffListInput(input);
      const limit = Math.min(50, normalized.limit ?? 20);
      const at = normalized.cursorCreatedAt ?? null;
      const id = normalized.cursorId ?? null;
      const rows = await sql.query(`select p.id, p.body, p.community_id, p.quote_post_id, p.media_id,
        p.created_at, p.updated_at, coalesce(sp.handle, 'member') as author_handle,
        (p.community_id is null or exists (select 1 from community_members own_member where own_member.community_id = p.community_id and own_member.user_id = $4)) as can_interact,
        exists(select 1 from riff_reactions own_like where own_like.post_id = p.id and own_like.user_id = $4) as liked,
        exists(select 1 from riff_follows own_follow where own_follow.post_id = p.id and own_follow.user_id = $4) as following,
        (select count(*)::int from riff_replies r where r.post_id = p.id and r.deleted_at is null) as reply_count,
        (select count(*)::int from riff_reactions x where x.post_id = p.id) as like_count,
        (select count(*)::int from riff_follows f where f.post_id = p.id) as follow_count
        from riff_posts p left join student_profiles sp on sp.user_id = p.author_user_id
        where p.deleted_at is null
        and (
          p.community_id is null
          or exists (select 1 from communities c where c.id = p.community_id and c.privacy = 'public')
          or ($4::text is not null and exists (
            select 1 from community_members cm where cm.community_id = p.community_id and cm.user_id = $4
          ))
        )
        and ($1::timestamptz is null or (p.created_at, p.id) < ($1::timestamptz, $2::text))
        order by p.created_at desc, p.id desc limit $3`, [at, id, limit, actor]);
      return rows.map((r) => postDto(r as Record<string, unknown>));
    },

    async getRiff(postIdValue: string) {
      const postId = idValue(postIdValue, "post ID");
      const post = await postById(postId);
      const rows = await sql.query(`select r.id, r.post_id, r.parent_reply_id, r.body, r.created_at,
        coalesce(sp.handle, 'member') as author_handle
        from riff_replies r join riff_posts p on p.id = r.post_id
        left join student_profiles sp on sp.user_id = r.author_user_id
        where r.post_id = $1 and r.deleted_at is null and p.deleted_at is null
        and (
          p.community_id is null
          or exists (select 1 from communities c where c.id = p.community_id and c.privacy = 'public')
          or ($2::text is not null and exists (
            select 1 from community_members cm where cm.community_id = p.community_id and cm.user_id = $2
          ))
        )
        order by r.created_at desc, r.id desc limit 500`, [postId, actor]);
      const own = await sql.query(`select exists(select 1 from riff_reactions where post_id = $1 and user_id = $2) as liked,
        exists(select 1 from riff_follows where post_id = $1 and user_id = $2) as following`, [postId, actor]);
      return { ...post, liked: Boolean(own[0]?.liked), following: Boolean(own[0]?.following), replies: rows.map((r) => replyDto(r as Record<string, unknown>)) };
    },

    async createRiff(input: { body: string; communityId?: string; quotePostId?: string; mediaId?: string }) {
      requireActor();
      const body = textValue(input?.body, "Riff");
      const communityId = input.communityId ? idValue(input.communityId, "community ID") : null;
      const quotePostId = input.quotePostId ? idValue(input.quotePostId, "quoted post ID") : null;
      if (input.mediaId) {
        const mediaId = idValue(input.mediaId, "media ID");
        const media = await sql.query("select id from media_assets where id = $1 and owner_id = $2 and status = 'ready' and visibility = 'private' limit 1", [mediaId, actor]);
        if (!media[0]) throw new Error("Media must be a ready private upload owned by you.");
        throw new Error("Riff media sharing is not enabled yet; create a text-only Riff for now.");
      }

      const id = "riff_" + crypto.randomUUID();
      const row = await inTransaction(async (tx) => {
        if (quotePostId) await lockVisiblePost(tx, quotePostId);
        if (communityId) {
          const membership = await tx.query(
            "select user_id from community_members where community_id = $1 and user_id = $2 for key share",
            [communityId, actor],
          );
          if (!membership[0]) throw new Error("Join this community before posting to it.");
        }
        const rows = await tx.query(
          "insert into riff_posts (id, author_user_id, body, community_id, quote_post_id) values ($1, $2, $3, $4, $5) returning id, body, community_id, quote_post_id, media_id, created_at, updated_at",
          [id, actor, body, communityId, quotePostId],
        );
        return rows[0] as Record<string, unknown>;
      });
      return postDto({ ...row, author_handle: "you", liked: false, following: false, reply_count: 0, like_count: 0, follow_count: 0 });
    },

    async replyToRiff(input: { postId: string; body: string; parentReplyId?: string }) {
      requireActor();
      const postId = idValue(input?.postId, "post ID");
      const body = textValue(input?.body, "Reply");
      const parentId = input.parentReplyId ? idValue(input.parentReplyId, "parent reply ID") : null;
      const id = "riff_reply_" + crypto.randomUUID();
      const row = await inTransaction(async (tx) => {
        await lockVisiblePost(tx, postId);
        if (parentId) {
          const parent = await tx.query(
            "select id from riff_replies where id = $1 and post_id = $2 and deleted_at is null limit 1",
            [parentId, postId],
          );
          if (!parent[0]) throw new Error("Parent reply not found in this Riff.");
        }
        const rows = await tx.query(
          "insert into riff_replies (id, post_id, parent_reply_id, author_user_id, body) values ($1, $2, $3, $4, $5) returning id, post_id, parent_reply_id, body, created_at",
          [id, postId, parentId, actor, body],
        );
        return rows[0] as Record<string, unknown>;
      });
      return replyDto({ ...row, author_handle: "you" });
    },

    async toggleRiffLike(postIdValue: string) {
      requireActor();
      const postId = idValue(postIdValue, "post ID");
      const operation = async (tx: Sql) => {
        await lockVisiblePost(tx, postId);
        const removed = await tx.query("delete from riff_reactions where post_id = $1 and user_id = $2 returning post_id", [postId, actor]);
        let liked = false;
        if (!removed[0]) {
          await tx.query("insert into riff_reactions (post_id, user_id) values ($1, $2) on conflict do nothing", [postId, actor]);
          const current = await tx.query("select 1 from riff_reactions where post_id = $1 and user_id = $2 limit 1", [postId, actor]);
          liked = Boolean(current[0]);
        }
        const count = await tx.query("select count(*)::int as count from riff_reactions where post_id = $1", [postId]);
        return { liked, likeCount: Number(count[0]?.count ?? 0) };
      };
      return inTransaction(operation);
    },

    async toggleRiffFollow(postIdValue: string) {
      requireActor();
      const postId = idValue(postIdValue, "post ID");
      const operation = async (tx: Sql) => {
        await lockVisiblePost(tx, postId);
        const removed = await tx.query("delete from riff_follows where post_id = $1 and user_id = $2 returning post_id", [postId, actor]);
        let following = false;
        if (!removed[0]) {
          await tx.query("insert into riff_follows (post_id, user_id) values ($1, $2) on conflict do nothing", [postId, actor]);
          const current = await tx.query("select 1 from riff_follows where post_id = $1 and user_id = $2 limit 1", [postId, actor]);
          following = Boolean(current[0]);
        }
        const count = await tx.query("select count(*)::int as count from riff_follows where post_id = $1", [postId]);
        return { following, followCount: Number(count[0]?.count ?? 0) };
      };
      return inTransaction(operation);
    },

    async reportRiff(input: { postId?: string; replyId?: string; reason: RiffReportReason; details?: string }) {
      requireActor();
      const postId = input.postId ? idValue(input.postId, "post ID") : null;
      const replyId = input.replyId ? idValue(input.replyId, "reply ID") : null;
      if (Boolean(postId) === Boolean(replyId)) throw new Error("Report exactly one Riff post or reply.");
      if (!reasons.has(input.reason)) throw new Error("Invalid report reason.");
      const rawDetails = input.details ?? "";
      if (typeof rawDetails !== "string") throw new Error("Report details must be text.");
      const details = rawDetails.trim();
      if (details.length > 1000) throw new Error("Report details must be at most 1,000 characters.");
      const operation = async (tx: Sql) => {
        // Serialize a reporter's own submissions while applying the rate limit.
        await tx.query('select id from "user" where id = $1 for update', [actor]);
        const recent = await tx.query("select count(*)::int as count from riff_reports where reporter_user_id = $1 and created_at > now() - interval '1 hour'", [actor]);
        if (Number(recent[0]?.count ?? 0) >= 10) throw new Error("Report limit reached. Try again later.");
        if (postId) {
          await lockVisiblePost(tx, postId);
        }
        if (replyId) {
          const target = await tx.query(
            "select r.id, p.community_id from riff_replies r join riff_posts p on p.id = r.post_id where r.id = $1 and r.deleted_at is null and p.deleted_at is null for update of r, p",
            [replyId],
          );
          if (!target[0]) throw new Error("Riff reply not found.");
          await assertCommunityMembership(tx, target[0].community_id);
        }
        const id = `riff_report_${crypto.randomUUID()}`;
        await tx.query("insert into riff_reports (id, reporter_user_id, post_id, reply_id, reason, details) values ($1, $2, $3, $4, $5, $6)", [id, actor, postId, replyId, input.reason, details]);
        return { id, status: "open" as const };
      };
      return inTransaction(operation);
    },

    async softDeleteRiffPost(postIdValue: string) {
      requireActor();
      const postId = idValue(postIdValue, "post ID");
      const rows = await sql.query("update riff_posts set deleted_at = now(), updated_at = now() where id = $1 and author_user_id = $2 and deleted_at is null returning id", [postId, actor]);
      if (!rows[0]) throw new Error("Riff not found or you cannot delete this post.");
      return { id: postId, deleted: true };
    },

    async softDeleteRiffReply(replyIdValue: string) {
      requireActor();
      const replyId = idValue(replyIdValue, "reply ID");
      const rows = await sql.query(`update riff_replies r set deleted_at = now(), updated_at = now()
        where r.id = $1 and r.author_user_id = $2 and r.deleted_at is null
        and exists (select 1 from riff_posts p where p.id = r.post_id and p.deleted_at is null)
        returning r.id`, [replyId, actor]);
      if (!rows[0]) throw new Error("Riff reply not found or you cannot delete this reply.");
      return { id: replyId, deleted: true };
    },
  };
}
