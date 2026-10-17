import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { s as listSaves } from "./server-3ArcV-Gz.mjs";
import { o as POSTS } from "./catalog-DxoFHR0q.mjs";
import { t as EmptyState } from "./empty-CzUOsSSv.mjs";
import { n as useAuthReady, t as SignInCard } from "./sign-in-gate-rXdNMVWJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/saved-CXs2FJdC.js
var import_jsx_runtime = require_jsx_runtime();
function Saved() {
	const { user, isPending } = useAuthReady();
	const savedIds = useCampusStore((s) => s.savedPosts ?? []);
	const savedAudioIds = useCampusStore((s) => s.savedAudioIds ?? []);
	const originals = useCampusStore((s) => s.originalAudios ?? []);
	const localPosts = useCampusStore((s) => s.localPosts);
	const toggleSavePost = useCampusStore((s) => s.toggleSavePost);
	const savedFeed = savedIds.map((id) => localPosts.find((p) => p.id === id) ?? POSTS.find((p) => p.id === id)).filter(Boolean);
	const q = useQuery({
		queryKey: ["saves"],
		queryFn: () => listSaves(),
		enabled: Boolean(user)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-4 h-32 animate-pulse rounded-2xl bg-secondary" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 py-8 md:px-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-medium",
			children: "Saved"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInCard, {
				title: "Keep a trail",
				body: "Listings, posts, and Bud threads you want again."
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-4 pb-8 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "pt-2 text-2xl font-medium tracking-tight",
				children: "Saved"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Videos and posts you kept. Saved audio is separate."
			}),
			savedAudioIds.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase",
					children: "Saved audio"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: originals.filter((a) => savedAudioIds.includes(a.audioId)).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/audio/$id",
						params: { id: a.audioId },
						className: "text-sm font-medium",
						children: [
							"Original audio · @",
							a.creatorHandle,
							" — ",
							a.title
						]
					}) }, a.audioId))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 space-y-2",
				children: [savedFeed.map((p) => p ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl bg-card px-4 py-3 ring-1 ring-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] uppercase tracking-wider text-muted-foreground",
							children: ["Post · @", p.authorHandle]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: p.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-2 text-xs font-medium",
							onClick: () => toggleSavePost(p.id),
							children: "Unsave"
						})
					]
				}, p.id) : null), (q.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: s.href,
					className: "block rounded-2xl bg-card px-4 py-3 ring-1 ring-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-wider text-muted-foreground",
						children: s.kind
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: s.title
					})]
				}, `${s.kind}-${s.item_id}`))]
			}),
			!savedFeed.length && !q.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: "Nothing saved",
				body: "Bookmark a post on Square or a listing in Market."
			}) : null
		]
	});
}
//#endregion
export { Saved as component };
