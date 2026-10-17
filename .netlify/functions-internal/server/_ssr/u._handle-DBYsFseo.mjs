import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { i as roleLabel } from "./roles-B968-RcG.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { d as uniById, n as COMMUNITIES, o as POSTS, u as personByHandle } from "./catalog-DxoFHR0q.mjs";
import { i as relativeTime } from "./format-o0D0ws6F.mjs";
import { t as Avatar } from "./person-BF6bewJz.mjs";
import { rt as BadgeCheck } from "../_libs/lucide-react.mjs";
import { g as cn, n as Route$2 } from "./router-DSOd9OgQ.mjs";
import { a as sharedContext, n as academicLine, r as canViewAcademic, t as RelationActions } from "./identity-5w8BAmFz.mjs";
import { i as tagLabel } from "./identity-tags-DhbfIlck.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/u._handle-DBYsFseo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PublicProfile() {
	const { handle } = Route$2.useParams();
	const person = personByHandle(handle);
	const connections = useCampusStore((s) => s.connections);
	const following = useCampusStore((s) => s.following);
	const homeCampusId = useCampusStore((s) => s.homeCampusId);
	const faculty = useCampusStore((s) => s.faculty);
	const department = useCampusStore((s) => s.department);
	const [ctx, setCtx] = (0, import_react.useState)("social");
	if (!person) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-5 py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No student with that username."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/connect",
			className: "mt-4 inline-block text-sm font-medium",
			children: "Back to Connect"
		})]
	});
	const uni = uniById(person.universityId);
	const role = person.role ?? "student";
	const shared = sharedContext(person, {
		universityId: homeCampusId || "unilag",
		program: "Computer Engineering",
		year: "300",
		faculty,
		department
	});
	const connected = connections.includes(person.handle);
	const followingThem = following.includes(person.handle);
	const posts = POSTS.filter((p) => p.authorHandle === person.handle);
	const sameCampus = person.universityId === (homeCampusId || "unilag");
	const canSeeAcademic = canViewAcademic({
		connected,
		following: followingThem,
		sameCampus,
		visibility: "connections"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Student"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-start gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					name: person.name,
					className: "size-16 text-lg rounded-2xl"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-3xl",
							children: [person.name, person.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "ml-1 inline size-4 text-bud" }) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: ["@", person.handle]
						}),
						ctx === "social" && person.tags?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: person.tags.map(tagLabel).join(" · ")
						}) : null
					]
				})]
			}),
			ctx === "social" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed",
				children: person.bio
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCtx("social"),
					className: cn("h-9 rounded-full px-4 text-sm", ctx === "social" ? "bg-ink text-paper" : "bg-card ring-1 ring-border"),
					children: "Social"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCtx("academic"),
					className: cn("h-9 rounded-full px-4 text-sm", ctx === "academic" ? "bg-ink text-paper" : "bg-card ring-1 ring-border"),
					children: "Academic"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelationActions, { handle: person.handle })
			}),
			ctx === "social" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: posts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-sm font-medium",
					children: "Posts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-2",
					children: posts.map((p) => {
						const community = COMMUNITIES.find((c) => c.id === p.communityId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-xl bg-card p-3 ring-1 ring-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: p.body
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [
									community?.name,
									" · ",
									relativeTime(p.createdAt)
								]
							})]
						}, p.id);
					})
				})]
			}) : null }) : canSeeAcademic ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-xs font-medium",
					children: roleLabel(role, person.program)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: academicLine(person)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-5 grid grid-cols-2 gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-card p-3 ring-1 ring-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Campus"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-medium",
								children: uni?.shortName ?? "—"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-card p-3 ring-1 ring-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Faculty"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-medium",
								children: person.faculty ?? "—"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-card p-3 ring-1 ring-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Department"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 font-medium",
								children: person.department ?? "—"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl bg-card p-3 ring-1 ring-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted-foreground",
								children: "Programme · Level"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "mt-1 font-medium",
								children: [
									person.program,
									" · ",
									person.year
								]
							})]
						})
					]
				}),
				shared.rooms.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium",
						children: "Shared campus spaces"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-2",
						children: shared.rooms.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/communities/$id",
							params: { id: c.id },
							className: "text-sm text-bud",
							children: c.name
						}) }, c.id))
					})]
				}) : null
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted-foreground",
				children: "Academic details stay with connections and classmates. Connect to see more. Following is not enough."
			})
		]
	});
}
//#endregion
export { PublicProfile as component };
