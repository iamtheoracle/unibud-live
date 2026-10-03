import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as Sparkles } from "../_libs/lucide-react.mjs";
import { t as setBudDraft } from "./draft-B9TP0WQX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bud-nudge-D6BWV5dx.js
var import_jsx_runtime = require_jsx_runtime();
/** Quiet Bud entry. Not a second AI product. */
function BudNudge({ draft, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/bud",
		className: "mt-4 inline-flex h-10 items-center gap-2 text-sm text-muted-foreground",
		onClick: () => setBudDraft(draft),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4 text-bud" }), children]
	});
}
//#endregion
export { BudNudge as t };
