import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

/** Publish a Square (or community) post owned by the signed-in user. */
export const createPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      communityId?: string;
      body: string;
      image?: string;
      video?: string;
      kind?: "post" | "reel";
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const body = data.body.trim() || (data.video ? "Reel" : data.image ? "Photo" : "");
    if (!body) throw new Error("Write something first");
    const sql = await getSql();
    const profile = await sql<{ handle: string }>`select handle from student_profiles where user_id = ${context.userId} limit 1`;
    const handle = profile[0]?.handle || "you";
    const id = `p_${crypto.randomUUID().slice(0, 12)}`;
    const kind = data.kind ?? (data.video ? "reel" : "post");
    const communityId = (data.communityId || "square").trim() || "square";
    try {
      await sql`insert into posts (id, community_id, author_handle, body, image, video, kind, owner_user_id)
        values (${id}, ${communityId}, ${handle}, ${body}, ${data.image ?? null}, ${data.video ?? null}, ${kind}, ${context.userId})`;
    } catch {
      try {
        await sql`insert into posts (id, community_id, author_handle, body, image, video, kind)
          values (${id}, ${communityId}, ${handle}, ${body}, ${data.image ?? null}, ${data.video ?? null}, ${kind})`;
      } catch {
        await sql`insert into posts (id, community_id, author_handle, body, image)
          values (${id}, ${communityId}, ${handle}, ${body}, ${data.image ?? null})`;
      }
    }
    return { id, handle, body, kind, communityId, ownerUserId: context.userId };
  });

/** Soft-delete own post. Only the owner can delete. */
export const deleteOwnPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((postId: string) => postId)
  .handler(async ({ context, data: postId }) => {
    const sql = await getSql();
    const id = postId.split("~")[0] ?? postId;
    const rows = await sql<{ id: string; owner_user_id: string | null }>`select id, owner_user_id from posts where id = ${id} and deleted_at is null limit 1`;
    const post = rows[0];
    if (!post) throw new Error("Post not found");
    if (post.owner_user_id && post.owner_user_id !== context.userId) {
      throw new Error("You can only delete your own posts");
    }
    if (!post.owner_user_id) {
      const profile = await sql<{ handle: string }>`select handle from student_profiles where user_id = ${context.userId} limit 1`;
      const handle = profile[0]?.handle;
      const authored = await sql`select id from posts where id = ${id} and author_handle = ${handle ?? ""} limit 1`;
      if (!authored[0]) throw new Error("You can only delete your own posts");
    }
    try {
      await sql`update posts set deleted_at = now() where id = ${id}`;
    } catch {
      await sql`delete from posts where id = ${id}`;
    }
    return { ok: true as const, id };
  });
