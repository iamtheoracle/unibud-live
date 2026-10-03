import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/photo-plate-C01bEh4k.js
var import_jsx_runtime = require_jsx_runtime();
var tones = {
	ink: "from-zinc-800 to-zinc-950",
	teal: "from-teal-900 to-zinc-950",
	warm: "from-orange-950 to-zinc-950",
	forest: "from-emerald-950 to-zinc-950",
	clay: "from-stone-800 to-zinc-950",
	night: "from-slate-800 to-zinc-950"
};
function PhotoPlate({ src, alt, tone = "ink", title, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("relative overflow-hidden bg-secondary", className),
		children: src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt,
			className: "h-full w-full object-cover"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("flex h-full w-full items-end bg-linear-to-br p-4", tones[tone]),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "noise-overlay absolute inset-0" }), title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative text-sm font-medium text-foreground/90",
				children: title
			}) : null]
		})
	});
}
//#endregion
export { PhotoPlate as t };
