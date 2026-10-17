import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useCampusStore, r as resolveBudShortcut } from "./campus-store-VLAQ_aP0.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { p as upsertMyProfile } from "./server-3ArcV-Gz.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
import { n as useAuthReady } from "./sign-in-gate-rXdNMVWJ.mjs";
import { t as Textarea } from "./textarea-DCQBtqbi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CbrOjdrn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Settings() {
	const shortcut = useCampusStore((s) => resolveBudShortcut(s));
	const setBudShortcut = useCampusStore((s) => s.setBudShortcut);
	const role = useCampusStore((s) => s.role ?? "student");
	const setRole = useCampusStore((s) => s.setRole);
	const visibility = useCampusStore((s) => s.profileVisibility);
	const setProfileVisibility = useCampusStore((s) => s.setProfileVisibility);
	const academicVisibility = useCampusStore((s) => s.academicVisibility);
	const setAcademicVisibility = useCampusStore((s) => s.setAcademicVisibility);
	const prefs = useCampusStore((s) => s.prefs);
	const setPrefs = useCampusStore((s) => s.setPrefs);
	const { user } = useAuthReady();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Account"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "Settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Privacy, notifications, Bud placement, and demo role."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Bud shortcut position"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Placement only. Bud always stays in the menu. Hidden does not disable Bud."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-3 gap-2",
				children: [
					"top",
					"bottom",
					"hidden"
				].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setBudShortcut(v),
					className: cn("h-11 rounded-full text-sm capitalize", shortcut === v ? "bg-ink text-paper" : "bg-card ring-1 ring-border"),
					children: v
				}, v))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Profile visibility"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Private chats, attendance and study material stay gated. This only controls how open your identity card is."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					"public",
					"campus",
					"connections"
				].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setProfileVisibility(v),
					className: cn("h-9 rounded-full px-4 text-sm capitalize", visibility === v ? "bg-ink text-paper" : "bg-card ring-1 ring-border"),
					children: v
				}, v))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Role on this device (demo)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Roles do not inherit. Class Governor is still a student. Tutor Mode is lecturers only."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					"student",
					"governor",
					"lecturer",
					"moderator"
				].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setRole(v);
						if (user) upsertMyProfile({ data: { campusRole: v } });
					},
					className: cn("h-9 rounded-full px-4 text-sm capitalize", role === v ? "bg-ink text-paper" : "bg-card ring-1 ring-border"),
					children: v === "governor" ? "Class Governor" : v
				}, v))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Academic details visibility"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Programme and department stay off the social card unless you choose otherwise."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					"connections",
					"campus",
					"hidden"
				].map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setAcademicVisibility(v),
					className: cn("h-9 rounded-full px-4 text-sm capitalize", academicVisibility === v ? "bg-ink text-paper" : "bg-card ring-1 ring-border"),
					children: v
				}, v))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Preferences"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-2 divide-y divide-border rounded-2xl bg-card ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Push-style alerts in the app",
						value: prefs.push,
						onChange: (v) => setPrefs({ push: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Read receipts in Chat",
						value: prefs.reads,
						onChange: (v) => setPrefs({ reads: v })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Marketplace activity",
						value: prefs.market,
						onChange: (v) => setPrefs({ market: v })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Report"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Software bugs and platform problems belong here — not in The Fixer."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportBox, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-2xl bg-card p-4 ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: "About"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed",
						children: "UNIBUD is a student operating environment. Credits: Oracle — Engineer / Builder / Systems Thinker. References Bud, UNIBUD, SOULYNC, My Realm, and The Fixer methodology."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://myrealmbyoracle.netlify.app/",
						target: "_blank",
						rel: "noopener noreferrer",
						className: "mt-3 inline-block text-sm font-medium",
						children: "Oracle portfolio"
					})
				]
			})
		]
	});
}
function Toggle({ label, hint, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center justify-between gap-4 px-4 py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: label
			}), hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: hint
			}) : null]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			role: "switch",
			"aria-checked": value,
			"aria-label": label,
			onClick: () => onChange(!value),
			className: cn("h-7 w-12 shrink-0 rounded-full p-0.5 transition-colors", value ? "bg-ink" : "bg-secondary"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("block size-6 rounded-full bg-paper transition-transform", value ? "translate-x-5" : "translate-x-0") })
		})]
	});
}
function ReportBox() {
	const [kind, setKind] = (0, import_react.useState)("problem");
	const [body, setBody] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-3 space-y-3 rounded-2xl bg-card p-4 ring-1 ring-border",
		onSubmit: (e) => {
			e.preventDefault();
			if (!body.trim()) return;
			toast.success("Report saved on this device. This is not The Fixer.");
			setBody("");
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					["problem", "Report a problem"],
					["bug", "Report a bug"],
					["content", "Report content"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setKind(id),
					className: cn("h-9 rounded-full px-3 text-xs", kind === id ? "bg-ink text-paper" : "bg-secondary"),
					children: label
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				value: body,
				onChange: (e) => setBody(e.target.value),
				placeholder: kind === "bug" ? "What broke, and what did you expect?" : kind === "content" ? "Which post, Riff, or profile — and why?" : "What went wrong in UNIBUD?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "sm",
				disabled: !body.trim(),
				children: "Send report"
			})
		]
	});
}
//#endregion
export { Settings as component };
