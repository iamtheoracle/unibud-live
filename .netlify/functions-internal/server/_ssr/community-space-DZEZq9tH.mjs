import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { n as canModerateCommunity, r as canTeach, t as canGovernClass } from "./roles-B968-RcG.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { a as myCommunities, r as joinCommunity, t as createPost } from "./server-DJgS4hqB.mjs";
import { l as communityById, u as personByHandle } from "./catalog-DxoFHR0q.mjs";
import { i as relativeTime } from "./format-o0D0ws6F.mjs";
import { t as Avatar } from "./person-BF6bewJz.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useAuthReady } from "./sign-in-gate-rXdNMVWJ.mjs";
import { t as Textarea } from "./textarea-DCQBtqbi.mjs";
import { t as PhotoPlate } from "./photo-plate-C01bEh4k.mjs";
import { t as useCatalog } from "./queries-yrK0-y42.mjs";
import { n as communityKindCopy, r as communityKindLabel, t as COMMUNITY_META } from "./community-meta-DMXbBdbf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/community-space-DZEZq9tH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CommunitySpace({ id }) {
	const { data, refetch } = useCatalog();
	const { user } = useAuthReady();
	const qc = useQueryClient();
	const role = useCampusStore((s) => s.role ?? "student");
	const community = data?.communities.find((c) => c.id === id) ?? communityById(id);
	const posts = (data?.posts ?? []).filter((p) => p.communityId === id);
	const isIn = useQuery({
		queryKey: ["my-communities"],
		queryFn: () => myCommunities(),
		enabled: Boolean(user)
	}).data?.includes(id);
	const [body, setBody] = (0, import_react.useState)("");
	const [announcement, setAnnouncement] = (0, import_react.useState)("");
	const meta = COMMUNITY_META[id];
	const isClass = community?.kind === "Class";
	const isStudy = community?.kind === "Study";
	const governorHere = isClass && canGovernClass(role);
	const moderatorHere = Boolean(meta?.moderatorHandles) && canModerateCommunity(role);
	const spills = useCampusStore((s) => s.spills);
	const flagged = useCampusStore((s) => s.flaggedSpills);
	const communitySpills = spills.filter((x) => x.communityId === id && !flagged.includes(x.id));
	const joinMut = useMutation({
		mutationFn: () => joinCommunity({ data: id }),
		onSuccess: () => void qc.invalidateQueries({ queryKey: ["my-communities"] })
	});
	const postMut = useMutation({
		mutationFn: () => createPost({ data: {
			communityId: id,
			body
		} }),
		onSuccess: () => {
			setBody("");
			toast.success("Posted");
			refetch();
		},
		onError: (e) => toast.error(e.message)
	});
	if (!community) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "px-4 py-16",
		children: "Community not found."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-4 pb-8 md:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoPlate, {
				src: community.cover,
				alt: "",
				tone: "night",
				title: community.name,
				className: "mt-2 h-40 rounded-3xl"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] uppercase tracking-wider text-muted-foreground",
						children: communityKindLabel(community.kind)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-medium tracking-tight",
						children: community.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: community.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: communityKindCopy(community.kind)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [community.members.toLocaleString(), " members"]
					})
				] }), user ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: isIn ? "outline" : "primary",
					onClick: () => joinMut.mutate(),
					children: isIn ? "Joined" : "Join"
				}) : null]
			}),
			meta?.chatId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/messages/$id",
				params: { id: meta.chatId },
				className: "mt-4 inline-flex h-10 items-center rounded-full bg-secondary px-4 text-sm font-medium",
				children: [
					"Open ",
					isClass ? "class" : isStudy ? "study" : "community",
					" chat"
				]
			}) : null,
			communitySpills.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/riff",
				className: "mt-3 block text-sm font-medium text-bud",
				children: [
					communitySpills.length,
					" Riff",
					communitySpills.length === 1 ? "" : "s",
					" from this room"
				]
			}) : null,
			governorHere ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 rounded-2xl bg-card p-4 ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold tracking-wide uppercase",
						children: "Class governor"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Coordination only. This is not Tutor Mode and not lecturer attendance."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/communities/$id",
							params: { id: "night-study" },
							className: "inline-flex h-9 items-center rounded-full bg-secondary px-3 text-sm",
							children: "Organise a study group"
						}), meta?.chatId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/messages/$id",
							params: { id: meta.chatId },
							className: "inline-flex h-9 items-center rounded-full bg-secondary px-3 text-sm",
							children: "Class chat"
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-3",
						value: announcement,
						onChange: (e) => setAnnouncement(e.target.value),
						placeholder: "Class announcement"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-2",
						size: "sm",
						variant: "outline",
						disabled: !announcement.trim(),
						onClick: () => {
							toast.success("Announcement noted for the class (demo).");
							setAnnouncement("");
						},
						children: "Publish update"
					})
				]
			}) : null,
			canTeach(role) && isClass ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/tutor",
					className: "font-medium",
					children: "Start a live class in Tutor Mode"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground",
					children: " — teaching is not a Square post."
				})]
			}) : null,
			moderatorHere ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-muted-foreground",
				children: "Community moderator tools stay in this space. They are not class governor or lecturer privileges."
			}) : null,
			meta?.announcements?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Announcements"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: meta.announcements.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-secondary p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: a.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: a.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-[11px] text-muted-foreground",
								children: [
									a.by,
									" · ",
									relativeTime(a.createdAt)
								]
							})
						]
					}, a.id))
				})]
			}) : null,
			user && isIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-5 space-y-2",
				onSubmit: (e) => {
					e.preventDefault();
					postMut.mutate();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: body,
					onChange: (e) => setBody(e.target.value),
					placeholder: isClass ? "Class discussion" : isStudy ? "Study note" : "Share with the room"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					size: "sm",
					disabled: postMut.isPending,
					children: "Post"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Discussions"
					}),
					posts.map((p) => {
						const person = personByHandle(p.authorHandle);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-2xl bg-card p-4 ring-1 ring-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									name: person?.name ?? p.authorHandle,
									className: "size-8"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: person?.name ?? p.authorHandle
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: relativeTime(p.createdAt)
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed",
								children: p.body
							})]
						}, p.id);
					}),
					posts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No discussions in this space yet."
					}) : null
				]
			})
		]
	});
}
//#endregion
export { CommunitySpace as t };
