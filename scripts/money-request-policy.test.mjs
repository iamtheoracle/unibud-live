import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/lib/money/server.ts", import.meta.url), "utf8");

test("money requests can only transition from pending and paid credit is idempotent", () => {
  const start = source.indexOf("export const updateMoneyRequest");
  const end = source.indexOf("export const saveFundingNotes", start);
  assert.notEqual(start, -1, "updateMoneyRequest exists");
  assert.notEqual(end, -1, "saveFundingNotes follows updateMoneyRequest");
  const handler = source.slice(start, end);

  assert.match(handler, /data\.status !== "paid" && data\.status !== "cancelled"/);
  assert.match(handler, /and status = 'pending'/);
  assert.match(handler, /with changed as \([\s\S]*?update payment_requests[\s\S]*?returning amount_kobo, peer_handle, status/);
  assert.match(handler, /insert into wallets[\s\S]*?from changed[\s\S]*?where status = 'paid'/);
  assert.match(handler, /insert into wallet_tx[\s\S]*?from changed[\s\S]*?where status = 'paid'/);
  assert.match(handler, /if \(changed\.length === 0\)/);
  assert.doesNotMatch(handler, /update payment_requests set status = \$\{data\.status\}[\s\S]*?select amount_kobo, peer_handle from payment_requests/);
});

test("Flow student bank is the user-facing name while demo disclosures stay explicit", async () => {
  const [moneyPage, shell, help, login] = await Promise.all([
    readFile(new URL("../src/routes/_app/money.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/components/shell/spark-gate.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/routes/_app/help.tsx", import.meta.url), "utf8"),
    readFile(new URL("../src/routes/login.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(moneyPage, /Flow Student Bank/);
  assert.match(moneyPage, /title="Flow"/);
  assert.match(shell, /label: "Flow"/);
  assert.match(help, /Is Flow real money\?/);
  assert.match(help, /demo ledger/);
  assert.match(login, /Flow’s student-money/);
  assert.match(login, /No real naira moves/);
});
