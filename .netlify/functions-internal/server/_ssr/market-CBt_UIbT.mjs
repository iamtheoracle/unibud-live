import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { t as CATEGORIES } from "./catalog-DxoFHR0q.mjs";
import { g as cn, p as Route$32 } from "./router-DSOd9OgQ.mjs";
import { t as useCatalog } from "./queries-yrK0-y42.mjs";
import { t as Input } from "./input-BLGtTKRX.mjs";
import { t as ListingCard } from "./listing-card-A4Qf6FTH.mjs";
import { t as VaultGate } from "./vault-gate-CXiQkllu.mjs";
import { t as BudNudge } from "./bud-nudge-D6BWV5dx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market-CBt_UIbT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Market() {
	const { cat = "all" } = Route$32.useSearch();
	const { data, isPending } = useCatalog();
	const [q, setQ] = (0, import_react.useState)("");
	const [sellOpen, setSellOpen] = (0, import_react.useState)(false);
	const listings = data?.listings ?? [];
	const filtered = (0, import_react.useMemo)(() => {
		return listings.filter((l) => {
			const catOk = cat === "all" || l.category === cat;
			const qOk = !q.trim() || `${l.title} ${l.description} ${l.location}`.toLowerCase().includes(q.toLowerCase());
			return catOk && qOk;
		});
	}, [
		listings,
		cat,
		q
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultGate, {
		title: "Marketplace",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "px-4 pb-8 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-3 pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground",
						children: "Marketplace"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-2xl font-medium tracking-tight",
						children: "Market"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => setSellOpen(true),
						children: "Sell / offer"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-md text-sm text-muted-foreground",
					children: "Hostels, food, thrift, gear, and skills — listed by people, not a generic store."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-4",
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search listings"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BudNudge, {
					draft: `Help me find a listing. Query: “${q || "something useful"}”. Stay as Bud.`,
					children: "Need a hand finding this?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2 overflow-x-auto pb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						to: "all",
						active: cat === "all",
						children: "All"
					}), CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
						to: c.id,
						active: cat === c.id,
						children: c.label
					}, c.id))]
				}),
				isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid grid-cols-2 gap-3",
					children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "aspect-4/3 animate-pulse rounded-2xl bg-secondary" }, i))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 grid grid-cols-2 gap-3 md:grid-cols-3",
					children: filtered.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListingCard, { listing: l }, l.id))
				}),
				sellOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SellSheet, { onClose: () => setSellOpen(false) }) : null
			]
		})
	});
}
function Chip({ to, active, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/market",
		search: { cat: to },
		className: cn("shrink-0 rounded-full px-3.5 py-2 text-sm", active ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"),
		children
	});
}
function SellSheet({ onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end bg-ink/60 md:items-center md:justify-center",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-t-3xl bg-card p-5 md:rounded-3xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-medium",
					children: "List something"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Goods, a service, or a room. Sign in first so the listing is yours."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/creator",
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "w-full",
								children: "Offer a service"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/profile",
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "w-full",
								children: "List from your profile"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "w-full",
							onClick: onClose,
							children: "Close"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { Market as component };
