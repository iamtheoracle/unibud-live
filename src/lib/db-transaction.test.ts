import assert from "node:assert/strict";
import test from "node:test";
import { runInTransaction, type TransactionClient } from "./db-transaction.ts";

function fakeClient(options: {
  failOn?: string;
  calls?: string[];
  releaseCalls?: { count: number };
} = {}): TransactionClient {
  return {
    async query(text) {
      options.calls?.push(text);
      if (options.failOn === text) throw new Error(`failed ${text}`);
    },
    release() {
      if (options.releaseCalls) options.releaseCalls.count += 1;
    },
  };
}

test("commits successful work and releases the client", async () => {
  const calls: string[] = [];
  const released = { count: 0 };
  const value = await runInTransaction(fakeClient({ calls, releaseCalls: released }), async () => {
    calls.push("work");
    return 42;
  });

  assert.equal(value, 42);
  assert.deepEqual(calls, ["begin", "work", "commit"]);
  assert.equal(released.count, 1);
});

test("rolls back failed work, preserves the original error, and releases the client", async () => {
  const calls: string[] = [];
  const released = { count: 0 };
  await assert.rejects(
    runInTransaction(fakeClient({ calls, releaseCalls: released }), async () => {
      calls.push("work");
      throw new Error("work failed");
    }),
    /work failed/,
  );

  assert.deepEqual(calls, ["begin", "work", "rollback"]);
  assert.equal(released.count, 1);
});

test("does not mask a work error when rollback also fails", async () => {
  const released = { count: 0 };
  const client = fakeClient({ failOn: "rollback", releaseCalls: released });
  await assert.rejects(
    runInTransaction(client, async () => {
      throw new Error("original failure");
    }),
    /original failure/,
  );
  assert.equal(released.count, 1);
});

test("releases the client when beginning the transaction fails without attempting rollback", async () => {
  const calls: string[] = [];
  const released = { count: 0 };
  await assert.rejects(
    runInTransaction(fakeClient({ failOn: "begin", calls, releaseCalls: released }), async () => {
      assert.fail("work must not run when BEGIN fails");
    }),
    /failed begin/,
  );
  assert.deepEqual(calls, ["begin"]);
  assert.equal(released.count, 1);
});

test("attempts rollback when commit fails and releases the client", async () => {
  const calls: string[] = [];
  const released = { count: 0 };
  await assert.rejects(
    runInTransaction(fakeClient({ failOn: "commit", calls, releaseCalls: released }), async () => "done"),
    /failed commit/,
  );
  assert.deepEqual(calls, ["begin", "commit", "rollback"]);
  assert.equal(released.count, 1);
});
