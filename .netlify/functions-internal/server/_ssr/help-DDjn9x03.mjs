import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/help-DDjn9x03.js
var import_jsx_runtime = require_jsx_runtime();
var FAQS = [
	{
		q: "Is the wallet real money?",
		a: "No. UNIBUD’s wallet is a demo ledger unless a real payment provider is connected. Nothing here is a bank transfer, card charge, or NELFUND disbursement."
	},
	{
		q: "Is UNIBUD NELFUND?",
		a: "No. UNIBUD can explain the process and keep your notes. Official applications live at nelf.gov.ng."
	},
	{
		q: "Who is Bud?",
		a: "Bud is the only assistant you talk to. Anything underneath stays hidden."
	},
	{
		q: "Where are academic tools?",
		a: "Board for live class, Studies for your semester, Tutor Mode for lecturers. Square stays social."
	},
	{
		q: "What is The Fixer?",
		a: "A place to talk through something that’s sitting on you. It is not therapy and not where you report app bugs."
	}
];
function Help() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Support"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "Help & Support"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-6 space-y-3",
				children: FAQS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl bg-card p-4 ring-1 ring-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: f.q
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: f.a
					})]
				}, f.q))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-sm",
				children: [
					"App problem?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/settings",
						className: "font-medium text-bud",
						children: "Report it in Settings"
					}),
					". Need a person?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/fixer",
						className: "font-medium text-bud",
						children: "The Fixer"
					}),
					" ",
					"or",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/feedback",
						className: "font-medium text-bud",
						children: "send feedback"
					}),
					"."
				]
			})
		]
	});
}
//#endregion
export { Help as component };
