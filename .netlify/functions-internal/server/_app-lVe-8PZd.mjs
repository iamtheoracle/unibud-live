import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as useLoaderData, x as useNavigate, y as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { a as useCampusStore } from "./_ssr/campus-store-VLAQ_aP0.mjs";
import { r as useStudioStore } from "./_ssr/store-Q3creU_Y.mjs";
import { d as togglePostLike, f as toggleSave, t as addSquareReply, u as toggleCommentLike } from "./_ssr/server-3ArcV-Gz.mjs";
import { t as useCurrentUserState } from "./_ssr/use-current-user-Q8r4NahO.mjs";
import { l as communityById, o as POSTS, u as personByHandle } from "./_ssr/catalog-DxoFHR0q.mjs";
import { i as relativeTime } from "./_ssr/format-o0D0ws6F.mjs";
import { t as Avatar } from "./_ssr/person-BF6bewJz.mjs";
import { C as Play, N as MessageCircle, Q as Bookmark, R as Heart, S as Plus, W as Ellipsis, X as ChevronLeft, Y as ChevronRight, p as Share2, rt as BadgeCheck, t as X } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as EmptyState } from "./_ssr/empty-CzUOsSSv.mjs";
import { g as cn } from "./_ssr/router-DSOd9OgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-lVe-8PZd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CLUSTERS = [
	{
		id: "c-amaka",
		handles: ["amaka", "kemi"],
		count: 3,
		photos: ["/market/camera.jpg", "/covers/campus-night.jpg"],
		lines: [
			"Hall week fittings, not the rumour.",
			"Studio light hit different tonight.",
			"Portraits after faculty night."
		]
	},
	{
		id: "c-tunde",
		handles: ["tunde", "ibrahim"],
		count: 2,
		photos: ["/market/keke.jpg", "/covers/campus-night.jpg"],
		lines: ["Rain, keke, still made 8am.", "Second gate queue before lecture."]
	},
	{
		id: "c-adaeze",
		handles: ["adaeze", "chinedu"],
		count: 4,
		photos: ["/covers/campus-night.jpg", "/market/camera.jpg"],
		lines: [
			"Library till close. Notes after.",
			"Quiet reading corner, no playlist.",
			"Night class from the floor.",
			"Past questions club, New Hall."
		]
	},
	{
		id: "c-fatima",
		handles: ["fatima", "ngozi"],
		count: 2,
		photos: ["/covers/campus-night.jpg", "/market/braids.jpg"],
		lines: ["From the second gate before lecture.", "Meal plan that actually lasted the week."]
	},
	{
		id: "c-sky",
		handles: ["jonas_wits", "aisha_nbo"],
		count: 2,
		photos: ["/covers/campus-night.jpg", "/market/camera.jpg"],
		lines: ["Cheap lens. Honest sky.", "The arm grabbed on the third try."]
	}
];
function Face({ src, name, className }) {
	if (src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		className: cn("size-11 rounded-full object-cover", className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
		name,
		className: cn("size-11", className)
	});
}
function CampusMoments({ signedIn, onCreate }) {
	const seen = useCampusStore((s) => s.storiesSeen);
	const seeStory = useCampusStore((s) => s.seeStory);
	const mine = useCampusStore((s) => s.myStories ?? []);
	const [open, setOpen] = (0, import_react.useState)(null);
	const [mineOpen, setMineOpen] = (0, import_react.useState)(false);
	const [seg, setSeg] = (0, import_react.useState)(0);
	const active = CLUSTERS.filter((c) => !seen.includes(c.id));
	const current = CLUSTERS.find((c) => c.id === open) ?? null;
	function closeCluster(id) {
		seeStory(id);
		setOpen(null);
		setSeg(0);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3 overflow-x-auto px-4 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => mine.length ? setMineOpen(true) : onCreate(),
				className: "w-[3.25rem] shrink-0",
				"aria-label": "Your story",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("relative mx-auto grid size-11 place-items-center overflow-hidden rounded-full bg-secondary text-ink", mine.length ? "ring-2 ring-success" : "ring-2 ring-dashed ring-ink/30"),
					children: mine[0]?.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: mine[0].image,
						alt: "",
						className: "size-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 truncate text-center text-[10px] text-muted-foreground",
					children: "You"
				})]
			}), active.map((c, i) => {
				const a = personByHandle(c.handles[0]);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => {
						setOpen(c.id);
						setSeg(0);
					},
					className: "w-[3.25rem] shrink-0",
					"aria-label": `${a?.name ?? c.handles[0]} story`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "relative mx-auto block size-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute inset-0 rounded-full bg-[conic-gradient(from_200deg,#6d5ef6,#111114,#1f9d61,#6d5ef6)] p-[2px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block size-full rounded-full bg-background p-[2px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, {
									src: c.photos[0],
									name: a?.name ?? c.handles[0],
									className: "size-full"
								})
							})
						}), i === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -bottom-0.5 left-1/2 -translate-x-1/2 rounded-full bg-ink px-1 text-[8px] font-semibold tracking-wide text-paper",
							children: "LIVE"
						}) : null]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1.5 truncate text-center text-[10px]",
						children: (a?.name ?? c.handles[0]).split(" ")[0]
					})]
				}, c.id);
			})]
		}),
		current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-50 flex flex-col bg-ink text-paper",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 px-3 pt-[max(0.75rem,env(safe-area-inset-top))]",
					children: current.lines.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-0.5 flex-1 rounded-full", i <= seg ? "bg-paper" : "bg-paper/25") }, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "px-3 text-sm font-medium",
						children: [personByHandle(current.handles[0])?.name ?? current.handles[0], /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-1 text-paper/50",
							children: ["@", current.handles[0]]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center",
						"aria-label": "Close moment",
						onClick: () => closeCluster(current.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 items-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-11 place-items-center",
							"aria-label": "Previous",
							onClick: () => setSeg((i) => Math.max(0, i - 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 px-4 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl",
								children: current.lines[seg]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-sm text-paper/60",
								children: "Moment"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-11 place-items-center",
							"aria-label": "Next",
							onClick: () => {
								if (seg >= current.lines.length - 1) closeCluster(current.id);
								else setSeg((i) => i + 1);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-6" })
						})
					]
				}),
				!signedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "sheet-safe text-center text-xs text-paper/50",
					children: "Sign in to post your own moment."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-[env(safe-area-inset-bottom)]" })
			]
		}) : null,
		mineOpen && mine[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-50 flex flex-col bg-ink text-paper",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-2 pt-[max(0.75rem,env(safe-area-inset-top))]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 text-sm font-semibold",
						children: "You"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center",
						onClick: () => setMineOpen(false),
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-0 flex-1 items-center",
					children: mine[0].video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: mine[0].video,
						className: "max-h-full w-full object-contain",
						autoPlay: true,
						playsInline: true
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: mine[0].image,
						alt: "",
						className: "max-h-full w-full object-contain"
					})
				}),
				mine[0].caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-5 py-3 text-sm",
					children: mine[0].caption
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "sheet-safe pb-4 text-center text-sm font-medium",
					onClick: onCreate,
					children: "Add another"
				})
			]
		}) : null
	] });
}
/** Relevance first. Campus/location is a signal, never the whole score. */
function scorePost(post, ctx) {
	let score = 0;
	const person = personByHandle(post.authorHandle);
	const hay = `${post.body} ${person?.program ?? ""} ${person?.bio ?? ""}`.toLowerCase();
	if (ctx.following.includes(post.authorHandle)) score += 8;
	if (person?.universityId === ctx.universityId) score += 2;
	for (const interest of ctx.interests) if (interest && hay.includes(interest.toLowerCase())) score += 5;
	for (const q of ctx.searches.slice(0, 4)) {
		const t = q.toLowerCase();
		if (t && hay.includes(t)) score += 3;
	}
	score += Math.min(6, (ctx.likeCounts[post.id] ?? 0) / 12);
	const ageH = (Date.now() - new Date(post.createdAt).getTime()) / 36e5;
	score += Math.max(0, 4 - ageH / 18);
	return score;
}
function rankPosts(posts, ctx) {
	return [...posts].sort((a, b) => scorePost(b, ctx) - scorePost(a, ctx));
}
function campusContextual(posts, ctx) {
	const ranked = rankPosts(posts, ctx);
	const near = ranked.filter((p) => personByHandle(p.authorHandle)?.universityId === ctx.universityId);
	const farButRelevant = ranked.filter((p) => {
		if (personByHandle(p.authorHandle)?.universityId === ctx.universityId) return false;
		return scorePost(p, ctx) >= 8;
	});
	return [...near, ...farButRelevant];
}
function boiling(posts, ctx) {
	return [...posts].sort((a, b) => {
		const ea = (ctx.likeCounts[a.id] ?? 0) + scorePost(a, ctx) * .2;
		return (ctx.likeCounts[b.id] ?? 0) + scorePost(b, ctx) * .2 - ea;
	});
}
var SQUARE_LANES = [
	{
		id: "on-stream",
		label: "On Stream"
	},
	{
		id: "quad-drop",
		label: "Quad Drop"
	},
	{
		id: "buddies",
		label: "Buddies"
	},
	{
		id: "peek",
		label: "Peek"
	},
	{
		id: "off-rails",
		label: "Off the Rails"
	}
];
function isVideoPost(post) {
	return post.kind === "reel" || Boolean(post.video);
}
function likeKey(id) {
	return id.split("~")[0] ?? id;
}
/** Repeat a finite catalog so Square never hits an artificial end. */
function loopStream(source, count) {
	if (!source.length || count <= 0) return [];
	const out = [];
	for (let i = 0; i < count; i++) {
		const src = source[i % source.length];
		const lap = Math.floor(i / source.length);
		out.push(lap === 0 ? src : {
			...src,
			id: `${src.id}~${lap}`
		});
	}
	return out;
}
function postsForLane(posts, lane, ctx, connections) {
	if (lane === "on-stream") return rankPosts(posts, ctx);
	if (lane === "quad-drop") return campusContextual(posts, ctx);
	if (lane === "buddies") {
		const circle = /* @__PURE__ */ new Set([...ctx.following, ...connections]);
		return rankPosts(posts.filter((p) => circle.has(p.authorHandle)), ctx);
	}
	if (lane === "peek") return rankPosts(posts.filter(isVideoPost), ctx);
	return boiling(posts, ctx);
}
function ReelsStage({ source, startId }) {
	const reels = (0, import_react.useMemo)(() => source.filter(isVideoPost), [source]);
	const [n, setN] = (0, import_react.useState)(() => Math.max(16, reels.length * 3));
	const items = (0, import_react.useMemo)(() => loopStream(reels, n), [reels, n]);
	const scroller = (0, import_react.useRef)(null);
	const sentinel = (0, import_react.useRef)(null);
	const started = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		started.current = false;
	}, [startId]);
	(0, import_react.useEffect)(() => {
		const root = scroller.current;
		const el = sentinel.current;
		if (!root || !el || !reels.length) return;
		const io = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setN((v) => v + Math.max(reels.length, 6));
		}, {
			root,
			rootMargin: "1200px"
		});
		io.observe(el);
		return () => io.disconnect();
	}, [reels.length, items.length]);
	(0, import_react.useEffect)(() => {
		if (!startId || started.current || !scroller.current) return;
		const node = scroller.current.querySelector(`[data-reel="${CSS.escape(startId)}"]`);
		if (node) {
			node.scrollIntoView();
			started.current = true;
		}
	}, [startId, items.length]);
	function goNext(from) {
		const root = scroller.current;
		if (!root) return;
		const next = root.querySelectorAll("[data-reel]")[from + 1];
		if (next) next.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
		if (from > items.length - 5) setN((v) => v + Math.max(reels.length, 6));
	}
	if (!reels.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-5 py-12 text-center text-sm text-muted-foreground",
		children: "No video posts yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: scroller,
		className: "h-dvh snap-y snap-mandatory overflow-y-auto overscroll-y-contain bg-ink",
		children: [items.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReelSlide, {
			post: p,
			onEnded: () => goNext(i)
		}, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: sentinel,
			className: "h-24 snap-start",
			"aria-hidden": true
		})]
	});
}
function ReelSlide({ post, onEnded }) {
	const wrap = (0, import_react.useRef)(null);
	const video = (0, import_react.useRef)(null);
	const [on, setOn] = (0, import_react.useState)(false);
	const person = personByHandle(post.authorHandle);
	const key = likeKey(post.id);
	const liked = useCampusStore((s) => s.liked[key]);
	const count = useCampusStore((s) => s.likeCounts[key] ?? 0);
	const toggleLike = useCampusStore((s) => s.toggleLike);
	const audio = useCampusStore((s) => s.originalAudios ?? []).find((a) => a.audioId === post.audioId || a.sourceContentId === key);
	(0, import_react.useEffect)(() => {
		const el = wrap.current;
		if (!el) return;
		const io = new IntersectionObserver(([e]) => {
			const vis = e.isIntersecting && e.intersectionRatio >= .65;
			setOn(vis);
		}, { threshold: [
			.2,
			.65,
			1
		] });
		io.observe(el);
		return () => io.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		const v = video.current;
		if (!v) return;
		if (on) v.play().catch(() => {});
		else v.pause();
	}, [on]);
	(0, import_react.useEffect)(() => {
		if (post.video || !on) return;
		const t = window.setTimeout(() => onEnded(), 7e3);
		return () => window.clearTimeout(t);
	}, [
		on,
		post.video,
		post.id
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		ref: wrap,
		"data-reel": post.id,
		className: "relative flex h-dvh snap-start snap-always flex-col justify-end",
		children: [
			post.video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: video,
				src: post.video,
				poster: post.image,
				className: "absolute inset-0 size-full object-cover",
				muted: true,
				playsInline: true,
				onEnded
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: post.image,
				alt: "",
				className: "absolute inset-0 size-full object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex items-end justify-between px-5 pb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 pr-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm font-semibold text-paper",
							children: [person?.name ?? post.authorHandle, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-1 font-normal text-paper/70",
								children: ["@", post.authorHandle]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-paper",
							children: post.body
						}),
						audio ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/audio/$id",
							params: { id: audio.audioId },
							className: "mt-2 block text-xs text-paper/80",
							children: [
								"Original audio · ",
								audio.creatorHandle ? `${audio.creatorHandle} · ` : "",
								audio.title,
								audio.usageCount > 1 ? ` · ${audio.usageCount} uses` : ""
							]
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => toggleLike(key),
					className: cn("grid size-11 place-items-center text-paper", liked && "text-bud"),
					"aria-label": "Like",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-6", liked && "fill-bud") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px]",
						children: count || ""
					})]
				})]
			})
		]
	});
}
var EMPTY_REPLIES = [];
function Square() {
	const catalog = useLoaderData({ from: "/_app" });
	const nav = useNavigate();
	const { user, isPending } = useCurrentUserState();
	const onboardingDone = useCampusStore((s) => s.onboardingDone);
	(0, import_react.useEffect)(() => {
		if (isPending) return;
		let guest = false;
		try {
			guest = sessionStorage.getItem("unibud-guest-browse") === "1";
		} catch {
			guest = false;
		}
		if (!user && !guest) {
			nav({ to: "/welcome" });
			return;
		}
		if (user && !onboardingDone) nav({ to: "/welcome" });
	}, [
		user,
		isPending,
		onboardingDone,
		nav
	]);
	let guestBrowse = false;
	try {
		guestBrowse = sessionStorage.getItem("unibud-guest-browse") === "1";
	} catch {
		guestBrowse = false;
	}
	if (isPending || !user && !guestBrowse || user && !onboardingDone) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "m-4 h-48 animate-pulse rounded-3xl bg-secondary" });
	const [lane, setLane] = (0, import_react.useState)("on-stream");
	const [peekStart, setPeekStart] = (0, import_react.useState)();
	const [shown, setShown] = (0, import_react.useState)(10);
	const localPosts = useCampusStore((s) => s.localPosts);
	const following = useCampusStore((s) => s.following);
	const connections = useCampusStore((s) => s.connections);
	const interests = useCampusStore((s) => s.interests);
	const likeCounts = useCampusStore((s) => s.likeCounts);
	const searches = useCampusStore((s) => s.recentSearches);
	const homeCampusId = useCampusStore((s) => s.homeCampusId);
	const hiddenPosts = useCampusStore((s) => s.hiddenPosts);
	const setComposeOpen = useCampusStore((s) => s.setComposeOpen);
	const setDropOpen = useCampusStore((s) => s.setDropOpen);
	const setSquareView = useCampusStore((s) => s.setSquareView);
	const catalogPosts = catalog.posts.map((p) => {
		const seed = POSTS.find((x) => x.id === p.id);
		return seed ? {
			...p,
			video: seed.video ?? p.video,
			kind: seed.kind ?? p.kind,
			image: p.image ?? seed.image
		} : p;
	});
	const extra = POSTS.filter((p) => !catalogPosts.some((c) => c.id === p.id));
	const merged = [
		...localPosts.map((p) => ({
			id: p.id,
			communityId: p.communityId ?? "unilag-campus",
			authorHandle: p.authorHandle,
			body: p.body,
			createdAt: p.createdAt,
			image: p.image,
			video: p.video,
			kind: p.kind,
			audioId: p.audioId
		})),
		...catalogPosts,
		...extra
	].filter((p) => !hiddenPosts.includes(p.id) && !hiddenPosts.includes(likeKey(p.id)));
	const lanePosts = postsForLane(merged, lane, {
		following,
		interests,
		universityId: homeCampusId || "unilag",
		likeCounts,
		searches
	}, connections);
	const stream = (0, import_react.useMemo)(() => loopStream(lanePosts, shown), [lanePosts, shown]);
	const sentinel = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (typeof sessionStorage === "undefined") return;
		const saved = sessionStorage.getItem("unibud-square-mode");
		if (saved === "peek" || saved === "reels") {
			sessionStorage.removeItem("unibud-square-mode");
			setLane("peek");
			setSquareView("peek");
		}
	}, [setSquareView]);
	(0, import_react.useEffect)(() => {
		const el = sentinel.current;
		if (!el || lane === "peek") return;
		const io = new IntersectionObserver(([e]) => {
			if (e.isIntersecting) setShown((n) => n + 12);
		}, { rootMargin: "1200px" });
		io.observe(el);
		return () => io.disconnect();
	}, [lane, stream.length]);
	function openPeek(id) {
		setPeekStart(id);
		setLane("peek");
		setSquareView("peek");
	}
	function chooseLane(v) {
		setLane(v);
		setSquareView(v === "peek" ? "peek" : "feed");
		if (v !== "peek") setPeekStart(void 0);
		setShown(10);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "bg-card",
		children: lane === "peek" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative bg-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-0 right-0 left-0 z-20 px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StreamPicker, {
					lane,
					onChange: chooseLane,
					dark: true
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReelsStage, {
				source: lanePosts.length ? lanePosts : merged,
				startId: peekStart
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "kicker",
					children: "The UNIBUD world"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-1 flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-5xl font-medium",
						children: "Square"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center text-2xl leading-none text-ink",
						"aria-label": "Drop",
						onClick: () => setDropOpen(true),
						children: "+"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampusMoments, {
					signedIn: true,
					onCreate: () => {
						const studio = useStudioStore.getState();
						studio.setIntent("story");
						studio.setMode("story");
						studio.setDest("story");
						studio.setView("camera");
						setComposeOpen(true);
					}
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StreamPicker, {
				lane,
				onChange: chooseLane
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LaneFeed, {
				lane,
				stream,
				discovery: lane === "off-rails" ? catalog.discovery ?? [] : [],
				sentinel,
				onOpenPeek: openPeek
			})
		] })
	});
}
function StreamPicker({ lane, onChange, dark }) {
	const [busy, setBusy] = (0, import_react.useState)(null);
	function pick(id) {
		if (id === lane) return;
		setBusy(id);
		onChange(id);
		window.setTimeout(() => setBusy(null), 180);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: cn("square-lanes", !dark && "mt-3"),
		"aria-label": "Square feeds",
		"data-dark": dark ? "true" : void 0,
		children: SQUARE_LANES.map((item) => {
			const on = lane === item.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "square-lane",
				"data-on": on ? "true" : void 0,
				"data-busy": busy === item.id ? "true" : void 0,
				"aria-current": on ? "page" : void 0,
				onClick: () => pick(item.id),
				children: item.label
			}, item.id);
		})
	});
}
function LaneFeed({ lane, stream, discovery, sentinel, onOpenPeek }) {
	if (!stream.length) {
		const copy = lane === "buddies" ? {
			title: "Buddies is quiet",
			body: "Connect with people and follow a few voices. Their posts land here."
		} : lane === "quad-drop" ? {
			title: "Nothing on Quad Drop yet",
			body: "Campus and university activity will gather here as people post."
		} : {
			title: "Square is still waking up",
			body: "Drop something, or come back as the world starts moving."
		};
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "px-4 py-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				title: copy.title,
				body: copy.body
			})
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-1",
		children: [stream.map((p, i) => {
			const spark = lane === "off-rails" && discovery.length ? discovery[i % discovery.length] : null;
			const showSpark = Boolean(spark) && i > 0 && i % 5 === 0 && !p.id.includes("~");
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [showSpark && spark ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiscoveryCard, { item: spark }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedItem, {
				post: p,
				onOpenPeek
			})] }, p.id);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: sentinel,
			className: "h-16",
			"aria-hidden": true
		})]
	});
}
function DiscoveryCard({ item }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "border-b border-border px-5 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase",
				children: item.kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm font-semibold",
				children: item.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm leading-relaxed text-muted-foreground",
				children: item.summary
			})
		]
	});
}
function postUrl(id) {
	if (typeof window === "undefined") return `/?p=${id}`;
	return `${window.location.origin}/?p=${likeKey(id)}`;
}
async function sharePost(post) {
	const url = postUrl(post.id);
	try {
		if (navigator.share) {
			await navigator.share({
				title: "UNIBUD",
				text: post.body,
				url
			});
			return;
		}
	} catch {}
	try {
		await navigator.clipboard.writeText(url);
		toast.success("Link copied.");
	} catch {
		toast.message(url);
	}
}
function FeedItem({ post, onOpenPeek }) {
	const person = personByHandle(post.authorHandle);
	const community = communityById(post.communityId);
	const key = likeKey(post.id);
	const liked = useCampusStore((s) => s.liked[key]);
	const count = useCampusStore((s) => s.likeCounts[key] ?? 0);
	const toggleLike = useCampusStore((s) => s.toggleLike);
	const localReplies = useCampusStore((s) => s.postReplies[key] ?? EMPTY_REPLIES);
	const addPostReply = useCampusStore((s) => s.addPostReply);
	const hidePost = useCampusStore((s) => s.hidePost);
	const saved = useCampusStore((s) => (s.savedPosts ?? []).includes(key));
	const toggleSavePost = useCampusStore((s) => s.toggleSavePost);
	const { user } = useCurrentUserState();
	const dbReplies = (useLoaderData({ from: "/_app" }).replies ?? []).filter((r) => r.postId === key).map((r) => ({
		id: r.id,
		authorHandle: r.authorHandle,
		body: r.body,
		parentId: r.parentId,
		createdAt: r.createdAt
	}));
	const localIds = new Set(localReplies.map((r) => r.id));
	const replies = [...dbReplies.filter((r) => !localIds.has(r.id)), ...localReplies];
	const following = useCampusStore((s) => s.following);
	const follow = useCampusStore((s) => s.follow);
	const unfollow = useCampusStore((s) => s.unfollow);
	const reportPost = useCampusStore((s) => s.reportPost);
	const originals = useCampusStore((s) => s.originalAudios ?? []);
	const commentLikes = useCampusStore((s) => s.commentLikes ?? {});
	const toggleCommentLike$1 = useCampusStore((s) => s.toggleCommentLike);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [reply, setReply] = (0, import_react.useState)("");
	const [parent, setParent] = (0, import_react.useState)();
	const name = person?.name ?? post.authorHandle;
	const isFollowed = following.includes(post.authorHandle);
	const audio = originals.find((a) => a.audioId === post.audioId || a.sourceContentId === key);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "border-b border-border px-5 py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/u/$handle",
				params: { handle: post.authorHandle },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, { name })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-sm font-semibold",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/u/$handle",
										params: { handle: post.authorHandle },
										className: "hover:underline",
										children: name
									}),
									person?.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, { className: "ml-1 inline size-3.5 text-bud" }) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "ml-1 font-normal text-muted-foreground",
										children: ["@", post.authorHandle]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									community ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/communities/$id",
										params: { id: community.id },
										className: "font-medium text-bud",
										children: community.name
									}) : null,
									community ? " · " : null,
									relativeTime(post.createdAt)
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-9 place-items-center text-muted-foreground",
								"aria-label": "More",
								onClick: () => setMenu((v) => !v),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
							}), menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute top-9 right-0 z-10 w-44 rounded-xl bg-card p-1 ring-1 ring-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "block w-full rounded-lg px-3 py-2 text-left text-xs",
										onClick: () => {
											if (isFollowed) unfollow(post.authorHandle);
											else follow(post.authorHandle);
											setMenu(false);
										},
										children: [
											isFollowed ? "Unfollow" : "Follow",
											" @",
											post.authorHandle
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "block w-full rounded-lg px-3 py-2 text-left text-xs",
										onClick: () => {
											navigator.clipboard.writeText(postUrl(post.id)).then(() => toast.success("Link copied."), () => toast.message(postUrl(post.id)));
											setMenu(false);
										},
										children: "Copy link"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "block w-full rounded-lg px-3 py-2 text-left text-xs",
										onClick: () => {
											hidePost(key);
											setMenu(false);
											toast.success("Hidden from Feed on this device.");
										},
										children: "Hide this"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "block w-full rounded-lg px-3 py-2 text-left text-xs text-destructive",
										onClick: () => {
											reportPost(key);
											setMenu(false);
											toast.success("Reported. It won’t show here again.");
										},
										children: "Report"
									})
								]
							}) : null]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed",
						children: post.body
					}),
					audio ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/audio/$id",
						params: { id: audio.audioId },
						className: "mt-2 block text-xs text-muted-foreground",
						children: [
							"♪ ",
							audio.sourceType === "LICENSED_MUSIC" ? "Music" : "Original audio",
							" · ",
							audio.title,
							audio.creatorHandle ? ` · @${audio.creatorHandle}` : ""
						]
					}) : null,
					isVideoPost(post) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReelMedia, {
						post,
						onOpen: () => onOpenPeek(key)
					}) : post.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: post.image,
						alt: "",
						className: "mt-3 h-52 w-full rounded-2xl object-cover"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center gap-4 text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									toggleLike(key);
									if (user) togglePostLike({ data: key }).catch(() => {});
								},
								className: cn("inline-flex h-9 items-center gap-1.5 text-sm", liked && "text-bud"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", liked && "fill-bud") }), count || ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setOpen((v) => !v),
								className: "inline-flex h-9 items-center gap-1.5 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), replies.length || ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "inline-flex h-9 items-center gap-1.5 text-sm",
								onClick: () => void sharePost(post),
								"aria-label": "Share",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("inline-flex h-9 items-center gap-1.5 text-sm", saved && "text-ink"),
								onClick: () => {
									toggleSavePost(key);
									if (user) toggleSave({ data: {
										kind: "post",
										itemId: key,
										title: post.body.slice(0, 80),
										href: "/"
									} }).catch(() => {});
									toast.success(saved ? "Removed from Saved." : "Saved.");
								},
								"aria-label": saved ? "Unsave" : "Save",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: cn("size-4", saved && "fill-ink") })
							})
						]
					}),
					open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-2",
						children: [replies.map((r) => {
							const parentBody = r.parentId ? replies.find((x) => x.id === r.parentId)?.body : null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl bg-secondary px-3 py-2 text-xs",
								children: [
									parentBody ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mb-1 text-[11px] text-muted-foreground",
										children: ["Replying: ", parentBody]
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/u/$handle",
											params: { handle: r.authorHandle },
											className: "font-medium",
											children: ["@", r.authorHandle]
										}),
										" ",
										r.body
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "font-medium",
											onClick: () => setParent(r.id),
											children: "Reply"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: cn("font-medium", commentLikes[r.id] && "text-bud"),
											onClick: () => {
												toggleCommentLike$1(r.id);
												if (user) toggleCommentLike({ data: r.id }).catch(() => {});
											},
											children: commentLikes[r.id] ? "Liked" : "Like"
										})]
									})
								]
							}, r.id);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: (e) => {
								e.preventDefault();
								if (!reply.trim()) return;
								addPostReply(key, {
									id: `pr-${Date.now()}`,
									authorHandle: "you",
									body: reply.trim(),
									parentId: parent,
									createdAt: (/* @__PURE__ */ new Date()).toISOString()
								});
								if (user) addSquareReply({ data: {
									postId: key,
									body: reply.trim(),
									parentId: parent
								} }).catch(() => {});
								setReply("");
								setParent(void 0);
							},
							children: [parent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mb-1 text-[11px] text-muted-foreground",
								children: [
									"Replying to a reply ·",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setParent(void 0),
										children: "cancel"
									})
								]
							}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: reply,
								onChange: (e) => setReply(e.target.value),
								placeholder: "Reply to this post",
								className: "h-10 w-full rounded-full bg-secondary px-4 text-sm outline-none"
							})]
						})]
					}) : null
				]
			})]
		})
	});
}
function ReelMedia({ post, onOpen }) {
	const wrap = (0, import_react.useRef)(null);
	const video = (0, import_react.useRef)(null);
	const [inView, setInView] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const el = wrap.current;
		if (!el) return;
		const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting && e.intersectionRatio > .5), { threshold: [
			0,
			.5,
			1
		] });
		io.observe(el);
		return () => io.disconnect();
	}, []);
	(0, import_react.useEffect)(() => {
		const v = video.current;
		if (!v || !post.video) return;
		if (inView) v.play().catch(() => {});
		else v.pause();
	}, [inView, post.video]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		ref: wrap,
		type: "button",
		className: "relative mt-3 block w-full overflow-hidden rounded-2xl",
		onClick: onOpen,
		"aria-label": "Open in Peek",
		children: [post.video ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
			ref: video,
			src: post.video,
			poster: post.image,
			className: "aspect-[3/4] max-h-[28rem] w-full object-cover",
			muted: true,
			playsInline: true,
			loop: true
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: post.image,
			alt: "",
			className: "aspect-[3/4] max-h-[28rem] w-full object-cover"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute inset-0 grid place-items-center bg-ink/10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid size-12 place-items-center rounded-full bg-ink/70 text-paper",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5 fill-paper" })
			})
		})]
	});
}
//#endregion
export { Square as component };
