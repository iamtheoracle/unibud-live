import { i as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { a as getSql } from "./db-CZ1suuUF.mjs";
import { c as notify } from "./server-3ArcV-Gz.mjs";
import { o as courseByCode } from "./academic-yrmQUZab.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-CsteN357.js
async function loadEnrollments(userId) {
	return (await (await getSql())`select * from enrollments where user_id = ${userId} order by course_code`).map((r) => ({
		id: String(r.id),
		code: String(r.course_code),
		title: String(r.course_title),
		semester: String(r.semester),
		sessionLabel: String(r.session_label),
		catalog: courseByCode(String(r.course_code))
	}));
}
var listEnrollments_createServerFn_handler = createServerRpc({
	id: "d0b785559f86b0052cc1a6d30b2e6036401270a22d833d470f1497a944e8e18a",
	name: "listEnrollments",
	filename: "src/lib/academic/server.ts"
}, (opts) => listEnrollments.__executeServer(opts));
var listEnrollments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listEnrollments_createServerFn_handler, async ({ context }) => loadEnrollments(context.userId));
var enrollCourse_createServerFn_handler = createServerRpc({
	id: "8a2aaab0ab42a4cd81edb7f804840c5aacb65cd7336a760e21fa52ec8a1880ba",
	name: "enrollCourse",
	filename: "src/lib/academic/server.ts"
}, (opts) => enrollCourse.__executeServer(opts));
var enrollCourse = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(enrollCourse_createServerFn_handler, async ({ context, data }) => {
	const cat = courseByCode(data.code);
	if (!cat) throw new Error("That course is not in the catalogue.");
	const sql = await getSql();
	const semester = data.semester || "Semester 1";
	if (!(await sql`select id from enrollments where user_id = ${context.userId} and course_code = ${cat.code} and semester = ${semester}`)[0]) await sql`insert into enrollments (id, user_id, course_code, course_title, semester, session_label)
        values (${crypto.randomUUID()}, ${context.userId}, ${cat.code}, ${cat.title}, ${semester}, ${data.sessionLabel || "2026/2027 Academic Session"})`;
	return loadEnrollments(context.userId);
});
var dropCourse_createServerFn_handler = createServerRpc({
	id: "092dd8ff9e198c6b808a49f7bd9e6adbe268f1124f0162af1c5deb5908a5f1c9",
	name: "dropCourse",
	filename: "src/lib/academic/server.ts"
}, (opts) => dropCourse.__executeServer(opts));
var dropCourse = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((code) => code).handler(dropCourse_createServerFn_handler, async ({ context, data: code }) => {
	await (await getSql())`delete from enrollments where user_id = ${context.userId} and course_code = ${code}`;
	return loadEnrollments(context.userId);
});
var postAnnouncement_createServerFn_handler = createServerRpc({
	id: "5e1f2929e8b8511f1e095023168bedad31d41098394ec90d8863a15ceb6b91a9",
	name: "postAnnouncement",
	filename: "src/lib/academic/server.ts"
}, (opts) => postAnnouncement.__executeServer(opts));
var postAnnouncement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(postAnnouncement_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await sql`insert into board_announcements (id, course_code, author_id, title, body)
      values (${crypto.randomUUID()}, ${data.courseCode}, ${context.userId}, ${data.title.trim()}, ${data.body.trim()})`;
	await notify(context.userId, "class", data.title.trim(), data.body.trim(), `/board/${data.courseCode.toLowerCase().replace(/\s+/g, "")}`);
	return (await sql`select * from board_announcements where course_code = ${data.courseCode} order by created_at desc`).map((r) => ({
		id: String(r.id),
		title: String(r.title),
		body: String(r.body),
		createdAt: String(r.created_at)
	}));
});
var listAnnouncements_createServerFn_handler = createServerRpc({
	id: "21ca75e9e5ab388e4884fe7d524ef4b77e2b9cc14eb0d723aed0b8a0d64e2299",
	name: "listAnnouncements",
	filename: "src/lib/academic/server.ts"
}, (opts) => listAnnouncements.__executeServer(opts));
var listAnnouncements = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((courseCode) => courseCode).handler(listAnnouncements_createServerFn_handler, async ({ data: courseCode }) => {
	return (await (await getSql())`select * from board_announcements where course_code = ${courseCode} order by created_at desc`).map((r) => ({
		id: String(r.id),
		title: String(r.title),
		body: String(r.body),
		createdAt: String(r.created_at)
	}));
});
var logAttendance_createServerFn_handler = createServerRpc({
	id: "9229f4ed49b69ef533e6d0ebdb8615784894d98b251169295a74857404034de7",
	name: "logAttendance",
	filename: "src/lib/academic/server.ts"
}, (opts) => logAttendance.__executeServer(opts));
var logAttendance = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(logAttendance_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`insert into attendance_events (id, session_id, user_id, kind)
      values (${crypto.randomUUID()}, ${data.sessionId}, ${context.userId}, ${data.kind})`;
	return { ok: true };
});
var listAttendance_createServerFn_handler = createServerRpc({
	id: "2d78359a179b7bc55e66a150b728ef2ec5b626b03fe47e937910537da085204a",
	name: "listAttendance",
	filename: "src/lib/academic/server.ts"
}, (opts) => listAttendance.__executeServer(opts));
var listAttendance = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((sessionId) => sessionId).handler(listAttendance_createServerFn_handler, async ({ data: sessionId }) => {
	const rows = await (await getSql())`select user_id, kind, created_at from attendance_events where session_id = ${sessionId} order by created_at`;
	const byUser = /* @__PURE__ */ new Map();
	for (const r of rows) {
		const uid = String(r.user_id);
		const cur = byUser.get(uid) ?? {};
		if (String(r.kind) === "join" && !cur.joined) cur.joined = String(r.created_at);
		if (String(r.kind) === "leave") cur.left = String(r.created_at);
		byUser.set(uid, cur);
	}
	return [...byUser.entries()].map(([userId, v]) => ({
		userId,
		...v
	}));
});
var askInClass_createServerFn_handler = createServerRpc({
	id: "d5c7e8fbfe4750d9835655dc12fa169fd9bb39957d0e6f5e4da452e2d5cbf55e",
	name: "askInClass",
	filename: "src/lib/academic/server.ts"
}, (opts) => askInClass.__executeServer(opts));
var askInClass = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(askInClass_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await sql`insert into class_questions (id, session_id, user_id, body)
      values (${crypto.randomUUID()}, ${data.sessionId}, ${context.userId}, ${data.body.trim()})`;
	return (await sql`select id, body, created_at from class_questions where session_id = ${data.sessionId} order by created_at`).map((r) => ({
		id: String(r.id),
		body: String(r.body),
		createdAt: String(r.created_at)
	}));
});
var listClassQuestions_createServerFn_handler = createServerRpc({
	id: "51a195429c7b2360f4a0a1b2ed20d2d91b8dae9036ba6a922806d6b18f044ae3",
	name: "listClassQuestions",
	filename: "src/lib/academic/server.ts"
}, (opts) => listClassQuestions.__executeServer(opts));
var listClassQuestions = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((sessionId) => sessionId).handler(listClassQuestions_createServerFn_handler, async ({ data: sessionId }) => {
	return (await (await getSql())`select id, body, created_at from class_questions where session_id = ${sessionId} order by created_at`).map((r) => ({
		id: String(r.id),
		body: String(r.body),
		createdAt: String(r.created_at)
	}));
});
//#endregion
export { askInClass_createServerFn_handler, dropCourse_createServerFn_handler, enrollCourse_createServerFn_handler, listAnnouncements_createServerFn_handler, listAttendance_createServerFn_handler, listClassQuestions_createServerFn_handler, listEnrollments_createServerFn_handler, logAttendance_createServerFn_handler, postAnnouncement_createServerFn_handler };
