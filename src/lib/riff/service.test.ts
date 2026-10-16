import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import type { Sql } from "@/lib/db";
import { createRiffService } from "./service.ts";

async function fixture() {
  const pg = new PGlite();
  await pg.exec(`
    create table "user" (id text primary key, name text not null default '', email text not null unique);
    create table media_assets (
      id text primary key, owner_id text not null, kind text not null, mime_type text not null,
      file_name text not null, file_size integer not null default 0, storage_path text not null,
      status text not null default 'uploading', visibility text not null default 'private',
      created_at timestamptz not null default now(), updated_at timestamptz not null default now()
    );
    create table community_members (community_id text not null, user_id text not null, primary key (community_id, user_id));
    create table student_profiles (user_id text primary key, handle text not null);
    insert into "user" (id, name, email) values ('user-a', 'A', 'a@example.test'), ('user-b', 'B', 'b@example.test');
    insert into student_profiles (user_id, handle) values ('user-a', 'alice'), ('user-b', 'ben');
  `);
  const migration = await readFile(new URL("../../../migrations/0027_riff.sql", import.meta.url), "utf8");
  await pg.exec(migration);
  const makeSql = (query: (text: string, params: unknown[]) => Promise<unknown[]>) => {
    const sql = (async (strings: TemplateStringsArray, ...values: unknown[]) => {
      let text = strings[0];
      for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
      return query(text, values);
    }) as unknown as Sql;
    sql.query = query as Sql["query"];
    return sql;
  };
  const sql = makeSql(async (text, params) => (await pg.query(text, params)).rows);
  sql.transaction = async <T>(work: (tx: Sql) => Promise<T>) => pg.transaction(async (tx) => {
    const txSql = makeSql(async (text, params) => (await tx.query(text, params)).rows);
    return work(txSql);
  });
  return { pg, a: createRiffService(sql, "user-a"), b: createRiffService(sql, "user-b") };
}

test("two accounts share persisted posts and replies, newest first", async () => {
  const { pg, a, b } = await fixture();
  try {
    const post = await a.createRiff({ body: "Persistent post from A" });
    assert.equal((await b.listRiffs()).length, 1);
    assert.equal((await b.listRiffs())[0].authorHandle, "alice");
    await b.replyToRiff({ postId: post.id, body: "First reply" });
    await b.replyToRiff({ postId: post.id, body: "Second reply" });
    const thread = await a.getRiff(post.id);
    assert.deepEqual(thread.replies.map((reply) => reply.body), ["Second reply", "First reply"]);
    assert.equal(thread.replyCount, 2);
  } finally { await pg.close(); }
});

test("ownership is derived from the server service identity", async () => {
  const { pg, a, b } = await fixture();
  try {
    const post = await a.createRiff({ body: "Identity stays server-side" });
    assert.equal(post.authorHandle, "you");
    const rows = await pg.query<{ author_user_id: string }>("select author_user_id from riff_posts where id = $1", [post.id]);
    assert.equal(rows.rows[0].author_user_id, "user-a");
    assert.equal((await b.getRiff(post.id)).authorHandle, "alice");
  } finally { await pg.close(); }
});

test("community Riffs are visible and interactive only for current members", async () => {
  const { pg, a, b } = await fixture();
  try {
    await pg.query("insert into community_members (community_id, user_id) values ($1, $2)", ["community-a", "user-a"]);
    const post = await a.createRiff({ body: "Community-only conversation", communityId: "community-a" });

    assert.equal((await a.listRiffs()).some((item) => item.id === post.id), true);
    assert.equal((await b.listRiffs()).some((item) => item.id === post.id), false);
    await assert.rejects(() => b.getRiff(post.id), /Riff not found/);
    await assert.rejects(() => b.createRiff({ body: "Unauthorized quote", quotePostId: post.id }), /Riff not found/);
    await assert.rejects(() => b.replyToRiff({ postId: post.id, body: "Unauthorized reply" }), /Riff not found/);
    await assert.rejects(() => b.toggleRiffLike(post.id), /Riff not found/);
    await assert.rejects(() => b.toggleRiffFollow(post.id), /Riff not found/);
    await assert.rejects(() => b.reportRiff({ postId: post.id, reason: "spam" }), /Riff not found/);
    await pg.query("delete from community_members where community_id = $1 and user_id = $2", ["community-a", "user-a"]);
    assert.equal((await a.listRiffs()).some((item) => item.id === post.id), false);
    await assert.rejects(() => a.getRiff(post.id), /Riff not found/);
    await assert.rejects(() => a.createRiff({ body: "Quote after leaving", quotePostId: post.id }), /Riff not found/);
  } finally { await pg.close(); }
});

