import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { a as PEOPLE, n as COMMUNITIES, o as POSTS, s as SAMPLE_COURSES } from "./catalog-DxoFHR0q.mjs";
import { K as Clock, g as Search, t as X } from "../_libs/lucide-react.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
import { t as BOARD_SESSIONS } from "./board-data-BGjl2DkS.mjs";
import { t as EDU_PODCASTS } from "./podcast-data-DU_p_mjD.mjs";
import { t as Input } from "./input-BLGtTKRX.mjs";
import { t as EDUCATIONAL_NEWS } from "./news-data-DYC6iqL1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-CdzEY2M_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FILTERS = [
	"all",
	"people",
	"communities",
	"classes",
	"posts",
	"learning",
	"news",
	"live",
	"podcasts"
];
function SearchPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const recent = useCampusStore((s) => s.recentSearches);
	const addSearch = useCampusStore((s) => s.addSearch);
	const clearSearches = useCampusStore((s) => s.clearSearches);
	const removeSearch = useCampusStore((s) => s.removeSearch);
	function commit(term) {
		setQ(term);
		addSearch(term);
	}
	const ql = q.trim().toLowerCase();
	const hits = (0, import_react.useMemo)(() => {
		if (!ql) return {
			people: [],
			communities: [],
			classes: [],
			posts: [],
			courses: [],
			news: [],
			live: [],
			podcasts: []
		};
		return {
			people: PEOPLE.filter((p) => p.name.toLowerCase().includes(ql) || p.handle.toLowerCase().includes(ql) || p.program.toLowerCase().includes(ql) || (p.faculty ?? "").toLowerCase().includes(ql)),
			communities: COMMUNITIES.filter((c) => c.kind !== "Class" && (c.name.toLowerCase().includes(ql) || c.description.toLowerCase().includes(ql) || c.kind.toLowerCase().includes(ql))),
			classes: COMMUNITIES.filter((c) => c.kind === "Class" && (c.name.toLowerCase().includes(ql) || c.description.toLowerCase().includes(ql))),
			posts: POSTS.filter((p) => p.body.toLowerCase().includes(ql)),
			courses: SAMPLE_COURSES.filter((c) => c.code.toLowerCase().includes(ql) || c.title.toLowerCase().includes(ql)),
			news: EDUCATIONAL_NEWS.filter((n) => n.title.toLowerCase().includes(ql) || n.body.toLowerCase().includes(ql)),
			live: BOARD_SESSIONS.filter((s) => s.title.toLowerCase().includes(ql) || s.course.toLowerCase().includes(ql) || s.status.includes(ql)),
			podcasts: EDU_PODCASTS.filter((p) => p.title.toLowerCase().includes(ql) || p.course.toLowerCase().includes(ql) || p.topic.toLowerCase().includes(ql))
		};
	}, [ql]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker text-center",
				children: "Discover UNIBUD"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 text-center font-display text-4xl",
				children: "What are you looking for?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-3.5 left-4 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "pl-10",
					value: q,
					onChange: (e) => setQ(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") commit(q);
					},
					placeholder: "People, classes, news, live, podcasts",
					autoFocus: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: FILTERS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setFilter(f),
					className: cn("h-9 shrink-0 rounded-full px-4 text-sm capitalize", filter === f ? "bg-ink text-paper" : "bg-card text-muted-foreground ring-1 ring-border"),
					children: f
				}, f))
			}),
			!q.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-medium",
						children: "Recent searches"
					}), recent.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-sm text-muted-foreground",
						onClick: clearSearches,
						children: "Clear all"
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 divide-y divide-border",
					children: recent.map((term) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-3 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex-1 text-left text-sm",
								onClick: () => commit(term),
								children: term
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": "Remove",
								onClick: () => removeSearch(term),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 text-muted-foreground" })
							})
						]
					}, term))
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-6",
				children: [
					(filter === "all" || filter === "people") && hits.people.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "People",
						children: hits.people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/u/$handle",
							params: { handle: p.handle },
							onClick: () => addSearch(q),
							className: "block py-2 text-sm",
							children: [
								p.name,
								" · @",
								p.handle,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [" · ", p.program]
								})
							]
						}, p.handle))
					}) : null,
					(filter === "all" || filter === "communities") && hits.communities.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Communities",
						children: hits.communities.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/communities/$id",
							params: { id: c.id },
							onClick: () => addSearch(q),
							className: "block py-2 text-sm",
							children: [c.name, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [" · ", c.kind]
							})]
						}, c.id))
					}) : null,
					(filter === "all" || filter === "classes") && hits.classes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Classes",
						children: hits.classes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/communities/$id",
							params: { id: c.id },
							onClick: () => addSearch(q),
							className: "block py-2 text-sm",
							children: c.name
						}, c.id))
					}) : null,
					(filter === "all" || filter === "posts") && hits.posts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Posts",
						children: hits.posts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							onClick: () => addSearch(q),
							className: "block py-2 text-sm",
							children: p.body.slice(0, 90)
						}, p.id))
					}) : null,
					(filter === "all" || filter === "learning") && (hits.courses.length || hits.podcasts.length) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Block, {
						title: "Learning",
						children: [hits.courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/studies",
							className: "block py-2 text-sm",
							children: [
								c.code,
								" · ",
								c.title
							]
						}, c.code)), hits.podcasts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/podcasts",
							className: "block py-2 text-sm",
							children: p.title
						}, p.id))]
					}) : null,
					(filter === "all" || filter === "news") && hits.news.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "News",
						children: hits.news.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/news",
							className: "block py-2 text-sm",
							children: n.title
						}, n.id))
					}) : null,
					(filter === "all" || filter === "live") && hits.live.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Live · Board",
						children: hits.live.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/board",
							className: "block py-2 text-sm",
							children: [
								s.title,
								" · ",
								s.status
							]
						}, s.id))
					}) : null,
					(filter === "all" || filter === "podcasts") && hits.podcasts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, {
						title: "Podcasts",
						children: hits.podcasts.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/podcasts",
							className: "block py-2 text-sm",
							children: [
								p.title,
								" · ",
								p.course
							]
						}, p.id))
					}) : null
				]
			})
		]
	});
}
function Block({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs font-semibold tracking-wider text-muted-foreground uppercase",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-1",
		children
	})] });
}
//#endregion
export { SearchPage as component };
