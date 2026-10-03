import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { n as createListing, o as getMyProfile } from "./server-3ArcV-Gz.mjs";
import { r as koboFromNairaInput } from "./format-o0D0ws6F.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuthReady, t as SignInCard } from "./sign-in-gate-rXdNMVWJ.mjs";
import { t as Textarea } from "./textarea-DCQBtqbi.mjs";
import { t as useCatalog } from "./queries-yrK0-y42.mjs";
import { t as Input } from "./input-BLGtTKRX.mjs";
import { t as ListingCard } from "./listing-card-A4Qf6FTH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/creator-C_WoBTkP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Creator() {
	const { user, isPending } = useAuthReady();
	const { data, refetch } = useCatalog();
	const profile = useQuery({
		queryKey: ["profile"],
		queryFn: () => getMyProfile(),
		enabled: Boolean(user)
	});
	const qc = useQueryClient();
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [price, setPrice] = (0, import_react.useState)("15000");
	const mine = (data?.listings ?? []).filter((l) => l.sellerHandle === profile.data?.handle && l.kind === "service");
	const mut = useMutation({
		mutationFn: () => {
			const kobo = koboFromNairaInput(price) ?? 0;
			return createListing({ data: {
				kind: "service",
				category: "services",
				title,
				description,
				priceKobo: kobo,
				priceNote: "starting",
				location: "Campus / remote"
			} });
		},
		onSuccess: () => {
			toast.success("Service listed");
			setTitle("");
			setDescription("");
			refetch();
			qc.invalidateQueries({ queryKey: ["catalog"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-4 h-40 animate-pulse rounded-2xl bg-secondary" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 py-8 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-medium",
			children: "Creator Space"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInCard, {
				title: "Show what you make",
				body: "Portfolio, services, and campus audience — without an agent dashboard."
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 pb-8 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "pt-2 text-2xl font-medium tracking-tight",
				children: "Creator Space"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Video, design, music, writing, events, tutoring. Publish a service students can actually book."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 rounded-3xl bg-card p-5 ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-medium",
						children: "New service"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-3",
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "I edit graduation films"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-2",
						value: description,
						onChange: (e) => setDescription(e.target.value),
						placeholder: "What you do, how long, where"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-2",
						value: price,
						onChange: (e) => setPrice(e.target.value),
						placeholder: "Starting price ₦"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						onClick: () => mut.mutate(),
						disabled: !title.trim() || mut.isPending,
						children: "Publish to market"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 text-sm font-medium",
				children: "Your services"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-2 gap-3",
				children: mine.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListingCard, { listing: l }, l.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/market",
				search: { cat: "services" },
				className: "mt-6 inline-block text-sm text-bud",
				children: "See all campus services"
			})
		]
	});
}
//#endregion
export { Creator as component };
