import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { r as canTeach } from "./roles-B968-RcG.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { u as Route$13 } from "./router-DSOd9OgQ.mjs";
import { a as boardIdFor, o as courseByCode, t as COURSE_CATALOGUE } from "./academic-yrmQUZab.mjs";
import { t as BOARD_SESSIONS } from "./board-data-BGjl2DkS.mjs";
import { a as listAttendance, c as logAttendance, i as listAnnouncements, l as postAnnouncement, o as listClassQuestions, t as askInClass } from "./server-C79XTJTu.mjs";
import { t as BUD_MEDIA } from "./bud-media-oRvNX2s6.mjs";
import { t as EDU_PODCASTS } from "./podcast-data-DU_p_mjD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/board._id-CZrGrfLZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UniBoard() {
	const { id } = Route$13.useParams();
	const course = COURSE_CATALOGUE.find((c) => boardIdFor(c.code) === id) ?? courseByCode(id);
	const role = useCampusStore((s) => s.role ?? "student");
	const liveAttendance = useCampusStore((s) => s.liveAttendance);
	const livePresence = useCampusStore((s) => s.livePresence);
	const markLivePresent = useCampusStore((s) => s.markLivePresent);
	const leaveLive = useCampusStore((s) => s.leaveLive);
	const rejoinLive = useCampusStore((s) => s.rejoinLive);
	const lecturer = canTeach(role);
	const [q, setQ] = (0, import_react.useState)("");
	const [annTitle, setAnnTitle] = (0, import_react.useState)("");
	const [annBody, setAnnBody] = (0, import_react.useState)("");
	const [inClass, setInClass] = (0, import_react.useState)(false);
	const qc = useQueryClient();
	if (!course) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-5 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "That UniBoard is not in the catalogue."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/board",
			className: "mt-3 inline-block text-sm font-medium",
			children: "Back to Board"
		})]
	});
	const session = BOARD_SESSIONS.find((s) => s.id === course.boardSessionId || s.course === course.code);
	const present = session ? liveAttendance[session.id] === "present" : false;
	const inRoom = session ? livePresence[session.id] === "in" : false;
	const pods = EDU_PODCASTS.filter((p) => p.course === course.code);
	const budMedia = BUD_MEDIA.filter((m) => m.title.includes(course.code));
	const anns = useQuery({
		queryKey: ["anns", course.code],
		queryFn: () => listAnnouncements({ data: course.code })
	});
	const questions = useQuery({
		queryKey: ["q", session?.id],
		queryFn: () => listClassQuestions({ data: session.id }),
		enabled: Boolean(session)
	});
	const roster = useQuery({
		queryKey: ["att", session?.id],
		queryFn: () => listAttendance({ data: session.id }),
		enabled: Boolean(lecturer && session)
	});
	const sendQ = useMutation({
		mutationFn: () => askInClass({ data: {
			sessionId: session.id,
			body: q
		} }),
		onSuccess: (d) => {
			setQ("");
			qc.setQueryData(["q", session?.id], d);
		}
	});
	const sendAnn = useMutation({
		mutationFn: () => postAnnouncement({ data: {
			courseCode: course.code,
			title: annTitle,
			body: annBody
		} }),
		onSuccess: (d) => {
			setAnnTitle("");
			setAnnBody("");
			qc.setQueryData(["anns", course.code], d);
		}
	});
	async function join() {
		if (!session) return;
		if (present) rejoinLive(session.id);
		else markLivePresent(session.id);
		await logAttendance({ data: {
			sessionId: session.id,
			kind: "join"
		} });
		setInClass(true);
	}
	async function leave() {
		if (!session) return;
		leaveLive(session.id);
		await logAttendance({ data: {
			sessionId: session.id,
			kind: "leave"
		} });
		setInClass(false);
	}
	const late = present && session?.status === "live";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Board"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: course.code
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					course.title,
					" · ",
					course.lecturer,
					" · ",
					course.programme
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-sm leading-relaxed",
				children: course.description
			}),
			session?.status === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-3xl bg-ink px-5 py-5 text-paper",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold tracking-[0.16em] uppercase text-paper/60",
						children: "Live class"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-2xl",
						children: session.topic
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-paper/70",
						children: [
							session.lecturer,
							" is in session · ",
							session.durationMin,
							" min"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-paper/60",
						children: [
							"Your attendance: ",
							present ? inRoom || inClass ? "Present" : "Left early" : "Not marked",
							late && !inRoom ? " · you can rejoin" : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [!inRoom && !inClass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => void join(),
							children: present ? "Rejoin" : "Join class"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							className: "border-paper/30 text-paper",
							onClick: () => void leave(),
							children: "Leave"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/bud",
							className: "grid h-9 place-items-center rounded-full px-3 text-sm",
							children: "Ask Bud privately"
						})]
					}),
					inRoom || inClass ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 flex gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							if (q.trim()) sendQ.mutate();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "A question for the class…",
							className: "h-11 flex-1 rounded-full bg-paper/10 px-4 text-sm outline-none"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							type: "submit",
							children: "Ask"
						})]
					}) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-muted-foreground",
				children: session?.status === "scheduled" ? `Next class ${session.topic}.` : "No live class right now."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Syllabus"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-1 text-sm",
						children: course.topics.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted-foreground",
							children: t
						}, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs font-semibold tracking-wide uppercase text-muted-foreground",
						children: "You should be able to"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-1 space-y-1 text-sm",
						children: course.objectives.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: t }, t))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Assessments & exam"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2",
					children: [course.assessments.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-card p-4 ring-1 ring-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold tracking-wide uppercase text-bud",
								children: a.kind
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-medium",
								children: a.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: ["Due ", a.due]
							})
						]
					}, a.title)), course.exam ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-2xl bg-card p-4 ring-1 ring-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold tracking-wide uppercase text-bud",
								children: "Examination"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-medium",
								children: course.exam.date
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: course.exam.note
							})
						]
					}) : null]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Materials"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2 text-sm",
					children: [
						course.materials.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted-foreground",
							children: m
						}, m)),
						pods.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-2xl bg-card p-3 ring-1 ring-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-semibold tracking-[0.14em] uppercase text-bud",
									children: "Bud · Educational"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-medium",
									children: p.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										p.lecturer,
										" · ",
										p.duration
									]
								})
							]
						}, p.id)),
						budMedia.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "text-sm",
							children: [
								m.title,
								" · ",
								m.durationMin,
								" min"
							]
						}, m.id))
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Announcements"
					}),
					lecturer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-3 space-y-2",
						onSubmit: (e) => {
							e.preventDefault();
							if (annTitle.trim() && annBody.trim()) sendAnn.mutate();
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: annTitle,
								onChange: (e) => setAnnTitle(e.target.value),
								placeholder: "Title",
								className: "h-11 w-full rounded-full bg-secondary px-4 text-sm outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: annBody,
								onChange: (e) => setAnnBody(e.target.value),
								placeholder: "For the class…",
								className: "min-h-20 w-full rounded-2xl bg-secondary p-3 text-sm outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								type: "submit",
								children: "Post to class"
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 space-y-2",
						children: (anns.data ?? []).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-2xl bg-card p-4 ring-1 ring-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: a.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: a.body
							})]
						}, a.id))
					})
				]
			}),
			lecturer && session ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Lecturer view"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "Attendance is from join/leave in this live session. Recordings never rewrite it."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-1 text-sm",
						children: [(roster.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-muted-foreground",
								children: r.userId.slice(0, 8)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.left ? "Left early" : r.joined ? "Present" : "Absent" })]
						}, r.userId)), !roster.data?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-muted-foreground",
							children: "Nobody has joined yet."
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 space-y-1 text-sm",
						children: (questions.data ?? []).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item.body }, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						className: "mt-3",
						onClick: () => toast.message(session.status === "live" ? "This session is already live." : "Go live from Tutor Mode when a stream is connected."),
						children: "Start live class"
					})
				]
			}) : null,
			course.communityId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/communities/$id",
				params: { id: course.communityId },
				className: "mt-8 mb-8 inline-block text-sm font-medium",
				children: "Class community"
			}) : null
		]
	});
}
//#endregion
export { UniBoard as component };
