import { n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { i as getCampusCatalog } from "./server-3ArcV-Gz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/queries-yrK0-y42.js
function useCatalog() {
	return useQuery({
		queryKey: ["catalog"],
		queryFn: () => getCampusCatalog(),
		staleTime: 6e4
	});
}
//#endregion
export { useCatalog as t };
