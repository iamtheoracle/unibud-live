import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import test from "node:test";
import { Pool, type PoolClient } from "pg";
import type { Sql } from "@/lib/db";
import { createRiffService } from "./service.ts";

const databaseUrl = process.env.RIFF_TEST_DATABASE_URL;

function makeSql(
  query: (text: string, params?: unknown[]) => Promise<unknown[]>,
  transaction?: NonNullable<Sql["transaction"]>,
): Sql {
  const sql = (async (strings: TemplateStringsArray, ...values: unknown[]) => {
    let text = strings[0];
    for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
    return query(text, values);
  }) as unknown as Sql;
  sql.query = async <T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> =>
    await query(text, params) as T[];
  if (transaction) sql.transaction = transaction;
  return sql;
}

function makePoolSql(pool: Pool): Sql {
  const query = async (text: string, params: unknown[] = []) =>
    (await pool.query(text, params as any[])).rows as unknown[];
  const transaction: NonNullable<Sql["transaction"]> = async <T>(work: (tx: Sql) => Promise<T>) => {
    const client = await pool.connect();
    await client.query("begin");
    const txSql = makeSql(async (text, params = []) =>
      (await client.query(text, params as any[])).rows as unknown[],
    );
    try {
      const result = await work(txSql);
      await client.query("commit");
      return result;
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  };
  return makeSql(query, transaction);
}

function withMembershipLockGate(sql: Sql, gate: Promise<void>, onLocked: () => void): Sql {
  let used = false;
  const transaction: NonNullable<Sql["transaction"]> = async <T>(work: (tx: Sql) => Promise<T>) => {
    if (!sql.transaction) throw new Error("Transactions are unavailable in the test SQL adapter.");
    return sql.transaction(async (tx) => {
      const gatedTx = makeSql(async (text, params = []) => {
        const rows = await tx.query(text, params);
        if (!used && /from community_members/i.test(text) && /for key share/i.test(text)) {
          used = true;
          onLocked();
          await gate;
        }
        return rows;
      });
      return work(gatedTx);
    });
  };
  return makeSql((text, params = []) => sql.query(text, params), transaction);
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test("PostgreSQL serializes membership revocation behind an in-flight Riff reply", { skip: !databaseUrl }, async () => {
  if (!databaseUrl) return;
  const rootPool = new Pool({ connectionString: databaseUrl, max: 4 });
  const schema = `riff_test_${randomUUID().replace(/-/g, "")}`;
  let pool: Pool | undefined;
  let revoker: PoolClient | undefined;
  let action: Promise<unknown> | undefined;
  let revokePromise: Promise<unknown> | undefined;
  let releaseGate: () => void = () => {};
  try {
    await rootPool.query(`create schema "${schema}"`);
    pool = new Pool({ connectionString: databaseUrl, options: `-c search_path=${schema}`, max: 4 });
    await pool.query(`create table "user" (id text primary key)`);
    await pool.query("create table media_assets (id text primary key)");
    await pool.query("create table student_profiles (user_id text primary key, handle text not null)");
    await pool.query("create table communities (id text primary key, privacy text not null default 'public')");
    await pool.query("create table community_members (community_id text not null, user_id text not null, primary key (community_id, user_id))");
    const migration = await readFile(new URL("../../../migrations/0027_riff.sql", import.meta.url), "utf8");
    await pool.query(migration);
    await pool.query('insert into "user" (id) values ($1), ($2)', ["user-a", "user-b"]);
    await pool.query("insert into student_profiles (user_id, handle) values ($1, $2), ($3, $4)", [
      "user-a", "alpha", "user-b", "beta",
    ]);
    await pool.query("insert into communities (id, privacy) values ('private-room', 'private')");
    await pool.query("insert into community_members (community_id, user_id) values ('private-room', 'user-a')");

    const sql = makePoolSql(pool);
    const member = createRiffService(sql, "user-a");
    const post = await member.createRiff({ body: "Lock ordering target", communityId: "private-room" });

    let signalLocked: () => void = () => {};
    const membershipLocked = new Promise<void>((resolve) => { signalLocked = resolve; });
    const gate = new Promise<void>((resolve) => { releaseGate = resolve; });
    const gatedService = createRiffService(withMembershipLockGate(sql, gate, signalLocked), "user-a");
    action = gatedService.replyToRiff({ postId: post.id, body: "Reply while membership is locked" });

    let lockTimeout: ReturnType<typeof setTimeout> | undefined;
    await Promise.race([
      membershipLocked,
      new Promise<never>((_, reject) => {
        lockTimeout = setTimeout(() => reject(new Error("Riff mutation did not acquire its membership lock.")), 3000);
      }),
    ]).finally(() => { if (lockTimeout) clearTimeout(lockTimeout); });

    revoker = await pool.connect();
    await revoker.query("begin");
    const pid = (await revoker.query("select pg_backend_pid() as pid")).rows[0].pid as number;
    let revoked = false;
    revokePromise = revoker.query("delete from community_members where community_id = $1 and user_id = $2", [
      "private-room", "user-a",
    ]).then((result) => { revoked = true; return result; });

    const deadline = Date.now() + 3000;
    let waitingForLock = false;
    while (Date.now() < deadline) {
      const state = await rootPool.query("select wait_event_type from pg_stat_activity where pid = $1", [pid]);
      if (state.rows[0]?.wait_event_type === "Lock") {
        waitingForLock = true;
        break;
      }
      await delay(10);
    }
    assert.equal(waitingForLock, true, "membership DELETE should wait on the row lock held by the Riff action");
    assert.equal(revoked, false);

    releaseGate();
    const reply = await action;
    await revokePromise;
    await revoker.query("commit");
    assert.equal((reply as { body: string }).body, "Reply while membership is locked");

    const membershipRows = await pool.query(
      "select 1 from community_members where community_id = 'private-room' and user_id = 'user-a'",
    );
    const replyRows = await pool.query(
      "select 1 from riff_replies where post_id = $1 and body = $2",
      [post.id, "Reply while membership is locked"],
    );
    assert.equal(membershipRows.rows.length, 0, "revocation should commit after the in-flight action");
    assert.equal(replyRows.rows.length, 1, "the authorized action should finish before revocation commits");
  } finally {
    releaseGate();
    if (action) await Promise.allSettled([action]);
    if (revokePromise) await Promise.allSettled([revokePromise]);
    if (revoker) {
      try { await revoker.query("rollback"); } catch {}
      revoker.release();
    }
    if (pool) {
      await pool.end();
      await rootPool.query(`drop schema if exists "${schema}" cascade`).catch(() => undefined);
    }
    await rootPool.end();
  }
});
