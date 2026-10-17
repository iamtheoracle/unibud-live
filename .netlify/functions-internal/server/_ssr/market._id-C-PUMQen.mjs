import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { a as getListing, f as toggleSave } from "./server-3ArcV-Gz.mjs";
import { o as openConversation } from "./server-DJgS4hqB.mjs";
import { d as uniById } from "./catalog-DxoFHR0q.mjs";
import { t as formatNaira } from "./format-o0D0ws6F.mjs";
import { n as PersonMeta, t as Avatar } from "./person-BF6bewJz.mjs";
import { N as MessageCircle, Q as Bookmark, V as Flag, f as Shield } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as isUnauthorized, o as Route$7 } from "./router-DSOd9OgQ.mjs";
import { n as useAuthReady, t as SignInCard } from "./sign-in-gate-rXdNMVWJ.mjs";
import { t as PhotoPlate } from "./photo-plate-C01bEh4k.mjs";
import { t as Badge } from "./badge-SYw1Pg1W.mjs";
import { i as payListingDemo } from "./server-D82pVd56.mjs";
import { t as ListingCard } from "./listing-card-A4Qf6FTH.mjs";
import { t as VaultGate } from "./vault-gate-CXiQkllu.mjs";
import { t as DemoCallout } from "./demo-callout-3yKOc5mg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/market._id-C-PUMQen.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ListingPage() {
	const { id } = Route$7.useParams();
	const nav = useNavigate();
	const { user, isPending: authPending } = useAuthReady();
	const { data, isPending } = useQuery({
		queryKey: ["listing", id],
		queryFn: () => getListing({ data: id })
	});
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-4 h-80 animate-pulse rounded-3xl bg-secondary" });
	if (!data?.listing) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "That listing is gone." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/market",
			className: "mt-3 inline-block text-sm text-bud",
			children: "Back to market"
		})]
	});
	const { listing, seller, related } = data;
	const uni = uniById(listing.universityId);
	async function onMessage() {
		if (!user) {
			nav({ to: "/login" });
			return;
		}
		setBusy(true);
		try {
			const convo = await openConversation({ data: {
				handle: listing.sellerHandle,
				listingId: listing.id,
				seed: `Hi, I’m interested in “${listing.title}”.`
			} });
			nav({
				to: "/messages/$id",
				params: { id: convo.id }
			});
		} catch (e) {
			if (isUnauthorized(e)) nav({ to: "/login" });
			else toast.error(e instanceof Error ? e.message : "Could not open chat");
		} finally {
			setBusy(false);
		}
	}
	async function onPay() {
		if (!user) {
			nav({ to: "/login" });
			return;
		}
		setBusy(true);
		try {
			await payListingDemo({ data: {
				listingId: listing.id,
				kobo: listing.priceKobo,
				sellerHandle: listing.sellerHandle,
				title: listing.title
			} });
			toast.message("Demo payment recorded", { description: "No real money moved. Check your Money ledger." });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Demo pay failed");
		} finally {
			setBusy(false);
		}
	}
	async function onSave() {
		if (!user) {
			nav({ to: "/login" });
			return;
		}
		try {
			const r = await toggleSave({ data: {
				kind: "listing",
				itemId: listing.id,
				title: listing.title,
				href: `/market/${listing.id}`
			} });
			toast.success(r.saved ? "Saved" : "Removed from saved");
		} catch (e) {
			if (isUnauthorized(e)) nav({ to: "/login" });
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultGate, {
		title: "Marketplace",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "px-4 pb-10 md:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoPlate, {
					src: listing.image,
					alt: listing.title,
					tone: listing.tone,
					title: listing.title,
					className: "mt-2 aspect-video rounded-3xl md:aspect-4/3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] uppercase tracking-wider text-muted-foreground",
						children: [
							listing.category,
							" · ",
							uni?.shortName,
							" · ",
							listing.location
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 text-2xl font-medium tracking-tight",
						children: listing.title
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onSave,
						className: "grid size-11 place-items-center rounded-full bg-secondary",
						"aria-label": "Save listing",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 tabular text-xl text-bud",
					children: [formatNaira(listing.priceKobo), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-sm text-muted-foreground",
						children: listing.priceNote
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm leading-relaxed text-muted-foreground",
					children: listing.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: listing.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: t }, t))
				}),
				seller ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center gap-3 rounded-2xl bg-card p-4 ring-1 ring-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { name: seller.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonMeta, { person: seller })]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-start gap-2 rounded-2xl bg-secondary/60 px-4 py-3 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "mt-0.5 size-4 shrink-0 text-bud" }), "Meet on campus when you can. Keep chat here. Report anything that feels off. University affiliation is a trust signal, not a guarantee."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DemoCallout, { children: "Paying here records a demo ledger entry only. No card, bank, or payout is connected." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 grid grid-cols-2 gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: onMessage,
						disabled: busy || authPending,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), "Message"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "bud",
						onClick: onPay,
						disabled: busy || authPending,
						children: "Pay (demo)"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "mt-3 flex items-center gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "size-3.5" }), "Report listing"]
				}),
				!user && !authPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInCard, {
						title: "Sign in to message or pay",
						body: "Browsing is open. Wallet, chat, and saves need an account."
					})
				}) : null,
				related.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 text-lg font-medium",
						children: "Related"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-3",
						children: related.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListingCard, { listing: l }, l.id))
					})]
				}) : null
			]
		})
	});
}
//#endregion
export { ListingPage as component };
