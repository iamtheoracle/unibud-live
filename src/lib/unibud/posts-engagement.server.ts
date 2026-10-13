import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { mapPostReply } from "./map";

/** Replies for a post, newest first. */
export const listPostReplies = createServerFn({ method: "GET" })
  .validator((postId: string) => postId)
  .handler(async ({ data: postId }) => {
    const sql = await getSql();
    const id = postId.split("~")[0] ?? postId;
    const rows = await sql`select * from post_replies where post_id = ${id} order by created_at desc limit 200`;
    return rows.map(mapPostReply);
  });

/** Like count for a post (server truth after refresh). */
export const getPostLikeCount = createServerFn({ method: "GET" })
  .validator((postId: string) => postId)
  .handler(async ({ data: postId }) => {
    const sql = await getSql();
    const id = postId.split("~")[0] ?? postId;
    const rows = await sql<{ n: string }>`select count(*)::text as n from post_likes where post_id = ${id}`;
    return { postId: id, count: Number(rows[0]?.n ?? 0) };
  });
