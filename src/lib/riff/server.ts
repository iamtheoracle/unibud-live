import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { createRiffService, type RiffReportReason } from "./service";

const validId = (value: unknown, label: string) => {
  if (typeof value !== "string" || !value.trim() || value.length > 200) throw new Error(`Invalid ${label}.`);
  return value.trim();
};

/** Anonymous reads are limited by the service to global and public-community posts. */
export const listPublicRiffs = createServerFn({ method: "GET" })
  .validator((input: { cursorCreatedAt?: string; cursorId?: string; limit?: number } = {}) => input)
  .handler(async ({ data }) => createRiffService(await getSql(), null).listRiffs(data));

export const getPublicRiff = createServerFn({ method: "GET" })
  .validator((input: { postId: string }) => ({ postId: validId(input?.postId, "post ID") }))
  .handler(async ({ data }) => createRiffService(await getSql(), null).getRiff(data.postId));

export const listRiffs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { cursorCreatedAt?: string; cursorId?: string; limit?: number } = {}) => input)
  .handler(async ({ context, data }) => createRiffService(await getSql(), context.userId).listRiffs(data));

export const getRiff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { postId: string }) => ({ postId: validId(input?.postId, "post ID") }))
  .handler(async ({ context, data }) => createRiffService(await getSql(), context.userId).getRiff(data.postId));

export const createRiff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { body: string; communityId?: string; quotePostId?: string; mediaId?: string }) => input)
  .handler(async ({ context, data }) => createRiffService(await getSql(), context.userId).createRiff(data));

export const replyToRiff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { postId: string; body: string; parentReplyId?: string }) => input)
  .handler(async ({ context, data }) => createRiffService(await getSql(), context.userId).replyToRiff(data));

export const toggleRiffLike = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { postId: string }) => ({ postId: validId(input?.postId, "post ID") }))
  .handler(async ({ context, data }) => createRiffService(await getSql(), context.userId).toggleRiffLike(data.postId));

export const toggleRiffFollow = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { postId: string }) => ({ postId: validId(input?.postId, "post ID") }))
  .handler(async ({ context, data }) => createRiffService(await getSql(), context.userId).toggleRiffFollow(data.postId));

export const reportRiff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { postId?: string; replyId?: string; reason: RiffReportReason; details?: string }) => input)
  .handler(async ({ context, data }) => createRiffService(await getSql(), context.userId).reportRiff(data));

export const softDeleteRiffPost = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { postId: string }) => ({ postId: validId(input?.postId, "post ID") }))
  .handler(async ({ context, data }) => createRiffService(await getSql(), context.userId).softDeleteRiffPost(data.postId));

export const softDeleteRiffReply = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { replyId: string }) => ({ replyId: validId(input?.replyId, "reply ID") }))
  .handler(async ({ context, data }) => createRiffService(await getSql(), context.userId).softDeleteRiffReply(data.replyId));
