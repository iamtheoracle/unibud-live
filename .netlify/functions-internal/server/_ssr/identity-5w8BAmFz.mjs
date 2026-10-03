import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useCampusStore, t as connectLabel } from "./campus-store-VLAQ_aP0.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { n as COMMUNITIES } from "./catalog-DxoFHR0q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/identity-5w8BAmFz.js
var import_jsx_runtime = require_jsx_runtime();
function RelationActions({ handle }) {
	const connections = useCampusStore((s) => s.connections);
	const outgoing = useCampusStore((s) => s.outgoing);
	const following = useCampusStore((s) => s.following);
	const request = useCampusStore((s) => s.request);
	const cancelRequest = useCampusStore((s) => s.cancelRequest);
	const unconnect = useCampusStore((s) => s.unconnect);
	const follow = useCampusStore((s) => s.follow);
	const unfollow = useCampusStore((s) => s.unfollow);
	const connected = connections.includes(handle);
	const pending = outgoing.includes(handle);
	const isFollowed = following.includes(handle);
	const connectText = connectLabel(handle, {
		connections,
		outgoing
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: connected || pending ? "outline" : "primary",
				onClick: () => {
					if (connected) unconnect(handle);
					else if (pending) cancelRequest(handle);
					else request(handle);
				},
				children: connectText
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => isFollowed ? unfollow(handle) : follow(handle),
				children: isFollowed ? "Following" : "Follow"
			}),
			connected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "ghost",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/messages/$id",
					params: { id: handle },
					children: "Message"
				})
			}) : null
		]
	});
}
/** Fallback lens when the student has not set a campus yet. Not a Mix filter. */
var SELF_CAMPUS = {
	universityId: "unilag",
	program: "Computer Engineering",
	year: "300",
	faculty: "Engineering",
	department: "Computer Engineering"
};
function academicLine(p) {
	return [
		p.faculty,
		p.department,
		p.program,
		p.year ? `${p.year} level` : ""
	].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(" · ");
}
function proximityScore(p, connected, lens = SELF_CAMPUS) {
	let n = 0;
	if (p.universityId === lens.universityId) n += 5;
	if (p.faculty === lens.faculty) n += 3;
	if (p.program === lens.program) n += 4;
	if (p.year === lens.year) n += 2;
	if (p.department === lens.department) n += 2;
	const shared = COMMUNITIES.filter((c) => c.universityId && (c.universityId === p.universityId || c.universityId === lens.universityId)).length;
	n += Math.min(3, shared);
	if (connected.includes(p.handle)) n -= 8;
	return n;
}
function sharedContext(p, lens = SELF_CAMPUS) {
	const items = [];
	if (p.universityId === lens.universityId) items.push("Same campus");
	if (p.program === lens.program) items.push("Same programme");
	if (p.year === lens.year) items.push("Same level");
	if (p.faculty && p.faculty === lens.faculty) items.push("Same faculty");
	return {
		items,
		rooms: COMMUNITIES.filter((c) => c.universityId === p.universityId && c.universityId === lens.universityId && (c.kind === "Class" || c.kind === "Study" || c.kind === "University" || c.kind === "Faculty")).slice(0, 3)
	};
}
/** Academic details are a permission, not a UI trick. Self always sees their own. */
function canViewAcademic(opts) {
	if (opts.self) return true;
	if (opts.visibility === "hidden") return false;
	if (opts.visibility === "campus") return opts.sameCampus || opts.connected;
	return opts.connected;
}
//#endregion
export { sharedContext as a, proximityScore as i, academicLine as n, canViewAcademic as r, RelationActions as t };
