import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/demo-callout-3yKOc5mg.js
var import_jsx_runtime = require_jsx_runtime();
function DemoCallout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-3 rounded-2xl border border-warn/30 bg-warn/10 px-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "inline-flex h-6 items-center rounded-full bg-warn/20 px-2 text-[11px] font-semibold text-ink",
			children: "Demo"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm leading-relaxed text-muted-foreground",
			children
		})]
	});
}
//#endregion
export { DemoCallout as t };
