import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
import { t as Textarea } from "./textarea-DCQBtqbi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fixer-rEA1cPhJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STEPS = [
	"Hear you",
	"Break it down",
	"One question",
	"A next step"
];
function TheFixer() {
	const [issue, setIssue] = (0, import_react.useState)("");
	const [step, setStep] = (0, import_react.useState)(0);
	const [log, setLog] = (0, import_react.useState)([]);
	const [peer, setPeer] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)("");
	const [lines, setLines] = (0, import_react.useState)([{
		from: "peer",
		body: "I’m another student. No names. Tell me what’s sitting heavy — I’ll stay with it."
	}]);
	const [rating, setRating] = (0, import_react.useState)(null);
	const addFixerRating = useCampusStore((s) => s.addFixerRating);
	const crisis = /\b(suicid|kill myself|end it|self.?harm|want to die)\b/i.test(issue) || lines.some((l) => /\b(suicid|kill myself|end it|self.?harm|want to die)\b/i.test(l.body));
	function next() {
		if (!issue.trim()) return;
		const notes = [
			`I’m with you. You said: “${issue.trim()}”. This is about you — not a UNIBUD bug.`,
			"Splitting it: what happened, what you hoped for, and what feels stuck.",
			"One question: do you need someone to listen, or a concrete next step you can take today?",
			"Next step: write one sentence you’d tell a trusted person. If you want, you can talk to another student anonymously below. I am not a therapist."
		];
		setLog((l) => [...l, notes[step] ?? notes[notes.length - 1]]);
		setStep((s) => Math.min(s + 1, STEPS.length - 1));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "People, not the platform"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "The Fixer"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"For when you’re stuck as a person. Software bugs live in",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/settings",
						className: "font-medium text-foreground",
						children: "Settings → Report"
					}),
					". This is not therapy and not a crisis line."
				]
			}),
			crisis ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-2xl bg-destructive/10 p-4 text-sm",
				children: "If you are in immediate danger, contact campus security or local emergency services. In Nigeria you can also reach the Mentally Aware Nigeria Initiative. UNIBUD cannot replace that help."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				className: "mt-5",
				value: issue,
				onChange: (e) => setIssue(e.target.value),
				placeholder: "What’s sitting on you right now?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto",
				children: STEPS.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: i <= step ? "h-8 rounded-full bg-ink px-3 text-xs leading-8 text-paper" : "h-8 rounded-full bg-secondary px-3 text-xs leading-8 text-muted-foreground",
					children: s
				}, s))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4 w-full",
				onClick: next,
				disabled: !issue.trim(),
				children: step === STEPS.length - 1 ? "Sit with it again" : "Continue"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-6 space-y-3",
				children: log.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "rounded-2xl bg-card p-4 text-sm ring-1 ring-border",
					children: line
				}, i))
			}),
			step >= 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Anonymous peer"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Optional. Another willing student, no names. Consent both ways. You can leave anytime."
					}),
					!peer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						variant: "outline",
						onClick: () => setPeer(true),
						children: "Request an anonymous conversation"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 rounded-2xl bg-card p-4 ring-1 ring-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Connected · identity hidden"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 max-h-48 space-y-2 overflow-y-auto",
								children: lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("max-w-[85%] rounded-2xl px-3 py-2 text-sm", l.from === "you" ? "ml-auto bg-ink text-paper" : "bg-secondary"),
									children: l.body
								}, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "mt-3 flex gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									if (!draft.trim()) return;
									const body = draft.trim();
									setLines((x) => [
										...x,
										{
											from: "you",
											body
										},
										{
											from: "peer",
											body: "Heard. What’s one thing that would make tonight 10% lighter?"
										}
									]);
									setDraft("");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: draft,
									onChange: (e) => setDraft(e.target.value),
									placeholder: "Say it here…",
									className: "h-11 flex-1 rounded-full bg-secondary px-4 text-sm outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									children: "Send"
								})]
							}),
							rating == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Was this person helpful?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2 flex gap-2",
									children: [
										1,
										2,
										3,
										4,
										5
									].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "size-9 rounded-full bg-secondary text-sm",
										onClick: () => {
											setRating(n);
											addFixerRating(n);
										},
										children: n
									}, n))
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: "Thanks. Helpful ratings stay with the supporter — they don’t become a public score you can farm."
							})
						]
					})
				]
			}) : null
		]
	});
}
//#endregion
export { TheFixer as component };
