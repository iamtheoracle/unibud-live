import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { i as createServerFn } from "./ssr.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { r as createSsrRpc } from "./server-3ArcV-Gz.mjs";
import { c as UNIVERSITIES } from "./catalog-DxoFHR0q.mjs";
import { t as EmptyState } from "./empty-CzUOsSSv.mjs";
import { n as useAuthReady, t as SignInCard } from "./sign-in-gate-rXdNMVWJ.mjs";
import { a as boardIdFor, i as PROGRAMMES, n as FACULTIES, r as LEVELS, s as coursesFor } from "./academic-yrmQUZab.mjs";
import { n as dropCourse, r as enrollCourse, s as listEnrollments } from "./server-C79XTJTu.mjs";
import { t as Input } from "./input-BLGtTKRX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studies-D_oMTaAA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getStudies = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("043af26ddb9761e809dcaa18fa447a07f2661d702b08879db081e1d88f8d4348"));
var seedSampleSemester = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("c15ca8e0f5be01f2212cee0306799393f4625f1628bf1bb24c6056e78725577a"));
var addCourse = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("cc99d26e6659c31c4cc1800ed7fae48696e9cf3e40d4c5406a29d38405b2130d"));
var addMaterial = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0b71389b7fbcf7bf2791e94691a52ed4598d9535cdd946934ecb5ee2986a85b6"));
var addStudySession = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ac8d8eeab970fcea11b422407500bb2ba2e4bff2edf1b3f3d7b7d12032d46afe"));
function Studies() {
	const { user, isPending } = useAuthReady();
	const qc = useQueryClient();
	const q = useQuery({
		queryKey: ["studies"],
		queryFn: () => getStudies(),
		enabled: Boolean(user)
	});
	const enrolled = useQuery({
		queryKey: ["enroll"],
		queryFn: () => listEnrollments(),
		enabled: Boolean(user)
	});
	const homeCampusId = useCampusStore((s) => s.homeCampusId);
	const setHomeCampusId = useCampusStore((s) => s.setHomeCampusId);
	const faculty = useCampusStore((s) => s.faculty);
	const setFaculty = useCampusStore((s) => s.setFaculty);
	useCampusStore((s) => s.department);
	const setDepartment = useCampusStore((s) => s.setDepartment);
	const programme = useCampusStore((s) => s.programme);
	const setProgramme = useCampusStore((s) => s.setProgramme);
	const level = useCampusStore((s) => s.level);
	const setLevel = useCampusStore((s) => s.setLevel);
	const semester = useCampusStore((s) => s.semester);
	const setSemester = useCampusStore((s) => s.setSemester);
	const enroll = useMutation({
		mutationFn: (code) => enrollCourse({ data: {
			code,
			semester: `Semester ${semester}`
		} }),
		onSuccess: (d) => qc.setQueryData(["enroll"], d)
	});
	const drop = useMutation({
		mutationFn: (code) => dropCourse({ data: code }),
		onSuccess: (d) => qc.setQueryData(["enroll"], d)
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [code, setCode] = (0, import_react.useState)("");
	const [active, setActive] = (0, import_react.useState)(null);
	const [mat, setMat] = (0, import_react.useState)("");
	const seed = useMutation({
		mutationFn: () => seedSampleSemester(),
		onSuccess: (d) => {
			qc.setQueryData(["studies"], d);
		}
	});
	const add = useMutation({
		mutationFn: () => addCourse({ data: {
			title,
			code,
			sessionLabel: "2026/2027 Academic Session",
			semester: "Semester 1"
		} }),
		onSuccess: (d) => {
			qc.setQueryData(["studies"], d);
			setTitle("");
			setCode("");
			setOpen(false);
		}
	});
	const addMat = useMutation({
		mutationFn: () => addMaterial({ data: {
			courseId: active,
			title: mat,
			kind: "note"
		} }),
		onSuccess: (d) => {
			qc.setQueryData(["studies"], d);
			setMat("");
		}
	});
	const addSess = useMutation({
		mutationFn: () => addStudySession({ data: {
			courseId: active,
			title: "Study block",
			startsAt: new Date(Date.now() + 36e5).toISOString(),
			minutes: 90
		} }),
		onSuccess: (d) => qc.setQueryData(["studies"], d)
	});
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-4 h-40 animate-pulse rounded-2xl bg-secondary" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-5 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Personal learning"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "Studies"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInCard, {
					title: "Organise your semester",
					body: "Notes, materials, revision and study blocks. This is not Board and not Bud."
				})
			})
		]
	});
	const courses = q.data?.courses ?? [];
	const selected = courses.find((c) => c.id === active) ?? courses[0];
	const materials = (q.data?.materials ?? []).filter((m) => m.courseId === selected?.id);
	const sessions = (q.data?.sessions ?? []).filter((s) => s.courseId === selected?.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "safe-bottom px-5 pt-6 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: "Personal learning"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-4xl",
				children: "Studies"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Your notes, revision and study plan. Board is live class. Bud is the AI platform. Study groups live in Communities."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/communities/$id",
						params: { id: "night-study" },
						className: "inline-flex h-9 items-center rounded-full bg-secondary px-4 text-sm",
						children: "Study groups"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/board",
						className: "inline-flex h-9 items-center rounded-full bg-secondary px-4 text-sm",
						children: "Board"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/podcasts",
						className: "inline-flex h-9 items-center rounded-full bg-secondary px-4 text-sm",
						children: "Lectures & podcasts"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-3xl bg-card p-5 ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold tracking-wide uppercase text-muted-foreground",
						children: "This semester"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs text-muted-foreground",
								children: ["Institution", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "mt-1 h-11 w-full rounded-full bg-secondary px-3 text-sm",
									value: homeCampusId,
									onChange: (e) => setHomeCampusId(e.target.value),
									children: UNIVERSITIES.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: u.id,
										children: [
											u.shortName,
											" · ",
											u.name
										]
									}, u.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs text-muted-foreground",
								children: ["Faculty", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "mt-1 h-11 w-full rounded-full bg-secondary px-3 text-sm",
									value: faculty,
									onChange: (e) => {
										setFaculty(e.target.value);
										setProgramme(PROGRAMMES[e.target.value]?.[0] ?? "");
									},
									children: FACULTIES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: f,
										children: f
									}, f))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-xs text-muted-foreground",
								children: ["Programme", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "mt-1 h-11 w-full rounded-full bg-secondary px-3 text-sm",
									value: programme,
									onChange: (e) => {
										setProgramme(e.target.value);
										setDepartment(e.target.value);
									},
									children: (PROGRAMMES[faculty] ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: p,
										children: p
									}, p))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs text-muted-foreground",
									children: ["Level", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "mt-1 h-11 w-full rounded-full bg-secondary px-3 text-sm",
										value: level,
										onChange: (e) => setLevel(e.target.value),
										children: LEVELS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: l,
											children: l
										}, l))
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs text-muted-foreground",
									children: ["Semester", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "mt-1 h-11 w-full rounded-full bg-secondary px-3 text-sm",
										value: semester,
										onChange: (e) => setSemester(e.target.value),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "1",
											children: "1"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "2",
											children: "2"
										})]
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-muted-foreground",
						children: "Add only the courses you are taking."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-2",
						children: coursesFor({
							faculty,
							programme,
							level,
							semester
						}).map((c) => {
							const on = (enrolled.data ?? []).some((e) => e.code === c.code);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "min-w-0 truncate",
									children: [
										c.code,
										" · ",
										c.title
									]
								}), on ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/board/$id",
										params: { id: boardIdFor(c.code) },
										className: "text-xs font-medium",
										children: "Board"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "text-xs",
										onClick: () => drop.mutate(c.code),
										children: "Remove"
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-xs font-medium",
									onClick: () => enroll.mutate(c.code),
									children: "Add"
								})]
							}, c.code);
						})
					})
				]
			}),
			!courses.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No semester yet",
					body: "Start from a Computer Engineering sample, or add your own courses.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => seed.mutate(),
							disabled: seed.isPending,
							children: "Use sample semester"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setOpen(true),
							children: "Add a course"
						})]
					})
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex gap-2 overflow-x-auto pb-1",
				children: [courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setActive(c.id),
					className: `shrink-0 rounded-full px-3.5 py-2 text-sm ${selected?.id === c.id ? "bg-ink text-paper" : "bg-secondary"}`,
					children: c.code
				}, c.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setOpen(true),
					className: "shrink-0 rounded-full bg-secondary px-3.5 py-2 text-sm",
					children: "Add"
				})]
			}), selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-5 rounded-3xl bg-card p-5 ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							selected.sessionLabel,
							" · ",
							selected.semester
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-1 text-xl font-medium",
						children: [
							selected.code,
							" · ",
							selected.title
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-5 text-sm font-medium",
						children: "Materials"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1 text-sm text-muted-foreground",
						children: materials.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: m.title }, m.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: mat,
							onChange: (e) => setMat(e.target.value),
							placeholder: "Add a note title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => selected && addMat.mutate(),
							disabled: !mat.trim() || addMat.isPending,
							children: "Add"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-6 text-sm font-medium",
						children: "Study sessions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 space-y-1 text-sm text-muted-foreground",
						children: sessions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							s.title,
							" · ",
							s.minutes,
							" min"
						] }, s.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						size: "sm",
						variant: "outline",
						onClick: () => selected && addSess.mutate(),
						children: "Schedule 90 min"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/bud",
						className: "mt-4 block text-sm text-bud",
						children: ["Ask Bud about ", selected.title]
					})
				]
			}) : null] }),
			open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-end bg-ink/60 md:items-center md:justify-center",
				onClick: () => setOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-t-3xl bg-card p-5 md:rounded-3xl",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-medium",
							children: "Add a course"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-3",
							value: code,
							onChange: (e) => setCode(e.target.value),
							placeholder: "Code · PHY 201"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-2",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "Title · Physics"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4 w-full",
							onClick: () => add.mutate(),
							disabled: !title.trim() || add.isPending,
							children: "Save course"
						})
					]
				})
			}) : null
		]
	});
}
//#endregion
export { Studies as component };