test("users cannot delete another user's post or reply", async () => {
  const { pg, a, b } = await fixture();
  try {
    const post = await a.createRiff({ body: "Owned by A" });
    const reply = await b.replyToRiff({ postId: post.id, body: "Owned by B" });
    await assert.rejects(() => b.softDeleteRiffPost(post.id), /cannot delete/);
    await assert.rejects(() => a.softDeleteRiffReply(reply.id), /cannot delete/);
    await a.softDeleteRiffPost(post.id);
    assert.equal((await b.listRiffs()).length, 0);
  } finally { await pg.close(); }
});

test("likes and follows toggle per account", async () => {
  const { pg, a, b } = await fixture();
  try {
    const post = await a.createRiff({ body: "React to this" });
    assert.deepEqual(await b.toggleRiffLike(post.id), { liked: true, likeCount: 1 });
    assert.deepEqual(await b.toggleRiffLike(post.id), { liked: false, likeCount: 0 });
    assert.deepEqual(await b.toggleRiffFollow(post.id), { following: true, followCount: 1 });
    assert.deepEqual(await b.toggleRiffFollow(post.id), { following: false, followCount: 0 });
  } finally { await pg.close(); }
});

test("reports persist without exposing reporter identity in feed results", async () => {
  const { pg, a, b } = await fixture();
  try {
    const post = await a.createRiff({ body: "Reportable post" });
    const report = await b.reportRiff({ postId: post.id, reason: "spam", details: "Unwanted content" });
    const rows = await pg.query<{ reporter_user_id: string; status: string }>("select reporter_user_id, status from riff_reports where id = $1", [report.id]);
    assert.equal(rows.rows[0].reporter_user_id, "user-b");
    assert.equal(rows.rows[0].status, "open");
    assert.equal("reporterUserId" in (await a.getRiff(post.id)), false);
  } finally { await pg.close(); }
});

test("report details reject non-text payloads", async () => {
  const { pg, a, b } = await fixture();
  try {
    const post = await a.createRiff({ body: "Report validation target" });
    await assert.rejects(
      () => b.reportRiff({ postId: post.id, reason: "spam", details: 123 as unknown as string }),
      /Report details must be text/,
    );
  } finally { await pg.close(); }
});

test("report submissions are rate-limited per account", async () => {
  const { pg, a, b } = await fixture();
  try {
    const post = await a.createRiff({ body: "Rate-limit target" });
    for (let i = 0; i < 10; i += 1) {
      await b.reportRiff({ postId: post.id, reason: "spam", details: `Report ${i}` });
    }
    await assert.rejects(
      () => b.reportRiff({ postId: post.id, reason: "spam" }),
      /Report limit reached/,
    );
  } finally { await pg.close(); }
});

test("media sharing fails closed until Riff has a dedicated media read policy", async () => {
  const { pg, a } = await fixture();
  try {
    await pg.query(`insert into media_assets (id, owner_id, kind, mime_type, file_name, storage_path, status, visibility)
      values ('media-a', 'user-a', 'image', 'image/png', 'a.png', 'private/a.png', 'ready', 'private')`);
    await assert.rejects(() => a.createRiff({ body: "No unsafe media", mediaId: "media-a" }), /not enabled yet/);
  } finally { await pg.close(); }
});
