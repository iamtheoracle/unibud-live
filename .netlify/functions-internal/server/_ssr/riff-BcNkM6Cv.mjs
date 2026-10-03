import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { l as communityById, u as personByHandle } from "./catalog-DxoFHR0q.mjs";
import { i as relativeTime } from "./format-o0D0ws6F.mjs";
import { t as Avatar } from "./person-BF6bewJz.mjs";
import { N as MessageCircle, Q as Bookmark, R as Heart, V as Flag, b as Repeat2, d as Sparkles } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
import { t as setBudDraft } from "./draft-B9TP0WQX.mjs";
import { t as CHALLENGES } from "./discover-data-BBo6c_co.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/riff-BcNkM6Cv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TOPICS = [
	"all",
	"music",
	"tech",
	"games",
	"culture",
	"learning",
	"space"
];
function Riff() {
	const { user } = useCurrentUserState();
	const spills = useCampusStore((s) => s.spills);
	const addSpill = useCampusStore((s) => s.addSpill);
	const flagged = useCampusStore((s) => s.flaggedSpills);
	const followed = useCampusStore((s) => s.followedRiffs ?? []);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [quoting, setQuoting] = (0, import_react.useState)(null);
	const [topic, setTopic] = (0, import_react.useState)("all");
	const list = (0, import_react.useMemo)(() => {
		const base = spills.filter((s) => !flagged.includes(s.id));
		if (topic === "all") return base;
		const needle = topic;
		return base.filter((s) => `${s.body} ${s.communityId ?? ""}`.toLowerCase().includes(needle));
	}, [
		spills,
		flagged,
		topic
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "px-5 pt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: "Conversation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-4xl",
						children: "Riff"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Short posts that can become a whole conversation. Not Square. Not Chat. Not a profile tab."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto px-5",
				children: TOPICS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTopic(id),
					className: cn("h-9 shrink-0 rounded-full px-4 text-sm capitalize", topic === id ? "bg-ink text-paper" : "bg-card ring-1 ring-border"),
					children: id
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto px-5 pb-2",
				children: CHALLENGES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "w-44 shrink-0 rounded-2xl bg-secondary p-3 text-left",
					onClick: () => setDraft((d) => d || `${c.title}: ${c.body}`),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] font-medium text-bud",
						children: [c.joins.toLocaleString(), " in"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm font-medium",
						children: c.title
					})]
				}, c.id))
			}),
			user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-2 border-y border-border px-5 py-4",
				onSubmit: (e) => {
					e.preventDefault();
					if (!draft.trim()) return;
					addSpill(draft.trim(), "you", quoting ? { quoteId: quoting } : void 0);
					setDraft("");
					setQuoting(null);
				},
				children: [
					quoting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-2 text-xs text-muted-foreground",
						children: [
							"Quoting a Riff ·",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "underline",
								onClick: () => setQuoting(null),
								children: "cancel"
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						placeholder: "Start a Riff.",
						className: "min-h-20 w-full resize-none bg-transparent text-sm outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "sm",
							disabled: !draft.trim(),
							children: "Drop"
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 px-5 text-sm text-muted-foreground",
				children: "Sign in to drop a Riff. You can still read."
			}),
			followed.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "px-5 pt-4 text-xs text-muted-foreground",
				children: [
					"Following ",
					followed.length,
					" conversation",
					followed.length === 1 ? "" : "s",
					" on this device."
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: list.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiffCard, {
				spill: s,
				onQuote: () => setQuoting(s.id)
			}, s.id)) })
		]
	});
}
function RiffCard({ spill, onQuote }) {
	const name = personByHandle(spill.authorHandle)?.name ?? (spill.authorHandle === "you" ? "You" : spill.authorHandle);
	const community = spill.communityId ? communityById(spill.communityId) : void 0;
	const liked = useCampusStore((s) => s.liked[spill.id]);
	const count = useCampusStore((s) => s.likeCounts[spill.id] ?? 0);
	const toggleLike = useCampusStore((s) => s.toggleLike);
	const flagSpill = useCampusStore((s) => s.flagSpill);
	const followRiff = useCampusStore((s) => s.followRiff);
	const followed = useCampusStore((s) => (s.followedRiffs ?? []).includes(spill.id));
	const quote = spill.quoteId ? useCampusStore.getState().spills.find((x) => x.id === spill.quoteId) : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "border-b border-border px-5 py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/u/$handle",
								params: { handle: spill.authorHandle },
								className: "hover:underline",
								children: name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1 font-normal text-muted-foreground",
								children: ["@", spill.authorHandle]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1 font-normal text-muted-foreground",
								children: ["· ", relativeTime(spill.createdAt)]
							})
						]
					}),
					community ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/communities/$id",
						params: { id: community.id },
						className: "text-[11px] font-medium text-bud",
						children: ["from ", community.name]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed",
						children: spill.body
					}),
					quote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 rounded-xl bg-secondary px-3 py-2 text-xs text-muted-foreground",
						children: [
							"@",
							quote.authorHandle,
							": ",
							quote.body
						]
					}) : spill.quotedFrom ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 rounded-xl bg-secondary px-3 py-2 text-xs text-muted-foreground",
						children: [
							"From Square · @",
							spill.quotedFrom.handle,
							": ",
							spill.quotedFrom.body
						]
					}) : null,
					spill.video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: spill.video,
						alt: "",
						className: "mt-3 h-40 w-full rounded-2xl object-cover"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center gap-3 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => toggleLike(spill.id),
								className: cn("inline-flex h-9 items-center gap-1.5 text-sm", liked && "text-bud"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", liked && "fill-bud") }), count || ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/riff/$id",
								params: { id: spill.id },
								className: "inline-flex h-9 items-center gap-1.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), spill.replies.length || ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: onQuote,
								className: "inline-flex h-9 items-center gap-1.5 text-sm",
								"aria-label": "Quote",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat2, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("inline-flex h-9 items-center gap-1.5 text-sm", followed && "text-ink"),
								onClick: () => followRiff(spill.id),
								"aria-label": "Follow conversation",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: cn("size-4", followed && "fill-ink") })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/bud",
								className: "inline-flex h-9 items-center gap-1.5 text-sm",
								"aria-label": "Ask Bud",
								onClick: () => setBudDraft(`A Riff by @${spill.authorHandle}: “${spill.body}”\nHelp me think about this. Stay as Bud.`),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "inline-flex h-9 items-center gap-1.5 text-sm",
								onClick: () => {
									flagSpill(spill.id);
									toast.success("Report noted. This is not The Fixer.");
								},
								"aria-label": "Report",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flag, { className: "size-4" })
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { Riff as component };
