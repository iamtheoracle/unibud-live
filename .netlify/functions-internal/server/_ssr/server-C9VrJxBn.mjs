import { i as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { a as getSql } from "./db-CZ1suuUF.mjs";
import { s as SAMPLE_COURSES } from "./catalog-DxoFHR0q.mjs";
import { a as mapCourse, c as mapMaterial, g as mapSession } from "./map-BJvu74k2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-C9VrJxBn.js
async function loadStudies(userId) {
	const sql = await getSql();
	return {
		courses: (await sql`select * from courses where user_id = ${userId} order by code`).map(mapCourse),
		materials: (await sql`select * from study_materials where user_id = ${userId}`).map(mapMaterial),
		sessions: (await sql`select * from study_sessions where user_id = ${userId} order by starts_at`).map(mapSession)
	};
}
var getStudies_createServerFn_handler = createServerRpc({
	id: "043af26ddb9761e809dcaa18fa447a07f2661d702b08879db081e1d88f8d4348",
	name: "getStudies",
	filename: "src/lib/studies/server.ts"
}, (opts) => getStudies.__executeServer(opts));
var getStudies = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getStudies_createServerFn_handler, async ({ context }) => loadStudies(context.userId));
var seedSampleSemester_createServerFn_handler = createServerRpc({
	id: "c15ca8e0f5be01f2212cee0306799393f4625f1628bf1bb24c6056e78725577a",
	name: "seedSampleSemester",
	filename: "src/lib/studies/server.ts"
}, (opts) => seedSampleSemester.__executeServer(opts));
var seedSampleSemester = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(seedSampleSemester_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	if ((await sql`select id from courses where user_id = ${context.userId} limit 1`)[0]) return loadStudies(context.userId);
	for (const c of SAMPLE_COURSES) {
		const id = crypto.randomUUID();
		await sql`insert into courses (id, user_id, session_label, semester, title, code)
        values (${id}, ${context.userId}, ${"2026/2027 Academic Session"}, ${"Semester 1"}, ${c.title}, ${c.code})`;
		await sql`insert into study_materials (id, user_id, course_id, title, kind)
        values (${crypto.randomUUID()}, ${context.userId}, ${id}, ${`${c.title} — week 1 notes`}, ${"note"})`;
	}
	return loadStudies(context.userId);
});
var addCourse_createServerFn_handler = createServerRpc({
	id: "cc99d26e6659c31c4cc1800ed7fae48696e9cf3e40d4c5406a29d38405b2130d",
	name: "addCourse",
	filename: "src/lib/studies/server.ts"
}, (opts) => addCourse.__executeServer(opts));
var addCourse = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addCourse_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`insert into courses (id, user_id, session_label, semester, title, code)
      values (${crypto.randomUUID()}, ${context.userId}, ${data.sessionLabel || "2026/2027 Academic Session"}, ${data.semester || "Semester 1"}, ${data.title.trim()}, ${data.code.trim()})`;
	return loadStudies(context.userId);
});
var addMaterial_createServerFn_handler = createServerRpc({
	id: "0b71389b7fbcf7bf2791e94691a52ed4598d9535cdd946934ecb5ee2986a85b6",
	name: "addMaterial",
	filename: "src/lib/studies/server.ts"
}, (opts) => addMaterial.__executeServer(opts));
var addMaterial = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addMaterial_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (!(await sql`select id from courses where id = ${data.courseId} and user_id = ${context.userId}`)[0]) throw new Error("Course not found");
	await sql`insert into study_materials (id, user_id, course_id, title, kind)
      values (${crypto.randomUUID()}, ${context.userId}, ${data.courseId}, ${data.title.trim()}, ${data.kind})`;
	return loadStudies(context.userId);
});
var addStudySession_createServerFn_handler = createServerRpc({
	id: "ac8d8eeab970fcea11b422407500bb2ba2e4bff2edf1b3f3d7b7d12032d46afe",
	name: "addStudySession",
	filename: "src/lib/studies/server.ts"
}, (opts) => addStudySession.__executeServer(opts));
var addStudySession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(addStudySession_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	if (!(await sql`select id from courses where id = ${data.courseId} and user_id = ${context.userId}`)[0]) throw new Error("Course not found");
	await sql`insert into study_sessions (id, user_id, course_id, title, starts_at, minutes)
      values (${crypto.randomUUID()}, ${context.userId}, ${data.courseId}, ${data.title.trim()}, ${data.startsAt}, ${data.minutes})`;
	return loadStudies(context.userId);
});
//#endregion
export { addCourse_createServerFn_handler, addMaterial_createServerFn_handler, addStudySession_createServerFn_handler, getStudies_createServerFn_handler, seedSampleSemester_createServerFn_handler };
