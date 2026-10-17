import { i as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { a as getSql } from "./db-CZ1suuUF.mjs";
import { i as writeMediaBytes, r as removeMediaBytes, t as parseDataUrl } from "./store.server-BHpVpEmr.mjs";
import { t as BUD_MEDIA } from "./bud-media-oRvNX2s6.mjs";
import { t as kindFromMime } from "./types-DSXVAMNP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-CCYUJx_O.js
var REVENUE_POLICY = {
	affiliateLive: false,
	campaignsLive: false,
	creatorPayoutsLive: false,
	revenueKobo: 0
};
async function ensureBudSeed() {
	const sql = await getSql();
	for (const m of BUD_MEDIA) {
		if ((await sql`select id from bud_media where id = ${m.id} limit 1`)[0]) continue;
		await sql`insert into bud_media (id, owner_id, kind, title, course, duration_min, status, visibility)
      values (${m.id}, ${"unibud-academic"}, ${m.kind}, ${m.title}, ${m.course ?? null}, ${m.durationMin}, ${"awaiting_file"}, ${"class"})`;
	}
}
var uploadMedia_createServerFn_handler = createServerRpc({
	id: "1e34b454461a6dea40d1f75c4b85357e086fb4e0350f590a0cb2b7baf30bbc6d",
	name: "uploadMedia",
	filename: "src/lib/media/server.ts"
}, (opts) => uploadMedia.__executeServer(opts));
var uploadMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(uploadMedia_createServerFn_handler, async ({ context, data }) => {
	const parsed = parseDataUrl(data.dataUrl);
	if (parsed.bytes.length > 8388608) return {
		ok: false,
		error: "That file is over 8 MB."
	};
	const mime = data.mime || parsed.mime;
	const kind = data.kind ?? kindFromMime(mime);
	const id = crypto.randomUUID();
	const sql = await getSql();
	await sql`insert into media_assets (id, owner_id, kind, mime_type, file_name, file_size, storage_path, status, visibility, conversation_id, room_id)
      values (${id}, ${context.userId}, ${kind}, ${mime}, ${data.fileName}, ${parsed.bytes.length}, ${id}, ${"processing"}, ${data.roomId ? "room" : data.conversationId ? "conversation" : "private"}, ${data.conversationId ?? null}, ${data.roomId ?? null})`;
	try {
		await writeMediaBytes(id, parsed.bytes);
		await sql`update media_assets set status = ${"ready"}, updated_at = now() where id = ${id}`;
		return {
			ok: true,
			id,
			kind,
			mime,
			size: parsed.bytes.length
		};
	} catch (err) {
		await sql`update media_assets set status = ${"failed"}, error = ${String(err)}, updated_at = now() where id = ${id}`;
		return {
			ok: false,
			error: "Upload failed. Try again."
		};
	}
});
var deleteMedia_createServerFn_handler = createServerRpc({
	id: "4b67e236f662d21a514c1937cbb9192a0f87191084893d4256798edbdd6860c3",
	name: "deleteMedia",
	filename: "src/lib/media/server.ts"
}, (opts) => deleteMedia.__executeServer(opts));
var deleteMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(deleteMedia_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	const rows = await sql`select owner_id from media_assets where id = ${id} limit 1`;
	if (!rows[0] || String(rows[0].owner_id) !== context.userId) throw new Error("Not allowed");
	await sql`update media_assets set status = ${"deleted"}, updated_at = now() where id = ${id}`;
	await removeMediaBytes(id);
	return { ok: true };
});
var reportMedia_createServerFn_handler = createServerRpc({
	id: "be48a0f7ff4ac4a713dc48106173eab8f5d42407ded7d0b7a2512b978ab688ad",
	name: "reportMedia",
	filename: "src/lib/media/server.ts"
}, (opts) => reportMedia.__executeServer(opts));
var reportMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(reportMedia_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`insert into media_reports (id, media_id, audio_id, reporter_id, reason)
      values (${crypto.randomUUID()}, ${data.mediaId ?? null}, ${data.audioId ?? null}, ${context.userId}, ${data.reason})`;
	return { ok: true };
});
var listBudMedia_createServerFn_handler = createServerRpc({
	id: "00140fc91cf7581c81ea598be246f72e93008a3cf361df9bb14b5b748b8efcda",
	name: "listBudMedia",
	filename: "src/lib/media/server.ts"
}, (opts) => listBudMedia.__executeServer(opts));
var listBudMedia = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listBudMedia_createServerFn_handler, async () => {
	await ensureBudSeed();
	return (await (await getSql())`select * from bud_media order by created_at desc`).map((r) => ({
		id: String(r.id),
		kind: String(r.kind),
		title: String(r.title),
		course: r.course ? String(r.course) : void 0,
		durationMin: Number(r.duration_min ?? 0),
		mediaId: r.media_id ? String(r.media_id) : void 0,
		status: String(r.status),
		lecturer: r.lecturer ? String(r.lecturer) : void 0,
		origin: "bud"
	}));
});
var attachBudFile_createServerFn_handler = createServerRpc({
	id: "ca3cf27d519d4b2ee189844c3ff263d589aab31ee430ae843c459f01e888a2d3",
	name: "attachBudFile",
	filename: "src/lib/media/server.ts"
}, (opts) => attachBudFile.__executeServer(opts));
var attachBudFile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(attachBudFile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (!(await sql`select id from media_assets where id = ${data.mediaId} and owner_id = ${context.userId} and status = ${"ready"}`)[0]) throw new Error("Media not ready");
	await sql`update bud_media set media_id = ${data.mediaId}, status = ${"ready"} where id = ${data.budId}`;
	return { ok: true };
});
var listRoomMessages_createServerFn_handler = createServerRpc({
	id: "c59528282e2807d52b219965f187d917a45b81da80e2a8c2a2e7a23bf968eec2",
	name: "listRoomMessages",
	filename: "src/lib/media/server.ts"
}, (opts) => listRoomMessages.__executeServer(opts));
var listRoomMessages = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((roomId) => roomId).handler(listRoomMessages_createServerFn_handler, async ({ data: roomId }) => {
	return (await (await getSql())`select * from room_messages where room_id = ${roomId} order by created_at asc`).map((r) => ({
		id: String(r.id),
		sender: String(r.sender_name),
		body: String(r.body),
		mediaId: r.media_id ? String(r.media_id) : void 0,
		shareKind: r.share_kind ? String(r.share_kind) : void 0,
		shareJson: r.share_json ? String(r.share_json) : void 0,
		createdAt: String(r.created_at)
	}));
});
var sendRoomMessage_createServerFn_handler = createServerRpc({
	id: "57ec43f815e73a4bfe062db1cc8a54381a5d2aa1730d731bc37c01f83d393909",
	name: "sendRoomMessage",
	filename: "src/lib/media/server.ts"
}, (opts) => sendRoomMessage.__executeServer(opts));
var sendRoomMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(sendRoomMessage_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await sql`insert into room_messages (id, room_id, user_id, sender_name, body, media_id, share_kind, share_json)
      values (${crypto.randomUUID()}, ${data.roomId}, ${context.userId}, ${data.senderName}, ${data.body}, ${data.mediaId ?? null}, ${data.shareKind ?? null}, ${data.shareJson ?? null})`;
	return (await sql`select * from room_messages where room_id = ${data.roomId} order by created_at asc`).map((r) => ({
		id: String(r.id),
		sender: String(r.sender_name),
		body: String(r.body),
		mediaId: r.media_id ? String(r.media_id) : void 0,
		shareKind: r.share_kind ? String(r.share_kind) : void 0,
		shareJson: r.share_json ? String(r.share_json) : void 0,
		createdAt: String(r.created_at)
	}));
});
var persistAudioEvent_createServerFn_handler = createServerRpc({
	id: "177b8d6828ab6e008c4bf0f0386fc55cbc5edc338277cdbb6ea2a747cb36efe6",
	name: "persistAudioEvent",
	filename: "src/lib/media/server.ts"
}, (opts) => persistAudioEvent.__executeServer(opts));
var persistAudioEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(persistAudioEvent_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`insert into audio_events (id, kind, user_id, audio_id, bud_media_id, provider_id, surface)
      values (${crypto.randomUUID()}, ${data.kind}, ${context.userId}, ${data.audioId ?? null}, ${data.budMediaId ?? null}, ${data.providerId ?? null}, ${data.surface})`;
	return { ok: true };
});
var recordPartnerClick_createServerFn_handler = createServerRpc({
	id: "fcf21d5703f16cd08eec2aa81458aad1deffa615bc77a99740351d060cd17a2f",
	name: "recordPartnerClick",
	filename: "src/lib/media/server.ts"
}, (opts) => recordPartnerClick.__executeServer(opts));
var recordPartnerClick = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(recordPartnerClick_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`insert into partner_clicks (id, user_id, provider, track_id, surface, revenue_kobo)
      values (${crypto.randomUUID()}, ${context.userId}, ${data.provider}, ${data.trackId ?? null}, ${data.surface ?? null}, ${REVENUE_POLICY.revenueKobo})`;
	return {
		ok: true,
		revenueKobo: 0
	};
});
//#endregion
export { attachBudFile_createServerFn_handler, deleteMedia_createServerFn_handler, listBudMedia_createServerFn_handler, listRoomMessages_createServerFn_handler, persistAudioEvent_createServerFn_handler, recordPartnerClick_createServerFn_handler, reportMedia_createServerFn_handler, sendRoomMessage_createServerFn_handler, uploadMedia_createServerFn_handler };
