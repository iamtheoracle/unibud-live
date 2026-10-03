import { a as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { l as Route$10 } from "./_ssr/router-DSOd9OgQ.mjs";
import { t as CommunitySpace } from "./_ssr/community-space-DZEZq9tH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_communityId-CvJ5teTG.js
var import_jsx_runtime = require_jsx_runtime();
function CommunityPage() {
	const { communityId } = Route$10.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunitySpace, { id: communityId });
}
//#endregion
export { CommunityPage as component };
