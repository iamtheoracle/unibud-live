import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logo-DSR5RTW3.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Approved UNIBUD logo: arched collegiate wordmark.
* White letters, navy outline (#001240), transparent field.
* Navy is for the logo only — not a UI fill.
*/
var WORDMARK = "/brand/unibud-wordmark.png";
var heights = {
	header: "h-6",
	sm: "h-7",
	md: "h-10",
	lg: "h-16",
	hero: "h-auto w-full max-w-md"
};
function Wordmark({ className, size = "md" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: WORDMARK,
		alt: "UNIBUD",
		className: cn("w-auto bg-transparent object-contain object-left", heights[size], className)
	});
}
//#endregion
export { Wordmark as t };
