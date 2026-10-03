import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { i as relativeTime } from "./format-o0D0ws6F.mjs";
import { t as EDU_PODCASTS } from "./podcast-data-DU_p_mjD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/podcasts-CBtBM6_G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Podcasts() {
	const [playing, setPlaying] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Educational audio"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "Podcasts"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Lecturer-created audio lessons. Listening later does not affect Board attendance."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-3",
				children: EDU_PODCASTS.map((p) => {
					const on = playing === p.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-card p-4 ring-1 ring-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] font-semibold tracking-wide text-bud uppercase",
								children: [
									p.course,
									" · Episode ",
									p.episode
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-medium",
								children: p.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: [
									p.lecturer,
									" · ",
									p.subject,
									" · ",
									p.topic
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [
									p.programme,
									" · ",
									p.duration,
									" · ",
									relativeTime(p.publishedAt)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: on ? "outline" : "primary",
									onClick: () => setPlaying(on ? null : p.id),
									children: on ? "Pause" : "Listen"
								}), p.classId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/communities/$id",
									params: { id: p.classId },
									className: "inline-flex h-8 items-center rounded-full px-3 text-xs ring-1 ring-border",
									children: "Class space"
								}) : null]
							}),
							on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted-foreground",
								children: "Demo playback. This is recorded access — not live attendance."
							}) : null
						]
					}, p.id);
				})
			})
		]
	});
}
//#endregion
export { Podcasts as component };
