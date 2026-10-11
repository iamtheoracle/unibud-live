import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

export const submitFeedback = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { body: string; category?: string; email?: string }) => input)
  .handler(async ({ context, data }) => {
    const body = data.body.trim();
    if (!body || body.length < 3) throw new Error("Write a bit more so we can act on it.");
    if (body.length > 4000) throw new Error("Keep feedback under 4000 characters.");
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql`insert into feedback_submissions (id, user_id, email, category, body)
      values (${id}, ${context.userId}, ${data.email?.trim() || ""}, ${data.category || "general"}, ${body})`;
    return { ok: true as const, id };
  });

/** Guest feedback — still stored, no fake emailed claim. */
export const submitPublicFeedback = createServerFn({ method: "POST" })
  .validator((input: { body: string; category?: string; email?: string }) => input)
  .handler(async ({ data }) => {
    const body = data.body.trim();
    if (!body || body.length < 3) throw new Error("Write a bit more so we can act on it.");
    if (body.length > 4000) throw new Error("Keep feedback under 4000 characters.");
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql`insert into feedback_submissions (id, user_id, email, category, body)
      values (${id}, ${null}, ${data.email?.trim() || ""}, ${data.category || "general"}, ${body})`;
    return { ok: true as const, id };
  });
