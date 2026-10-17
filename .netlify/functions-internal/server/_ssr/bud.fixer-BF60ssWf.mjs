import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { n as useAuthReady } from "./sign-in-gate-rXdNMVWJ.mjs";
import { t as Textarea } from "./textarea-DCQBtqbi.mjs";
import { t as askBud } from "./server-Bn1J_VW6.mjs";
import { t as BudShell } from "./bud-shell-SNTqYnat.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bud.fixer-BF60ssWf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BudFixer() {
	const { user } = useAuthReady();
	const [problem, setProblem] = (0, import_react.useState)("");
	const [reply, setReply] = (0, import_react.useState)(null);
	const mut = useMutation({
		mutationFn: () => askBud({ data: { prompt: `Bud Fixer (academic/task): ${problem}. Break it down, ask one question if needed, and suggest a next step. Do not write the assignment.` } }),
		onSuccess: (r) => {
			if (r.ok) setReply(r.text);
			else setReply(r.error);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BudShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Problem-solving"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl",
				children: "Bud Fixer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Academic and task help. Software bugs belong in Settings → Report. The Fixer in the menu is for people, not the platform."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				className: "mt-5",
				value: problem,
				onChange: (e) => setProblem(e.target.value),
				placeholder: "I don’t know how to start this lab / semester / reading…"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3 w-full",
				disabled: !problem.trim() || mut.isPending || !user,
				onClick: () => mut.mutate(),
				children: mut.isPending ? "Bud is thinking…" : user ? "Work it with Bud" : "Sign in first"
			}),
			reply ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 rounded-2xl bg-card p-4 text-sm leading-relaxed ring-1 ring-border",
				children: reply
			}) : null
		]
	}) });
}
//#endregion
export { BudFixer as component };
