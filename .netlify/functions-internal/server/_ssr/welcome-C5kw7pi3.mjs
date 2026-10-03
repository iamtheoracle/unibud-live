import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Wordmark } from "./logo-DSR5RTW3.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { p as upsertMyProfile } from "./server-3ArcV-Gz.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
import { n as useAuthReady } from "./sign-in-gate-rXdNMVWJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/welcome-C5kw7pi3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SOCIAL = [
	"music",
	"football",
	"campus gist",
	"fashion",
	"tech",
	"faith",
	"hustle",
	"nightlife"
];
var ACADEMIC = [
	"notes",
	"exams",
	"projects",
	"internships",
	"research"
];
var ROOM_HINTS = {
	music: [{
		to: "/communities/$id",
		id: "afrobeats",
		label: "Afrobeats & Campus DJ"
	}],
	football: [{
		to: "/communities/$id",
		id: "five-aside",
		label: "Five-a-side"
	}],
	"campus gist": [{
		to: "/communities/$id",
		id: "the-gist",
		label: "The Gist"
	}]
};
function Welcome() {
	const nav = useNavigate();
	const { user, isPending } = useAuthReady();
	const setOnboardingDone = useCampusStore((s) => s.setOnboardingDone);
	const setInterests = useCampusStore((s) => s.setInterests);
	const setAcademicInterests = useCampusStore((s) => s.setAcademicInterests);
	const setLifeStage = useCampusStore((s) => s.setLifeStage);
	const onboardingDone = useCampusStore((s) => s.onboardingDone);
	const [step, setStep] = (0, import_react.useState)(0);
	const [who, setWho] = (0, import_react.useState)("student");
	const [social, setSocial] = (0, import_react.useState)([]);
	const [academic, setAcademic] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (user && onboardingDone) nav({ to: "/" });
	}, [
		user,
		onboardingDone,
		nav
	]);
	function finish() {
		setInterests(social);
		setAcademicInterests(academic);
		setLifeStage(who);
		setOnboardingDone(true);
		if (user) upsertMyProfile({ data: { onboardingDone: true } });
		nav({ to: "/" });
	}
	const hints = social.flatMap((id) => ROOM_HINTS[id] ?? []);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-6 h-64 animate-pulse rounded-3xl bg-secondary" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {
				size: "sm",
				className: "mb-10 max-w-[9rem]"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Welcome"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-4xl font-medium",
				children: "The UNIBUD world."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "People, ideas, culture, and learning. Sign in to keep your wallet, chats, and semester with you."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					search: { mode: "up" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "w-full",
						children: "Create account"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "w-full",
						children: "Sign in"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-6 text-sm text-muted-foreground",
				onClick: () => {
					try {
						sessionStorage.setItem("unibud-guest-browse", "1");
					} catch {}
					nav({ to: "/" });
				},
				children: "Look around first"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Welcome"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: "A few things, so the mix is yours."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Short questions. Skip anything. Nothing here grants extra permissions."
			}),
			step === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "You’re here as…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [
							["student", "Student"],
							["tutor", "Tutor"],
							["both", "Both"],
							["pre", "Pre-university"]
						].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							on: who === id,
							onClick: () => setWho(id),
							children: label
						}, id))
					}),
					who === "tutor" || who === "both" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-muted-foreground",
						children: "Bud will remember you teach. Tutor Mode still needs lecturer verification — this does not grant it."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-8 w-full",
						onClick: () => setStep(1),
						children: "Continue"
					})
				]
			}) : null,
			step === 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "What do you actually want to see?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: SOCIAL.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							on: social.includes(id),
							onClick: () => setSocial((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]),
							children: id
						}, id))
					}),
					who === "tutor" || who === "both" || who === "student" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm font-medium",
						children: "Learning, if you want it."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: ACADEMIC.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
							on: academic.includes(id),
							onClick: () => setAcademic((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]),
							children: id
						}, id))
					})] }) : null,
					hints.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Rooms that match, if you want them later."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1",
							children: hints.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/communities/$id",
								params: { id: h.id },
								className: "text-sm font-medium text-bud",
								children: h.label
							}) }, h.id))
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-8 w-full",
						onClick: finish,
						children: "Take me to Square"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-4 w-full text-sm text-muted-foreground",
				onClick: finish,
				children: "Skip for now"
			})
		]
	});
}
function Chip({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-9 rounded-full px-4 text-sm capitalize", on ? "bg-ink text-paper" : "bg-card ring-1 ring-border"),
		children
	});
}
//#endregion
export { Welcome as component };
