import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as roleLabel } from "./roles-B968-RcG.mjs";
import { d as uniById } from "./catalog-DxoFHR0q.mjs";
import { n as initials } from "./format-o0D0ws6F.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/person-BF6bewJz.js
var import_jsx_runtime = require_jsx_runtime();
var hues = [
	"bg-bud-dim text-bud",
	"bg-secondary text-foreground",
	"bg-tone-warm text-ink",
	"bg-tone-forest text-ink"
];
function Avatar({ name, className }) {
	const hue = hues[name.length % hues.length];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold", hue, className),
		children: initials(name)
	});
}
function PersonMeta({ person, compact }) {
	const uni = uniById(person.universityId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-sm font-medium",
					children: person.name
				}), person.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-4 place-items-center rounded-full bg-bud text-[9px] font-bold text-bud-foreground",
					children: "✓"
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "truncate text-xs text-muted-foreground",
				children: [
					"@",
					person.handle,
					compact ? null : ` · ${uni?.shortName ?? ""} · ${person.program}`
				]
			}),
			person.role && person.role !== "student" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "truncate text-[11px] text-muted-foreground",
				children: roleLabel(person.role, person.program)
			}) : null
		]
	});
}
//#endregion
export { PersonMeta as n, Avatar as t };
