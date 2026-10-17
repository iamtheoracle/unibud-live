import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { f as useRouterState, h as Outlet, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, n as useQuery } from "../_libs/react+tanstack__react-query.mjs";
import { t as canGovernClass } from "./roles-B968-RcG.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { a as myCommunities } from "./server-DJgS4hqB.mjs";
import { n as COMMUNITIES } from "./catalog-DxoFHR0q.mjs";
import { S as Plus, g as Search } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
import { n as useAuthReady } from "./sign-in-gate-rXdNMVWJ.mjs";
import { t as useCatalog } from "./queries-yrK0-y42.mjs";
import { r as communityKindLabel } from "./community-meta-DMXbBdbf.mjs";
import { t as Input } from "./input-BLGtTKRX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/communities-CNuLX6Dv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Communities() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (pathname !== "/communities" && pathname !== "/communities/") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommunitiesList, {});
}
function CommunitiesList() {
	const { data } = useCatalog();
	const catalogRooms = data?.communities ?? [];
	const allRooms = [...COMMUNITIES.filter((c) => !catalogRooms.some((x) => x.id === c.id)), ...catalogRooms];
	const { user } = useAuthReady();
	const role = useCampusStore((s) => s.role ?? "student");
	const [tab, setTab] = (0, import_react.useState)("discover");
	const [kind, setKind] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [createKind, setCreateKind] = (0, import_react.useState)("Study");
	const mine = useQuery({
		queryKey: ["my-communities"],
		queryFn: () => myCommunities(),
		enabled: Boolean(user)
	});
	const communities = allRooms.filter((c) => !q.trim() || c.name.toLowerCase().includes(q.toLowerCase()) || c.description.toLowerCase().includes(q.toLowerCase()));
	const shown = (tab === "mine" ? communities.filter((c) => mine.data?.includes(c.id)) : communities).filter((c) => kind === "all" || c.kind === kind || kind === "Interest" && [
		"Interest",
		"Music",
		"Sports",
		"Career"
	].includes(c.kind));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Find your people"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "Communities"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Structured shared spaces. Class groups are academic cohorts. Study groups are student-run. Chat lives in Chat — a community is not a thread."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-3.5 left-4 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "pl-10",
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search communities"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-4 w-full",
				onClick: () => setCreating((v) => !v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Create"]
			}),
			creating ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 rounded-2xl bg-card p-4 ring-1 ring-border",
				onSubmit: (e) => {
					e.preventDefault();
					if (createKind === "Class" && !canGovernClass(role)) {
						toast.error("Only a class governor can open an official class group.");
						return;
					}
					toast.success(createKind === "Study" ? "Study group drafted. Students can join without lecturer permission." : "Community drafted in this demo.");
					setCreating(false);
					setName("");
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Students can start study groups. Official class groups stay with class governors. Lecturers teach on Board."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex gap-2",
						children: [
							"Study",
							"Interest",
							"Class"
						].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCreateKind(k),
							className: cn("h-8 rounded-full px-3 text-xs", createKind === k ? "bg-ink text-paper" : "bg-secondary"),
							children: k === "Study" ? "Study group" : k === "Class" ? "Class group" : "Interest"
						}, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-3",
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: createKind === "Study" ? "Night calculus group" : "Community name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "mt-3 w-full",
						disabled: !name.trim(),
						children: "Save draft"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: [
					"all",
					"Class",
					"Study",
					"University",
					"Faculty",
					"Interest"
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setKind(k),
					className: cn("h-9 shrink-0 rounded-full px-4 text-sm", kind === k ? "bg-ink text-paper" : "bg-card ring-1 ring-border text-muted-foreground"),
					children: k === "all" ? "All" : k === "Class" ? "Classes" : k === "Study" ? "Study groups" : k === "Interest" ? "Scenes" : k
				}, k))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab("discover"),
					className: cn("h-9 rounded-full px-4 text-sm font-medium", tab === "discover" ? "bg-ink text-paper" : "bg-card ring-1 ring-border text-muted-foreground"),
					children: "Discover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab("mine"),
					className: cn("h-9 rounded-full px-4 text-sm font-medium", tab === "mine" ? "bg-ink text-paper" : "bg-card ring-1 ring-border text-muted-foreground"),
					children: "My Communities"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/communities/$id",
				params: { id: data?.communities[0]?.id ?? "unilag-campus" },
				className: "relative mt-5 block overflow-hidden rounded-3xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/covers/campus-night.jpg",
						alt: "",
						className: "h-56 w-full object-cover"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-ink/45" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 flex flex-col justify-end p-5 text-paper",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "self-start rounded-full bg-paper/15 px-3 py-1 text-[10px] font-semibold tracking-widest uppercase",
								children: "Community spotlight"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-3xl text-paper",
								children: "Make something worth sharing."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-paper/80",
								children: "Campus Entrepreneurs brings student ideas, feedback and collaboration into one room."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-4 inline-flex h-10 w-fit items-center rounded-full bg-paper px-4 text-sm font-medium text-ink",
								children: "Visit community"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 space-y-3 pb-8",
				children: shown.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/communities/$id",
					params: { id: c.id },
					className: "flex overflow-hidden rounded-2xl bg-card ring-1 ring-border",
					children: [c.cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: c.cover,
						alt: "",
						className: "h-24 w-24 shrink-0 object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-24 w-24 shrink-0 bg-secondary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-medium tracking-wider text-muted-foreground uppercase",
								children: communityKindLabel(c.kind)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg",
								children: c.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
								children: c.description
							})
						]
					})]
				}) }, c.id))
			})
		]
	});
}
//#endregion
export { Communities as component };
