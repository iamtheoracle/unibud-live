import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { r as canTeach } from "./roles-B968-RcG.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { l as requireLecturer } from "./server-3ArcV-Gz.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuthReady } from "./sign-in-gate-rXdNMVWJ.mjs";
import { t as BOARD_SESSIONS } from "./board-data-BGjl2DkS.mjs";
import { t as EDU_PODCASTS } from "./podcast-data-DU_p_mjD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tutor-CiqEliAF.js
var import_jsx_runtime = require_jsx_runtime();
function Tutor() {
	const role = useCampusStore((s) => s.role ?? "student");
	const tutorMode = useCampusStore((s) => s.tutorMode);
	const setTutorMode = useCampusStore((s) => s.setTutorMode);
	const { user } = useAuthReady();
	const gate = useQuery({
		queryKey: ["tutor-gate"],
		queryFn: () => requireLecturer(),
		enabled: Boolean(user),
		retry: false
	});
	const allowed = user ? Boolean(gate.data?.ok) : canTeach(role);
	if (user && gate.isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-4 h-40 animate-pulse rounded-2xl bg-secondary" });
	if (!allowed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-5 py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Restricted"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl",
				children: "Tutor Mode"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Only authorized lecturers can open Tutor Mode. Class Governors stay students with class coordination — they do not get lecture creation, attendance authority, or broadcasting."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/settings",
				className: "mt-5 inline-block text-sm font-medium",
				children: "Role is set in Settings (demo)"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Lecturer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl",
					children: "Tutor Mode"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: tutorMode ? "primary" : "outline",
					onClick: () => setTutorMode(!tutorMode),
					children: tutorMode ? "Switch to student" : "Enter Tutor"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Teaching tools. This is not Square posting and not Class Governor coordination."
			}),
			!tutorMode ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-2xl bg-secondary p-4 text-sm",
				children: "You are in student view. Enter Tutor to use broadcasting tools."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid grid-cols-2 gap-3",
				children: [
					{
						label: "My Classes",
						hint: "CSC 301 UniBoard",
						href: "/board/csc301"
					},
					{
						label: "Upcoming Sessions",
						hint: "Board schedule",
						href: "/board"
					},
					{
						label: "Start Live Class",
						hint: "Open the live UniBoard",
						href: "/board/csc301"
					},
					{
						label: "Create Podcast",
						hint: "Educational audio",
						href: "/podcasts"
					},
					{
						label: "Attendance",
						hint: "Live participation only",
						href: "/board/csc301"
					},
					{
						label: "Students",
						hint: "Class roster",
						href: "/board/csc301"
					}
				].map((t) => t.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: t.href,
					className: "rounded-2xl bg-card p-4 ring-1 ring-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: t.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: t.hint
					})]
				}, t.label) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "rounded-2xl bg-card p-4 text-left ring-1 ring-border",
					onClick: () => toast.message(`${t.label} is a demo control. No real stream is published.`),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: t.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: t.hint
					})]
				}, t.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 text-sm font-medium",
				children: "Your sessions"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-2",
				children: BOARD_SESSIONS.filter((s) => s.lecturerHandle === "okoro").map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-secondary px-4 py-3 text-sm",
					children: [s.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-xs text-muted-foreground",
						children: s.status
					})]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 text-sm font-medium",
				children: "Educational podcasts"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-2",
				children: EDU_PODCASTS.filter((p) => p.lecturerHandle === "okoro").map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-xl bg-secondary px-4 py-3 text-sm",
					children: [p.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-xs text-muted-foreground",
						children: p.course
					})]
				}, p.id))
			})
		]
	});
}
//#endregion
export { Tutor as component };
