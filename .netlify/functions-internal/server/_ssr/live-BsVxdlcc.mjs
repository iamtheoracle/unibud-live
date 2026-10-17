import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { N as MessageCircle, t as X } from "../_libs/lucide-react.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-BsVxdlcc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Live() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [lines, setLines] = (0, import_react.useState)(["Amaka: light is good from the second gate.", "Tunde: don’t pay off-platform."]);
	const [draft, setDraft] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "relative min-h-[calc(100dvh-3.5rem)] overflow-hidden bg-tone-night text-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/covers/campus-night.jpg",
				alt: "",
				className: "absolute inset-0 size-full object-cover opacity-70"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex min-h-[calc(100dvh-3.5rem)] flex-col justify-between px-5 pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker",
						children: "Live"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl text-paper",
						children: "Faculty night, from the floor."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-sm text-sm text-paper/80",
						children: "Mock broadcast. Nobody is actually streaming."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "border-paper/30 bg-ink/40 text-paper",
						onClick: () => setOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), "Live Chat"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-paper/70",
						children: "Safe-area controls"
					})]
				})]
			}),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-x-0 bottom-0 z-20 rounded-t-3xl bg-background text-foreground shadow-soft",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between px-4 pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "Live Chat"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-11 place-items-center",
							onClick: () => setOpen(false),
							"aria-label": "Close",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-56 space-y-2 overflow-y-auto px-4 py-2",
						children: lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm",
							children: l
						}, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "sheet-safe flex gap-2 px-4 pt-2",
						onSubmit: (e) => {
							e.preventDefault();
							if (!draft.trim()) return;
							setLines((x) => [...x, `You: ${draft.trim()}`]);
							setDraft("");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							placeholder: "Say something…",
							className: cn("h-11 flex-1 rounded-full bg-secondary px-4 text-sm outline-none")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							size: "sm",
							children: "Send"
						})]
					})
				]
			}) : null
		]
	});
}
//#endregion
export { Live as component };
