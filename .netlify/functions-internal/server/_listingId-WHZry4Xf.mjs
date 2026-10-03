import { C as useRouter, y as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, t as useMutation } from "./_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./_ssr/button-CoXdmm_3.mjs";
import { f as toggleSave } from "./_ssr/server-3ArcV-Gz.mjs";
import { o as openConversation } from "./_ssr/server-DJgS4hqB.mjs";
import { t as useCurrentUserState } from "./_ssr/use-current-user-Q8r4NahO.mjs";
import { d as uniById } from "./_ssr/catalog-DxoFHR0q.mjs";
import { n as initials, t as formatNaira } from "./_ssr/format-o0D0ws6F.mjs";
import { N as MessageCircle, Q as Bookmark } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { a as Route$6, g as cn } from "./_ssr/router-DSOd9OgQ.mjs";
import { t as Badge } from "./_ssr/badge-SYw1Pg1W.mjs";
import { i as payListingDemo } from "./_ssr/server-D82pVd56.mjs";
import { t as ListingCard } from "./_ssr/listing-card-q2ZkbZQM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_listingId-WHZry4Xf.js
var import_jsx_runtime = require_jsx_runtime();
var TONES = [
	"bg-tone-teal text-paper",
	"bg-tone-warm text-paper",
	"bg-tone-forest text-paper",
	"bg-tone-clay text-paper",
	"bg-tone-night text-paper",
	"bg-tone-ink text-paper"
];
function toneFor(key) {
	let n = 0;
	for (let i = 0; i < key.length; i++) n += key.charCodeAt(i);
	return TONES[n % TONES.length];
}
function PersonMark({ name, handle, size = "md", verified }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "relative inline-flex shrink-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("grid place-items-center rounded-full font-medium", size === "sm" ? "size-8 text-xs" : size === "lg" ? "size-14 text-lg" : "size-10 text-sm", toneFor(handle || name)),
			children: initials(name)
		}), verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute -right-0.5 -bottom-0.5 size-3 rounded-full bg-bud",
			title: "Verified"
		}) : null]
	});
}
function ListingPage() {
	const data = Route$6.useLoaderData();
	const router = useRouter();
	const qc = useQueryClient();
	const { user, isPending } = useCurrentUserState();
	const message = useMutation({
		mutationFn: () => openConversation({ data: {
			handle: data.listing.sellerHandle,
			listingId: data.listing.id,
			seed: `Hi — I’m interested in “${data.listing.title}”.`
		} }),
		onSuccess: (convo) => {
			router.navigate({
				to: "/messages/$id",
				params: { id: convo.id }
			});
		},
		onError: (e) => toast.error(e.message)
	});
	const pay = useMutation({
		mutationFn: () => payListingDemo({ data: {
			listingId: data.listing.id,
			kobo: data.listing.priceKobo,
			sellerHandle: data.listing.sellerHandle,
			title: data.listing.title
		} }),
		onSuccess: () => {
			toast.success("Demo payment recorded. No real money moved.");
			qc.invalidateQueries({ queryKey: ["wallet"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const save = useMutation({
		mutationFn: () => toggleSave({ data: {
			kind: "listing",
			itemId: data.listing.id,
			title: data.listing.title,
			href: `/market/${data.listing.id}`
		} }),
		onSuccess: (r) => toast.success(r.saved ? "Saved" : "Removed from saves"),
		onError: (e) => toast.error(e.message)
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-16 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl",
			children: "Listing gone"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/market",
			className: "mt-4 inline-block text-sm text-bud",
			children: "Back to market"
		})]
	});
	const { listing, seller, related } = data;
	const uni = uniById(listing.universityId);
	const needAuth = !isPending && !user;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-10 pb-10 lg:grid-cols-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `relative aspect-4/3 overflow-hidden rounded-2xl tone-${listing.tone}`,
						children: listing.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: listing.image,
							alt: "",
							className: "absolute inset-0 size-full object-cover"
						}) : null
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 flex flex-wrap gap-2",
						children: listing.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: t }, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-4xl",
						children: listing.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-2xl text-muted-foreground",
						children: listing.description
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-5 lg:col-span-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs tracking-widest text-muted-foreground uppercase",
							children: [
								listing.kind,
								" · ",
								listing.category
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 tabular font-display text-4xl",
							children: formatNaira(listing.priceKobo)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: listing.priceNote
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm",
							children: [listing.location, uni ? ` · ${uni.shortName}` : ""]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 grid gap-2",
							children: [
								needAuth ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										children: "Sign in to message"
									})
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => message.mutate(),
									disabled: message.isPending,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), "Message seller"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => needAuth ? router.navigate({ to: "/login" }) : pay.mutate(),
									disabled: pay.isPending,
									children: ["Demo pay ", formatNaira(listing.priceKobo)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									onClick: () => needAuth ? router.navigate({ to: "/login" }) : save.mutate(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }), "Save"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-muted-foreground",
							children: "Demo ledger only. No real money, bank, or NELFUND rail is connected."
						})
					]
				}), seller ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/u/$handle",
					params: { handle: seller.handle },
					className: "flex items-center gap-3 rounded-2xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonMark, {
						name: seller.name,
						handle: seller.handle,
						verified: seller.verified,
						size: "lg"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium",
						children: seller.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"@",
							seller.handle,
							" · ",
							seller.program
						]
					})] })]
				}) : null]
			}),
			related.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 font-display text-2xl",
					children: "Nearby in this lane"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: related.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListingCard, { listing: l }, l.id))
				})]
			}) : null
		]
	});
}
//#endregion
export { ListingPage as component };
