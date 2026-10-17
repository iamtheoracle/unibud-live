import { i as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { r as createSsrRpc } from "./server-3ArcV-Gz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-C79XTJTu.js
var listEnrollments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("d0b785559f86b0052cc1a6d30b2e6036401270a22d833d470f1497a944e8e18a"));
var enrollCourse = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("8a2aaab0ab42a4cd81edb7f804840c5aacb65cd7336a760e21fa52ec8a1880ba"));
var dropCourse = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((code) => code).handler(createSsrRpc("092dd8ff9e198c6b808a49f7bd9e6adbe268f1124f0162af1c5deb5908a5f1c9"));
var postAnnouncement = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("5e1f2929e8b8511f1e095023168bedad31d41098394ec90d8863a15ceb6b91a9"));
var listAnnouncements = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((courseCode) => courseCode).handler(createSsrRpc("21ca75e9e5ab388e4884fe7d524ef4b77e2b9cc14eb0d723aed0b8a0d64e2299"));
var logAttendance = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("9229f4ed49b69ef533e6d0ebdb8615784894d98b251169295a74857404034de7"));
var listAttendance = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((sessionId) => sessionId).handler(createSsrRpc("2d78359a179b7bc55e66a150b728ef2ec5b626b03fe47e937910537da085204a"));
var askInClass = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d5c7e8fbfe4750d9835655dc12fa169fd9bb39957d0e6f5e4da452e2d5cbf55e"));
var listClassQuestions = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((sessionId) => sessionId).handler(createSsrRpc("51a195429c7b2360f4a0a1b2ed20d2d91b8dae9036ba6a922806d6b18f044ae3"));
//#endregion
export { listAttendance as a, logAttendance as c, listAnnouncements as i, postAnnouncement as l, dropCourse as n, listClassQuestions as o, enrollCourse as r, listEnrollments as s, askInClass as t };
