import { i as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { a as getSql } from "./db-CZ1suuUF.mjs";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/server-Dvbz55zC.js
var PIN_RE = /^\d{4}$/;
var attempts = /* @__PURE__ */ new Map();
function hashPin(pin, salt) {
	return scryptSync(pin, salt, 32).toString("hex");
}
async function ensureTable() {
	const sql = await getSql();
	await sql.query(`create table if not exists user_vault (
    user_id text primary key,
    pin_hash text,
    pin_salt text,
    passkey_id text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  )`);
	return sql;
}
function guardAttempts(userId) {
	const now = Date.now();
	const row = attempts.get(userId);
	if (row && row.until > now && row.n >= 5) throw new Error("Too many tries. Wait a minute.");
}
var vaultStatus_createServerFn_handler = createServerRpc({
	id: "f2218adb991edf653f254ff844af803a4cea29c4144127bac1aa1be42ed0eca4",
	name: "vaultStatus",
	filename: "src/lib/vault/server.ts"
}, (opts) => vaultStatus.__executeServer(opts));
var vaultStatus = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(vaultStatus_createServerFn_handler, async ({ context }) => {
	const row = (await (await ensureTable())`
      select pin_hash, passkey_id from user_vault where user_id = ${context.userId} limit 1`)[0];
	return {
		hasPin: Boolean(row?.pin_hash),
		hasPasskey: Boolean(row?.passkey_id)
	};
});
var setVaultPin_createServerFn_handler = createServerRpc({
	id: "3b0d8883e4d4898643eafe505fd6b0c848f45b1df79ecca414d85f0b13f1a636",
	name: "setVaultPin",
	filename: "src/lib/vault/server.ts"
}, (opts) => setVaultPin.__executeServer(opts));
var setVaultPin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(setVaultPin_createServerFn_handler, async ({ context, data }) => {
	if (!PIN_RE.test(data.pin)) throw new Error("Use a 4-digit passcode.");
	const sql = await ensureTable();
	const salt = randomBytes(16).toString("hex");
	const pin_hash = hashPin(data.pin, salt);
	await sql`
      insert into user_vault (user_id, pin_hash, pin_salt, updated_at)
      values (${context.userId}, ${pin_hash}, ${salt}, now())
      on conflict (user_id) do update set pin_hash = excluded.pin_hash, pin_salt = excluded.pin_salt, updated_at = now()`;
	return { ok: true };
});
var verifyVaultPin_createServerFn_handler = createServerRpc({
	id: "203b94765dfbe879584c15aa4ee4021d32b9c7e3695c6ec36c89716e226932d6",
	name: "verifyVaultPin",
	filename: "src/lib/vault/server.ts"
}, (opts) => verifyVaultPin.__executeServer(opts));
var verifyVaultPin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(verifyVaultPin_createServerFn_handler, async ({ context, data }) => {
	guardAttempts(context.userId);
	if (!PIN_RE.test(data.pin)) throw new Error("Use a 4-digit passcode.");
	const row = (await (await ensureTable())`
      select pin_hash, pin_salt from user_vault where user_id = ${context.userId} limit 1`)[0];
	if (!row?.pin_hash) throw new Error("Set a passcode first.");
	const got = hashPin(data.pin, row.pin_salt);
	const a = Buffer.from(got, "hex");
	const b = Buffer.from(row.pin_hash, "hex");
	const ok = a.length === b.length && timingSafeEqual(a, b);
	const rec = attempts.get(context.userId) ?? {
		n: 0,
		until: Date.now() + 6e4
	};
	if (!ok) {
		rec.n += 1;
		rec.until = Date.now() + 6e4;
		attempts.set(context.userId, rec);
		throw new Error("Wrong passcode.");
	}
	attempts.delete(context.userId);
	return { ok: true };
});
var vaultPasskeyChallenge_createServerFn_handler = createServerRpc({
	id: "40148330e8b90e854e246893c97d3d6a0db75c677c71d3aa604451ad9ab65828",
	name: "vaultPasskeyChallenge",
	filename: "src/lib/vault/server.ts"
}, (opts) => vaultPasskeyChallenge.__executeServer(opts));
var vaultPasskeyChallenge = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(vaultPasskeyChallenge_createServerFn_handler, async () => {
	return { challenge: randomBytes(32).toString("base64url") };
});
var saveVaultPasskey_createServerFn_handler = createServerRpc({
	id: "7cd5c1612b2ab528776c56311da3c9da282dfd09ef2356c0b360b390a7f682ce",
	name: "saveVaultPasskey",
	filename: "src/lib/vault/server.ts"
}, (opts) => saveVaultPasskey.__executeServer(opts));
var saveVaultPasskey = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveVaultPasskey_createServerFn_handler, async ({ context, data }) => {
	if (!data.credentialId.trim()) throw new Error("Passkey was empty.");
	await (await ensureTable())`
      insert into user_vault (user_id, passkey_id, updated_at)
      values (${context.userId}, ${data.credentialId}, now())
      on conflict (user_id) do update set passkey_id = excluded.passkey_id, updated_at = now()`;
	return { ok: true };
});
var verifyVaultPasskey_createServerFn_handler = createServerRpc({
	id: "4889c38e7f00846e23b6366485d86882d46ea5933da2484b68e822a238b46bb5",
	name: "verifyVaultPasskey",
	filename: "src/lib/vault/server.ts"
}, (opts) => verifyVaultPasskey.__executeServer(opts));
var verifyVaultPasskey = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(verifyVaultPasskey_createServerFn_handler, async ({ context, data }) => {
	const rows = await (await ensureTable())`
      select passkey_id from user_vault where user_id = ${context.userId} limit 1`;
	if (!rows[0]?.passkey_id || rows[0].passkey_id !== data.credentialId) throw new Error("That passkey is not registered on this account.");
	return { ok: true };
});
//#endregion
export { saveVaultPasskey_createServerFn_handler, setVaultPin_createServerFn_handler, vaultPasskeyChallenge_createServerFn_handler, vaultStatus_createServerFn_handler, verifyVaultPasskey_createServerFn_handler, verifyVaultPin_createServerFn_handler };
