import { i as createServerFn, o as getServerFnById, t as TSS_SERVER_FUNCTION } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { a as getSql } from "./db-CZ1suuUF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-3ArcV-Gz.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getCampusCatalog = createServerFn({ method: "GET" }).handler(createSsrRpc("d22156d22618d18f2098ec1f258bafd181e24f97bea6d808d4ec858b287cb407"));
var getListing = createServerFn({ method: "GET" }).validator((id) => id).handler(createSsrRpc("a3e317a3ab74b8aa1a9a01f36221aa456ea6e7a8305798de47882c017c63ed45"));
createServerFn({ method: "GET" }).validator((q) => q.trim().toLowerCase()).handler(createSsrRpc("f4bc8ed5d0661688eef61f3a45d9bedad83cd57ef3cba5059ed4d613d8162669"));
createServerFn({ method: "GET" }).validator((category) => category).handler(createSsrRpc("c9cd56918ac094e7bdb54a8a0cff91aa96aa94bc3d7180f7c8f66a3f5ad6d7a7"));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ebd5e1fb9c33d2d7cf81c2d344019edc37f20d38c38a64a9cbec08a2fecf99e1"));
var upsertMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("23ddffa3dd76873587091f0b00c06a4d6305d3d3c55fc834eabc197da7285398"));
var toggleSave = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("67c9cb798096d971f961097bec8a26dceb99a812d28890bdb5d5e571e336cb33"));
var listSaves = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("1739f77f3850051fe3c0febd020e5772cd5c41a00ab32bd88ede490f0cb31a33"));
async function notify(userId, kind, title, body, href) {
	await (await getSql())`insert into notifications (id, user_id, kind, title, body, href)
    values (${crypto.randomUUID()}, ${userId}, ${kind}, ${title}, ${body}, ${href ?? null})`;
}
var createListing = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("dc76f1738535f711d8036372b39e12ee84fa8577f1ea8614bb2cee19b1542d63"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("5fe5f9e6b5475c3b50951cb30fb35f88fb8e972a86976db4a4bfdd74b8dd3306"));
/** Server gate for Tutor Mode. Class Governor does not pass. */
var requireLecturer = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("e1b496873dee6ba207339d30535d3190bb4bbb7b40ac3c578c605a6b80958115"));
createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("c8a70525dea9f9ce7e2a42ffedf2609740182721cb23e33b74cdf31695e0f12c"));
var togglePostLike = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((postId) => postId).handler(createSsrRpc("db4548d3aaffa0538f6fb4481d73775420b47deea72baa7d8ebb58d5c6ab8151"));
var addSquareReply = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8532b7de1f6df0a79fca9ffb67955a8b3e0b9081106fbbf9f2b6d9b5e7c7bdde"));
var toggleCommentLike = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((replyId) => replyId).handler(createSsrRpc("5cd793160fe9ed5305781cca89ac06d218ce27b2120e90af7778fe04482d0a66"));
//#endregion
export { getListing as a, notify as c, togglePostLike as d, toggleSave as f, getCampusCatalog as i, requireLecturer as l, createListing as n, getMyProfile as o, upsertMyProfile as p, createSsrRpc as r, listSaves as s, addSquareReply as t, toggleCommentLike as u };
