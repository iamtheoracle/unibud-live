import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as relativeTime } from "./format-o0D0ws6F.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
import { t as EDUCATIONAL_NEWS } from "./news-data-DYC6iqL1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/news-BMFXyWGF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATS = [
	"all",
	"exams",
	"scholarship",
	"admission",
	"deadline",
	"campus",
	"opportunity"
];
function News() {
	const [cat, setCat] = (0, import_react.useState)("all");
	const items = EDUCATIONAL_NEWS.filter((n) => cat === "all" || n.category === cat);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Academic information"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "Educational News"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Official-feeling campus and academic notices. This is not the Square feed."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: CATS.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCat(c),
					className: cn("h-9 shrink-0 rounded-full px-4 text-sm capitalize", cat === c ? "bg-ink text-paper" : "bg-card text-muted-foreground ring-1 ring-border"),
					children: c
				}, c))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-3",
				children: items.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl bg-card p-4 ring-1 ring-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-bud",
								children: n.category
							}), n.importance === "high" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-destructive",
								children: "Important"
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-medium",
							children: n.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: n.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-muted-foreground",
							children: [
								n.source,
								" · ",
								n.institution,
								" · ",
								n.audience,
								" · ",
								relativeTime(n.date)
							]
						})
					]
				}, n.id))
			})
		]
	});
}
//#endregion
export { News as component };
