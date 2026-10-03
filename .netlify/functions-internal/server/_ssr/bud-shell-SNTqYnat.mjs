import { f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bud-shell-SNTqYnat.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Internal Bud workspace chrome — not primary UNIBUD navigation.
* Future Oracle knowledge/identity capabilities attach through Bud Chat,
* never as a Square/Connect tab or a specialist picker.
*/
var TABS = [
	{
		to: "/bud",
		label: "Chat"
	},
	{
		to: "/studies",
		label: "Studies"
	},
	{
		to: "/bud/communities",
		label: "Communities"
	},
	{
		to: "/bud/fixer",
		label: "Fixer"
	}
];
function BudShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex gap-1 overflow-x-auto px-4 pt-3",
		children: TABS.map((t) => {
			const on = t.to === "/bud" ? pathname === "/bud" : pathname.startsWith(t.to);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: t.to,
				className: cn("h-9 shrink-0 rounded-full px-3 text-sm font-medium", on ? "bg-ink text-paper" : "text-muted-foreground"),
				children: t.label
			}, t.to);
		})
	}), children] });
}
//#endregion
export { BudShell as t };
