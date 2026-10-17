import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as uniById } from "./catalog-DxoFHR0q.mjs";
import { t as formatNaira } from "./format-o0D0ws6F.mjs";
import { t as PhotoPlate } from "./photo-plate-C01bEh4k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/listing-card-A4Qf6FTH.js
var import_jsx_runtime = require_jsx_runtime();
function ListingCard({ listing }) {
	const uni = uniById(listing.universityId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/market/$id",
		params: { id: listing.id },
		className: "group block overflow-hidden rounded-2xl bg-card ring-1 ring-border transition-transform duration-200 hover:-translate-y-0.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoPlate, {
			src: listing.image,
			alt: listing.title,
			tone: listing.tone,
			title: listing.title,
			className: "aspect-4/3"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1 p-3.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
					children: [
						listing.category,
						" · ",
						uni?.shortName
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "line-clamp-2 text-sm font-medium leading-snug",
					children: listing.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "tabular text-sm text-bud",
					children: [formatNaira(listing.priceKobo), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1 text-xs text-muted-foreground",
						children: listing.priceNote
					})]
				})
			]
		})]
	});
}
//#endregion
export { ListingCard as t };
