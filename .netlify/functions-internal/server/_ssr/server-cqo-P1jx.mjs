import { i as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { a as getSql } from "./db-CZ1suuUF.mjs";
import { c as notify } from "./server-3ArcV-Gz.mjs";
import { _ as mapTx, h as mapRequest } from "./map-BJvu74k2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-cqo-P1jx.js
var DEMO_NOTE = "Demo ledger only. No real money moved. No bank, card, or NELFUND rail is connected.";
async function ensureWallet(userId) {
	const sql = await getSql();
	await sql`insert into wallets (user_id, balance_kobo) values (${userId}, 0) on conflict (user_id) do nothing`;
	return (await sql`select balance_kobo from wallets where user_id = ${userId}`)[0]?.balance_kobo ?? 0;
}
async function loadWallet(userId) {
	const balanceKobo = await ensureWallet(userId);
	const sql = await getSql();
	return {
		balanceKobo,
		demo: true,
		disclaimer: DEMO_NOTE,
		tx: (await sql`select * from wallet_tx where user_id = ${userId} order by created_at desc limit 40`).map(mapTx),
		requests: (await sql`select * from payment_requests where user_id = ${userId} order by created_at desc limit 40`).map(mapRequest),
		funding: (await sql`select program, status, notes, updated_at from funding_notes where user_id = ${userId} limit 1`)[0] ?? {
			program: "nelfund",
			status: "exploring",
			notes: "",
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}
	};
}
var getWallet_createServerFn_handler = createServerRpc({
	id: "c24bb7589c99aaa146fd19c2da2c3b7c80fbed83f68da84df6eccc0314a7111b",
	name: "getWallet",
	filename: "src/lib/money/server.ts"
}, (opts) => getWallet.__executeServer(opts));
var getWallet = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getWallet_createServerFn_handler, async ({ context }) => loadWallet(context.userId));
var addDemoFunds_createServerFn_handler = createServerRpc({
	id: "8529a3226e92dafd450333a25afd5046b146283f002d41b5034ca66ba9b689c3",
	name: "addDemoFunds",
	filename: "src/lib/money/server.ts"
}, (opts) => addDemoFunds.__executeServer(opts));
var addDemoFunds = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((kobo) => kobo).handler(addDemoFunds_createServerFn_handler, async ({ context, data: kobo }) => {
	if (!Number.isInteger(kobo) || kobo < 1e4 || kobo > 5e7) throw new Error("Demo top-up must be between ₦100 and ₦500,000");
	const sql = await getSql();
	await ensureWallet(context.userId);
	await sql`update wallets set balance_kobo = balance_kobo + ${kobo}, updated_at = now() where user_id = ${context.userId}`;
	await sql`insert into wallet_tx (id, user_id, type, amount_kobo, status, counterparty, note)
      values (${crypto.randomUUID()}, ${context.userId}, ${"demo_topup"}, ${kobo}, ${"demo_recorded"}, ${"UNIBUD demo"}, ${"Demo funds added. Not a real deposit."})`;
	await notify(context.userId, "money", "Demo funds added", "This is a simulated ledger entry. No real money moved.", "/money");
	return loadWallet(context.userId);
});
var sendDemoMoney_createServerFn_handler = createServerRpc({
	id: "407859e35cb52f503a226719d1ac57bbfe3bdb2aaa3d1c1aa948419fde10e419",
	name: "sendDemoMoney",
	filename: "src/lib/money/server.ts"
}, (opts) => sendDemoMoney.__executeServer(opts));
var sendDemoMoney = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sendDemoMoney_createServerFn_handler, async ({ context, data }) => {
	if (!Number.isInteger(data.kobo) || data.kobo < 1e4) throw new Error("Minimum demo send is ₦100");
	const sql = await getSql();
	if (await ensureWallet(context.userId) < data.kobo) throw new Error("Not enough demo balance");
	const handle = data.handle.replace(/^@/, "").trim().toLowerCase();
	if (!handle) throw new Error("Choose someone to pay");
	await sql`update wallets set balance_kobo = balance_kobo - ${data.kobo}, updated_at = now() where user_id = ${context.userId}`;
	await sql`insert into wallet_tx (id, user_id, type, amount_kobo, status, counterparty, note)
      values (${crypto.randomUUID()}, ${context.userId}, ${"send"}, ${data.kobo}, ${"demo_recorded"}, ${handle}, ${data.note.trim() || "Demo send. No real money moved."})`;
	await notify(context.userId, "money", "Demo send recorded", `Simulated send to @${handle}. ${DEMO_NOTE}`, "/money");
	return loadWallet(context.userId);
});
var withdrawDemo_createServerFn_handler = createServerRpc({
	id: "e6d5a40fa0f7534645504148ea0b26c17a40d9e9529b045a3700c5a5a32fbf9e",
	name: "withdrawDemo",
	filename: "src/lib/money/server.ts"
}, (opts) => withdrawDemo.__executeServer(opts));
var withdrawDemo = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(withdrawDemo_createServerFn_handler, async ({ context, data }) => {
	if (!Number.isInteger(data.kobo) || data.kobo < 1e4) throw new Error("Minimum demo withdrawal is ₦100");
	const sql = await getSql();
	if (await ensureWallet(context.userId) < data.kobo) throw new Error("Not enough demo balance");
	await sql`update wallets set balance_kobo = balance_kobo - ${data.kobo}, updated_at = now() where user_id = ${context.userId}`;
	await sql`insert into wallet_tx (id, user_id, type, amount_kobo, status, counterparty, note)
      values (${crypto.randomUUID()}, ${context.userId}, ${"withdraw"}, ${data.kobo}, ${"demo_recorded"}, ${data.destination}, ${"Demo withdrawal recorded. No payout rail is connected."})`;
	await notify(context.userId, "money", "Demo withdrawal recorded", "No bank payout happened. This is a simulated ledger entry.", "/money");
	return loadWallet(context.userId);
});
var payListingDemo_createServerFn_handler = createServerRpc({
	id: "a61e37c6992d3c5c25f1e738f0cc57c04629eacf370892058edce745dc8fdb3f",
	name: "payListingDemo",
	filename: "src/lib/money/server.ts"
}, (opts) => payListingDemo.__executeServer(opts));
var payListingDemo = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(payListingDemo_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (await ensureWallet(context.userId) < data.kobo) throw new Error("Not enough demo balance");
	await sql`update wallets set balance_kobo = balance_kobo - ${data.kobo}, updated_at = now() where user_id = ${context.userId}`;
	await sql`insert into wallet_tx (id, user_id, type, amount_kobo, status, counterparty, note)
      values (${crypto.randomUUID()}, ${context.userId}, ${"market_pay"}, ${data.kobo}, ${"demo_recorded"}, ${data.sellerHandle}, ${`Demo payment for “${data.title}”. No real money moved.`})`;
	await notify(context.userId, "market", "Demo marketplace payment", `Recorded against “${data.title}”. Not a real transfer.`, "/money");
	return loadWallet(context.userId);
});
var createMoneyRequest_createServerFn_handler = createServerRpc({
	id: "db895b5de14bc03324f6c6d972066dc8d486099d91c98669ff464b37ab9a3d1f",
	name: "createMoneyRequest",
	filename: "src/lib/money/server.ts"
}, (opts) => createMoneyRequest.__executeServer(opts));
var createMoneyRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createMoneyRequest_createServerFn_handler, async ({ context, data }) => {
	if (!Number.isInteger(data.kobo) || data.kobo < 1e4) throw new Error("Minimum request is ₦100");
	const handles = data.handles.map((h) => h.replace(/^@/, "").trim().toLowerCase()).filter(Boolean);
	if (handles.length === 0) throw new Error("Choose at least one person");
	const per = data.split ? Math.round(data.kobo / handles.length) : data.kobo;
	const sql = await getSql();
	for (const handle of handles) await sql`insert into payment_requests (id, user_id, direction, peer_handle, amount_kobo, note, status)
        values (${crypto.randomUUID()}, ${context.userId}, ${"out"}, ${handle}, ${per}, ${data.note.trim() || "Demo request"}, ${"pending"})`;
	await notify(context.userId, "request", data.split ? "Split request created" : "Money request created", "These are demo requests. Nobody was charged.", "/money");
	return loadWallet(context.userId);
});
var updateMoneyRequest_createServerFn_handler = createServerRpc({
	id: "9cf6e694e084ffb5b912fc12823ae741227506b29a7d0aaeaa7addf152cf0938",
	name: "updateMoneyRequest",
	filename: "src/lib/money/server.ts"
}, (opts) => updateMoneyRequest.__executeServer(opts));
var updateMoneyRequest = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateMoneyRequest_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await sql`update payment_requests set status = ${data.status}
      where id = ${data.id} and user_id = ${context.userId}`;
	if (data.status === "paid") {
		const row = (await sql`
        select amount_kobo, peer_handle from payment_requests
        where id = ${data.id} and user_id = ${context.userId}`)[0];
		if (row) {
			await ensureWallet(context.userId);
			await sql`update wallets set balance_kobo = balance_kobo + ${row.amount_kobo}, updated_at = now() where user_id = ${context.userId}`;
			await sql`insert into wallet_tx (id, user_id, type, amount_kobo, status, counterparty, note)
          values (${crypto.randomUUID()}, ${context.userId}, ${"receive"}, ${row.amount_kobo}, ${"demo_recorded"}, ${row.peer_handle}, ${"Demo request marked paid. No real money received."})`;
		}
	}
	return loadWallet(context.userId);
});
var saveFundingNotes_createServerFn_handler = createServerRpc({
	id: "bcf20e5785da3d0c036eccb9f326158c7efcab155d92130d451174a7c02af282",
	name: "saveFundingNotes",
	filename: "src/lib/money/server.ts"
}, (opts) => saveFundingNotes.__executeServer(opts));
var saveFundingNotes = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveFundingNotes_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`insert into funding_notes (user_id, program, status, notes, updated_at)
      values (${context.userId}, ${data.program}, ${data.status}, ${data.notes}, now())
      on conflict (user_id) do update set program = ${data.program}, status = ${data.status}, notes = ${data.notes}, updated_at = now()`;
	return loadWallet(context.userId);
});
//#endregion
export { addDemoFunds_createServerFn_handler, createMoneyRequest_createServerFn_handler, getWallet_createServerFn_handler, payListingDemo_createServerFn_handler, saveFundingNotes_createServerFn_handler, sendDemoMoney_createServerFn_handler, updateMoneyRequest_createServerFn_handler, withdrawDemo_createServerFn_handler };
