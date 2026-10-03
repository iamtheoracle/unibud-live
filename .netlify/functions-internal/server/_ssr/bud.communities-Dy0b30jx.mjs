import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as BudShell } from "./bud-shell-SNTqYnat.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bud.communities-Dy0b30jx.js
var import_jsx_runtime = require_jsx_runtime();
var ROOMS = [
	{
		id: "math",
		name: "Mathematics",
		blurb: "Worked examples, not assignment dumping."
	},
	{
		id: "cs",
		name: "Computer Science",
		blurb: "Labs, debugging, and study groups."
	},
	{
		id: "research",
		name: "Research",
		blurb: "Sources, outlines, and honest citations."
	},
	{
		id: "exams",
		name: "Exam preparation",
		blurb: "Plans and past questions, not leaked papers."
	},
	{
		id: "lit",
		name: "Literature",
		blurb: "Close reading with people who showed up."
	}
];
function BudCommunities() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BudShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Knowledge"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl",
				children: "Bud Communities"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Academic rooms. Social clubs stay in UNIBUD Communities."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-3",
				children: ROOMS.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl bg-card p-4 ring-1 ring-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: r.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: r.blurb
					})]
				}, r.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-sm",
				children: [
					"Need the social side?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/communities",
						className: "font-medium text-bud",
						children: "Open UNIBUD Communities"
					})
				]
			})
		]
	}) });
}
//#endregion
export { BudCommunities as component };
