import { i as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { a as getSql } from "./db-CZ1suuUF.mjs";
import { c as notify } from "./server-3ArcV-Gz.mjs";
import { a as PEOPLE } from "./catalog-DxoFHR0q.mjs";
import { i as mapConvo, l as mapMessage } from "./map-BJvu74k2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-Bi1G0v3k.js
async function loadConversation(userId, id) {
	const sql = await getSql();
	const convos = await sql`select * from conversations where id = ${id} and user_id = ${userId} limit 1`;
	if (!convos[0]) return null;
	const messages = (await sql`select * from messages where conversation_id = ${id} and user_id = ${userId} order by created_at asc`).map(mapMessage);
	return {
		conversation: mapConvo(convos[0]),
		messages
	};
}
var listConversations_createServerFn_handler = createServerRpc({
	id: "8c268163592aac3c92342701eb40a52d22f5a0c68acf78c02fdaae85b203f26e",
	name: "listConversations",
	filename: "src/lib/social/server.ts"
}, (opts) => listConversations.__executeServer(opts));
var listConversations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listConversations_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`select * from conversations where user_id = ${context.userId} order by updated_at desc`).map(mapConvo);
});
var getConversation_createServerFn_handler = createServerRpc({
	id: "ae0cd7c3ec9b55892e9768293d3cd5fc4284539e682254d23a665e5d4337626b",
	name: "getConversation",
	filename: "src/lib/social/server.ts"
}, (opts) => getConversation.__executeServer(opts));
var getConversation = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getConversation_createServerFn_handler, async ({ context, data: id }) => loadConversation(context.userId, id));
var openConversation_createServerFn_handler = createServerRpc({
	id: "1226a209efdeb5ed553ed79ffb51340db5a2c302b5276a2912377662482d56af",
	name: "openConversation",
	filename: "src/lib/social/server.ts"
}, (opts) => openConversation.__executeServer(opts));
var openConversation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(openConversation_createServerFn_handler, async ({ context, data }) => {
	const handle = data.handle.replace(/^@/, "").trim().toLowerCase();
	const sql = await getSql();
	const existing = await sql`select * from conversations where user_id = ${context.userId} and peer_handle = ${handle} limit 1`;
	if (existing[0]) return mapConvo(existing[0]);
	const id = crypto.randomUUID();
	const seed = data.seed || `Hi — I saw your listing on UNIBUD.`;
	await sql`insert into conversations (id, user_id, peer_handle, listing_id, last_body)
      values (${id}, ${context.userId}, ${handle}, ${data.listingId ?? null}, ${seed})`;
	await sql`insert into messages (id, conversation_id, user_id, sender, body)
      values (${crypto.randomUUID()}, ${id}, ${context.userId}, ${"me"}, ${seed})`;
	const person = PEOPLE.find((p) => p.handle === handle);
	const reply = person ? `Hey, this is ${person.name.split(" ")[0]}. Happy to talk — keep payments inside UNIBUD demo so we both have a record.` : "Got it. Let’s keep this on UNIBUD.";
	await sql`insert into messages (id, conversation_id, user_id, sender, body)
      values (${crypto.randomUUID()}, ${id}, ${context.userId}, ${"peer"}, ${reply})`;
	await sql`update conversations set last_body = ${reply}, updated_at = now() where id = ${id} and user_id = ${context.userId}`;
	await notify(context.userId, "message", `Chat with @${handle}`, reply, `/messages/${id}`);
	const rows = await sql`select * from conversations where id = ${id} and user_id = ${context.userId}`;
	return mapConvo(rows[0]);
});
var sendMessage_createServerFn_handler = createServerRpc({
	id: "1aa8e9da95a4494f9ebe4722b1f2a73360ea6de8b2bb716516399f71f92b53e9",
	name: "sendMessage",
	filename: "src/lib/social/server.ts"
}, (opts) => sendMessage.__executeServer(opts));
var sendMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sendMessage_createServerFn_handler, async ({ context, data }) => {
	const body = data.body.trim();
	if (!body && !data.mediaId && !data.shareJson) throw new Error("Message is empty");
	const sql = await getSql();
	if (!(await sql`select * from conversations where id = ${data.conversationId} and user_id = ${context.userId} limit 1`)[0]) throw new Error("Conversation not found");
	const preview = body || data.shareKind || "Media";
	await sql`insert into messages (id, conversation_id, user_id, sender, body, media_id, share_kind, share_json)
      values (${crypto.randomUUID()}, ${data.conversationId}, ${context.userId}, ${"me"}, ${body || preview}, ${data.mediaId ?? null}, ${data.shareKind ?? null}, ${data.shareJson ?? null})`;
	await sql`update conversations set last_body = ${preview}, updated_at = now()
      where id = ${data.conversationId} and user_id = ${context.userId}`;
	return loadConversation(context.userId, data.conversationId);
});
var joinCommunity_createServerFn_handler = createServerRpc({
	id: "d25180cf38c0db45c35b6ca179fdbdb0977ed8a83919b9c99b1f6492d66033cf",
	name: "joinCommunity",
	filename: "src/lib/social/server.ts"
}, (opts) => joinCommunity.__executeServer(opts));
var joinCommunity = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((communityId) => communityId).handler(joinCommunity_createServerFn_handler, async ({ context, data: communityId }) => {
	const sql = await getSql();
	if ((await sql`select community_id from community_members where user_id = ${context.userId} and community_id = ${communityId}`)[0]) {
		await sql`delete from community_members where user_id = ${context.userId} and community_id = ${communityId}`;
		return { joined: false };
	}
	await sql`insert into community_members (user_id, community_id) values (${context.userId}, ${communityId})`;
	return { joined: true };
});
var myCommunities_createServerFn_handler = createServerRpc({
	id: "cd8fff3846d9df00971e47df95793633c255afde74dedbb0e811f229d150d589",
	name: "myCommunities",
	filename: "src/lib/social/server.ts"
}, (opts) => myCommunities.__executeServer(opts));
var myCommunities = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(myCommunities_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`select community_id from community_members where user_id = ${context.userId}`).map((r) => r.community_id);
});
var createPost_createServerFn_handler = createServerRpc({
	id: "b87a705d21f422de288a8796a3a6e9b0268ad02a7374945222dd6406bf4ba8f7",
	name: "createPost",
	filename: "src/lib/social/server.ts"
}, (opts) => createPost.__executeServer(opts));
var createPost = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createPost_createServerFn_handler, async ({ context, data }) => {
	const body = data.body.trim() || (data.video ? "Reel" : data.image ? "Photo" : "");
	if (!body) throw new Error("Write something first");
	const sql = await getSql();
	const handle = (await sql`select handle from student_profiles where user_id = ${context.userId} limit 1`)[0]?.handle || "you";
	const id = `p_${crypto.randomUUID().slice(0, 8)}`;
	const kind = data.kind ?? (data.video ? "reel" : "post");
	try {
		await sql`insert into posts (id, community_id, author_handle, body, image, video, kind)
        values (${id}, ${data.communityId}, ${handle}, ${body}, ${data.image ?? null}, ${data.video ?? null}, ${kind})`;
	} catch {
		await sql`insert into posts (id, community_id, author_handle, body, image)
        values (${id}, ${data.communityId}, ${handle}, ${body}, ${data.image ?? null})`;
	}
	return {
		id,
		handle,
		body,
		kind
	};
});
//#endregion
export { createPost_createServerFn_handler, getConversation_createServerFn_handler, joinCommunity_createServerFn_handler, listConversations_createServerFn_handler, myCommunities_createServerFn_handler, openConversation_createServerFn_handler, sendMessage_createServerFn_handler };
