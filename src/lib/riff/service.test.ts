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
    create table communities (id text primary key, privacy text not null default 'public');
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
  return {
    pg,
    sql,
    a: createRiffService(sql, "user-a"),
    b: createRiffService(sql, "user-b"),
    guest: createRiffService(sql, null),
  };
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


test("guests can read global and public-community Riffs but not private content or mutations", async () => {
  const { pg, a, guest } = await fixture();
  try {
    await pg.query("insert into communities (id, privacy) values ($1, $2), ($3, $4)", [
      "public-community", "public", "private-community", "private",
    ]);
    await pg.query("insert into community_members (community_id, user_id) values ($1, $2), ($3, $2)", [
      "public-community", "user-a", "private-community",
    ]);

    const globalPost = await a.createRiff({ body: "Public global post" });
    const publicPost = await a.createRiff({ body: "Public community post", communityId: "public-community" });
    const privatePost = await a.createRiff({ body: "Private community post", communityId: "private-community" });
    await a.replyToRiff({ postId: publicPost.id, body: "Public reply" });
    await a.replyToRiff({ postId: privatePost.id, body: "Private reply" });

    const feed = await guest.listRiffs({ limit: 50 });
    const visibleIds = new Set(feed.map((post) => post.id));
    assert.equal(visibleIds.has(globalPost.id), true);
    assert.equal(visibleIds.has(publicPost.id), true);
    assert.equal(visibleIds.has(privatePost.id), false);
    assert.equal(feed.find((post) => post.id === globalPost.id)?.canInteract, true);
    assert.equal(feed.find((post) => post.id === publicPost.id)?.canInteract, false);
    assert.equal("authorUserId" in feed[0], false);
    assert.equal("author_user_id" in feed[0], false);

    const publicThread = await guest.getRiff(publicPost.id);
    assert.equal(publicThread.replies.some((reply) => reply.body === "Public reply"), true);
    await assert.rejects(() => guest.getRiff(privatePost.id), /Riff not found/);

    await assert.rejects(() => guest.createRiff({ body: "Guest write" }), /Authentication required/);
    await assert.rejects(() => guest.replyToRiff({ postId: globalPost.id, body: "Guest reply" }), /Authentication required/);
    await assert.rejects(() => guest.toggleRiffLike(globalPost.id), /Authentication required/);
    await assert.rejects(() => guest.toggleRiffFollow(globalPost.id), /Authentication required/);
    await assert.rejects(() => guest.reportRiff({ postId: globalPost.id, reason: "spam" }), /Authentication required/);
    await assert.rejects(() => guest.softDeleteRiffPost(globalPost.id), /Authentication required/);
  } finally { await pg.close(); }
});


test("feed input rejects malformed cursors, limits, and non-object payloads", async () => {
  const { pg, a } = await fixture();
  try {
    await assert.rejects(() => a.listRiffs(null as unknown as {}), /Invalid feed input/);
    await assert.rejects(() => a.listRiffs({ cursorCreatedAt: "", cursorId: "" }), /Invalid feed cursor/);
    await assert.rejects(() => a.listRiffs({ cursorCreatedAt: "2026-10-16T00:00:00Z" }), /Both cursor fields are required/);
    await assert.rejects(() => a.listRiffs({ limit: "20" as unknown as number }), /Invalid feed limit/);
    await assert.rejects(() => a.listRiffs({ limit: 0 }), /Invalid feed limit/);
  } finally { await pg.close(); }
});


test("membership revocation waits for an in-flight Riff mutation holding the membership lock", async () => {
  const { pg, sql, a } = await fixture();
  let releaseGate: () => void = () => {};
  let signalLocked: () => void = () => {};
  let gateUsed = false;
  const membershipLocked = new Promise<void>((resolve) => { signalLocked = resolve; });
  const gate = new Promise<void>((resolve) => { releaseGate = resolve; });
  let revocation: Promise<void> | undefined;
  let action: Promise<unknown> | undefined;
  try {
    await pg.query("create table communities (id text primary key, privacy text not null default 'public')");
    await pg.query("insert into communities (id, privacy) values ('private-room', 'private')");
    await pg.query("insert into community_members (community_id, user_id) values ('private-room', 'user-a')");
    const post = await a.createRiff({ body: "Lock ordering target", communityId: "private-room" });

    const gatedSql = (async (strings: TemplateStringsArray, ...values: unknown[]) => sql(strings, ...values)) as unknown as Sql;
    gatedSql.query = sql.query;
    gatedSql.transaction = async <T>(work: (tx: Sql) => Promise<T>) => sql.transaction!(async (tx) => {
      const txSql = (async (strings: TemplateStringsArray, ...values: unknown[]) => tx(strings, ...values)) as unknown as Sql;
      txSql.query = async (text: string, params?: unknown[]) => {
        const rows = await tx.query(text, params);
        if (!gateUsed && /from community_members/i.test(text) && /for key share/i.test(text)) {
          gateUsed = true;
          signalLocked();
          await gate;
        }
        return rows;
      };
      return work(txSql);
    });
    const gatedService = createRiffService(gatedSql, "user-a");
    action = gatedService.replyToRiff({ postId: post.id, body: "Reply while membership is locked" });

    let timeout: ReturnType<typeof setTimeout> | undefined;
    await Promise.race([
      membershipLocked,
      new Promise<never>((_, reject) => { timeout = setTimeout(() => reject(new Error("Membership lock was not acquired.")), 2000); }),
    ]).finally(() => { if (timeout) clearTimeout(timeout); });

    let revoked = false;
    revocation = sql.transaction!(async (tx) => {
      await tx.query("delete from community_members where community_id = $1 and user_id = $2", ["private-room", "user-a"]);
      revoked = true;
    });
    await new Promise((resolve) => setTimeout(resolve, 25));
    assert.equal(revoked, false, "revocation must wait while the action holds the membership lock");

    releaseGate();
    const reply = await action;
    await revocation;
    assert.equal((reply as { body: string }).body, "Reply while membership is locked");
    assert.equal(revoked, true);
    const remainingMembership = await pg.query("select 1 from community_members where community_id = 'private-room' and user_id = 'user-a'");
    const persistedReply = await pg.query("select 1 from riff_replies where post_id = $1 and body = $2", [post.id, "Reply while membership is locked"]);
    assert.equal(remainingMembership.rows.length, 0);
    assert.equal(persistedReply.rows.length, 1);
  } finally {
    releaseGate();
    if (action) await Promise.allSettled([action]);
    if (revocation) await Promise.allSettled([revocation]);
    await pg.close();
  }
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
