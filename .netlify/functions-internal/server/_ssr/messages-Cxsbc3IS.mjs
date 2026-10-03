import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { i as listConversations, o as openConversation } from "./server-DJgS4hqB.mjs";
import { a as PEOPLE, u as personByHandle } from "./catalog-DxoFHR0q.mjs";
import { i as relativeTime } from "./format-o0D0ws6F.mjs";
import { t as Avatar } from "./person-BF6bewJz.mjs";
import { t as EmptyState } from "./empty-CzUOsSSv.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
import { n as useAuthReady, t as SignInCard } from "./sign-in-gate-rXdNMVWJ.mjs";
import { t as CAMPUS_ROOMS } from "./chat-rooms-BCFzG8-m.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/messages-Cxsbc3IS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChatList() {
	const { user, isPending } = useAuthReady();
	const nav = useNavigate();
	const [tab, setTab] = (0, import_react.useState)("direct");
	const convos = useQuery({
		queryKey: ["convos"],
		queryFn: () => listConversations(),
		enabled: Boolean(user)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-4 h-40 animate-pulse rounded-2xl bg-secondary" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-5 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Messages"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "Chat"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInCard, {
					title: "Sign in to chat",
					body: "Direct, class, study and community conversations stay private."
				})
			})
		]
	});
	async function start(handle) {
		const c = await openConversation({ data: { handle } });
		nav({
			to: "/messages/$id",
			params: { id: c.id }
		});
	}
	const rooms = CAMPUS_ROOMS.filter((r) => tab === "direct" ? false : r.kind === tab);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Communication layer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "Chat"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Direct messages, group, class, study and community conversations. Chat is not Connect, not Communities, not Board."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: [
					["direct", "Direct"],
					["group", "Groups"],
					["class", "Classes"],
					["study", "Study"],
					["community", "Community"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: cn("h-9 shrink-0 rounded-full px-4 text-sm font-medium", tab === id ? "bg-ink text-paper" : "bg-card text-muted-foreground ring-1 ring-border"),
					children: label
				}, id))
			}),
			tab === "direct" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-5 space-y-1",
					children: (convos.data ?? []).map((c) => {
						const person = personByHandle(c.peerHandle);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/messages/$id",
							params: { id: c.id },
							className: "flex items-center gap-3 rounded-2xl px-1 py-3 hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									name: person?.name ?? c.peerHandle,
									className: "size-12"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-0 bottom-0 size-2.5 rounded-full bg-success ring-2 ring-card" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm font-semibold",
										children: person?.name ?? `@${c.peerHandle}`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: relativeTime(c.updatedAt)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm text-muted-foreground",
									children: c.lastBody
								})]
							})]
						}, c.id);
					})
				}),
				!convos.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No threads yet",
					body: "Message someone from Connect, or start a chat below."
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-8 text-sm font-medium",
					children: "Suggested"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2",
					children: PEOPLE.filter((p) => p.role !== "lecturer").slice(0, 6).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void start(p.handle),
						className: "flex w-full items-center gap-3 py-3 text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { name: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: p.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: ["@", p.handle]
							})]
						})]
					}) }, p.handle))
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-5 space-y-2",
				children: [rooms.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/messages/$id",
					params: { id: r.id },
					className: "block rounded-2xl bg-card p-4 ring-1 ring-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-semibold tracking-wide text-bud uppercase",
							children: r.kind
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm font-semibold",
							children: r.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: r.subtitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 truncate text-sm text-muted-foreground",
							children: r.lastBody
						})
					]
				}) }, r.id)), rooms.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "py-10 text-center text-sm text-muted-foreground",
					children: [
						"No ",
						tab,
						" chats yet."
					]
				}) : null]
			})
		]
	});
}
//#endregion
export { ChatList as component };
