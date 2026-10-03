import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { t as useCurrentUserState } from "./use-current-user-Q8r4NahO.mjs";
import { u as personByHandle } from "./catalog-DxoFHR0q.mjs";
import { i as relativeTime } from "./format-o0D0ws6F.mjs";
import { t as Avatar } from "./person-BF6bewJz.mjs";
import { r as Route$4 } from "./router-DSOd9OgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/riff._id-U_W_hwZ8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RiffThread() {
	const { id } = Route$4.useParams();
	const { user } = useCurrentUserState();
	const spill = useCampusStore((s) => s.spills.find((x) => x.id === id));
	const replySpill = useCampusStore((s) => s.replySpill);
	const followRiff = useCampusStore((s) => s.followRiff);
	const followed = useCampusStore((s) => (s.followedRiffs ?? []).includes(id));
	const [draft, setDraft] = (0, import_react.useState)("");
	const [parent, setParent] = (0, import_react.useState)();
	if (!spill) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-5 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "That Riff is gone."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/riff",
			className: "mt-3 inline-block text-sm font-medium",
			children: "Back to Riff"
		})]
	});
	const name = personByHandle(spill.authorHandle)?.name ?? spill.authorHandle;
	function send() {
		if (!draft.trim()) return;
		const reply = {
			id: `r-${Date.now()}`,
			authorHandle: "you",
			body: draft.trim(),
			parentId: parent,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		replySpill(spill.id, reply);
		setDraft("");
		setParent(void 0);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/riff",
				className: "text-xs font-medium text-muted-foreground",
				children: "Riff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					name,
					className: "size-12"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: [
						"@",
						spill.authorHandle,
						" · ",
						relativeTime(spill.createdAt)
					]
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-base leading-relaxed",
				children: spill.body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				size: "sm",
				variant: followed ? "outline" : "primary",
				onClick: () => followRiff(id),
				children: followed ? "Following this conversation" : "Follow conversation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 text-sm font-medium",
				children: "Conversation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 space-y-3",
				children: spill.replies.map((r) => {
					const who = personByHandle(r.authorHandle);
					const parentBody = r.parentId ? spill.replies.find((x) => x.id === r.parentId)?.body : null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-card p-3 ring-1 ring-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									who?.name ?? r.authorHandle,
									" · ",
									relativeTime(r.createdAt)
								]
							}),
							parentBody ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: ["Replying: ", parentBody]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: r.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-2 text-xs font-medium",
								onClick: () => setParent(r.id),
								children: "Reply"
							})
						]
					}, r.id);
				})
			}),
			user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6",
				onSubmit: (e) => {
					e.preventDefault();
					send();
				},
				children: [
					parent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-1 text-xs text-muted-foreground",
						children: [
							"Replying to a reply ·",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setParent(void 0),
								children: "cancel"
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						placeholder: "Join the conversation",
						className: "min-h-16 w-full rounded-xl bg-secondary px-3 py-2 text-sm outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-2",
						size: "sm",
						type: "submit",
						disabled: !draft.trim(),
						children: "Reply"
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted-foreground",
				children: "Sign in to reply."
			})
		]
	});
}
//#endregion
export { RiffThread as component };
