import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { i as relativeTime } from "./format-o0D0ws6F.mjs";
import { $ as BookOpen, N as MessageCircle, O as Newspaper, R as Heart, Z as Calendar, q as Clapperboard, s as UserPlus, tt as Bell } from "../_libs/lucide-react.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-B3zO95Cs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	social: Heart,
	communities: MessageCircle,
	events: Calendar,
	money: Heart,
	class: BookOpen,
	live: Clapperboard,
	news: Newspaper
};
function Notifications() {
	const notes = useCampusStore((s) => s.notes);
	const markAllRead = useCampusStore((s) => s.markAllRead);
	const markRead = useCampusStore((s) => s.markRead);
	const [tab, setTab] = (0, import_react.useState)("all");
	const shown = tab === "all" ? notes : notes.filter((n) => n.kind === tab);
	const fresh = shown.filter((n) => !n.read);
	const earlier = shown.filter((n) => n.read);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker text-center",
				children: "Your updates"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 text-center font-display text-4xl",
				children: "Notifications"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: markAllRead,
				className: "mx-auto mt-3 block text-sm font-medium text-bud",
				children: "Mark all as read"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex gap-2 overflow-x-auto",
				children: [
					["all", "All"],
					["social", "Social"],
					["communities", "Communities"],
					["class", "Class"],
					["live", "Live"],
					["news", "News"],
					["events", "Events"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: cn("h-9 shrink-0 rounded-full px-4 text-sm font-medium", tab === id ? "bg-ink text-paper" : "bg-card text-muted-foreground ring-1 ring-border"),
					children: label
				}, id))
			}),
			fresh.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 text-sm font-medium",
				children: "New"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: fresh.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteRow, {
				note: n,
				onOpen: () => markRead(n.id)
			}, n.id)) }),
			earlier.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 text-sm font-medium",
				children: "Earlier"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: earlier.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoteRow, {
				note: n,
				onOpen: () => markRead(n.id)
			}, n.id)) })
		]
	});
}
function NoteRow({ note, onOpen }) {
	const Icon = note.kind === "social" && note.title.includes("accepted") ? UserPlus : ICONS[note.kind] ?? Bell;
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-3 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-11 shrink-0 place-items-center rounded-full bg-bud-dim text-bud",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-snug",
						children: note.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: note.body
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: relativeTime(note.createdAt)
					})
				]
			}),
			!note.read ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-2 size-2 rounded-full bg-bud" }) : null
		]
	});
	if (note.href) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: "border-b border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: note.href,
			onClick: onOpen,
			children: inner
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
		className: "border-b border-border",
		children: inner
	});
}
//#endregion
export { Notifications as component };
