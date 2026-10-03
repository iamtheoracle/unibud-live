import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { d as uniById } from "./catalog-DxoFHR0q.mjs";
import { t as formatNaira } from "./format-o0D0ws6F.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
import { t as Badge } from "./badge-SYw1Pg1W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/listing-card-q2ZkbZQM.js
var import_jsx_runtime = require_jsx_runtime();
var TONE = {
	ink: "tone-ink",
	teal: "tone-teal",
	warm: "tone-warm",
	forest: "tone-forest",
	clay: "tone-clay",
	night: "tone-night"
};
function ListingCard({ listing, featured = false }) {
	const uni = uniById(listing.universityId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/market/$listingId",
		params: { listingId: listing.id },
		className: cn("group block overflow-hidden rounded-xl border border-border bg-card transition-opacity hover:opacity-95", featured && "rounded-2xl"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("relative overflow-hidden", featured ? "aspect-16/10" : "aspect-4/3", TONE[listing.tone]),
			children: [
				listing.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: listing.image,
					alt: "",
					className: "absolute inset-0 size-full object-cover"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-linear-to-t from-ink/70 via-ink/10 to-transparent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-medium tracking-wide text-paper/80 uppercase",
						children: [
							listing.category,
							" · ",
							uni?.shortName ?? listing.universityId
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: cn("font-display font-medium text-paper", featured ? "mt-1 text-2xl" : "mt-1 text-lg"),
						children: listing.title
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between gap-3 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "tabular text-base font-medium",
				children: formatNaira(listing.priceKobo)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: listing.priceNote
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: listing.location })]
		})]
	});
}
//#endregion
export { ListingCard as t };
