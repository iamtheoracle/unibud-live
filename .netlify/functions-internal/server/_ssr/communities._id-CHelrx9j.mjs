import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { c as Route$9 } from "./router-DSOd9OgQ.mjs";
import { t as CommunitySpace } from "./community-space-DZEZq9tH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/communities._id-CHelrx9j.js
var import_jsx_runtime = require_jsx_runtime();
function CommunityPage() {
	const { id } = Route$9.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunitySpace, { id });
}
//#endregion
export { CommunityPage as component };
