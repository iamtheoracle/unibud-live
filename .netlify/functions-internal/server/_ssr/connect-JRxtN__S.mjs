import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { a as PEOPLE, d as uniById } from "./catalog-DxoFHR0q.mjs";
import { n as PersonMeta, t as Avatar } from "./person-BF6bewJz.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
import { t as Input } from "./input-BLGtTKRX.mjs";
import { a as sharedContext, i as proximityScore, n as academicLine, t as RelationActions } from "./identity-5w8BAmFz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/connect-JRxtN__S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Connect() {
	const [tab, setTab] = (0, import_react.useState)("discover");
	const [q, setQ] = (0, import_react.useState)("");
	const incoming = useCampusStore((s) => s.incoming);
	const outgoing = useCampusStore((s) => s.outgoing);
	const connections = useCampusStore((s) => s.connections);
	const following = useCampusStore((s) => s.following);
	const followers = useCampusStore((s) => s.followers);
	const accept = useCampusStore((s) => s.accept);
	const decline = useCampusStore((s) => s.decline);
	const cancelRequest = useCampusStore((s) => s.cancelRequest);
	const homeCampusId = useCampusStore((s) => s.homeCampusId);
	const faculty = useCampusStore((s) => s.faculty);
	const department = useCampusStore((s) => s.department);
	const lens = {
		universityId: homeCampusId || "unilag",
		program: "Computer Engineering",
		year: "300",
		faculty,
		department
	};
	const filtered = (0, import_react.useMemo)(() => PEOPLE.filter((p) => {
		const hay = `${p.name} ${p.handle} ${p.program} ${p.year} ${p.universityId} ${p.faculty ?? ""} ${p.department ?? ""}`.toLowerCase();
		return !q.trim() || hay.includes(q.toLowerCase());
	}), [q]);
	const list = tab === "requests" ? PEOPLE.filter((p) => incoming.includes(p.handle)) : tab === "sent" ? PEOPLE.filter((p) => outgoing.includes(p.handle)) : tab === "connections" ? PEOPLE.filter((p) => connections.includes(p.handle)) : tab === "following" ? PEOPLE.filter((p) => following.includes(p.handle)) : tab === "followers" ? PEOPLE.filter((p) => followers.includes(p.handle)) : filtered;
	const suggested = [...filtered].sort((a, b) => proximityScore(b, connections, lens) - proximityScore(a, connections, lens));
	const shown = tab === "discover" ? suggested : list;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "People"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "Connect"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Find people you would not normally meet — same interests, other cities, other schools. Connect is mutual. Follow is one-way."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search people, programmes, places, interests",
					"aria-label": "Search students"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: [
					["discover", "Discover"],
					["requests", "Requests"],
					["sent", "Sent"],
					["connections", "Connections"],
					["following", "Following"],
					["followers", "Followers"]
				].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setTab(id),
					className: cn("relative h-9 shrink-0 rounded-full px-4 text-sm font-medium", tab === id ? "bg-ink text-paper" : "bg-card text-muted-foreground ring-1 ring-border"),
					children: [label, id === "requests" && incoming.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-1 inline-flex min-w-4 justify-center rounded-full bg-bud px-1 text-[10px] text-bud-foreground",
						children: incoming.length
					}) : null]
				}, id))
			}),
			tab === "discover" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 rounded-3xl bg-ink px-6 py-7 text-paper",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "kicker text-bud",
						children: "People you may never have met"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-3xl text-paper",
						children: "Same interests beat same postcode."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-paper/70",
						children: "Robotics in Nairobi. Physics in Johannesburg. Language exchange. Builders, players, and people who like the same strange things you like."
					})
				]
			}) : null,
			tab === "discover" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lane, {
						title: "Builders far from you",
						handles: [
							"aisha_nbo",
							"chinedu",
							"adaeze"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lane, {
						title: "Sky, games, language",
						handles: [
							"jonas_wits",
							"yuki_lang",
							"ibrahim"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lane, {
						title: "Creators",
						handles: PEOPLE.filter((p) => p.tags?.includes("creator")).map((p) => p.handle)
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-3",
				children: shown.map((p) => {
					const uni = uniById(p.universityId);
					const ctx = sharedContext(p, lens);
					const mutuals = connections.filter((h) => h !== p.handle).slice(0, 2);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-card p-3 ring-1 ring-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/u/$handle",
								params: { handle: p.handle },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									name: p.name,
									className: "size-12"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/u/$handle",
								params: { handle: p.handle },
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonMeta, {
										person: p,
										compact: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: [
											uni?.shortName,
											" · ",
											academicLine(p)
										]
									}),
									ctx.items.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: ctx.items.join(" · ")
									}) : null,
									mutuals.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground",
										children: ["Mutual: ", mutuals.map((h) => `@${h}`).join(", ")]
									}) : null
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: tab === "requests" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => accept(p.handle),
									children: "Accept"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => decline(p.handle),
									children: "Decline"
								})]
							}) : tab === "sent" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => cancelRequest(p.handle),
								children: "Pending · Cancel"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelationActions, { handle: p.handle })
						})]
					}, p.handle);
				})
			}),
			shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-12 text-center text-sm text-muted-foreground",
				children: "Nobody in this list yet."
			}) : null
		]
	});
}
function Lane({ title, handles }) {
	const people = handles.map((h) => PEOPLE.find((p) => p.handle === h)).filter(Boolean);
	if (!people.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl bg-card p-4 ring-1 ring-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-3",
			children: people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/u/$handle",
						params: { handle: p.handle },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { name: p.name })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: p.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-[11px] text-muted-foreground",
							children: [
								"@",
								p.handle,
								" · ",
								p.bio
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelationActions, { handle: p.handle })
				]
			}, p.handle))
		})]
	});
}
//#endregion
export { Connect as component };
