import { S as useLoaderData, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as CATEGORIES } from "./catalog-DxoFHR0q.mjs";
import { g as cn, s as Route$8 } from "./router-DSOd9OgQ.mjs";
import { t as ListingCard } from "./listing-card-q2ZkbZQM.mjs";
import { t as VaultGate } from "./vault-gate-CXiQkllu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market-ZHcItc8G.js
var import_jsx_runtime = require_jsx_runtime();
function Market() {
	const catalog = useLoaderData({ from: "/_app" });
	const { cat = "all" } = Route$8.useSearch();
	const listings = cat === "all" ? catalog.listings : catalog.listings.filter((l) => l.category === cat);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultGate, {
		title: "Marketplace",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6 pb-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-bud uppercase",
						children: "Marketplace"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl",
						children: "What campus is selling"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/sell",
						className: "inline-flex h-11 items-center rounded-md bg-paper px-4 text-sm font-medium text-ink",
						children: "List something"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 overflow-x-auto pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						to: "/market",
						search: { cat: "all" },
						active: cat === "all",
						children: "All"
					}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						to: "/market",
						search: { cat: c.id },
						active: cat === c.id,
						children: c.label
					}, c.id))]
				}),
				listings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Nothing in this lane yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: listings.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListingCard, { listing: l }, l.id))
				})
			]
		})
	});
}
function Chip({ children, active, to, search }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to,
		search,
		className: cn("inline-flex h-10 shrink-0 items-center rounded-full px-4 text-sm font-medium", active ? "bg-paper text-ink" : "border border-border text-muted-foreground hover:bg-secondary"),
		children
	});
}
//#endregion
export { Market as component };
