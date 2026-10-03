import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { r as canTeach } from "./roles-B968-RcG.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { i as relativeTime } from "./format-o0D0ws6F.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
import { n as useAuthReady } from "./sign-in-gate-rXdNMVWJ.mjs";
import { a as boardIdFor } from "./academic-yrmQUZab.mjs";
import { n as SESSION_LIFECYCLE, t as BOARD_SESSIONS } from "./board-data-BGjl2DkS.mjs";
import { s as listEnrollments } from "./server-C79XTJTu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board-Cv3Cw1l_.js
var import_jsx_runtime = require_jsx_runtime();
function Board() {
	const { user } = useAuthReady();
	const role = useCampusStore((s) => s.role ?? "student");
	const liveAttendance = useCampusStore((s) => s.liveAttendance);
	const livePresence = useCampusStore((s) => s.livePresence);
	const recordingWatched = useCampusStore((s) => s.recordingWatched);
	const markLivePresent = useCampusStore((s) => s.markLivePresent);
	const leaveLive = useCampusStore((s) => s.leaveLive);
	const rejoinLive = useCampusStore((s) => s.rejoinLive);
	const markRecordingWatched = useCampusStore((s) => s.markRecordingWatched);
	const mine = useQuery({
		queryKey: ["enroll"],
		queryFn: () => listEnrollments(),
		enabled: Boolean(user)
	}).data ?? [];
	const codes = new Set(mine.map((c) => c.code));
	const sessions = codes.size ? BOARD_SESSIONS.filter((s) => codes.has(s.course)) : BOARD_SESSIONS;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Board"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "Your classrooms"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-sm text-muted-foreground",
				children: "Course rooms, live class, syllabus and attendance. Not Square. Not Chat."
			}),
			mine.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 grid gap-3",
				children: mine.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/board/$id",
					params: { id: boardIdFor(c.code) },
					className: "block rounded-2xl bg-card p-4 ring-1 ring-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-semibold tracking-wide uppercase text-bud",
							children: c.code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium",
							children: c.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								c.catalog?.lecturer,
								" · ",
								c.catalog?.programme
							]
						})
					]
				}) }, c.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-sm text-muted-foreground",
				children: [
					"Pick this semester’s courses in ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/studies",
						className: "font-medium",
						children: "Studies"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-8 flex gap-2 overflow-x-auto text-[10px] font-semibold tracking-wide uppercase text-muted-foreground",
				children: SESSION_LIFECYCLE.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "shrink-0 rounded-full bg-secondary px-3 py-1",
					children: step
				}, step))
			}),
			canTeach(role) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/tutor",
				className: "mt-4 inline-block text-sm font-medium",
				children: "Open Tutor Mode"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-3",
				children: sessions.map((s) => {
					const present = liveAttendance[s.id] === "present";
					const inRoom = livePresence[s.id] === "in";
					const watched = Boolean(recordingWatched[s.id]);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-card p-4 ring-1 ring-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold tracking-wide text-bud uppercase",
								children: s.status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-medium",
								children: s.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: [
									s.course,
									" · ",
									s.lecturer,
									" · ",
									s.department
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [
									s.topic,
									" · ",
									relativeTime(s.startsAt),
									" · ",
									s.durationMin,
									" min"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 text-xs",
								children: [
									"Your attendance:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn(present ? "text-success" : "text-muted-foreground"),
										children: present ? inRoom ? "Present" : "Left early" : "Not attended"
									}),
									watched ? " · Recording played (does not change attendance)" : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/board/$id",
										params: { id: boardIdFor(s.course) },
										className: "grid h-9 place-items-center rounded-full bg-secondary px-3 text-sm",
										children: "Open Board"
									}),
									s.status === "live" && !inRoom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										onClick: () => present ? rejoinLive(s.id) : markLivePresent(s.id),
										children: present ? "Rejoin live" : "Join live"
									}) : null,
									s.status === "live" && inRoom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => leaveLive(s.id),
										children: "Leave"
									}) : null,
									s.status === "available" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										onClick: () => markRecordingWatched(s.id),
										children: "Play recording"
									}) : null
								]
							})
						]
					}, s.id);
				})
			})
		]
	});
}
//#endregion
export { Board as component };
