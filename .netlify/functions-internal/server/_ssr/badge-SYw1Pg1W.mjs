import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-SYw1Pg1W.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground", tone === "warn" && "border-transparent bg-secondary", className),
		...props
	});
}
//#endregion
export { Badge as t };
