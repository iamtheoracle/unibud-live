import { i as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as canTeach } from "./roles-B968-RcG.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { a as getSql } from "./db-CZ1suuUF.mjs";
import { a as PEOPLE, c as UNIVERSITIES, i as LISTINGS, n as COMMUNITIES, o as POSTS, r as DISCOVERY } from "./catalog-DxoFHR0q.mjs";
import { d as mapPerson, f as mapPost, m as mapProfile, n as mapCommunity, o as mapDiscovery, p as mapPostReply, s as mapListing, u as mapNote, v as mapUni } from "./map-BJvu74k2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-DOkzU3AQ.js
async function ensureCatalogSeed() {
	const sql = await getSql();
	if ((await sql`select id from catalog_seeded where id = 1`).length > 0) return;
	for (const u of UNIVERSITIES) await sql`insert into universities (id, name, short_name, city)
      values (${u.id}, ${u.name}, ${u.shortName}, ${u.city})
      on conflict (id) do nothing`;
	for (const p of PEOPLE) await sql`insert into directory_people (handle, name, university_id, program, year, bio, verified)
      values (${p.handle}, ${p.name}, ${p.universityId}, ${p.program}, ${p.year}, ${p.bio}, ${p.verified})
      on conflict (handle) do nothing`;
	for (const l of LISTINGS) await sql`insert into listings (
      id, kind, category, title, description, price_kobo, price_note, image, tone,
      seller_handle, university_id, location, tags, saved_count, created_at
    ) values (
      ${l.id}, ${l.kind}, ${l.category}, ${l.title}, ${l.description}, ${l.priceKobo},
      ${l.priceNote}, ${l.image ?? null}, ${l.tone}, ${l.sellerHandle}, ${l.universityId},
      ${l.location}, ${JSON.stringify(l.tags)}, ${l.savedCount}, ${l.createdAt}
    ) on conflict (id) do nothing`;
	for (const c of COMMUNITIES) await sql`insert into communities (id, name, kind, university_id, description, cover, members)
      values (${c.id}, ${c.name}, ${c.kind}, ${c.universityId ?? null}, ${c.description}, ${c.cover ?? null}, ${c.members})
      on conflict (id) do nothing`;
	for (const p of POSTS) {
		await sql`insert into posts (id, community_id, author_handle, body, image, created_at)
      values (${p.id}, ${p.communityId}, ${p.authorHandle}, ${p.body}, ${p.image ?? null}, ${p.createdAt})
      on conflict (id) do nothing`;
		try {
			await sql`update posts set video = ${p.video ?? null}, kind = ${p.kind ?? "post"} where id = ${p.id}`;
		} catch {}
	}
	for (const d of DISCOVERY) await sql`insert into discovery_items (id, kicker, title, summary, topic, image)
      values (${d.id}, ${d.kicker}, ${d.title}, ${d.summary}, ${d.topic}, ${d.image ?? null})
      on conflict (id) do nothing`;
	await sql`insert into catalog_seeded (id, done) values (1, true) on conflict (id) do nothing`;
}
function emptyCatalog() {
	return {
		universities: UNIVERSITIES,
		people: PEOPLE,
		listings: LISTINGS,
		communities: COMMUNITIES,
		posts: POSTS,
		discovery: DISCOVERY,
		replies: []
	};
}
var getCampusCatalog_createServerFn_handler = createServerRpc({
	id: "d22156d22618d18f2098ec1f258bafd181e24f97bea6d808d4ec858b287cb407",
	name: "getCampusCatalog",
	filename: "src/lib/unibud/server.ts"
}, (opts) => getCampusCatalog.__executeServer(opts));
var getCampusCatalog = createServerFn({ method: "GET" }).handler(getCampusCatalog_createServerFn_handler, async () => {
	try {
		await ensureCatalogSeed();
		const sql = await getSql();
		const universities = (await sql`select * from universities order by name`).map(mapUni);
		const people = (await sql`select * from directory_people order by name`).map(mapPerson);
		const listings = (await sql`select * from listings order by created_at desc`).map(mapListing);
		const communities = (await sql`select * from communities order by members desc`).map(mapCommunity);
		const posts = (await sql`select * from posts order by created_at desc limit 80`).map(mapPost);
		const discovery = (await sql`select * from discovery_items`).map(mapDiscovery);
		let replies = [];
		try {
			replies = (await sql`select * from post_replies order by created_at asc limit 800`).map((r) => mapPostReply(r));
		} catch {
			replies = [];
		}
		return {
			universities,
			people,
			listings,
			communities,
			posts,
			discovery,
			replies
		};
	} catch (error) {
		console.error("[catalog] database unavailable, using local catalog", error);
		return emptyCatalog();
	}
});
var getListing_createServerFn_handler = createServerRpc({
	id: "a3e317a3ab74b8aa1a9a01f36221aa456ea6e7a8305798de47882c017c63ed45",
	name: "getListing",
	filename: "src/lib/unibud/server.ts"
}, (opts) => getListing.__executeServer(opts));
var getListing = createServerFn({ method: "GET" }).validator((id) => id).handler(getListing_createServerFn_handler, async ({ data: id }) => {
	await ensureCatalogSeed();
	const sql = await getSql();
	const rows = await sql`select * from listings where id = ${id} limit 1`;
	const listing = rows[0] ? mapListing(rows[0]) : null;
	if (!listing) return null;
	const sellerRows = await sql`select * from directory_people where handle = ${listing.sellerHandle} limit 1`;
	return {
		listing,
		seller: sellerRows[0] ? mapPerson(sellerRows[0]) : null,
		related: (await sql`select * from listings where category = ${listing.category} and id <> ${id} order by saved_count desc limit 4`).map(mapListing)
	};
});
var searchCampus_createServerFn_handler = createServerRpc({
	id: "f4bc8ed5d0661688eef61f3a45d9bedad83cd57ef3cba5059ed4d613d8162669",
	name: "searchCampus",
	filename: "src/lib/unibud/server.ts"
}, (opts) => searchCampus.__executeServer(opts));
var searchCampus = createServerFn({ method: "GET" }).validator((q) => q.trim().toLowerCase()).handler(searchCampus_createServerFn_handler, async ({ data: q }) => {
	await ensureCatalogSeed();
	if (!q) return {
		listings: [],
		people: [],
		communities: []
	};
	const sql = await getSql();
	const like = `%${q}%`;
	return {
		listings: (await sql`select * from listings where lower(title) like ${like} or lower(description) like ${like} or lower(category) like ${like} limit 12`).map(mapListing),
		people: (await sql`select * from directory_people where lower(name) like ${like} or lower(handle) like ${like} limit 8`).map(mapPerson),
		communities: (await sql`select * from communities where lower(name) like ${like} or lower(description) like ${like} limit 8`).map(mapCommunity)
	};
});
var listByCategory_createServerFn_handler = createServerRpc({
	id: "c9cd56918ac094e7bdb54a8a0cff91aa96aa94bc3d7180f7c8f66a3f5ad6d7a7",
	name: "listByCategory",
	filename: "src/lib/unibud/server.ts"
}, (opts) => listByCategory.__executeServer(opts));
var listByCategory = createServerFn({ method: "GET" }).validator((category) => category).handler(listByCategory_createServerFn_handler, async ({ data: category }) => {
	await ensureCatalogSeed();
	const sql = await getSql();
	return (category === "all" ? await sql`select * from listings order by created_at desc` : await sql`select * from listings where category = ${category} order by created_at desc`).map(mapListing);
});
async function handleFromName(name, userId) {
	return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 12) || "student"}${userId.slice(-4)}`;
}
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "ebd5e1fb9c33d2d7cf81c2d344019edc37f20d38c38a64a9cbec08a2fecf99e1",
	name: "getMyProfile",
	filename: "src/lib/unibud/server.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	await ensureCatalogSeed();
	const rows = await (await getSql())`select * from student_profiles where user_id = ${context.userId} limit 1`;
	if (rows[0]) return mapProfile(rows[0]);
	return null;
});
var upsertMyProfile_createServerFn_handler = createServerRpc({
	id: "23ddffa3dd76873587091f0b00c06a4d6305d3d3c55fc834eabc197da7285398",
	name: "upsertMyProfile",
	filename: "src/lib/unibud/server.ts"
}, (opts) => upsertMyProfile.__executeServer(opts));
var upsertMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(upsertMyProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const existing = await sql`select * from student_profiles where user_id = ${context.userId} limit 1`;
	const existingProfile = existing[0] ? mapProfile(existing[0]) : null;
	const displayName = (data.displayName ?? existingProfile?.displayName ?? "Student").trim() || "Student";
	const handle = data.handle?.replace(/[^a-z0-9_]/gi, "").toLowerCase() || existingProfile?.handle || await handleFromName(displayName, context.userId);
	const universityId = data.universityId || existingProfile?.universityId || "unilag";
	const program = data.program ?? existingProfile?.program ?? "";
	const year = data.year ?? existingProfile?.year ?? "";
	const bio = data.bio ?? existingProfile?.bio ?? "";
	const campusRole = data.campusRole ?? existingProfile?.campusRole ?? "student";
	const onboardingDone = data.onboardingDone ?? existingProfile?.onboardingDone ?? false;
	if (existing[0]) await sql`update student_profiles set display_name = ${displayName}, handle = ${handle},
        university_id = ${universityId}, program = ${program}, year = ${year}, bio = ${bio},
        campus_role = ${campusRole}, onboarding_done = ${onboardingDone}
        where user_id = ${context.userId}`;
	else await sql`insert into student_profiles (user_id, display_name, handle, university_id, program, year, bio, campus_role, onboarding_done)
        values (${context.userId}, ${displayName}, ${handle}, ${universityId}, ${program}, ${year}, ${bio}, ${campusRole}, ${onboardingDone})`;
	const rows = await sql`select * from student_profiles where user_id = ${context.userId} limit 1`;
	return mapProfile(rows[0]);
});
var toggleSave_createServerFn_handler = createServerRpc({
	id: "67c9cb798096d971f961097bec8a26dceb99a812d28890bdb5d5e571e336cb33",
	name: "toggleSave",
	filename: "src/lib/unibud/server.ts"
}, (opts) => toggleSave.__executeServer(opts));
var toggleSave = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(toggleSave_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if ((await sql`select item_id from saves where user_id = ${context.userId} and kind = ${data.kind} and item_id = ${data.itemId}`)[0]) {
		await sql`delete from saves where user_id = ${context.userId} and kind = ${data.kind} and item_id = ${data.itemId}`;
		return { saved: false };
	}
	await sql`insert into saves (user_id, kind, item_id, title, href) values (${context.userId}, ${data.kind}, ${data.itemId}, ${data.title}, ${data.href})`;
	return { saved: true };
});
var listSaves_createServerFn_handler = createServerRpc({
	id: "1739f77f3850051fe3c0febd020e5772cd5c41a00ab32bd88ede490f0cb31a33",
	name: "listSaves",
	filename: "src/lib/unibud/server.ts"
}, (opts) => listSaves.__executeServer(opts));
var listSaves = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSaves_createServerFn_handler, async ({ context }) => {
	return (await getSql())`select kind, item_id, title, href from saves where user_id = ${context.userId} order by created_at desc`;
});
var createListing_createServerFn_handler = createServerRpc({
	id: "dc76f1738535f711d8036372b39e12ee84fa8577f1ea8614bb2cee19b1542d63",
	name: "createListing",
	filename: "src/lib/unibud/server.ts"
}, (opts) => createListing.__executeServer(opts));
var createListing = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createListing_createServerFn_handler, async ({ context, data }) => {
	const title = data.title.trim();
	if (!title) throw new Error("Give it a title");
	const sql = await getSql();
	const profile = await sql`
      select handle, university_id from student_profiles where user_id = ${context.userId} limit 1`;
	const handle = profile[0]?.handle || "you";
	const universityId = profile[0]?.university_id || "unilag";
	const id = `l_${crypto.randomUUID().slice(0, 8)}`;
	await sql`insert into listings (
      id, owner_user_id, kind, category, title, description, price_kobo, price_note,
      tone, seller_handle, university_id, location, tags
    ) values (
      ${id}, ${context.userId}, ${data.kind}, ${data.category}, ${title}, ${data.description.trim()},
      ${data.priceKobo}, ${data.priceNote}, ${"ink"}, ${handle}, ${universityId},
      ${data.location.trim() || "Campus"}, ${"[]"}
    )`;
	const rows = await sql`select * from listings where id = ${id} limit 1`;
	return mapListing(rows[0]);
});
var listNotes_createServerFn_handler = createServerRpc({
	id: "5fe5f9e6b5475c3b50951cb30fb35f88fb8e972a86976db4a4bfdd74b8dd3306",
	name: "listNotes",
	filename: "src/lib/unibud/server.ts"
}, (opts) => listNotes.__executeServer(opts));
var listNotes = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listNotes_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`select * from notifications where user_id = ${context.userId} order by created_at desc limit 40`).map(mapNote);
});
var requireLecturer_createServerFn_handler = createServerRpc({
	id: "e1b496873dee6ba207339d30535d3190bb4bbb7b40ac3c578c605a6b80958115",
	name: "requireLecturer",
	filename: "src/lib/unibud/server.ts"
}, (opts) => requireLecturer.__executeServer(opts));
var requireLecturer = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(requireLecturer_createServerFn_handler, async ({ context }) => {
	const role = (await (await getSql())`
      select campus_role from student_profiles where user_id = ${context.userId} limit 1`)[0]?.campus_role ?? "student";
	if (!canTeach(role)) throw new Error("Only lecturers can use Tutor Mode.");
	return { ok: true };
});
var getMySquareState_createServerFn_handler = createServerRpc({
	id: "c8a70525dea9f9ce7e2a42ffedf2609740182721cb23e33b74cdf31695e0f12c",
	name: "getMySquareState",
	filename: "src/lib/unibud/server.ts"
}, (opts) => getMySquareState.__executeServer(opts));
var getMySquareState = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMySquareState_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	let liked = [];
	let commentLiked = [];
	try {
		liked = (await sql`select post_id from post_likes where user_id = ${context.userId}`).map((r) => r.post_id);
		commentLiked = (await sql`select reply_id from comment_likes where user_id = ${context.userId}`).map((r) => r.reply_id);
	} catch {
		liked = [];
		commentLiked = [];
	}
	const saved = (await sql`select item_id from saves where user_id = ${context.userId} and kind = ${"post"}`).map((r) => r.item_id);
	return {
		liked,
		saved,
		commentLiked
	};
});
var togglePostLike_createServerFn_handler = createServerRpc({
	id: "db4548d3aaffa0538f6fb4481d73775420b47deea72baa7d8ebb58d5c6ab8151",
	name: "togglePostLike",
	filename: "src/lib/unibud/server.ts"
}, (opts) => togglePostLike.__executeServer(opts));
var togglePostLike = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((postId) => postId).handler(togglePostLike_createServerFn_handler, async ({ context, data: postId }) => {
	const sql = await getSql();
	if ((await sql`select post_id from post_likes where user_id = ${context.userId} and post_id = ${postId}`)[0]) {
		await sql`delete from post_likes where user_id = ${context.userId} and post_id = ${postId}`;
		return { liked: false };
	}
	await sql`insert into post_likes (user_id, post_id) values (${context.userId}, ${postId})`;
	return { liked: true };
});
var addSquareReply_createServerFn_handler = createServerRpc({
	id: "8532b7de1f6df0a79fca9ffb67955a8b3e0b9081106fbbf9f2b6d9b5e7c7bdde",
	name: "addSquareReply",
	filename: "src/lib/unibud/server.ts"
}, (opts) => addSquareReply.__executeServer(opts));
var addSquareReply = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addSquareReply_createServerFn_handler, async ({ context, data }) => {
	const body = data.body.trim();
	if (!body) throw new Error("Write a reply first");
	const sql = await getSql();
	const handle = (await sql`select handle from student_profiles where user_id = ${context.userId} limit 1`)[0]?.handle || "you";
	const id = `pr_${crypto.randomUUID().slice(0, 10)}`;
	await sql`insert into post_replies (id, post_id, user_id, author_handle, parent_id, body)
      values (${id}, ${data.postId}, ${context.userId}, ${handle}, ${data.parentId ?? null}, ${body})`;
	return {
		id,
		postId: data.postId,
		authorHandle: handle,
		parentId: data.parentId,
		body,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
});
var toggleCommentLike_createServerFn_handler = createServerRpc({
	id: "5cd793160fe9ed5305781cca89ac06d218ce27b2120e90af7778fe04482d0a66",
	name: "toggleCommentLike",
	filename: "src/lib/unibud/server.ts"
}, (opts) => toggleCommentLike.__executeServer(opts));
var toggleCommentLike = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((replyId) => replyId).handler(toggleCommentLike_createServerFn_handler, async ({ context, data: replyId }) => {
	const sql = await getSql();
	if ((await sql`select reply_id from comment_likes where user_id = ${context.userId} and reply_id = ${replyId}`)[0]) {
		await sql`delete from comment_likes where user_id = ${context.userId} and reply_id = ${replyId}`;
		return { liked: false };
	}
	await sql`insert into comment_likes (user_id, reply_id) values (${context.userId}, ${replyId})`;
	return { liked: true };
});
//#endregion
export { addSquareReply_createServerFn_handler, createListing_createServerFn_handler, getCampusCatalog_createServerFn_handler, getListing_createServerFn_handler, getMyProfile_createServerFn_handler, getMySquareState_createServerFn_handler, listByCategory_createServerFn_handler, listNotes_createServerFn_handler, listSaves_createServerFn_handler, requireLecturer_createServerFn_handler, searchCampus_createServerFn_handler, toggleCommentLike_createServerFn_handler, togglePostLike_createServerFn_handler, toggleSave_createServerFn_handler, upsertMyProfile_createServerFn_handler };
