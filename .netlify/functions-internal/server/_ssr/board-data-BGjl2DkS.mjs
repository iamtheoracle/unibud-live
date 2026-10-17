//#region node_modules/.nitro/vite/services/ssr/assets/board-data-BGjl2DkS.js
var BOARD_SESSIONS = [
	{
		id: "csc301-live",
		title: "Data Structures — Recursion",
		course: "CSC 301",
		lecturer: "Dr. Okoro",
		lecturerHandle: "okoro",
		department: "Computer Science",
		startsAt: (/* @__PURE__ */ new Date()).toISOString(),
		status: "live",
		durationMin: 90,
		topic: "Recursion and call stacks"
	},
	{
		id: "law204-soon",
		title: "Constitutional Law tutorial",
		course: "LAW 204",
		lecturer: "Prof. Adewale",
		lecturerHandle: "adewale",
		department: "Law",
		startsAt: new Date(Date.now() + 108e5).toISOString(),
		status: "scheduled",
		durationMin: 60,
		topic: "Federalism"
	},
	{
		id: "eng205-ended",
		title: "Engineering Drawing studio",
		course: "ENG 205",
		lecturer: "Dr. Okoro",
		lecturerHandle: "okoro",
		department: "Engineering",
		startsAt: (/* @__PURE__ */ new Date(Date.now() - 108e5)).toISOString(),
		status: "ended",
		durationMin: 120,
		topic: "Orthographic projection"
	},
	{
		id: "gst201-proc",
		title: "Use of English — revision",
		course: "GST 201",
		lecturer: "Prof. Adewale",
		lecturerHandle: "adewale",
		department: "General Studies",
		startsAt: (/* @__PURE__ */ new Date(Date.now() - 936e5)).toISOString(),
		status: "processing",
		durationMin: 45,
		topic: "Academic writing"
	},
	{
		id: "mth101-rec",
		title: "Calculus I — Limits",
		course: "MTH 101",
		lecturer: "Dr. Okoro",
		lecturerHandle: "okoro",
		department: "Mathematics",
		startsAt: (/* @__PURE__ */ new Date(Date.now() - 1728e5)).toISOString(),
		status: "available",
		durationMin: 75,
		topic: "Limits and continuity"
	}
];
var SESSION_LIFECYCLE = [
	"scheduled",
	"live",
	"ended",
	"processing",
	"available"
];
//#endregion
export { SESSION_LIFECYCLE as n, BOARD_SESSIONS as t };
