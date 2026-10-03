import { o as __toESM, r as __exportAll } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as useRouter, f as useRouterState, h as Outlet, l as require_react_dom, x as useNavigate, y as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "./_libs/react+tanstack__react-query.mjs";
import { i as signOut } from "./_ssr/client-B40BzJxt.mjs";
import { i as roleLabel, r as canTeach } from "./_ssr/roles-B968-RcG.mjs";
import { t as Wordmark } from "./_ssr/logo-DSR5RTW3.mjs";
import { a as useCampusStore, i as unreadCount, n as originalFromPublish, r as resolveBudShortcut } from "./_ssr/campus-store-VLAQ_aP0.mjs";
import { n as evaluate, r as useStudioStore, t as NEUTRAL_ADJUST } from "./_ssr/store-Q3creU_Y.mjs";
import { t as UnibudMusic } from "./_ssr/service-BZMn3SFN.mjs";
import { t as recordAudioEvent } from "./_ssr/events-CplBO0C7.mjs";
import { t as Button } from "./_ssr/button-CoXdmm_3.mjs";
import { s as sendMessage, t as createPost } from "./_ssr/server-DJgS4hqB.mjs";
import { t as useCurrentUserState } from "./_ssr/use-current-user-Q8r4NahO.mjs";
import { t as Avatar } from "./_ssr/person-BF6bewJz.mjs";
import { n as SignedIn, r as SignedOut } from "./_ssr/gates-DDcqnn-l.mjs";
import { $ as BookOpen, B as FlipHorizontal, C as Play, E as Pause, F as LogOut, I as LayoutGrid, J as CircleUser, L as Image$1, M as MessageSquareText, N as MessageCircle, O as Newspaper, P as Megaphone, R as Heart, U as ExternalLink, _ as Scissors, c as Undo2, d as Sparkles, et as Bolt, g as Search, k as Music, m as Settings, n as Wrench, nt as BadgeHelp, o as Users, q as Clapperboard, s as UserPlus, t as X, tt as Bell, u as Trash2, v as RotateCw, x as Radio, y as RotateCcw, z as Grid2x2 } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { g as cn } from "./_ssr/router-DSOd9OgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-gydk5KZU.js
var _app_gydk5KZU_exports = /* @__PURE__ */ __exportAll({
	component: () => SplitComponent,
	i: () => stopDual,
	n: () => openDual,
	r: () => startDual,
	t: () => currentDual
});
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var live = null;
function currentDual() {
	return live;
}
function stopDual() {
	if (!live) return;
	live.front.getTracks().forEach((t) => t.stop());
	live.back.getTracks().forEach((t) => t.stop());
	live = null;
}
async function openDual() {
	if (!navigator.mediaDevices?.getUserMedia || !navigator.mediaDevices.enumerateDevices) return {
		ok: false,
		reason: "unsupported"
	};
	try {
		if ((await navigator.mediaDevices.enumerateDevices()).filter((d) => d.kind === "videoinput").length < 2) return {
			ok: false,
			reason: "unsupported"
		};
		const back = await navigator.mediaDevices.getUserMedia({
			video: { facingMode: { ideal: "environment" } },
			audio: false
		});
		try {
			const front = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: { ideal: "user" } },
				audio: false
			});
			const backId = back.getVideoTracks()[0]?.getSettings().deviceId;
			const frontId = front.getVideoTracks()[0]?.getSettings().deviceId;
			if (backId && frontId && backId === frontId) {
				front.getTracks().forEach((t) => t.stop());
				back.getTracks().forEach((t) => t.stop());
				return {
					ok: false,
					reason: "unsupported"
				};
			}
			return {
				ok: true,
				front,
				back
			};
		} catch (e) {
			back.getTracks().forEach((t) => t.stop());
			if ((e instanceof Error ? e.name : "") === "NotAllowedError") return {
				ok: false,
				reason: "denied"
			};
			return {
				ok: false,
				reason: "unsupported"
			};
		}
	} catch (e) {
		const name = e instanceof Error ? e.name : "";
		if (name === "NotAllowedError") return {
			ok: false,
			reason: "denied"
		};
		if (name === "NotReadableError") return {
			ok: false,
			reason: "busy"
		};
		return {
			ok: false,
			reason: "unsupported"
		};
	}
}
async function startDual() {
	stopDual();
	const r = await openDual();
	if (r.ok) live = r;
	return r;
}
/** Bottom Bud shortcut. Hidden when preference is Top or Hidden, and on composers/live. */
function AskBudFab({ menuOpen }) {
	const shortcut = useCampusStore((s) => resolveBudShortcut(s));
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (shortcut === "hidden" || menuOpen || pathname.startsWith("/bud") || pathname.startsWith("/messages") || pathname.startsWith("/studies") || pathname.startsWith("/board") || pathname.startsWith("/tutor") || pathname.startsWith("/live") || pathname.startsWith("/podcasts") || pathname.startsWith("/welcome") || pathname.startsWith("/spill") || pathname.startsWith("/riff") || pathname.startsWith("/fixer")) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/bud",
		"aria-label": "Ask Bud",
		className: "fixed right-4 z-40 flex h-11 items-center gap-2 rounded-full bg-ink px-4 text-sm font-medium text-paper shadow-soft",
		style: { bottom: "max(1.25rem, calc(env(safe-area-inset-bottom) + 0.75rem))" },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), "Ask Bud"]
	});
}
var ITEMS = [
	{
		id: "post",
		name: "Drop",
		blurb: "Share with Square — photo or video.",
		icon: Image$1
	},
	{
		id: "story",
		name: "Story",
		blurb: "One photo or one video. Gone soon.",
		icon: Image$1
	},
	{
		id: "peek",
		name: "Peek",
		blurb: "Short vertical video. Same Studio.",
		icon: Play
	},
	{
		id: "live",
		name: "Live",
		blurb: "Public broadcast. Policy decides if you’re open.",
		icon: Radio
	}
];
function DropSheet({ onClose }) {
	const panel = (0, import_react.useRef)(null);
	const first = (0, import_react.useRef)(null);
	const setComposeOpen = useCampusStore((s) => s.setComposeOpen);
	const connections = useCampusStore((s) => s.connections);
	const followers = useCampusStore((s) => s.followers);
	const policy = useStudioStore((s) => s.policy);
	const standing = useStudioStore((s) => s.standing);
	const premium = useStudioStore((s) => s.premium);
	const setMode = useStudioStore((s) => s.setMode);
	const setIntent = useStudioStore((s) => s.setIntent);
	const setView = useStudioStore((s) => s.setView);
	const setDest = useStudioStore((s) => s.setDest);
	const live = evaluate("live", {
		startedAt: standing.startedAt,
		connections: connections.length,
		followers: followers.length,
		verified: standing.verified,
		creator: premium,
		strikes: standing.strikes
	}, policy);
	(0, import_react.useEffect)(() => {
		first.current?.focus();
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		function onKey(e) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", onKey);
		return () => {
			document.body.style.overflow = prev;
			window.removeEventListener("keydown", onKey);
		};
	}, [onClose]);
	function openStudio(kind) {
		if (kind === "live") {
			onClose();
			setComposeOpen(true);
			setMode("live");
			setDest("live");
			setView(live.ok ? "camera" : "locked");
			return;
		}
		onClose();
		setIntent(kind === "peek" ? "peek" : kind === "story" ? "story" : "post");
		setMode(kind === "story" ? "story" : kind === "peek" ? "peek" : "post");
		setDest(kind === "story" ? "story" : kind === "peek" ? "peek" : "square");
		setView("camera");
		setComposeOpen(true);
	}
	const sheet = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-[200] flex flex-col justify-end bg-ink/50",
		onClick: onClose,
		role: "presentation",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: panel,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "drop-sheet-title",
			className: "rounded-t-[1.5rem] bg-paper px-4 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-ink shadow-soft",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					id: "drop-sheet-title",
					className: "font-display text-2xl",
					children: "Drop"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Create and share something with your UNIBUD world."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4",
					children: ITEMS.map((item, i) => {
						const why = item.id === "live" && !live.ok ? live.missing[0]?.need : void 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							ref: i === 0 ? first : void 0,
							type: "button",
							className: "flex min-h-14 w-full items-center gap-3 rounded-[1rem] px-2 py-2 text-left focus-visible:ring-2 focus-visible:ring-ring",
							onClick: () => openStudio(item.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-11 shrink-0 place-items-center rounded-full bg-secondary text-ink",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-sm font-semibold",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block text-xs text-muted-foreground",
									children: why ? `Needs ${why}` : item.blurb
								})]
							})]
						}) }, item.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-2 h-11 w-full text-sm text-muted-foreground",
					onClick: onClose,
					children: "Close"
				})
			]
		})
	});
	if (typeof document === "undefined") return sheet;
	return (0, import_react_dom.createPortal)(sheet, document.body);
}
var EFFECTS = [
	{
		id: "none",
		name: "Clear",
		category: "Original",
		kind: "filter",
		css: "none",
		process: "none",
		live: true
	},
	{
		id: "soft",
		name: "Soft",
		category: "Beauty",
		kind: "beauty",
		css: "brightness(1.08) saturate(1.06) contrast(0.96)",
		process: "none",
		live: true
	},
	{
		id: "glow",
		name: "Glow",
		category: "Beauty",
		kind: "beauty",
		css: "brightness(1.12) contrast(1.04) saturate(1.08)",
		process: "bloom",
		live: true
	},
	{
		id: "touch",
		name: "Touch-up",
		category: "Beauty",
		kind: "beauty",
		css: "brightness(1.1) contrast(0.94) saturate(1.04) blur(0.35px)",
		process: "none",
		live: true
	},
	{
		id: "warm",
		name: "Warm",
		category: "Aesthetic",
		kind: "filter",
		css: "sepia(0.22) saturate(1.12) brightness(1.04)",
		process: "none",
		live: true
	},
	{
		id: "cool",
		name: "Cool",
		category: "Aesthetic",
		kind: "filter",
		css: "hue-rotate(12deg) saturate(0.95)",
		process: "none",
		live: true
	},
	{
		id: "food",
		name: "Food",
		category: "Aesthetic",
		kind: "filter",
		css: "saturate(1.3) contrast(1.08)",
		process: "none",
		live: true
	},
	{
		id: "cine",
		name: "Cine",
		category: "Cinematic",
		kind: "filter",
		css: "contrast(1.18) saturate(0.84) brightness(0.96)",
		process: "none",
		live: true
	},
	{
		id: "night",
		name: "Night",
		category: "Cinematic",
		kind: "filter",
		css: "brightness(0.86) contrast(1.22) saturate(0.8)",
		process: "none",
		live: true
	},
	{
		id: "film",
		name: "Film",
		category: "Cinematic",
		kind: "filter",
		css: "contrast(1.08) sepia(0.18) saturate(0.9)",
		process: "none",
		live: true
	},
	{
		id: "fade",
		name: "Fade",
		category: "Aesthetic",
		kind: "filter",
		css: "contrast(0.9) brightness(1.08) saturate(0.85)",
		process: "none",
		live: true
	},
	{
		id: "mono",
		name: "Mono",
		category: "Aesthetic",
		kind: "filter",
		css: "grayscale(1) contrast(1.1)",
		process: "none",
		live: true
	},
	{
		id: "vhs",
		name: "Tape",
		category: "Visual",
		kind: "visual",
		css: "contrast(1.2) saturate(1.3) hue-rotate(-8deg)",
		process: "vhs",
		live: true
	},
	{
		id: "glitch",
		name: "Glitch",
		category: "Visual",
		kind: "visual",
		css: "contrast(1.35) saturate(1.5) hue-rotate(20deg)",
		process: "rgb-split",
		live: true
	},
	{
		id: "rgb",
		name: "Split",
		category: "Visual",
		kind: "visual",
		css: "contrast(1.1) saturate(1.4)",
		process: "rgb-split",
		live: true
	},
	{
		id: "pixel",
		name: "Pixel",
		category: "Visual",
		kind: "visual",
		css: "contrast(1.2) saturate(1.1)",
		process: "pixel",
		live: false
	},
	{
		id: "scan",
		name: "Scan",
		category: "Visual",
		kind: "visual",
		css: "contrast(1.15) grayscale(0.2)",
		process: "scan",
		live: true
	},
	{
		id: "fish",
		name: "Fish",
		category: "Visual",
		kind: "visual",
		css: "contrast(1.08)",
		process: "fisheye",
		live: false
	},
	{
		id: "bloom",
		name: "Bloom",
		category: "Visual",
		kind: "visual",
		css: "brightness(1.18) contrast(1.08) saturate(1.2)",
		process: "bloom",
		live: true
	},
	{
		id: "mirror",
		name: "Mirror",
		category: "Clone",
		kind: "clone",
		css: "none",
		process: "mirror",
		live: true
	},
	{
		id: "twin",
		name: "Twin",
		category: "Clone",
		kind: "clone",
		css: "none",
		process: "clone-split",
		live: true
	},
	{
		id: "echo",
		name: "Echo",
		category: "Clone",
		kind: "clone",
		css: "none",
		process: "clone-echo",
		live: false
	},
	{
		id: "quad",
		name: "Quad",
		category: "Clone",
		kind: "clone",
		css: "none",
		process: "clone-quad",
		live: false
	},
	{
		id: "ghost",
		name: "Ghost",
		category: "Motion",
		kind: "visual",
		css: "contrast(1.08)",
		process: "ghost",
		live: false
	},
	{
		id: "smear",
		name: "Smear",
		category: "Motion",
		kind: "visual",
		css: "blur(1.2px)",
		process: "motion",
		live: true
	},
	{
		id: "kaleido",
		name: "Kaleido",
		category: "Distortion",
		kind: "visual",
		css: "saturate(1.2)",
		process: "kaleido",
		live: false
	},
	{
		id: "portrait",
		name: "Portrait",
		category: "Portrait",
		kind: "beauty",
		css: "brightness(1.06) contrast(1.04) saturate(1.05)",
		process: "none",
		live: true
	},
	{
		id: "key",
		name: "Key light",
		category: "Light",
		kind: "filter",
		css: "brightness(1.14) contrast(1.08)",
		process: "none",
		live: true
	},
	{
		id: "poster",
		name: "Poster",
		category: "Experimental",
		kind: "visual",
		css: "contrast(1.4) saturate(1.3)",
		process: "posterize",
		live: false
	},
	{
		id: "duo",
		name: "Duo",
		category: "Color",
		kind: "visual",
		css: "contrast(1.1) saturate(0.4)",
		process: "duotone",
		live: false
	},
	{
		id: "leak",
		name: "Leak",
		category: "Light",
		kind: "visual",
		css: "brightness(1.08) saturate(1.2)",
		process: "leak",
		live: true
	},
	{
		id: "tunnel",
		name: "Tunnel",
		category: "Distortion",
		kind: "visual",
		css: "contrast(1.12)",
		process: "tunnel",
		live: false
	},
	{
		id: "dream",
		name: "Dream",
		category: "Portrait",
		kind: "beauty",
		css: "brightness(1.08) contrast(0.92) blur(0.4px) saturate(1.08)",
		process: "bloom",
		live: true
	},
	{
		id: "studio-back",
		name: "Studio",
		category: "Backdrop",
		kind: "backdrop",
		css: "contrast(1.1)",
		process: "none",
		live: true
	},
	{
		id: "paper-back",
		name: "Paper",
		category: "Backdrop",
		kind: "backdrop",
		css: "contrast(1.04)",
		process: "none",
		live: true
	},
	{
		id: "enhance-ai",
		name: "Enhance",
		category: "AI",
		kind: "ai",
		css: "contrast(1.12) saturate(1.08) brightness(1.04)",
		process: "none",
		live: true
	},
	{
		id: "depth-ai",
		name: "Depth",
		category: "AI",
		kind: "ai",
		css: "contrast(1.16) brightness(0.98)",
		process: "bloom",
		live: true
	},
	{
		id: "harmattan",
		name: "Harmattan",
		category: "Season",
		kind: "filter",
		css: "sepia(0.35) contrast(1.05) brightness(1.06)",
		process: "none",
		live: true
	},
	{
		id: "rain",
		name: "Rain",
		category: "Season",
		kind: "filter",
		css: "contrast(1.12) saturate(0.7) brightness(0.92)",
		process: "none",
		live: true
	}
];
var EFFECT_CATEGORIES = [
	"For you",
	"Trending",
	"New",
	"Color",
	"Cinematic",
	"Portrait",
	"Beauty",
	"Cinematic",
	"Aesthetic",
	"Light",
	"Motion",
	"Distortion",
	"Visual",
	"Clone",
	"AI",
	"Experimental",
	"Season",
	"Backdrop"
];
function effectById(id) {
	return EFFECTS.find((e) => e.id === id) ?? EFFECTS[0];
}
function effectsIn(cat, recent, favs, q) {
	let list = EFFECTS;
	if (cat === "Recents") list = EFFECTS.filter((e) => recent.includes(e.id));
	else if (cat === "Favourites") list = EFFECTS.filter((e) => favs.includes(e.id));
	else if (cat === "For you" || cat === "Trending" || cat === "New" || cat === "Popular") list = EFFECTS;
	else if (cat === "Color") list = EFFECTS.filter((e) => e.category === "Aesthetic" || e.category === "Color" || e.kind === "filter");
	else if (cat === "Funny") list = EFFECTS.filter((e) => e.kind === "visual" || e.id === "glitch");
	else list = EFFECTS.filter((e) => e.category === cat || e.kind === cat.toLowerCase());
	if (q.trim()) list = list.filter((e) => e.name.toLowerCase().includes(q.toLowerCase()) || e.category.toLowerCase().includes(q.toLowerCase()));
	return list;
}
var FILTERS = [
	{
		id: "original",
		name: "Original",
		category: "Original",
		css: "none"
	},
	{
		id: "natural",
		name: "Natural",
		category: "Natural",
		css: "saturate(1.08) contrast(1.04)"
	},
	{
		id: "soft",
		name: "Soft light",
		category: "Portrait",
		css: "contrast(0.94) saturate(1.06) brightness(1.06)"
	},
	{
		id: "studio",
		name: "Studio",
		category: "Portrait",
		css: "contrast(1.12) saturate(0.92) brightness(1.04)"
	},
	{
		id: "cine",
		name: "Cine",
		category: "Cinematic",
		css: "contrast(1.18) saturate(0.86) brightness(0.96)"
	},
	{
		id: "noir-teal",
		name: "Teal night",
		category: "Cinematic",
		css: "contrast(1.2) saturate(0.8) hue-rotate(-12deg)"
	},
	{
		id: "film",
		name: "Film",
		category: "Vintage",
		css: "contrast(1.08) sepia(0.18) saturate(0.9)"
	},
	{
		id: "fade",
		name: "Fade",
		category: "Vintage",
		css: "contrast(0.9) brightness(1.08) saturate(0.85)"
	},
	{
		id: "mono",
		name: "Mono",
		category: "Black & White",
		css: "grayscale(1) contrast(1.1)"
	},
	{
		id: "silver",
		name: "Silver",
		category: "Black & White",
		css: "grayscale(1) contrast(0.92) brightness(1.08)"
	},
	{
		id: "warm",
		name: "Warm",
		category: "Warm",
		css: "sepia(0.22) saturate(1.15) brightness(1.04)"
	},
	{
		id: "honey",
		name: "Honey",
		category: "Warm",
		css: "sepia(0.35) saturate(1.2) contrast(1.05)"
	},
	{
		id: "cool",
		name: "Cool",
		category: "Cool",
		css: "hue-rotate(12deg) saturate(0.95) brightness(1.02)"
	},
	{
		id: "night",
		name: "Night",
		category: "Night",
		css: "brightness(0.88) contrast(1.22) saturate(0.8)"
	},
	{
		id: "urban",
		name: "Urban",
		category: "Urban",
		css: "contrast(1.16) saturate(0.78)"
	},
	{
		id: "food",
		name: "Food",
		category: "Food",
		css: "saturate(1.28) contrast(1.08) brightness(1.04)"
	},
	{
		id: "minimal",
		name: "Minimal",
		category: "Minimal",
		css: "saturate(0.7) contrast(1.04) brightness(1.06)"
	},
	{
		id: "lux",
		name: "Lux",
		category: "Premium",
		premium: true,
		css: "contrast(1.14) saturate(1.1) brightness(1.05)"
	},
	{
		id: "opal",
		name: "Opal",
		category: "Premium",
		premium: true,
		css: "contrast(1.08) saturate(0.7) brightness(1.1)"
	}
];
var FILTER_CATEGORIES = [...new Set(FILTERS.map((f) => f.category))];
function filterById(id) {
	return FILTERS.find((f) => f.id === id) ?? FILTERS[0];
}
function adjustCss(a) {
	return `brightness(${1 + a.exposure * .35 + a.highlights * .08 - a.shadows * .04}) contrast(${1 + a.contrast * .4 + a.clarity * .15}) saturate(${1 + a.saturation * .5 + a.vibrance * .25}) hue-rotate(${a.temperature * -12 + a.tint * 8}deg) blur(${a.sharpness < 0 ? `${Math.abs(a.sharpness) * 1.4}px` : "0px"}) opacity(${1 - a.fade * .25})`;
}
function composedCss(a, filterId, amount) {
	const f = filterById(filterId);
	const mix = Math.max(0, Math.min(1, amount));
	if (f.id === "original" || mix === 0) return adjustCss(a);
	return `${adjustCss(a)} ${f.css}`;
}
var GREEN_KEY = {
	r: 48,
	g: 178,
	b: 72,
	tolerance: .38,
	feather: .16
};
function keyFrame(data, key) {
	const d = data.data;
	const kr = key.r / 255;
	const kg = key.g / 255;
	const kb = key.b / 255;
	const t0 = Math.max(.04, key.tolerance - key.feather);
	const t1 = key.tolerance + key.feather;
	for (let i = 0; i < d.length; i += 4) {
		const r = d[i] / 255;
		const g = d[i + 1] / 255;
		const b = d[i + 2] / 255;
		const dist = Math.hypot(r - kr, g - kg, b - kb);
		let a = 1;
		if (dist < t0) a = 0;
		else if (dist < t1) a = (dist - t0) / (t1 - t0);
		d[i + 3] = Math.round(d[i + 3] * a);
	}
	return data;
}
function compositeKey(ctx, w, h, plate, key = GREEN_KEY) {
	const fg = ctx.getImageData(0, 0, w, h);
	keyFrame(fg, key);
	ctx.clearRect(0, 0, w, h);
	if (typeof plate === "string") {
		ctx.fillStyle = plate;
		ctx.fillRect(0, 0, w, h);
	} else ctx.drawImage(plate, 0, 0, w, h);
	const tmp = document.createElement("canvas");
	tmp.width = w;
	tmp.height = h;
	const tctx = tmp.getContext("2d");
	if (!tctx) return;
	tctx.putImageData(fg, 0, 0);
	ctx.drawImage(tmp, 0, 0);
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("Could not load image"));
		img.src = src;
	});
}
function processCanvas(ctx, canvas, process) {
	if (process === "none") return;
	const w = canvas.width;
	const h = canvas.height;
	if (process === "rgb-split") {
		const src = ctx.getImageData(0, 0, w, h);
		const out = ctx.createImageData(w, h);
		const s = src.data;
		const d = out.data;
		const ox = 6;
		for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
			const i = (y * w + x) * 4;
			const r = (y * w + Math.min(w - 1, x + ox)) * 4;
			const b = (y * w + Math.max(0, x - ox)) * 4;
			d[i] = s[r];
			d[i + 1] = s[i + 1];
			d[i + 2] = s[b + 2];
			d[i + 3] = s[i + 3];
		}
		ctx.putImageData(out, 0, 0);
		return;
	}
	if (process === "pixel") {
		const s = 18;
		ctx.imageSmoothingEnabled = false;
		const tmp = document.createElement("canvas");
		tmp.width = Math.max(1, Math.floor(w / s));
		tmp.height = Math.max(1, Math.floor(h / s));
		const tctx = tmp.getContext("2d");
		if (!tctx) return;
		tctx.drawImage(canvas, 0, 0, tmp.width, tmp.height);
		ctx.imageSmoothingEnabled = false;
		ctx.clearRect(0, 0, w, h);
		ctx.drawImage(tmp, 0, 0, w, h);
		return;
	}
	if (process === "scan" || process === "vhs") {
		ctx.fillStyle = "rgba(0,0,0,0.18)";
		for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
		if (process === "vhs") {
			ctx.fillStyle = "rgba(0,180,255,0.06)";
			ctx.fillRect(0, 0, w, h);
		}
		return;
	}
	if (process === "mirror" || process === "clone-split") {
		const half = Math.floor(w / 2);
		const left = ctx.getImageData(0, 0, half, h);
		ctx.putImageData(left, 0, 0);
		ctx.save();
		ctx.translate(w, 0);
		ctx.scale(-1, 1);
		ctx.drawImage(canvas, 0, 0, half, h, 0, 0, half, h);
		ctx.restore();
		return;
	}
	if (process === "clone-echo") {
		ctx.globalAlpha = .35;
		ctx.drawImage(canvas, 18, 0);
		ctx.globalAlpha = .2;
		ctx.drawImage(canvas, 36, 0);
		ctx.globalAlpha = 1;
		return;
	}
	if (process === "bloom") {
		ctx.save();
		ctx.globalCompositeOperation = "screen";
		ctx.filter = "blur(8px) brightness(1.15)";
		ctx.drawImage(canvas, 0, 0);
		ctx.restore();
		ctx.filter = "none";
		return;
	}
	if (process === "fisheye") {
		const src = ctx.getImageData(0, 0, w, h);
		const out = ctx.createImageData(w, h);
		const cx = w / 2;
		const cy = h / 2;
		for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) {
			const dx = (x - cx) / cx;
			const dy = (y - cy) / cy;
			const r = Math.hypot(dx, dy);
			const nr = r * r;
			const sx = Math.round(cx + dx * nr * cx);
			const sy = Math.round(cy + dy * nr * cy);
			if (sx < 0 || sy < 0 || sx >= w || sy >= h) continue;
			const si = (sy * w + sx) * 4;
			const di = (y * w + x) * 4;
			out.data[di] = src.data[si];
			out.data[di + 1] = src.data[si + 1];
			out.data[di + 2] = src.data[si + 2];
			out.data[di + 3] = 255;
		}
		ctx.putImageData(out, 0, 0);
		return;
	}
	if (process === "clone-quad") {
		const tmp = document.createElement("canvas");
		tmp.width = w;
		tmp.height = h;
		tmp.getContext("2d")?.drawImage(canvas, 0, 0);
		ctx.clearRect(0, 0, w, h);
		const tw = w / 2;
		const th = h / 2;
		for (const [dx, dy, fx, fy] of [
			[
				0,
				0,
				1,
				1
			],
			[
				tw,
				0,
				-1,
				1
			],
			[
				0,
				th,
				1,
				-1
			],
			[
				tw,
				th,
				-1,
				-1
			]
		]) {
			ctx.save();
			ctx.translate(dx + (fx < 0 ? tw : 0), dy + (fy < 0 ? th : 0));
			ctx.scale(fx, fy);
			ctx.drawImage(tmp, 0, 0, w, h, 0, 0, tw, th);
			ctx.restore();
		}
		return;
	}
	if (process === "ghost") {
		ctx.globalAlpha = .45;
		ctx.drawImage(canvas, 12, 8);
		ctx.globalCompositeOperation = "screen";
		ctx.globalAlpha = .25;
		ctx.drawImage(canvas, -10, -6);
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = "source-over";
		return;
	}
	if (process === "motion") {
		ctx.save();
		ctx.globalAlpha = .35;
		ctx.drawImage(canvas, 10, 0);
		ctx.drawImage(canvas, 20, 0);
		ctx.restore();
		return;
	}
	if (process === "kaleido") {
		const tmp = document.createElement("canvas");
		tmp.width = w;
		tmp.height = h;
		tmp.getContext("2d")?.drawImage(canvas, 0, 0);
		ctx.save();
		ctx.translate(w / 2, h / 2);
		for (let i = 0; i < 6; i++) {
			ctx.save();
			ctx.rotate(i * Math.PI / 3);
			ctx.drawImage(tmp, -w / 4, -h / 4, w / 2, h / 2);
			ctx.restore();
		}
		ctx.restore();
		return;
	}
	if (process === "posterize") {
		const img = ctx.getImageData(0, 0, w, h);
		const d = img.data;
		const steps = 5;
		for (let i = 0; i < d.length; i += 4) {
			d[i] = Math.round(d[i] / (255 / steps)) * (255 / steps);
			d[i + 1] = Math.round(d[i + 1] / (255 / steps)) * (255 / steps);
			d[i + 2] = Math.round(d[i + 2] / (255 / steps)) * (255 / steps);
		}
		ctx.putImageData(img, 0, 0);
		return;
	}
	if (process === "duotone") {
		const img = ctx.getImageData(0, 0, w, h);
		const d = img.data;
		for (let i = 0; i < d.length; i += 4) {
			const l = (d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11) / 255;
			d[i] = Math.round(40 + l * 200);
			d[i + 1] = Math.round(20 + l * 90);
			d[i + 2] = Math.round(80 + l * 140);
		}
		ctx.putImageData(img, 0, 0);
		return;
	}
	if (process === "leak") {
		const g = ctx.createRadialGradient(w * .15, h * .1, 10, w * .15, h * .1, w * .55);
		g.addColorStop(0, "rgba(255,160,60,0.45)");
		g.addColorStop(1, "rgba(255,160,60,0)");
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, w, h);
		return;
	}
	if (process === "tunnel") {
		ctx.save();
		ctx.translate(w / 2, h / 2);
		ctx.scale(1.25, 1.25);
		ctx.drawImage(canvas, -w / 2, -h / 2);
		ctx.restore();
	}
}
function drawOverlays$1(ctx, canvas, overlays) {
	ctx.filter = "none";
	ctx.textAlign = "center";
	overlays.forEach((o) => {
		const x = o.x / 100 * canvas.width;
		const y = o.y / 100 * canvas.height;
		ctx.font = o.kind === "sticker" ? `${Math.round(canvas.width * .08)}px sans-serif` : `600 ${Math.round(canvas.width * .045)}px "DM Sans", sans-serif`;
		ctx.fillStyle = "#fff";
		ctx.strokeStyle = "rgba(0,0,0,0.45)";
		ctx.lineWidth = 4;
		ctx.strokeText(o.text, x, y);
		ctx.fillText(o.text, x, y);
	});
}
async function rasterize(src, adjust, filterId, amount, effectId = "none", overlays = [], chroma) {
	const img = await loadImage(src);
	const canvas = document.createElement("canvas");
	const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
	canvas.width = Math.max(1, Math.round(img.width * scale));
	canvas.height = Math.max(1, Math.round(img.height * scale));
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("No canvas");
	const fx = effectById(effectId);
	ctx.filter = composedCss(adjust, filterId, amount);
	if (fx.css !== "none") ctx.filter = `${ctx.filter} ${fx.css}`;
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	ctx.filter = "none";
	processCanvas(ctx, canvas, fx.process);
	if (adjust.vignette > .02) {
		const g = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width * .2, canvas.width / 2, canvas.height / 2, canvas.width * .75);
		g.addColorStop(0, "rgba(0,0,0,0)");
		g.addColorStop(1, `rgba(0,0,0,${.55 * adjust.vignette})`);
		ctx.fillStyle = g;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
	if (adjust.grain > .05) {
		const n = ctx.getImageData(0, 0, canvas.width, canvas.height);
		const d = n.data;
		const str = adjust.grain * 28;
		for (let i = 0; i < d.length; i += 16) {
			const v = (Math.random() - .5) * str;
			d[i] = Math.max(0, Math.min(255, d[i] + v));
			d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + v));
			d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + v));
		}
		ctx.putImageData(n, 0, 0);
	}
	if (chroma?.on) compositeKey(ctx, canvas.width, canvas.height, chroma.plate, {
		...GREEN_KEY,
		tolerance: chroma.tolerance,
		feather: chroma.feather
	});
	if (overlays.length) drawOverlays$1(ctx, canvas, overlays);
	return canvas.toDataURL("image/jpeg", .9);
}
function rotateDataUrl(src, deg) {
	return loadImage(src).then((img) => {
		const canvas = document.createElement("canvas");
		const swap = Math.abs(deg) === 90;
		canvas.width = swap ? img.height : img.width;
		canvas.height = swap ? img.width : img.height;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("No canvas");
		ctx.translate(canvas.width / 2, canvas.height / 2);
		ctx.rotate(deg * Math.PI / 180);
		ctx.drawImage(img, -img.width / 2, -img.height / 2);
		return canvas.toDataURL("image/jpeg", .92);
	});
}
function flipDataUrl(src) {
	return loadImage(src).then((img) => {
		const canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("No canvas");
		ctx.translate(canvas.width, 0);
		ctx.scale(-1, 1);
		ctx.drawImage(img, 0, 0);
		return canvas.toDataURL("image/jpeg", .92);
	});
}
function createFaceRuntime() {
	const Ctor = window.FaceDetector;
	if (!Ctor) return {
		id: "none",
		ready: false,
		detect: async () => []
	};
	const det = new Ctor({ fastMode: true });
	return {
		id: "shape-detection",
		ready: true,
		detect: async (source) => {
			try {
				return (await det.detect(source)).map((h) => ({
					x: h.boundingBox.x,
					y: h.boundingBox.y,
					width: h.boundingBox.width,
					height: h.boundingBox.height
				}));
			} catch {
				return [];
			}
		}
	};
}
var MAX = 83886080;
async function pickDeviceMedia(opts) {
	const multiple = opts?.multiple !== false;
	const picker = window.showOpenFilePicker;
	try {
		if (picker) {
			const handles = await picker({
				multiple,
				types: [{
					description: "Photos and videos",
					accept: {
						"image/*": [
							".png",
							".jpg",
							".jpeg",
							".webp",
							".heic"
						],
						"video/*": [
							".mp4",
							".webm",
							".mov"
						]
					}
				}]
			});
			const files = await Promise.all(handles.map((h) => h.getFile()));
			if (!files.length) return {
				ok: false,
				reason: "empty"
			};
			if (files.some((f) => f.size > MAX)) return {
				ok: false,
				reason: "too-large"
			};
			return {
				ok: true,
				files
			};
		}
		return {
			ok: false,
			reason: "unavailable"
		};
	} catch (e) {
		const name = e instanceof Error ? e.name : "";
		if (name === "AbortError") return {
			ok: false,
			reason: "cancelled"
		};
		if (name === "NotAllowedError" || name === "SecurityError") return {
			ok: false,
			reason: "denied"
		};
		return {
			ok: false,
			reason: "unavailable"
		};
	}
}
function filesFromInput(list) {
	const files = [...list ?? []];
	if (!files.length) return {
		ok: false,
		reason: "empty"
	};
	if (files.some((f) => f.size > MAX)) return {
		ok: false,
		reason: "too-large"
	};
	return {
		ok: true,
		files
	};
}
function pickReasonCopy(r) {
	if (r === "denied") return "UNIBUD can’t read files until this browser allows it.";
	if (r === "cancelled") return "Nothing imported.";
	if (r === "too-large") return "Keep each file under 80 MB on this path.";
	if (r === "empty") return "No files in that pick.";
	return "This browser uses the Files button, not the phone Photos app.";
}
function rightsForOriginal(audio, _surface) {
	if (audio.status === "removed" || audio.status === "restricted") return {
		useAudio: false,
		preview: false,
		share: false,
		listenExternal: false,
		reason: audio.status
	};
	if (audio.sourceType === "LICENSED_MUSIC" && audio.licensingStatus !== "cleared") return {
		useAudio: false,
		preview: audio.licensingStatus === "preview",
		share: true,
		listenExternal: true,
		reason: "not-cleared"
	};
	return {
		useAudio: true,
		preview: Boolean(audio.src),
		share: true,
		listenExternal: Boolean(audio.listenUrl)
	};
}
function dur(ms) {
	if (!ms) return "";
	const s = Math.round(ms / 1e3);
	return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
function attach(a) {
	const studio = useStudioStore.getState();
	studio.snapshot();
	studio.addMix({
		id: `oa-${a.audioId}`,
		kind: "catalogue",
		name: a.title,
		src: a.src,
		volume: .85,
		mute: false,
		fadeIn: 0,
		fadeOut: 0,
		trackId: a.audioId,
		artistName: a.creatorHandle ?? a.artistName
	});
	studio.setMusicRef({
		providerId: a.providerId ?? "unibud-original",
		trackId: a.audioId,
		audioId: a.audioId,
		title: a.title,
		artistName: a.artistName ?? a.creatorHandle,
		startMs: 0,
		durationMs: a.durationMs,
		entitlement: a.licensingStatus === "cleared" ? "free" : "preview",
		sourceType: a.sourceType === "LICENSED_MUSIC" ? "LICENSED_MUSIC" : "ORIGINAL_AUDIO",
		creatorHandle: a.creatorHandle
	});
}
function AudioSheet({ onClose, embedded }) {
	const originals = useCampusStore((s) => s.originalAudios ?? []);
	const savedIds = useCampusStore((s) => s.savedAudioIds ?? []);
	const following = useCampusStore((s) => s.following);
	const saveAudio = useCampusStore((s) => s.saveAudio);
	const unsaveAudio = useCampusStore((s) => s.unsaveAudio);
	const mix = useStudioStore((s) => s.mix);
	const musicRef = useStudioStore((s) => s.musicRef);
	const removeMix = useStudioStore((s) => s.removeMix);
	const [lane, setLane] = (0, import_react.useState)("foryou");
	const [q, setQ] = (0, import_react.useState)("");
	const [previewId, setPreviewId] = (0, import_react.useState)(null);
	const audioRef = (0, import_react.useRef)(null);
	const live = originals.filter((a) => a.status !== "removed");
	const needle = q.trim().toLowerCase();
	const list = (0, import_react.useMemo)(() => {
		let rows = live;
		if (lane === "saved") rows = live.filter((a) => savedIds.includes(a.audioId));
		else if (lane === "trending") rows = [...live].sort((a, b) => b.usageCount - a.usageCount);
		else if (lane === "foryou") {
			const followed = live.filter((a) => a.creatorHandle && following.includes(a.creatorHandle));
			const saved = live.filter((a) => savedIds.includes(a.audioId));
			const rest = live.filter((a) => !followed.includes(a) && !saved.includes(a));
			rows = [
				...followed,
				...saved,
				...rest
			];
		}
		if (!needle) return rows;
		return rows.filter((a) => a.title.toLowerCase().includes(needle) || (a.creatorHandle ?? "").toLowerCase().includes(needle) || (a.artistName ?? "").toLowerCase().includes(needle));
	}, [
		live,
		lane,
		savedIds,
		following,
		needle
	]);
	function preview(a) {
		if (!a.src) return;
		setPreviewId(a.audioId);
		const el = audioRef.current;
		if (!el) return;
		el.src = a.src;
		el.play().catch(() => {});
	}
	function useIt(a) {
		if (!rightsForOriginal(a, "PEAK").useAudio) return;
		attach(a);
		recordAudioEvent({
			kind: "use",
			audioId: a.audioId,
			surface: "peek"
		});
		onClose?.();
	}
	const body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-paper/60",
			children: "Add music or original audio to your Drop, Story, or Peek."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value: q,
			onChange: (e) => setQ(e.target.value),
			placeholder: "Search music, songs, artists, or sounds…",
			className: "mt-3 h-11 w-full rounded-full bg-paper/10 px-4 text-sm outline-none placeholder:text-paper/40"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex gap-4 overflow-x-auto text-[13px] font-semibold",
			children: [
				["foryou", "For You"],
				["trending", "Trending"],
				["original", "Original"],
				["saved", "Saved"]
			].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: cn("shrink-0 pb-1", lane === id ? "text-paper" : "text-paper/40"),
				onClick: () => setLane(id),
				children: label
			}, id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 max-h-[46vh] space-y-1 overflow-y-auto",
			children: [
				!UnibudMusic.ready() && (lane === "foryou" || q.trim()) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-[11px] text-paper/45",
					children: "Music catalogue — licensed songs appear here when a partner is connected."
				}) : null,
				list.map((a) => {
					const saved = savedIds.includes(a.audioId);
					const kind = a.sourceType === "LICENSED_MUSIC" ? "Song" : a.sourceType === "EXTERNAL_MUSIC_REFERENCE" ? "Listen" : "Original audio";
					const who = a.creatorHandle ? `@${a.creatorHandle}` : a.artistName ?? "";
					const canUse = rightsForOriginal(a, "PEAK").useAudio;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-2xl px-1 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 shrink-0 place-items-center rounded-xl bg-paper/10 text-[10px] font-semibold",
								onClick: () => preview(a),
								"aria-label": `Preview ${a.title}`,
								children: a.artwork ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: a.artwork,
									alt: "",
									className: "size-11 rounded-xl object-cover"
								}) : previewId === a.audioId ? "▶" : "♪"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "min-w-0 flex-1 text-left",
								onClick: () => preview(a),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-medium",
									children: a.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate text-[11px] text-paper/55",
									children: [
										kind,
										who ? ` · ${who}` : "",
										dur(a.durationMs) ? ` · ${dur(a.durationMs)}` : "",
										a.usageCount > 1 ? ` · ${a.usageCount} uses` : ""
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-10 place-items-center",
								"aria-label": saved ? "Unsave" : "Save",
								onClick: () => saved ? unsaveAudio(a.audioId) : saveAudio(a.audioId),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("size-4", saved && "fill-paper") })
							}),
							canUse ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-9 rounded-full bg-paper px-3 text-xs font-semibold text-ink",
								onClick: () => useIt(a),
								children: "Use"
							}) : a.listenUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: a.listenUrl,
								target: "_blank",
								rel: "noreferrer",
								className: "h-9 rounded-full bg-paper/10 px-3 text-xs leading-9",
								children: "Listen"
							}) : null
						]
					}, a.audioId);
				}),
				lane === "saved" && !list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-6 text-center text-xs text-paper/50",
					children: "Save audio you like. It stays here for Drops, Stories, and Peeks."
				}) : null,
				lane !== "saved" && !list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-6 text-center text-xs text-paper/50",
					children: "No original audio matches that yet."
				}) : null
			]
		}),
		musicRef ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-[11px] text-paper/70",
			children: [
				"On this ",
				musicRef.sourceType === "ORIGINAL_AUDIO" ? "original" : "track",
				": ",
				musicRef.title,
				musicRef.creatorHandle ? ` · @${musicRef.creatorHandle}` : ""
			]
		}) : null,
		mix.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 space-y-1",
			children: mix.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between text-xs text-paper/70",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: t.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => removeMix(t.id),
					children: "Remove"
				})]
			}, t.id))
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
			ref: audioRef,
			className: "hidden"
		})
	] });
	if (embedded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-paper",
		children: body
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-x-0 bottom-0 z-30 rounded-t-[1.5rem] bg-ink/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold",
				children: "Audio"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-10 px-2 text-sm text-paper/60",
				onClick: onClose,
				children: "Close"
			})]
		}), body]
	});
}
var MODES = [
	{
		id: "post",
		label: "Drop"
	},
	{
		id: "story",
		label: "Story"
	},
	{
		id: "peek",
		label: "Peek"
	},
	{
		id: "live",
		label: "Live"
	}
];
function CameraStage({ onClose }) {
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const recRef = (0, import_react.useRef)(null);
	const chunks = (0, import_react.useRef)([]);
	const hold = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [denied, setDenied] = (0, import_react.useState)(false);
	const [recording, setRecording] = (0, import_react.useState)(false);
	const [seconds, setSeconds] = (0, import_react.useState)(0);
	const [tray, setTray] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const facing = useStudioStore((s) => s.facing);
	const setFacing = useStudioStore((s) => s.setFacing);
	const zoom = useStudioStore((s) => s.zoom);
	const setZoom = useStudioStore((s) => s.setZoom);
	const mode = useStudioStore((s) => s.mode);
	const setMode = useStudioStore((s) => s.setMode);
	const prefs = useStudioStore((s) => s.prefs);
	const patchPrefs = useStudioStore((s) => s.patchPrefs);
	const setImage = useStudioStore((s) => s.setImage);
	const setVideo = useStudioStore((s) => s.setVideo);
	const addClip = useStudioStore((s) => s.addClip);
	const addLibrary = useStudioStore((s) => s.addLibrary);
	const setView = useStudioStore((s) => s.setView);
	const library = useStudioStore((s) => s.library);
	const effectId = useStudioStore((s) => s.effectId);
	useStudioStore((s) => s.setEffect);
	const policy = useStudioStore((s) => s.policy);
	const standing = useStudioStore((s) => s.standing);
	const premium = useStudioStore((s) => s.premium);
	const connections = useCampusStore((s) => s.connections);
	const followers = useCampusStore((s) => s.followers);
	const last = library[0];
	const fx = effectById(effectId);
	const liveOk = evaluate("live", {
		startedAt: standing.startedAt,
		connections: connections.length,
		followers: followers.length,
		verified: standing.verified,
		creator: premium,
		strikes: standing.strikes
	}, policy);
	(0, import_react.useEffect)(() => {
		let stop = false;
		async function boot() {
			setDenied(false);
			setReady(false);
			streamRef.current?.getTracks().forEach((t) => t.stop());
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: prefs.audio && mode !== "post",
					video: {
						facingMode: facing,
						width: { ideal: prefs.quality === "1080" ? 1920 : 1280 },
						frameRate: { ideal: prefs.fps }
					}
				});
				if (stop) {
					stream.getTracks().forEach((t) => t.stop());
					return;
				}
				streamRef.current = stream;
				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					await videoRef.current.play().catch(() => {});
				}
				setReady(true);
			} catch {
				setDenied(true);
			}
		}
		boot();
		return () => {
			stop = true;
			streamRef.current?.getTracks().forEach((t) => t.stop());
		};
	}, [
		facing,
		mode,
		prefs.audio,
		prefs.fps,
		prefs.quality
	]);
	(0, import_react.useEffect)(() => {
		if (!recording) return;
		const t = window.setInterval(() => setSeconds((n) => n + 1), 1e3);
		return () => window.clearInterval(t);
	}, [recording]);
	function snap() {
		const v = videoRef.current;
		if (!v) return;
		const canvas = document.createElement("canvas");
		canvas.width = v.videoWidth || 1080;
		canvas.height = v.videoHeight || 1440;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		if (facing === "user" && prefs.mirrorFront) {
			ctx.translate(canvas.width, 0);
			ctx.scale(-1, 1);
		}
		ctx.filter = fx.css === "none" ? "none" : fx.css;
		ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
		ctx.filter = "none";
		processCanvas(ctx, canvas, fx.process);
		const chroma = useStudioStore.getState().chroma;
		if (chroma.on) compositeKey(ctx, canvas.width, canvas.height, chroma.plate, {
			...GREEN_KEY,
			tolerance: chroma.tolerance,
			feather: chroma.feather
		});
		const url = canvas.toDataURL("image/jpeg", .92);
		addLibrary({
			id: `lib-${Date.now()}`,
			kind: "photo",
			src: url,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		if (prefs.dual) return;
		setImage(url, url);
	}
	function startRec() {
		const stream = streamRef.current;
		if (!stream) return;
		chunks.current = [];
		const rec = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : void 0 });
		rec.ondataavailable = (e) => {
			if (e.data.size) chunks.current.push(e.data);
		};
		rec.onstop = () => {
			const blob = new Blob(chunks.current, { type: rec.mimeType || "video/webm" });
			const url = URL.createObjectURL(blob);
			addLibrary({
				id: `lib-${Date.now()}`,
				kind: "video",
				src: url,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			addClip({
				id: `c-${Date.now()}`,
				src: url,
				duration: seconds,
				trimStart: 0,
				trimEnd: seconds,
				speed: 1,
				reverse: Boolean(prefs.handsFree && seconds > 0 && seconds < 4)
			});
			setVideo(url);
		};
		rec.start();
		recRef.current = rec;
		setSeconds(0);
		setRecording(true);
	}
	function stopRec() {
		recRef.current?.stop();
		recRef.current = null;
		setRecording(false);
	}
	function ingestFiles(files) {
		const list = mode === "story" ? files.slice(0, 1) : files;
		if (mode === "story" && files.length > 1) toast.message("One photo or one video per Story.");
		if (!list.length) return;
		list.forEach((f, i) => {
			const src = URL.createObjectURL(f);
			const kind = f.type.startsWith("video") ? "video" : "photo";
			addLibrary({
				id: `lib-${Date.now()}-${i}`,
				kind,
				src,
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			});
			if (i > 0 && mode !== "story") {
				if (kind === "video") addClip({
					id: `c-${Date.now()}-${i}`,
					src,
					duration: 8,
					trimStart: 0,
					trimEnd: 8,
					speed: 1
				});
				return;
			}
			if (kind === "video") {
				addClip({
					id: `c-${Date.now()}`,
					src,
					duration: 8,
					trimStart: 0,
					trimEnd: 8,
					speed: 1
				});
				setVideo(src);
			} else setImage(src, src);
		});
	}
	function openGallery() {
		pickDeviceMedia({ multiple: mode !== "story" }).then((r) => {
			if (r.ok) {
				ingestFiles(r.files);
				return;
			}
			if (r.reason === "unavailable" || r.reason === "denied") fileRef.current?.click();
			else toast.message(pickReasonCopy(r.reason));
		});
	}
	async function fire() {
		if (mode === "live") {
			if (!liveOk.ok) {
				setView("locked");
				return;
			}
			setView("live");
			return;
		}
		if (prefs.timer) {
			toast.message(`${prefs.timer}`);
			await new Promise((r) => setTimeout(r, prefs.timer * 1e3));
		}
		if (prefs.handsFree && (mode === "peek" || mode === "post" || mode === "story")) {
			startRec();
			window.setTimeout(() => stopRec(), 4e3);
			return;
		}
		if (mode === "peek" || recording) {
			if (recording) stopRec();
			else startRec();
			return;
		}
		snap();
	}
	function onShutterDown() {
		if (mode === "live" || mode === "peek") return;
		hold.current = window.setTimeout(() => startRec(), 280);
	}
	function onShutterUp() {
		if (hold.current) {
			window.clearTimeout(hold.current);
			hold.current = null;
			if (!recording && mode !== "peek" && mode !== "live") fire();
		}
		if (recording && mode !== "peek") stopRec();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-ink text-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mx-1.5 mt-[max(0.4rem,env(safe-area-inset-top))] min-h-0 flex-1 overflow-hidden rounded-[2.35rem] bg-ink",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						playsInline: true,
						muted: true,
						className: "absolute inset-0 size-full object-cover",
						style: {
							filter: fx.css === "none" ? void 0 : fx.css,
							transform: `scale(${zoom}) ${facing === "user" && prefs.mirrorFront ? "scaleX(-1)" : ""} ${fx.process === "mirror" ? "scaleX(-1)" : ""}`
						}
					}),
					prefs.grid !== "off" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GridOverlay, { kind: prefs.grid }) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChromaLayer, { videoRef }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaceLayer, { videoRef }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DualLayer, {}),
					prefs.teleprompter && prompt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pointer-events-none absolute inset-x-6 bottom-36 text-center text-lg text-paper/90",
						children: prompt
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative z-10 flex items-center justify-between px-3 pt-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "glass-circle",
								onClick: onClose,
								"aria-label": "Close",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							}),
							mode === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "glass rounded-full px-3 py-1 text-sm",
								children: "Everyone"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
									on: prefs.flash !== "off",
									onClick: () => patchPrefs({ flash: prefs.flash === "off" ? "on" : "off" }),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bolt, { className: "size-4" })
								}), zoom > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "glass-circle text-xs font-semibold",
									onClick: () => setZoom(1),
									children: [zoom.toFixed(1), "×"]
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "glass-circle",
								"aria-label": "Lens",
								onClick: () => setTray(tray === "lens" ? null : "lens"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "size-5" })
							})
						]
					}),
					mode === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						placeholder: "Title…",
						className: "absolute inset-x-8 bottom-36 z-10 bg-transparent text-center font-display text-2xl text-paper outline-none placeholder:text-paper/50"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute top-24 right-3 z-10 flex flex-col gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "glass-circle",
							"aria-label": "Looks",
							onClick: () => setTray("looks"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-[18px]" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "glass-circle",
							"aria-label": "Mix",
							onClick: () => setTray("mix"),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Music, { className: "size-[18px]" })
						})]
					}),
					tray === "lens" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LensSheet, {
						onClose: () => setTray(null),
						onWrite: () => setView("write"),
						onPrompt: () => setTray("prompt")
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "glass-ink absolute right-4 bottom-28 z-10 rounded-lg px-1.5 py-1 text-[10px] font-semibold tracking-wide",
						children: [prefs.quality === "1080" ? "1080" : "720", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[8px] font-medium text-paper/70",
							children: "HD"
						})]
					}),
					denied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-8 top-36 z-10 rounded-2xl bg-ink/80 p-5 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: "Camera needs permission"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-paper/70",
								children: "Allow camera, or open Media."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-3 text-sm font-semibold",
								onClick: openGallery,
								children: "Media"
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-x-0 bottom-5 z-10 flex items-end justify-center gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": recording ? "Stop" : mode === "live" ? "Go live" : "Capture",
							onClick: () => {
								if (mode === "peek" || mode === "live") fire();
							},
							onPointerDown: onShutterDown,
							onPointerUp: onShutterUp,
							onPointerCancel: onShutterUp,
							className: "shutter",
							"data-rec": recording ? "true" : void 0,
							"data-live": mode === "live" ? "true" : void 0
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "absolute right-[18%] bottom-1 size-12 overflow-hidden rounded-full shadow-[inset_0_0_0_2px_rgb(255_255_255_/_.85)]",
							"aria-label": "Media",
							onClick: openGallery,
							children: last ? last.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
								src: last.src,
								className: "size-full object-cover",
								muted: true
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: last.src,
								alt: "",
								className: "size-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid size-full place-items-center bg-paper/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid2x2, { className: "size-4" })
							})
						})]
					}),
					recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "absolute bottom-28 left-1/2 z-10 -translate-x-1/2 text-xs tabular-nums",
						children: [seconds, "s"]
					}) : null,
					ready || denied ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "absolute bottom-36 left-1/2 z-10 -translate-x-1/2 text-xs text-paper/60",
						children: "Starting camera…"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 py-3 pb-[max(0.85rem,env(safe-area-inset-bottom))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "glass-circle",
						"aria-label": "Media",
						onClick: openGallery,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Grid2x2, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "cam-modes glass",
						children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"data-on": mode === m.id ? "true" : void 0,
							onClick: () => {
								if (m.id === "live" && !liveOk.ok) {
									setMode("live");
									setView("locked");
									return;
								}
								setMode(m.id);
							},
							children: m.label
						}, m.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "glass-circle",
						"aria-label": "Flip camera",
						onClick: () => setFacing(facing === "user" ? "environment" : "user"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipHorizontal, { className: "size-5" })
					})
				]
			}),
			tray === "looks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EffectsSheet, { onClose: () => setTray(null) }) : null,
			tray === "mix" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MixSheet, { onClose: () => setTray(null) }) : null,
			tray === "prompt" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				onClose: () => setTray(null),
				title: "Prompt",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: prompt,
					onChange: (e) => {
						setPrompt(e.target.value);
						patchPrefs({ teleprompter: true });
					},
					placeholder: "Words to read while you record…",
					className: "min-h-28 w-full rounded-2xl bg-paper/10 p-3 text-sm outline-none"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "image/*,video/*",
				multiple: mode !== "story",
				className: "hidden",
				onChange: (e) => {
					const r = filesFromInput(e.target.files);
					e.target.value = "";
					if (r.ok) ingestFiles(r.files);
				}
			})
		]
	});
}
function MixSheet({ onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioSheet, { onClose });
}
function EffectsSheet({ onClose }) {
	const effectId = useStudioStore((s) => s.effectId);
	const setEffect = useStudioStore((s) => s.setEffect);
	const [cat, setCat] = (0, import_react.useState)(EFFECT_CATEGORIES[0] ?? "Looks");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		onClose,
		title: "Looks",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-2 flex gap-3 overflow-x-auto text-[11px] font-semibold",
			children: EFFECT_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: cn("shrink-0", cat === c ? "text-paper" : "text-paper/40"),
				onClick: () => setCat(c),
				children: c
			}, c))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: effectsIn(cat, [], [], "").map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: cn("h-10 rounded-full px-3 text-xs", effectId === e.id ? "bg-paper text-ink" : "bg-paper/10"),
				onClick: () => setEffect(e.id),
				children: e.name
			}, e.id))
		})]
	});
}
function LensSheet({ onClose, onWrite, onPrompt }) {
	const prefs = useStudioStore((s) => s.prefs);
	const patch = useStudioStore((s) => s.patchPrefs);
	const chroma = useStudioStore((s) => s.chroma);
	const patchChroma = useStudioStore((s) => s.patchChroma);
	const dualStatus = useStudioStore((s) => s.dualStatus);
	const setDualStatus = useStudioStore((s) => s.setDualStatus);
	const faceOn = useStudioStore((s) => s.faceOn);
	const setFaceOn = useStudioStore((s) => s.setFaceOn);
	const setView = useStudioStore((s) => s.setView);
	const rows = [
		{
			group: "Capture",
			items: [
				{
					label: "Timer",
					on: prefs.timer > 0,
					go: () => patch({ timer: prefs.timer ? 0 : 3 })
				},
				{
					label: "Hands-free",
					on: prefs.handsFree,
					go: () => patch({ handsFree: true })
				},
				{
					label: "60 fps",
					on: prefs.fps === 60,
					go: () => patch({ fps: prefs.fps === 60 ? 30 : 60 })
				}
			]
		},
		{
			group: "Lens",
			items: [
				{
					label: "Grid",
					on: prefs.grid !== "off",
					go: () => patch({ grid: prefs.grid === "off" ? "rule3" : "off" })
				},
				{
					label: "Level",
					on: prefs.level,
					go: () => patch({ level: !prefs.level })
				},
				{
					label: "Stabilise",
					on: prefs.stabilize,
					go: () => patch({ stabilize: !prefs.stabilize })
				},
				{
					label: "HD",
					on: prefs.quality === "1080",
					go: () => patch({ quality: prefs.quality === "1080" ? "720" : "1080" })
				},
				{
					label: "Mic",
					on: prefs.audio,
					go: () => patch({ audio: !prefs.audio })
				}
			]
		},
		{
			group: "Stage",
			items: [
				{
					label: "Chroma",
					on: chroma.on,
					go: () => patchChroma({ on: !chroma.on })
				},
				{
					label: "Dual",
					on: dualStatus === "on",
					hint: dualStatus === "unsupported" ? "This device won’t open two cameras" : dualStatus === "denied" ? "Camera permission blocked" : dualStatus === "busy" ? "Camera in use" : void 0,
					go: () => {
						(async () => {
							const { startDual, stopDual } = await import("./_ssr/dual-BdP2y1V_.mjs");
							if (dualStatus === "on") {
								stopDual();
								setDualStatus("off");
								return;
							}
							const r = await startDual();
							setDualStatus(r.ok ? "on" : r.reason);
						})();
					}
				},
				{
					label: "Face",
					on: faceOn,
					hint: "Boxes use FaceDetector when the device has it. Mesh/seg need MediaPipe — not faked.",
					go: () => setFaceOn(!faceOn)
				},
				{
					label: "Prompt",
					on: prefs.teleprompter,
					go: onPrompt
				},
				{
					label: "Write",
					on: false,
					go: onWrite
				},
				{
					label: "All lens settings",
					on: false,
					go: () => setView("settings")
				}
			]
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "glass-ink absolute inset-x-3 top-16 z-20 max-h-[70%] overflow-y-auto rounded-[1.5rem] p-3",
		children: [
			rows.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-2 text-[11px] font-semibold tracking-wide text-paper/50 uppercase",
					children: g.group
				}), g.items.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: r.go,
					className: "flex min-h-11 w-full items-center justify-between px-2 py-1 text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [r.label, "hint" in r && r.hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-[11px] text-paper/45",
						children: r.hint
					}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: r.on ? "text-paper" : "text-paper/35",
						children: r.on ? "On" : ""
					})]
				}, r.label))]
			}, g.group)),
			chroma.on ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2 px-2 text-xs",
				children: ["Tolerance", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "range",
					min: .1,
					max: .8,
					step: .02,
					value: chroma.tolerance,
					onChange: (e) => patchChroma({ tolerance: Number(e.target.value) }),
					className: "flex-1"
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-10 w-full text-sm text-paper/60",
				onClick: onClose,
				children: "Close"
			})
		]
	});
}
function Sheet({ onClose, title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "absolute inset-x-0 bottom-0 z-30 rounded-t-[1.5rem] bg-ink/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-sm text-paper/60",
				onClick: onClose,
				children: "Close"
			})]
		}), children]
	});
}
function IconBtn({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cn("glass-circle", on && "ring-1 ring-paper"),
		onClick,
		children
	});
}
function GridOverlay({ kind }) {
	const cols = kind === "rule4" ? 4 : 3;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0 grid opacity-30",
		style: {
			gridTemplateColumns: `repeat(${cols}, 1fr)`,
			gridTemplateRows: `repeat(${cols}, 1fr)`
		},
		children: Array.from({ length: cols * cols }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "border border-paper/30" }, i))
	});
}
function ChromaLayer({ videoRef }) {
	const canvas = (0, import_react.useRef)(null);
	const chroma = useStudioStore((s) => s.chroma);
	(0, import_react.useEffect)(() => {
		if (!chroma.on) return;
		let raf = 0;
		const draw = () => {
			const v = videoRef.current;
			const c = canvas.current;
			if (v && c && v.videoWidth) {
				c.width = v.videoWidth;
				c.height = v.videoHeight;
				const ctx = c.getContext("2d");
				if (ctx) {
					ctx.drawImage(v, 0, 0);
					compositeKey(ctx, c.width, c.height, chroma.plate, {
						...GREEN_KEY,
						tolerance: chroma.tolerance,
						feather: chroma.feather
					});
				}
			}
			raf = requestAnimationFrame(draw);
		};
		raf = requestAnimationFrame(draw);
		return () => cancelAnimationFrame(raf);
	}, [chroma, videoRef]);
	if (!chroma.on) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref: canvas,
		className: "pointer-events-none absolute inset-0 size-full object-cover"
	});
}
function FaceLayer({ videoRef }) {
	const on = useStudioStore((s) => s.faceOn);
	const [boxes, setBoxes] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!on) return;
		const runtime = createFaceRuntime();
		let stop = false;
		const tick = async () => {
			if (stop) return;
			const v = videoRef.current;
			if (v) setBoxes(await runtime.detect(v));
			window.setTimeout(() => void tick(), 240);
		};
		tick();
		return () => {
			stop = true;
		};
	}, [on, videoRef]);
	if (!on) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "pointer-events-none absolute inset-0",
		children: boxes.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute border border-paper/80",
			style: {
				left: b.x,
				top: b.y,
				width: b.width,
				height: b.height
			}
		}, i))
	});
}
function DualLayer() {
	const status = useStudioStore((s) => s.dualStatus);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const d = currentDual();
		if (status !== "on" || !d || !ref.current) return;
		ref.current.srcObject = d.front;
		ref.current.play().catch(() => {});
	}, [status]);
	if (status !== "on") return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
		ref,
		className: "absolute right-3 bottom-36 z-10 h-28 w-20 rounded-xl object-cover",
		muted: true,
		playsInline: true
	});
}
var AI_PRESETS = [
	{
		id: "enhance",
		kind: "local",
		label: "Enhance",
		prompt: "Enhance this photo.",
		patch: {
			exposure: .12,
			contrast: .18,
			clarity: .2,
			saturation: .08
		}
	},
	{
		id: "brighter",
		kind: "local",
		label: "Brighter",
		prompt: "Make this brighter.",
		patch: {
			exposure: .35,
			shadows: .2
		}
	},
	{
		id: "cinematic",
		kind: "local",
		label: "Cinematic",
		prompt: "Make this look cinematic.",
		patch: {
			contrast: .28,
			saturation: -.15,
			fade: .1,
			vignette: .35
		},
		filterId: "cine"
	},
	{
		id: "warm-film",
		kind: "local",
		label: "Warm film",
		prompt: "Give this a warm film look.",
		patch: {
			temperature: .4,
			fade: .12,
			grain: .25
		},
		filterId: "film"
	},
	{
		id: "portrait",
		kind: "local",
		label: "Portrait",
		prompt: "Make this look like a professional portrait.",
		patch: {
			contrast: .12,
			shadows: .15,
			clarity: .1
		},
		filterId: "studio"
	},
	{
		id: "bw",
		kind: "local",
		label: "Mono",
		prompt: "Make this black and white.",
		patch: {},
		filterId: "mono"
	},
	{
		id: "remove-person",
		kind: "cloud",
		label: "Remove person",
		prompt: "Remove the person in the background.",
		needs: "A connected image editor for object removal."
	},
	{
		id: "replace-bg",
		kind: "cloud",
		label: "Background",
		prompt: "Change the background.",
		needs: "A connected image editor for background replacement."
	},
	{
		id: "expand",
		kind: "cloud",
		label: "Expand",
		prompt: "Expand the image.",
		needs: "A connected image editor for outpainting."
	}
];
function matchPrompt(text) {
	const q = text.toLowerCase();
	return AI_PRESETS.find((p) => q.includes(p.id) || p.prompt.toLowerCase().includes(q) || q.includes(p.label.toLowerCase())) ?? AI_PRESETS.find((p) => q.includes("bright") && p.id === "brighter") ?? AI_PRESETS.find((p) => (q.includes("cinematic") || q.includes("cinema")) && p.id === "cinematic") ?? AI_PRESETS.find((p) => (q.includes("remove") || q.includes("person") || q.includes("object")) && p.id === "remove-person") ?? AI_PRESETS[0];
}
async function runLocalAi(src, job) {
	const adjust = {
		...NEUTRAL_ADJUST,
		...job.patch
	};
	return {
		image: await rasterize(src, adjust, job.filterId ?? "original", 1),
		adjust,
		filterId: job.filterId ?? "original"
	};
}
var ADJUST_KEYS = [
	{
		key: "exposure",
		label: "Exposure"
	},
	{
		key: "contrast",
		label: "Contrast"
	},
	{
		key: "highlights",
		label: "Highlights"
	},
	{
		key: "shadows",
		label: "Shadows"
	},
	{
		key: "saturation",
		label: "Saturation"
	},
	{
		key: "vibrance",
		label: "Vibrance"
	},
	{
		key: "temperature",
		label: "Temp"
	},
	{
		key: "tint",
		label: "Tint"
	},
	{
		key: "sharpness",
		label: "Sharp"
	},
	{
		key: "clarity",
		label: "Clarity"
	},
	{
		key: "vignette",
		label: "Vignette"
	},
	{
		key: "grain",
		label: "Grain"
	},
	{
		key: "fade",
		label: "Fade"
	}
];
function PhotoDesk() {
	const image = useStudioStore((s) => s.image);
	const original = useStudioStore((s) => s.originalImage);
	const setImage = useStudioStore((s) => s.setImage);
	const adjust = useStudioStore((s) => s.adjust);
	const patchAdjust = useStudioStore((s) => s.patchAdjust);
	const filterId = useStudioStore((s) => s.filterId);
	const filterAmount = useStudioStore((s) => s.filterAmount);
	const setFilter = useStudioStore((s) => s.setFilter);
	const resetEdit = useStudioStore((s) => s.resetEdit);
	const setView = useStudioStore((s) => s.setView);
	const premium = useStudioStore((s) => s.premium);
	const effectId = useStudioStore((s) => s.effectId);
	const setEffect = useStudioStore((s) => s.setEffect);
	const overlays = useStudioStore((s) => s.overlays);
	const addOverlay = useStudioStore((s) => s.addOverlay);
	const removeOverlay = useStudioStore((s) => s.removeOverlay);
	const [tab, setTab] = (0, import_react.useState)("filters");
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [words, setWords] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [cat, setCat] = (0, import_react.useState)("Original");
	const css = (0, import_react.useMemo)(() => {
		const base = composedCss(adjust, filterId, filterAmount);
		const e = effectById(effectId).css;
		return e === "none" ? base : `${base} ${e}`;
	}, [
		adjust,
		filterId,
		filterAmount,
		effectId
	]);
	(0, import_react.useEffect)(() => {
		if (!image) setView("camera");
	}, [image, setView]);
	if (!image) return null;
	const orig = original ?? image;
	async function applyAi() {
		const job = matchPrompt(prompt || "enhance");
		if (job.kind === "cloud") {
			toast.message(job.needs);
			return;
		}
		setBusy(true);
		try {
			const r = await runLocalAi(orig, job);
			setImage(r.image, orig);
			patchAdjust(r.adjust);
			setFilter(r.filterId, 1);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not edit.");
		} finally {
			setBusy(false);
		}
	}
	async function bake() {
		setBusy(true);
		try {
			const out = await rasterize(orig, adjust, filterId, filterAmount, effectId, overlays);
			setImage(out, orig);
			setView("publish");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not export.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-ink text-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-12 items-center justify-between px-2 pt-[env(safe-area-inset-top)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center",
						onClick: () => setView("camera"),
						children: "Back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Studio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						disabled: busy,
						onClick: () => void bake(),
						children: "Next"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image,
					alt: "",
					className: "size-full object-contain",
					style: { filter: css }
				}), overlays.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "absolute text-sm font-semibold drop-shadow",
					style: {
						left: `${o.x}%`,
						top: `${o.y}%`
					},
					children: o.text
				}, o.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-paper/10 bg-ink pb-[env(safe-area-inset-bottom)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-around px-2 pt-2",
						children: [
							"filters",
							"effects",
							"text",
							"adjust",
							"ai"
						].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTab(id),
							className: cn("h-10 text-xs font-semibold tracking-wide uppercase", tab === id ? "text-paper" : "text-paper/45"),
							children: id === "ai" ? "AI" : id
						}, id))
					}),
					tab === "filters" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-3 overflow-x-auto px-4 py-2",
							children: FILTER_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCat(c),
								className: cn("shrink-0 text-[11px]", cat === c ? "text-paper" : "text-paper/45"),
								children: c
							}, c))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-3 overflow-x-auto px-4 pb-3",
							children: FILTERS.filter((f) => f.category === cat).map((f) => {
								const locked = f.premium && !premium;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										if (locked) {
											toast.message("Lux filters are in Creator pack. Turn it on in Studio settings.");
											return;
										}
										setFilter(f.id, 1);
									},
									className: cn("w-16 shrink-0", filterId === f.id && "text-paper"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block aspect-square overflow-hidden rounded-lg ring-1 ring-paper/20",
										style: { filter: f.css },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: image,
											alt: "",
											className: "size-full object-cover"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 truncate text-[10px]",
										children: [f.name, f.premium ? " ·" : ""]
									})]
								}, f.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-3 px-4 pb-3 text-xs",
							children: ["Intensity", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 1,
								step: .01,
								value: filterAmount,
								onChange: (e) => setFilter(filterId, Number(e.target.value)),
								className: "flex-1"
							})]
						})
					] }) : null,
					tab === "effects" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-3 overflow-x-auto px-4 py-3",
						children: EFFECTS.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setEffect(e.id),
							className: cn("w-16 shrink-0", effectId === e.id && "text-paper"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block aspect-square overflow-hidden rounded-lg ring-1 ring-paper/20",
								style: { filter: e.css },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: image,
									alt: "",
									className: "size-full object-cover"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 truncate text-[10px]",
								children: e.name
							})]
						}, e.id))
					}) : null,
					tab === "text" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								className: "flex gap-2",
								onSubmit: (e) => {
									e.preventDefault();
									if (!words.trim()) return;
									addOverlay({
										id: `o-${Date.now()}`,
										kind: "text",
										text: words.trim(),
										x: 50,
										y: 40,
										start: 0,
										end: 0
									});
									setWords("");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: words,
									onChange: (e) => setWords(e.target.value),
									placeholder: "Only what you type is drawn",
									className: "h-11 flex-1 rounded-full bg-paper/10 px-4 text-sm outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									type: "submit",
									children: "Add"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex gap-2 text-xl",
								children: [
									"🔥",
									"💛",
									"😭",
									"🎓"
								].map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => addOverlay({
										id: `o-${Date.now()}`,
										kind: "sticker",
										text: e,
										x: 50,
										y: 55,
										start: 0,
										end: 0
									}),
									children: e
								}, e))
							}),
							overlays.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "mt-1 block text-xs",
								onClick: () => removeOverlay(o.id),
								children: ["Remove ", o.text]
							}, o.id))
						]
					}) : null,
					tab === "adjust" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-h-48 space-y-2 overflow-y-auto px-4 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "grid size-10 place-items-center",
									onClick: () => void rotateDataUrl(image, -90).then((u) => setImage(u, original)),
									"aria-label": "Rotate left",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "grid size-10 place-items-center",
									onClick: () => void rotateDataUrl(image, 90).then((u) => setImage(u, original)),
									"aria-label": "Rotate right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCw, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "h-10 px-2 text-xs",
									onClick: () => void flipDataUrl(image).then((u) => setImage(u, original)),
									children: "Flip"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "ml-auto grid size-10 place-items-center",
									onClick: resetEdit,
									"aria-label": "Reset",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-4" })
								})
							]
						}), ADJUST_KEYS.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-20 text-paper/70",
								children: row.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: -1,
								max: 1,
								step: .01,
								value: adjust[row.key],
								onChange: (e) => patchAdjust({ [row.key]: Number(e.target.value) }),
								className: "flex-1"
							})]
						}, row.key))]
					}) : null,
					tab === "ai" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-4 py-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: prompt,
									onChange: (e) => setPrompt(e.target.value),
									placeholder: "Make this cinematic…",
									className: "h-11 flex-1 rounded-full bg-paper/10 px-4 text-sm outline-none"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									disabled: busy,
									onClick: () => void applyAi(),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex gap-2 overflow-x-auto",
								children: AI_PRESETS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "h-9 shrink-0 rounded-full bg-paper/10 px-3 text-xs",
									onClick: () => {
										setPrompt(p.prompt);
										if (p.kind === "cloud") toast.message(p.needs);
										else (async () => {
											setBusy(true);
											try {
												const r = await runLocalAi(orig, p);
												setImage(r.image, orig);
												patchAdjust(r.adjust);
												setFilter(r.filterId, 1);
											} finally {
												setBusy(false);
											}
										})();
									},
									children: p.label
								}, p.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-[11px] text-paper/50",
								children: "Local looks run on this device. Object removal and background replace wait for a connected editor."
							})
						]
					}) : null
				]
			})
		]
	});
}
function wait(ms) {
	return new Promise((r) => window.setTimeout(r, ms));
}
function loadVideo(src, muted = true) {
	return new Promise((resolve, reject) => {
		const v = document.createElement("video");
		v.src = src;
		v.muted = muted;
		v.playsInline = true;
		v.crossOrigin = "anonymous";
		v.onloadedmetadata = () => resolve(v);
		v.onerror = () => reject(/* @__PURE__ */ new Error("Clip would not load"));
	});
}
function seek(v, t) {
	return new Promise((resolve) => {
		const on = () => {
			v.removeEventListener("seeked", on);
			resolve();
		};
		v.addEventListener("seeked", on);
		v.currentTime = Math.max(0, Math.min(t, v.duration || t));
	});
}
function drawOverlays(ctx, w, h, overlays, t) {
	overlays.forEach((o) => {
		if (o.start && t < o.start) return;
		if (o.end && t > o.end) return;
		ctx.save();
		ctx.translate(o.x / 100 * w, o.y / 100 * h);
		ctx.rotate((o.rot ?? 0) * Math.PI / 180);
		ctx.font = `600 ${(o.scale ?? 1) * (o.kind === "sticker" ? w * .08 : w * .045)}px "DM Sans", sans-serif`;
		ctx.textAlign = "center";
		ctx.lineWidth = 4;
		ctx.strokeStyle = "rgba(0,0,0,0.45)";
		ctx.fillStyle = "#fff";
		ctx.strokeText(o.text, 0, 0);
		ctx.fillText(o.text, 0, 0);
		ctx.restore();
	});
}
function mimeWithAudio() {
	return [
		"video/webm;codecs=vp9,opus",
		"video/webm;codecs=vp8,opus",
		"video/webm;codecs=vp9",
		"video/webm"
	].find((m) => MediaRecorder.isTypeSupported(m)) ?? "";
}
async function attachMix(actx, dest, mix) {
	const nodes = [];
	for (const t of mix) {
		if (t.mute || !t.src) continue;
		try {
			const el = new Audio(t.src);
			el.crossOrigin = "anonymous";
			el.loop = true;
			const src = actx.createMediaElementSource(el);
			const g = actx.createGain();
			g.gain.value = t.volume;
			if (t.fadeIn > 0) {
				g.gain.setValueAtTime(0, actx.currentTime);
				g.gain.linearRampToValueAtTime(t.volume, actx.currentTime + t.fadeIn);
			}
			src.connect(g);
			g.connect(dest);
			await el.play().catch(() => {});
			nodes.push({
				el,
				stop: () => {
					el.pause();
					el.src = "";
				}
			});
		} catch {}
	}
	return nodes;
}
/** Canvas video + AudioContext mix. Reverse clips drop original audio. Future backends: WebCodecs / ffmpeg. */
async function composeTimeline(opts) {
	const notes = [];
	const peek = !opts.aspect || opts.aspect === "9:16";
	const w = peek ? 720 : 1280;
	const h = peek ? 1280 : 720;
	const canvas = document.createElement("canvas");
	canvas.width = w;
	canvas.height = h;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("No canvas");
	const vstream = canvas.captureStream(30);
	const actx = new AudioContext();
	await actx.resume().catch(() => {});
	const dest = actx.createMediaStreamDestination();
	const mixed = dest.stream.getAudioTracks()[0];
	if (mixed) vstream.addTrack(mixed);
	else notes.push("No audio destination track in this browser.");
	const beds = await attachMix(actx, dest, opts.mix ?? []);
	const mime = mimeWithAudio();
	if (!mime) throw new Error("This browser cannot record a composed timeline.");
	const rec = new MediaRecorder(vstream, { mimeType: mime });
	const chunks = [];
	rec.ondataavailable = (e) => {
		if (e.data.size) chunks.push(e.data);
	};
	const done = new Promise((resolve, reject) => {
		rec.onstop = () => resolve(new Blob(chunks, { type: "video/webm" }));
		rec.onerror = () => reject(/* @__PURE__ */ new Error("Compose failed"));
	});
	rec.start(100);
	let clock = 0;
	for (const clip of opts.clips) {
		const fx = effectById(clip.effectId || opts.effectId);
		if (clip.src.startsWith("data:image")) {
			const img = new Image();
			img.src = clip.src;
			await new Promise((r, j) => {
				img.onload = () => r(null);
				img.onerror = j;
			});
			const hold = Math.max(.4, ((clip.trimEnd || 1) - clip.trimStart) / (clip.speed || 1));
			const frames = Math.ceil(hold * 30);
			for (let i = 0; i < frames; i++) {
				ctx.fillStyle = "#111114";
				ctx.fillRect(0, 0, w, h);
				ctx.globalAlpha = clip.opacity ?? 1;
				ctx.filter = fx.css === "none" ? "none" : fx.css;
				ctx.drawImage(img, 0, 0, w, h);
				ctx.filter = "none";
				ctx.globalAlpha = 1;
				if (fx.process !== "none") processCanvas(ctx, canvas, fx.process);
				if (opts.chroma?.on) compositeKey(ctx, w, h, opts.chroma.plate, {
					...GREEN_KEY,
					tolerance: opts.chroma.tolerance,
					feather: opts.chroma.feather
				});
				drawOverlays(ctx, w, h, opts.overlays, clock);
				clock += 1 / 30;
				await wait(33);
			}
			continue;
		}
		const v = await loadVideo(clip.src, true);
		const start = clip.trimStart || 0;
		const end = clip.trimEnd || v.duration || 4;
		const speed = clip.speed || 1;
		let clipAudio;
		if (opts.originalAudio !== false && !clip.reverse) try {
			clipAudio = new Audio(clip.src);
			clipAudio.crossOrigin = "anonymous";
			const node = actx.createMediaElementSource(clipAudio);
			const g = actx.createGain();
			g.gain.value = 1;
			node.connect(g);
			g.connect(dest);
			clipAudio.playbackRate = speed;
			clipAudio.currentTime = start;
			await clipAudio.play().catch(() => {
				notes.push("Original clip audio could not play into the mix.");
			});
		} catch {
			notes.push("Original clip audio needs a same-origin blob.");
		}
		else if (clip.reverse) notes.push("Reverse keeps picture; original audio is not reversed in this browser path.");
		if (clip.reverse) {
			let t = end;
			while (t > start) {
				await seek(v, t);
				ctx.fillStyle = "#111114";
				ctx.fillRect(0, 0, w, h);
				ctx.globalAlpha = clip.opacity ?? 1;
				ctx.filter = fx.css === "none" ? "none" : fx.css;
				ctx.drawImage(v, 0, 0, w, h);
				ctx.filter = "none";
				ctx.globalAlpha = 1;
				if (opts.chroma?.on) compositeKey(ctx, w, h, opts.chroma.plate, {
					...GREEN_KEY,
					tolerance: opts.chroma.tolerance,
					feather: opts.chroma.feather
				});
				drawOverlays(ctx, w, h, opts.overlays, clock);
				clock += .033;
				t -= .033 * speed;
				await wait(33);
			}
		} else {
			v.playbackRate = speed;
			await seek(v, start);
			await v.play().catch(() => {});
			while (!v.ended && v.currentTime < end) {
				ctx.fillStyle = "#111114";
				ctx.fillRect(0, 0, w, h);
				ctx.filter = fx.css === "none" ? "none" : fx.css;
				ctx.drawImage(v, 0, 0, w, h);
				ctx.filter = "none";
				if (opts.chroma?.on) compositeKey(ctx, w, h, opts.chroma.plate, {
					...GREEN_KEY,
					tolerance: opts.chroma.tolerance,
					feather: opts.chroma.feather
				});
				drawOverlays(ctx, w, h, opts.overlays, clock);
				clock = v.currentTime;
				await wait(33);
			}
			v.pause();
		}
		clipAudio?.pause();
		if (clipAudio) clipAudio.src = "";
		v.src = "";
		if (clip.transition === "fade") for (let i = 0; i < 8; i++) {
			ctx.fillStyle = `rgba(17,17,20,${.12 * (i + 1)})`;
			ctx.fillRect(0, 0, w, h);
			await wait(33);
		}
	}
	rec.stop();
	beds.forEach((b) => b.stop());
	vstream.getTracks().forEach((t) => t.stop());
	await actx.close().catch(() => {});
	return {
		blob: await done,
		backend: "mediarecorder",
		notes
	};
}
async function freezeFrame(src, at) {
	const v = await loadVideo(src);
	await seek(v, at);
	const canvas = document.createElement("canvas");
	canvas.width = v.videoWidth || 720;
	canvas.height = v.videoHeight || 1280;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("No canvas");
	ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
	return canvas.toDataURL("image/jpeg", .9);
}
var TOOLS = [
	"Cut",
	"Mix",
	"Type",
	"Looks",
	"Stickers",
	"Captions",
	"Grade",
	"AI",
	"Frame"
];
function VideoDesk() {
	const video = useStudioStore((s) => s.video);
	const clips = useStudioStore((s) => s.clips);
	const patchClip = useStudioStore((s) => s.patchClip);
	const removeClip = useStudioStore((s) => s.removeClip);
	const addClip = useStudioStore((s) => s.addClip);
	const moveClip = useStudioStore((s) => s.moveClip);
	const setView = useStudioStore((s) => s.setView);
	const overlays = useStudioStore((s) => s.overlays);
	const addOverlay = useStudioStore((s) => s.addOverlay);
	const removeOverlay = useStudioStore((s) => s.removeOverlay);
	const effectId = useStudioStore((s) => s.effectId);
	const setEffect = useStudioStore((s) => s.setEffect);
	const snapshot = useStudioStore((s) => s.snapshot);
	const undoLast = useStudioStore((s) => s.undoLast);
	const redoLast = useStudioStore((s) => s.redoLast);
	const mix = useStudioStore((s) => s.mix);
	const clipVolume = useStudioStore((s) => s.clipVolume);
	const clipMute = useStudioStore((s) => s.clipMute);
	const setClipVolume = useStudioStore((s) => s.setClipVolume);
	const setClipMute = useStudioStore((s) => s.setClipMute);
	const patchMix = useStudioStore((s) => s.patchMix);
	const intent = useStudioStore((s) => s.intent);
	const [active, setActive] = (0, import_react.useState)(clips[0]?.id);
	const clip = clips.find((c) => c.id === active) ?? clips[0];
	const ref = (0, import_react.useRef)(null);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [t, setT] = (0, import_react.useState)(0);
	const [tool, setTool] = (0, import_react.useState)("Cut");
	const [aspect, setAspect] = (0, import_react.useState)("9:16");
	const [draft, setDraft] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const v = ref.current;
		if (!v || !clip) return;
		const on = () => setT(v.currentTime);
		v.addEventListener("timeupdate", on);
		return () => v.removeEventListener("timeupdate", on);
	}, [clip]);
	(0, import_react.useEffect)(() => {
		if (!clip || clip.duration) return;
		const v = document.createElement("video");
		v.src = clip.src;
		v.onloadedmetadata = () => {
			const d = v.duration || 8;
			patchClip(clip.id, {
				duration: d,
				trimEnd: clip.trimEnd || d
			});
		};
	}, [clip, patchClip]);
	(0, import_react.useEffect)(() => {
		const v = ref.current;
		if (!v) return;
		v.volume = clipMute ? 0 : clipVolume;
	}, [
		clipVolume,
		clipMute,
		clip?.src,
		video
	]);
	(0, import_react.useEffect)(() => {
		if (!video && !clips.length) setView("camera");
	}, [
		video,
		clips.length,
		setView
	]);
	(0, import_react.useEffect)(() => {
		const v = ref.current;
		if (!v || !clip) return;
		v.playbackRate = clip.speed || 1;
		const loop = () => {
			if (!clip.reverse) {
				if (clip.trimEnd && v.currentTime >= clip.trimEnd) {
					v.pause();
					setPlaying(false);
				}
				return;
			}
			if (!v.paused) {
				v.currentTime = Math.max(clip.trimStart, v.currentTime - .04 * clip.speed);
				if (v.currentTime <= clip.trimStart + .05) {
					v.pause();
					setPlaying(false);
				}
			}
		};
		const id = window.setInterval(loop, 40);
		return () => window.clearInterval(id);
	}, [clip, playing]);
	if (!video && !clips.length) return null;
	const src = clip?.src ?? video;
	const dur = Math.max(clip?.duration || 12, 1);
	const span = Math.max((clip?.trimEnd || dur) - (clip?.trimStart || 0), .1);
	function splitAt() {
		if (!clip || !ref.current) return;
		snapshot();
		const at = ref.current.currentTime;
		patchClip(clip.id, { trimEnd: at });
		addClip({
			...clip,
			id: `c-${Date.now()}`,
			trimStart: at,
			trimEnd: clip.trimEnd || dur
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-ink text-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-12 items-center justify-between px-2 pt-[env(safe-area-inset-top)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 px-3 text-sm",
						onClick: () => setView("camera"),
						children: "Back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: intent === "peek" || intent === "reel" ? "Studio · Peek" : intent === "story" ? "Studio · Story" : "Studio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 place-items-center",
								"aria-label": "Undo",
								onClick: undoLast,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Undo2, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-11 px-2 text-xs",
								onClick: redoLast,
								children: "Redo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: () => setView("publish"),
								children: "Next"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("relative min-h-0 flex-1 bg-ink", aspect === "1:1" && "mx-auto aspect-square max-h-full", aspect === "16:9" && "mx-auto aspect-video max-h-full"),
				children: [
					src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref,
						src,
						className: "size-full object-contain",
						playsInline: true,
						muted: clipMute,
						onEnded: () => setPlaying(false),
						style: { filter: EFFECTS.find((e) => e.id === (clip?.effectId || effectId))?.css }
					}) : null,
					overlays.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute text-sm font-semibold drop-shadow",
						style: {
							left: `${o.x}%`,
							top: `${o.y}%`
						},
						children: o.text
					}, o.id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "absolute bottom-4 left-1/2 grid size-12 -translate-x-1/2 place-items-center rounded-full bg-paper text-ink",
						onClick: () => {
							const v = ref.current;
							if (!v) return;
							if (v.paused) {
								if (clip && clip.trimStart && v.currentTime < clip.trimStart) v.currentTime = clip.trimStart;
								v.play();
								setPlaying(true);
							} else {
								v.pause();
								setPlaying(false);
							}
						},
						"aria-label": playing ? "Pause" : "Play",
						children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-4 fill-ink" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 fill-ink" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-paper/10 px-3 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-16 overflow-x-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-full min-w-full gap-1",
						children: clips.map((c) => {
							const w = Math.max(56, ((c.trimEnd || c.duration || 8) - c.trimStart) * 28);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setActive(c.id),
								className: cn("relative h-full shrink-0 overflow-hidden rounded-lg", c.id === clip?.id ? "ring-2 ring-paper" : "ring-1 ring-paper/20"),
								style: { width: w },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
									src: c.src,
									className: "size-full object-cover",
									muted: true
								})
							}, c.id);
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "pointer-events-none absolute top-0 h-full w-0.5 bg-paper",
						style: { left: `${Math.min(98, t / dur * 100)}%` }
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-[11px] tabular-nums text-paper/55",
					children: [
						t.toFixed(1),
						"s · ",
						span.toFixed(1),
						"s in timeline",
						mix[0] ? ` · ${mix[0].name}` : ""
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-4 overflow-x-auto px-3 pb-1",
				children: TOOLS.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTool(id),
					className: cn("shrink-0 pb-2 text-[11px] font-semibold", tool === id ? "text-paper" : "text-paper/40"),
					children: id
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-28 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
				children: [
					tool === "Cut" && clip ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-3 text-xs",
								children: ["In", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: dur,
									step: .1,
									value: clip.trimStart,
									onChange: (e) => patchClip(clip.id, { trimStart: Number(e.target.value) }),
									className: "flex-1"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-3 text-xs",
								children: ["Out", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: 0,
									max: dur,
									step: .1,
									value: clip.trimEnd || dur,
									onChange: (e) => patchClip(clip.id, { trimEnd: Number(e.target.value) }),
									className: "flex-1"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-3 text-xs",
								children: [
									"Speed",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "range",
										min: .5,
										max: 2,
										step: .1,
										value: clip.speed,
										onChange: (e) => {
											patchClip(clip.id, { speed: Number(e.target.value) });
											if (ref.current) ref.current.playbackRate = Number(e.target.value);
										},
										className: "flex-1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [clip.speed.toFixed(1), "×"] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "h-10",
										onClick: splitAt,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scissors, { className: "mr-1 inline size-3.5" }), "Split"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-10",
										onClick: () => {
											snapshot();
											patchClip(clip.id, { reverse: !clip.reverse });
										},
										children: "Reverse"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-10",
										onClick: () => {
											if (!clip || !ref.current) return;
											snapshot();
											freezeFrame(clip.src, ref.current.currentTime).then((src) => addClip({
												id: `c-${Date.now()}`,
												src,
												duration: 1.2,
												trimStart: 0,
												trimEnd: 1.2,
												speed: 1
											}));
										},
										children: "Freeze"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-10",
										onClick: () => {
											snapshot();
											addClip({
												...clip,
												id: `c-${Date.now()}`
											});
										},
										children: "Duplicate"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-10",
										onClick: () => moveClip(clip.id, -1),
										children: "Left"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-10",
										onClick: () => moveClip(clip.id, 1),
										children: "Right"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "h-10",
										onClick: () => {
											snapshot();
											removeClip(clip.id);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 inline size-3.5" }), "Delete"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-10",
										onClick: () => setView("library"),
										children: "Add from Media"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-10",
										onClick: () => {
											snapshot();
											patchClip(clip.id, { transition: clip.transition === "fade" ? "cut" : "fade" });
										},
										children: clip.transition === "fade" ? "Fade" : "Cut"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "h-10",
										onClick: () => {
											snapshot();
											patchClip(clip.id, { opacity: clip.opacity === .5 ? 1 : .5 });
										},
										children: "Opacity"
									})
								]
							})
						]
					}) : null,
					tool === "Mix" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AudioSheet, { embedded: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid grid-cols-2 gap-3 text-[11px] text-paper/70",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [
							"Original",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 1,
								step: .05,
								value: clipMute ? 0 : clipVolume,
								onChange: (e) => {
									setClipMute(false);
									setClipVolume(Number(e.target.value));
								},
								className: "mt-1 w-full"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "mt-1",
								onClick: () => setClipMute(!clipMute),
								children: clipMute ? "Muted" : "On"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: ["Added audio", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 1,
							step: .05,
							value: mix[0]?.volume ?? .8,
							onChange: (e) => mix[0] && patchMix(mix[0].id, {
								volume: Number(e.target.value),
								mute: false
							}),
							className: "mt-1 w-full"
						})] })]
					})] }) : null,
					tool === "Type" || tool === "Captions" || tool === "Stickers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex gap-2",
							onSubmit: (e) => {
								e.preventDefault();
								if (!draft.trim()) return;
								addOverlay({
									id: `o-${Date.now()}`,
									kind: tool === "Stickers" ? "sticker" : "text",
									text: draft.trim(),
									x: 50,
									y: tool === "Captions" ? 82 : 40,
									start: clip?.trimStart ?? 0,
									end: clip?.trimEnd ?? 12
								});
								setDraft("");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: draft,
								onChange: (e) => setDraft(e.target.value),
								placeholder: tool === "Stickers" ? "Emoji…" : "Your words…",
								className: "h-11 flex-1 rounded-full bg-paper/10 px-4 text-sm outline-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								type: "submit",
								children: "Add"
							})]
						}),
						tool === "Stickers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex gap-2 text-xl",
							children: [
								"🔥",
								"💛",
								"😭",
								"🎓",
								"⚽"
							].map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => addOverlay({
									id: `o-${Date.now()}`,
									kind: "sticker",
									text: e,
									x: 50,
									y: 50,
									start: 0,
									end: 12
								}),
								children: e
							}, e))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 space-y-1",
							children: overlays.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-center justify-between text-xs",
								children: [o.text, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => removeOverlay(o.id),
									children: "Remove"
								})]
							}, o.id))
						})
					] }) : null,
					tool === "Looks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2 overflow-x-auto",
						children: EFFECTS.slice(0, 16).map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("h-10 shrink-0 rounded-full px-3 text-xs", (clip?.effectId || effectId) === e.id ? "bg-paper text-ink" : "bg-paper/10"),
							onClick: () => {
								if (clip) patchClip(clip.id, { effectId: e.id });
								setEffect(e.id);
							},
							children: e.name
						}, e.id))
					}) : null,
					tool === "AI" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-paper/60",
						children: "Enhance, cinematic, and local looks run on this clip. Cloud removal waits for a connected editor. Nothing is stamped onto the export."
					}) : null,
					tool === "Frame" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: [
							"9:16",
							"1:1",
							"16:9",
							"4:5"
						].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("h-10 rounded-full px-3 text-xs", aspect === a ? "bg-paper text-ink" : "bg-paper/10"),
							onClick: () => setAspect(a),
							children: a
						}, a))
					}) : null,
					tool === "Grade" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-paper/60",
						children: "Looks grade the clip. Nothing is printed onto the file."
					}) : null
				]
			})
		]
	});
}
var TABS = [
	"Recents",
	"Photos",
	"Videos",
	"Favorites",
	"Drafts"
];
function LibraryDesk() {
	const library = useStudioStore((s) => s.library);
	const drafts = useStudioStore((s) => s.drafts);
	const setImage = useStudioStore((s) => s.setImage);
	const setVideo = useStudioStore((s) => s.setVideo);
	const addClip = useStudioStore((s) => s.addClip);
	const intent = useStudioStore((s) => s.intent);
	const addLibrary = useStudioStore((s) => s.addLibrary);
	const toggleFavorite = useStudioStore((s) => s.toggleFavorite);
	const loadDraft = useStudioStore((s) => s.loadDraft);
	const setView = useStudioStore((s) => s.setView);
	const [tab, setTab] = (0, import_react.useState)("Recents");
	const [q, setQ] = (0, import_react.useState)("");
	const fileRef = (0, import_react.useRef)(null);
	const items = library.filter((x) => {
		if (tab === "Photos") return x.kind === "photo";
		if (tab === "Videos") return x.kind === "video";
		if (tab === "Favorites") return x.favorite;
		return true;
	}).filter((x) => !q || x.album?.toLowerCase().includes(q.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-12 items-center justify-between px-3 pt-[env(safe-area-inset-top)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 text-sm font-semibold",
						onClick: () => setView("camera"),
						children: "Camera"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: intent === "peek" || intent === "reel" ? "Media · Peek" : intent === "story" ? "Media · Story" : "Library"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 text-sm font-semibold",
						onClick: () => fileRef.current?.click(),
						children: "Import"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: fileRef,
				type: "file",
				accept: "image/*,video/*",
				multiple: intent !== "story",
				className: "hidden",
				onChange: (e) => {
					const files = intent === "story" ? [...e.target.files ?? []].slice(0, 1) : [...e.target.files ?? []];
					e.target.value = "";
					files.forEach((f) => {
						const src = URL.createObjectURL(f);
						const kind = f.type.startsWith("video") ? "video" : "photo";
						addLibrary({
							id: `lib-${Date.now()}-${f.name}`,
							kind,
							src,
							createdAt: (/* @__PURE__ */ new Date()).toISOString()
						});
					});
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Search albums, type…",
				className: "mx-4 h-11 rounded-full bg-secondary px-4 text-sm outline-none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-3 overflow-x-auto px-4",
				children: TABS.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setTab(t),
					className: cn("shrink-0 pb-2 text-[11px] font-semibold tracking-wide uppercase", tab === t ? "text-ink" : "text-muted-foreground"),
					children: t
				}, t))
			}),
			tab === "Drafts" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-2 overflow-y-auto px-4 py-3",
				children: [drafts.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => loadDraft(d.id),
					className: "flex w-full items-center gap-3 rounded-2xl bg-card px-3 py-3 text-left ring-1 ring-border",
					children: [d.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: d.image,
						alt: "",
						className: "size-12 rounded-lg object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-12 rounded-lg bg-secondary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: d.caption || d.kind
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: new Date(d.updatedAt).toLocaleString()
						})]
					})]
				}, d.id)), !drafts.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pt-8 text-center text-sm text-muted-foreground",
					children: "No drafts yet."
				}) : null]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid flex-1 grid-cols-3 gap-1 overflow-y-auto p-1",
				children: items.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "relative aspect-square overflow-hidden bg-secondary",
					onClick: () => {
						if (x.kind === "video") {
							if (intent === "reel" || intent === "peek") {
								addClip({
									id: `c-${Date.now()}`,
									src: x.src,
									duration: 0,
									trimStart: 0,
									trimEnd: 0,
									speed: 1
								});
								setView("video");
								return;
							}
							setVideo(x.src);
							return;
						}
						setImage(x.src, x.src);
					},
					onContextMenu: (e) => {
						e.preventDefault();
						toggleFavorite(x.id);
					},
					children: [x.kind === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: x.src,
						className: "size-full object-cover",
						muted: true
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: x.src,
						alt: "",
						className: "size-full object-cover"
					}), x.favorite ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-1 right-1 size-2 rounded-full bg-bud" }) : null]
				}, x.id))
			})
		]
	});
}
function sniffContainer(mime, blob) {
	if (mime.includes("mp4") || mime.includes("m4a")) return "mp4";
	if (mime.includes("webm")) return "webm";
	if (blob.type.includes("mp4")) return "mp4";
	if (blob.type.includes("webm")) return "webm";
	return "unknown";
}
function webCodecsSupport() {
	return {
		videoEncoder: typeof VideoEncoder !== "undefined",
		audioEncoder: typeof AudioEncoder !== "undefined",
		/** Chunk encode ≠ MP4 file. Muxer is a separate dependency. */
		mp4Muxer: false
	};
}
function pickExportEngine() {
	const wc = webCodecsSupport();
	if (wc.videoEncoder && wc.mp4Muxer) return "webcodecs";
	if (typeof MediaRecorder !== "undefined") return "mediarecorder";
	return "ffmpeg";
}
async function mediaRecorderEngine(job) {
	const out = await composeTimeline(job);
	const mime = out.blob.type || "video/webm";
	return {
		blob: out.blob,
		mime,
		container: sniffContainer(mime, out.blob),
		videoCodec: mime.includes("vp9") ? "vp9" : mime.includes("vp8") ? "vp8" : "unknown",
		audioCodec: mime.includes("opus") ? "opus" : "unknown",
		engine: "mediarecorder",
		notes: [
			...out.notes,
			"Container is WebM from MediaRecorder, not MP4.",
			"WebCodecs VideoEncoder may exist on this device but no MP4 muxer is bundled."
		]
	};
}
async function webCodecsEngine(job) {
	const wc = webCodecsSupport();
	if (!wc.videoEncoder || !wc.mp4Muxer) {
		const fallback = await mediaRecorderEngine(job);
		fallback.notes = [wc.videoEncoder ? "VideoEncoder is present. MP4 muxing (mp4box / fmp4) is not in this build." : "WebCodecs VideoEncoder is unavailable here.", ...fallback.notes];
		return fallback;
	}
	throw new Error("WebCodecs muxer not wired");
}
async function ffmpegEngine(_job) {
	throw new Error("Server FFmpeg export is not connected.");
}
async function runExport(job) {
	const engine = pickExportEngine();
	if (engine === "webcodecs") return webCodecsEngine(job);
	if (engine === "ffmpeg") return ffmpegEngine(job);
	return mediaRecorderEngine(job);
}
var DESTS = [
	{
		id: "square",
		label: "Square"
	},
	{
		id: "story",
		label: "Story"
	},
	{
		id: "peek",
		label: "Peek"
	},
	{
		id: "message",
		label: "Message"
	},
	{
		id: "save",
		label: "Save only"
	}
];
function PublishDesk() {
	const dest = useStudioStore((s) => s.dest);
	const intent = useStudioStore((s) => s.intent);
	const setDest = useStudioStore((s) => s.setDest);
	const caption = useStudioStore((s) => s.caption);
	const setCaption = useStudioStore((s) => s.setCaption);
	const image = useStudioStore((s) => s.image);
	const original = useStudioStore((s) => s.originalImage);
	const video = useStudioStore((s) => s.video);
	const clips = useStudioStore((s) => s.clips);
	const adjust = useStudioStore((s) => s.adjust);
	const filterId = useStudioStore((s) => s.filterId);
	const filterAmount = useStudioStore((s) => s.filterAmount);
	const effectId = useStudioStore((s) => s.effectId);
	const overlays = useStudioStore((s) => s.overlays);
	const audience = useStudioStore((s) => s.audience);
	const setAudience = useStudioStore((s) => s.setAudience);
	const topic = useStudioStore((s) => s.topic);
	const setTopic = useStudioStore((s) => s.setTopic);
	const place = useStudioStore((s) => s.place);
	const setPlace = useStudioStore((s) => s.setPlace);
	const musicRef = useStudioStore((s) => s.musicRef);
	const mix = useStudioStore((s) => s.mix);
	const saveDraft = useStudioStore((s) => s.saveDraft);
	const addLibrary = useStudioStore((s) => s.addLibrary);
	const clearProject = useStudioStore((s) => s.clearProject);
	const messageId = useStudioStore((s) => s.messageId);
	const addPost = useCampusStore((s) => s.addPost);
	const registerOriginalAudio = useCampusStore((s) => s.registerOriginalAudio);
	const useOriginalAudio = useCampusStore((s) => s.useOriginalAudio);
	const addStory = useCampusStore((s) => s.addStory);
	const setComposeOpen = useCampusStore((s) => s.setComposeOpen);
	const { user } = useCurrentUserState();
	const navigate = useNavigate();
	const router = useRouter();
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function bakeImage() {
		if (!image) return void 0;
		try {
			return await rasterize(original ?? image, adjust, filterId, filterAmount, effectId, overlays, useStudioStore.getState().chroma);
		} catch {
			return image;
		}
	}
	async function go() {
		if (!user) {
			setComposeOpen(false);
			navigate({ to: "/login" });
			return;
		}
		setBusy(true);
		try {
			const baked = await bakeImage();
			let clip = video ?? clips[0]?.src;
			if (clips.length) try {
				const out = await runExport({
					clips,
					overlays,
					effectId,
					aspect: dest === "peek" || dest === "story" ? "9:16" : "16:9",
					chroma: useStudioStore.getState().chroma,
					mix: useStudioStore.getState().mix,
					originalAudio: true
				});
				clip = URL.createObjectURL(out.blob);
				if (out.container !== "webm") toast.message(`Exported ${out.container}`);
				else if (out.notes[0]) toast.message(`${out.container.toUpperCase()} · ${out.engine}`);
			} catch {
				toast.message("Timeline preview is live; this browser kept the source clip for Drop.");
			}
			if (dest === "save") {
				if (baked) addLibrary({
					id: `lib-${Date.now()}`,
					kind: "photo",
					src: baked,
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				});
				toast.success("Saved to library.");
				clearProject();
				setComposeOpen(false);
				return;
			}
			if (dest === "story") {
				addStory({
					id: `st-${Date.now()}`,
					image: baked,
					video: clip,
					caption,
					createdAt: (/* @__PURE__ */ new Date()).toISOString()
				});
				toast.success("On your Story.");
				clearProject();
				setComposeOpen(false);
				navigate({ to: "/" });
				return;
			}
			if (dest === "message") {
				if (messageId) {
					const body = caption.trim() || (clip ? "Video" : "Photo");
					await sendMessage({ data: {
						conversationId: messageId,
						body: baked ? `${body}\n${baked}` : body
					} });
					toast.success("Sent.");
				} else toast.message("Open a chat, then Drop to send there.");
				clearProject();
				setComposeOpen(false);
				if (messageId) navigate({
					to: "/messages/$id",
					params: { id: messageId }
				});
				return;
			}
			const kind = intent === "reel" || dest === "peek" || clip ? "reel" : "post";
			const credit = musicRef ? `\n♪ ${musicRef.sourceType === "ORIGINAL_AUDIO" ? "Original audio" : "Music"} · ${musicRef.title}${musicRef.creatorHandle ? ` · @${musicRef.creatorHandle}` : musicRef.artistName ? ` · ${musicRef.artistName}` : ""}` : "";
			const r = await createPost({ data: {
				communityId: "unilag-campus",
				body: (caption.trim() || (intent === "reel" ? "Reel" : kind === "reel" ? "Peek" : "Photo")) + credit,
				image: baked,
				video: clip,
				kind
			} });
			addPost(r.body, r.handle, {
				image: baked,
				video: clip,
				id: r.id,
				audioId: musicRef?.audioId
			});
			if (musicRef?.sourceType === "ORIGINAL_AUDIO" && musicRef.audioId) useOriginalAudio(musicRef.audioId, r.id);
			else if (mix.some((m) => m.kind === "voice" || m.kind === "file" || m.kind === "tone")) {
				const bed = mix.find((m) => m.kind === "voice" || m.kind === "file" || m.kind === "tone");
				registerOriginalAudio(originalFromPublish({
					title: bed?.name || caption.trim() || "Original audio",
					creatorHandle: r.handle,
					sourceContentId: r.id,
					src: bed?.src
				}));
			}
			await router.invalidate();
			toast.success(intent === "reel" || dest === "peek" || intent === "peek" ? "On Peek." : "Dropped to Square.");
			clearProject();
			setComposeOpen(false);
			if (dest === "peek" || intent === "reel" || intent === "peek") sessionStorage.setItem("unibud-square-mode", "peek");
			navigate({ to: "/" });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not publish.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-background pt-[env(safe-area-inset-top)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-12 items-center justify-between px-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 px-2 text-sm",
						onClick: () => useStudioStore.getState().setView(video ? "video" : "photo"),
						children: "Back"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: "Publish"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 px-2 text-sm",
						onClick: () => {
							saveDraft();
							toast.success("Draft saved.");
						},
						children: "Draft"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto w-full max-w-3xl flex-1 overflow-y-auto px-5",
				children: [
					image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: image,
						alt: "",
						className: "mx-auto h-48 rounded-2xl object-cover"
					}) : null,
					video && !image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						src: video,
						className: "mx-auto h-48 rounded-2xl object-cover",
						muted: true
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: caption,
						onChange: (e) => setCaption(e.target.value),
						placeholder: "Write a caption…",
						className: "mt-4 min-h-24 w-full resize-none bg-transparent text-base outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Send to"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: DESTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setDest(d.id),
							className: dest === d.id ? "h-9 rounded-full bg-ink px-4 text-sm text-paper" : "h-9 rounded-full bg-card px-4 text-sm ring-1 ring-border",
							children: d.label
						}, d.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase",
						children: "Audience"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: [
							"everyone",
							"connections",
							"close",
							"me"
						].map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setAudience(a),
							className: audience === a ? "h-9 rounded-full bg-ink px-4 text-sm text-paper" : "h-9 rounded-full bg-card px-4 text-sm ring-1 ring-border",
							children: a === "me" ? "Only me" : a === "close" ? "Close" : a === "connections" ? "Connections" : "Everyone"
						}, a))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: topic,
						onChange: (e) => setTopic(e.target.value),
						placeholder: "Topic",
						className: "mt-4 h-11 w-full rounded-2xl bg-secondary px-4 text-sm outline-none"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: place,
						onChange: (e) => setPlace(e.target.value),
						placeholder: "Place",
						className: "mt-2 h-11 w-full rounded-2xl bg-secondary px-4 text-sm outline-none"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto w-full max-w-3xl px-5 py-4",
				style: { paddingBottom: "max(1rem, env(safe-area-inset-bottom))" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					disabled: busy,
					onClick: () => void go(),
					children: dest === "save" ? "Save" : dest === "message" ? "Send" : "Publish"
				})
			})
		]
	});
}
function LiveDesk({ kind }) {
	const videoRef = (0, import_react.useRef)(null);
	const streamRef = (0, import_react.useRef)(null);
	const live = useStudioStore((s) => s.live);
	const startLive = useStudioStore((s) => s.startLive);
	const addLiveLine = useStudioStore((s) => s.addLiveLine);
	const endLive = useStudioStore((s) => s.endLive);
	const facing = useStudioStore((s) => s.facing);
	const setFacing = useStudioStore((s) => s.setFacing);
	const setView = useStudioStore((s) => s.setView);
	const setComposeOpen = useCampusStore((s) => s.setComposeOpen);
	const connections = useCampusStore((s) => s.connections);
	const followers = useCampusStore((s) => s.followers);
	const policy = useStudioStore((s) => s.policy);
	const standing = useStudioStore((s) => s.standing);
	const premium = useStudioStore((s) => s.premium);
	const gate = evaluate(kind === "stream" ? "stream" : "live", {
		startedAt: standing.startedAt,
		connections: connections.length,
		followers: followers.length,
		verified: standing.verified,
		creator: premium,
		strikes: standing.strikes
	}, policy);
	const [title, setTitle] = (0, import_react.useState)(kind === "stream" ? "UNIBUD stream" : "Live from Square");
	const [draft, setDraft] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let stop = false;
		navigator.mediaDevices.getUserMedia({
			video: { facingMode: facing },
			audio: true
		}).then((stream) => {
			if (stop) {
				stream.getTracks().forEach((t) => t.stop());
				return;
			}
			streamRef.current = stream;
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.play().catch(() => {});
			}
		}).catch(() => {});
		return () => {
			stop = true;
			streamRef.current?.getTracks().forEach((t) => t.stop());
		};
	}, [facing]);
	(0, import_react.useEffect)(() => {
		if (!gate.ok && !live.on) setView("locked");
	}, [
		gate.ok,
		live.on,
		setView
	]);
	const onAir = live.on;
	if (!gate.ok && !onAir) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-dvh flex-col bg-ink text-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
				ref: videoRef,
				className: "absolute inset-0 size-full object-cover",
				playsInline: true,
				muted: !onAir
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex items-center justify-between px-3 pt-[max(0.75rem,env(safe-area-inset-top))]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 text-sm",
						onClick: () => onAir ? endLive() : setView("camera"),
						children: onAir ? "End" : "Back"
					}),
					onAir ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2 rounded-full bg-destructive px-3 py-1 text-[11px] font-semibold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radio, { className: "size-3" }),
							" ",
							kind === "stream" ? "STREAM" : "LIVE",
							" · ",
							1 + live.lines.length
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: kind === "stream" ? "Stream setup" : "Go Live"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center",
						onClick: () => setFacing(facing === "user" ? "environment" : "user"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlipHorizontal, { className: "size-4" })
					})
				]
			}),
			!onAir ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mx-5 mt-auto mb-8 rounded-2xl bg-ink/70 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: title,
						onChange: (e) => setTitle(e.target.value),
						className: "h-11 w-full rounded-xl bg-paper/10 px-3 text-sm outline-none",
						placeholder: "Title"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-paper/60",
						children: "Camera and mic stay on this device. This is a UNIBUD live room — not a third-party stream ingest."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-4 w-full",
						onClick: () => startLive(title.trim() || "Live"),
						children: ["Start ", kind === "stream" ? "stream" : "live"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 mt-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 max-h-40 space-y-1 overflow-y-auto",
					children: live.lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-paper/90",
						children: l
					}, i))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex gap-2",
					onSubmit: (e) => {
						e.preventDefault();
						if (!draft.trim()) return;
						addLiveLine(`You: ${draft.trim()}`);
						setDraft("");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						placeholder: "Comment…",
						className: "h-11 flex-1 rounded-full bg-paper/15 px-4 text-sm outline-none"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						className: "border-paper/30 text-paper",
						onClick: () => {
							endLive();
							streamRef.current?.getTracks().forEach((t) => t.stop());
							setComposeOpen(false);
						},
						children: "End"
					})]
				})]
			})
		]
	});
}
function SettingsDesk() {
	const prefs = useStudioStore((s) => s.prefs);
	const patchPrefs = useStudioStore((s) => s.patchPrefs);
	const premium = useStudioStore((s) => s.premium);
	const setPremium = useStudioStore((s) => s.setPremium);
	const setView = useStudioStore((s) => s.setView);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-background pt-[env(safe-area-inset-top)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-12 items-center px-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 text-sm font-semibold",
					onClick: () => setView("camera"),
					children: "Back"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "flex-1 text-center text-sm font-semibold",
					children: "Camera"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-12" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 space-y-6 overflow-y-auto px-5 pb-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Composition",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Grid",
							children: [
								"off",
								"rule3",
								"rule4",
								"golden",
								"cross",
								"safe"
							].map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								on: prefs.grid === g,
								onClick: () => patchPrefs({ grid: g }),
								children: g
							}, g))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Level",
							on: prefs.level,
							onChange: (v) => patchPrefs({ level: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Mirror front camera",
							on: prefs.mirrorFront,
							onChange: (v) => patchPrefs({ mirrorFront: v })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Capture",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Quality",
							children: ["720", "1080"].map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Chip, {
								on: prefs.quality === q,
								onClick: () => patchPrefs({ quality: q }),
								children: [q, "p"]
							}, q))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Frame rate",
							children: [
								24,
								30,
								60
							].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
								on: prefs.fps === f,
								onClick: () => patchPrefs({ fps: f }),
								children: f
							}, f))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "HDR preference",
							on: prefs.hdr,
							onChange: (v) => patchPrefs({ hdr: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Stabilization",
							on: prefs.stabilize,
							onChange: (v) => patchPrefs({ stabilize: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Record audio",
							on: prefs.audio,
							onChange: (v) => patchPrefs({ audio: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Hands-free",
							on: prefs.handsFree,
							onChange: (v) => patchPrefs({ handsFree: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Green screen",
							on: prefs.greenScreen,
							onChange: (v) => patchPrefs({ greenScreen: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Dual camera",
							on: prefs.dual,
							onChange: (v) => patchPrefs({ dual: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Teleprompter",
							on: prefs.teleprompter,
							onChange: (v) => patchPrefs({ teleprompter: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Save originals",
							on: prefs.saveOriginal,
							onChange: (v) => patchPrefs({ saveOriginal: v })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Privacy",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Location metadata",
						on: prefs.locationMeta,
						onChange: (v) => patchPrefs({ locationMeta: v })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Location stays off unless you turn this on. AI object removal is on-device only when a provider is connected."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
					title: "Creator pack",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
						label: "Premium filters and export looks",
						on: premium,
						onChange: setPremium
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Uses UNIBUD entitlement, not a separate checkout. Core editing stays free."
					})]
				})
			]
		})]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[11px] font-semibold tracking-wide text-muted-foreground uppercase",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 space-y-3",
		children
	})] });
}
function Row({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-2 flex flex-wrap gap-2",
		children
	})] });
}
function Chip({ on, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-9 rounded-full px-3 text-xs", on ? "bg-ink text-paper" : "bg-card ring-1 ring-border"),
		children
	});
}
function Toggle({ label, on, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		className: "flex w-full items-center justify-between py-1 text-sm",
		onClick: () => onChange(!on),
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("h-6 w-10 rounded-full p-0.5", on ? "bg-ink" : "bg-secondary"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("block size-5 rounded-full bg-paper transition-transform", on ? "translate-x-4" : "") })
		})]
	});
}
function WriteDesk({ onClose }) {
	const setView = useStudioStore((s) => s.setView);
	const addPost = useCampusStore((s) => s.addPost);
	const { user } = useCurrentUserState();
	const navigate = useNavigate();
	const router = useRouter();
	const [draft, setDraft] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function submit() {
		if (!user) {
			onClose();
			navigate({ to: "/login" });
			return;
		}
		if (!draft.trim()) return;
		setBusy(true);
		try {
			const r = await createPost({ data: {
				communityId: "unilag-campus",
				body: draft.trim()
			} });
			addPost(r.body, r.handle, { id: r.id });
			await router.invalidate();
			onClose();
			navigate({ to: "/" });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Could not post.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-background pt-[env(safe-area-inset-top)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-12 items-center justify-between px-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 px-2 text-sm",
					onClick: () => setView("camera"),
					children: "Camera"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: "Write"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					disabled: busy || !draft.trim(),
					onClick: () => void submit(),
					children: "Post"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			autoFocus: true,
			value: draft,
			onChange: (e) => setDraft(e.target.value),
			placeholder: "What’s moving you right now?",
			className: "min-h-40 flex-1 resize-none bg-transparent px-5 py-4 text-base outline-none"
		})]
	});
}
function LockedDesk() {
	const setView = useStudioStore((s) => s.setView);
	const setMode = useStudioStore((s) => s.setMode);
	const policy = useStudioStore((s) => s.policy);
	const standing = useStudioStore((s) => s.standing);
	const premium = useStudioStore((s) => s.premium);
	const connections = useCampusStore((s) => s.connections);
	const followers = useCampusStore((s) => s.followers);
	const result = evaluate("live", {
		startedAt: standing.startedAt,
		connections: connections.length,
		followers: followers.length,
		verified: standing.verified,
		creator: premium,
		strikes: standing.strikes
	}, policy);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-background px-5 pt-[max(1rem,env(safe-area-inset-top))]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "h-11 self-start text-sm",
				onClick: () => {
					setMode("post");
					setView("camera");
				},
				children: "Back"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase",
				children: "Live"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: "Not open for you yet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-sm text-sm text-muted-foreground",
				children: "Public Live is gated. Video calls in Chat stay available. This list comes from UNIBUD policy, not a hidden button."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-8 space-y-3",
				children: [result.missing.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-2xl bg-card px-4 py-3 ring-1 ring-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: m.need
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: ["Now: ", m.have]
					})]
				}, m.key)), result.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-sm",
					children: "You’re eligible — go back and start Live."
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-auto mb-[max(1rem,env(safe-area-inset-bottom))]",
				onClick: () => {
					setMode("post");
					setView("camera");
				},
				children: "Back to camera"
			})
		]
	});
}
function StudioRoot() {
	const open = useCampusStore((s) => s.composeOpen);
	const setOpen = useCampusStore((s) => s.setComposeOpen);
	const view = useStudioStore((s) => s.view);
	if (!open) return null;
	function close() {
		const s = useStudioStore.getState();
		if (s.image || s.video || s.clips.length || s.caption.trim()) s.saveDraft();
		setOpen(false);
		s.setView("camera");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 bg-ink",
		children: [
			view === "camera" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraStage, { onClose: close }) : null,
			view === "photo" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhotoDesk, {}) : null,
			view === "video" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoDesk, {}) : null,
			view === "library" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryDesk, {}) : null,
			view === "publish" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublishDesk, {}) : null,
			view === "live" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDesk, { kind: "live" }) : null,
			view === "stream" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDesk, { kind: "stream" }) : null,
			view === "settings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsDesk, {}) : null,
			view === "write" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WriteDesk, { onClose: close }) : null,
			view === "locked" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockedDesk, {}) : null
		]
	});
}
var PRIMARY_NAV = [
	{
		to: "/",
		label: "Square",
		icon: LayoutGrid
	},
	{
		to: "/connect",
		label: "Connect",
		icon: UserPlus
	},
	{
		to: "/communities",
		label: "Quad",
		icon: Users
	},
	{
		to: "/messages",
		label: "Chat",
		icon: MessageCircle
	}
];
function activePath(pathname, to) {
	if (to === "/") return pathname === "/";
	return pathname === to || pathname.startsWith(`${to}/`);
}
function PrimaryNav({ className }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Primary",
		className: cn("flex items-end justify-between px-3 pt-1 pb-1", className),
		children: PRIMARY_NAV.map((item) => {
			const on = activePath(pathname, item.to);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				className: cn("relative flex min-w-[4.5rem] flex-col items-center gap-1 px-1 pb-2 pt-1", on ? "text-ink" : "text-muted-foreground"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
						className: "size-5",
						strokeWidth: on ? 2.25 : 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-semibold tracking-[0.08em] uppercase",
						children: item.label
					}),
					on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-ink" }) : null
				]
			}, item.to);
		})
	});
}
var items = [
	{
		to: "/profile",
		label: "Profile",
		icon: CircleUser
	},
	{
		to: "/messages",
		label: "Chat",
		icon: MessageSquareText
	},
	{
		to: "/bud",
		label: "Bud",
		icon: Sparkles
	},
	{
		to: "/riff",
		label: "Riff",
		icon: Megaphone
	},
	{
		to: "/search",
		label: "Search",
		icon: Search
	},
	{
		to: "/board",
		label: "Board",
		icon: Clapperboard
	},
	{
		to: "/studies",
		label: "Studies",
		icon: BookOpen
	},
	{
		to: "/news",
		label: "Educational News",
		icon: Newspaper
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	},
	{
		to: "/fixer",
		label: "The Fixer",
		icon: Wrench
	},
	{
		to: "/help",
		label: "Help & Support",
		icon: BadgeHelp
	},
	{
		to: "/feedback",
		label: "Feedback",
		icon: MessageSquareText
	}
];
function SideMenu({ open, progress, dragging, onClose, onDrawerPointerDown, onPointerMove, onPointerUp }) {
	const { user, isPending } = useCurrentUserState();
	const role = useCampusStore((s) => s.role ?? "student");
	const panel = (0, import_react.useRef)(null);
	const idle = progress <= .001 && !dragging;
	(0, import_react.useEffect)(() => {
		if (open) panel.current?.focus();
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("fixed inset-0 z-50", idle && "pointer-events-none"),
		"aria-hidden": idle,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			tabIndex: idle ? -1 : 0,
			"aria-label": "Close menu",
			className: "absolute inset-0 bg-ink/40",
			style: {
				opacity: progress,
				transition: dragging ? "none" : "opacity 280ms cubic-bezier(0.32, 0.72, 0, 1)"
			},
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			ref: panel,
			id: "side-menu",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Menu",
			tabIndex: -1,
			className: "absolute top-0 right-0 flex h-full w-[min(100%,20rem)] flex-col bg-background px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-soft outline-none",
			style: {
				transform: `translateX(${(1 - progress) * 100}%)`,
				transition: dragging ? "none" : "transform 280ms cubic-bezier(0.32, 0.72, 0, 1)"
			},
			onPointerDown: onDrawerPointerDown,
			onPointerMove,
			onPointerUp,
			onPointerCancel: onPointerUp,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { size: "md" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border",
					children: [isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-11 animate-pulse rounded-full bg-secondary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						name: user?.displayName ?? "Guest",
						className: "size-11"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: user?.displayName ?? "Guest"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: user ? roleLabel(role) : "Sign in to keep your place"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
					className: "mt-4 flex-1 space-y-1 overflow-y-auto overscroll-contain",
					children: [
						items.map((item) => {
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								onClick: onClose,
								tabIndex: idle ? -1 : 0,
								className: "flex h-12 items-center gap-3 rounded-xl px-3 text-sm hover:bg-secondary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 text-muted-foreground" }), item.label]
							}, item.to);
						}),
						canTeach(role) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/tutor",
							onClick: onClose,
							tabIndex: idle ? -1 : 0,
							className: "flex h-12 items-center gap-3 rounded-xl px-3 text-sm hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, { className: "size-4 text-muted-foreground" }), "Tutor Mode"]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "https://myrealmbyoracle.netlify.app/",
							target: "_blank",
							rel: "noopener noreferrer",
							onClick: onClose,
							tabIndex: idle ? -1 : 0,
							className: "flex h-12 items-center gap-3 rounded-xl px-3 text-sm text-muted-foreground hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" }), "About Oracle"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					tabIndex: idle ? -1 : 0,
					className: "mt-2 flex h-12 items-center gap-3 rounded-xl px-3 text-sm hover:bg-secondary",
					onClick: () => {
						onClose();
						signOut();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4 text-muted-foreground" }), "Logout"]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedOut, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					onClick: onClose,
					tabIndex: idle ? -1 : 0,
					className: "mt-2 flex h-12 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground",
					children: "Sign in"
				}) })
			]
		})]
	});
}
var EDGE = 22;
var DRAWER = 320;
var COMMIT = .32;
function scrollerX(target) {
	let n = target instanceof Element ? target : null;
	while (n && n !== document.body) {
		const { overflowX } = getComputedStyle(n);
		if (overflowX === "auto" || overflowX === "scroll") return true;
		n = n.parentElement;
	}
	return false;
}
function useRightDrawer() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const session = (0, import_react.useRef)(null);
	const progressRef = (0, import_react.useRef)(0);
	const openRef = (0, import_react.useRef)(false);
	const setP = (0, import_react.useCallback)((v) => {
		const n = Math.max(0, Math.min(1, v));
		progressRef.current = n;
		setProgress(n);
	}, []);
	const close = (0, import_react.useCallback)(() => {
		openRef.current = false;
		setOpen(false);
		setP(0);
		setDragging(false);
		session.current = null;
	}, [setP]);
	const openMenu = (0, import_react.useCallback)(() => {
		openRef.current = true;
		setOpen(true);
		setP(1);
		setDragging(false);
		session.current = null;
	}, [setP]);
	const finish = (0, import_react.useCallback)(() => {
		const s = session.current;
		session.current = null;
		setDragging(false);
		const p = progressRef.current;
		const vx = s?.vx ?? 0;
		if (vx < -.55 || vx <= .45 && p >= COMMIT) openMenu();
		else close();
	}, [close, openMenu]);
	(0, import_react.useEffect)(() => {
		function down(e) {
			if (openRef.current) return;
			if (e.pointerType === "mouse") return;
			if (e.button !== 0) return;
			if (window.innerWidth - e.clientX > EDGE) return;
			if (scrollerX(e.target)) return;
			session.current = {
				startX: e.clientX,
				startY: e.clientY,
				from: "closed",
				locked: null,
				lastX: e.clientX,
				lastT: performance.now(),
				vx: 0,
				pointerId: e.pointerId
			};
		}
		function move(e) {
			const s = session.current;
			if (!s || s.pointerId !== e.pointerId) return;
			const dx = e.clientX - s.startX;
			const dy = e.clientY - s.startY;
			const now = performance.now();
			const dt = Math.max(1, now - s.lastT);
			s.vx = (e.clientX - s.lastX) / dt;
			s.lastX = e.clientX;
			s.lastT = now;
			if (!s.locked) {
				if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
				if (Math.abs(dy) > Math.abs(dx) * 1.15) {
					s.locked = "v";
					session.current = null;
					setDragging(false);
					setP(openRef.current ? 1 : 0);
					return;
				}
				s.locked = "h";
				setDragging(true);
			}
			if (s.locked !== "h") return;
			e.preventDefault();
			if (s.from === "closed") setP(-dx / DRAWER);
			else setP(1 - dx / DRAWER);
		}
		function up(e) {
			const s = session.current;
			if (!s || s.pointerId !== e.pointerId) return;
			if (s.locked === "h") finish();
			else session.current = null;
		}
		window.addEventListener("pointerdown", down, {
			capture: true,
			passive: true
		});
		window.addEventListener("pointermove", move, {
			capture: true,
			passive: false
		});
		window.addEventListener("pointerup", up, { capture: true });
		window.addEventListener("pointercancel", up, { capture: true });
		return () => {
			window.removeEventListener("pointerdown", down, true);
			window.removeEventListener("pointermove", move, true);
			window.removeEventListener("pointerup", up, true);
			window.removeEventListener("pointercancel", up, true);
		};
	}, [finish, setP]);
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			if (e.key === "Escape" && openRef.current) close();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [close]);
	return {
		open,
		progress,
		dragging,
		openMenu,
		close,
		onDrawerPointerDown: (0, import_react.useCallback)((e) => {
			if (!openRef.current) return;
			if (e.button !== 0) return;
			session.current = {
				startX: e.clientX,
				startY: e.clientY,
				from: "open",
				locked: null,
				lastX: e.clientX,
				lastT: performance.now(),
				vx: 0,
				pointerId: e.pointerId
			};
			e.currentTarget.setPointerCapture(e.pointerId);
		}, []),
		onPointerMove: (0, import_react.useCallback)((e) => {
			const s = session.current;
			if (!s || s.pointerId !== e.pointerId || s.from !== "open") return;
			const dx = e.clientX - s.startX;
			const dy = e.clientY - s.startY;
			const now = performance.now();
			const dt = Math.max(1, now - s.lastT);
			s.vx = (e.clientX - s.lastX) / dt;
			s.lastX = e.clientX;
			s.lastT = now;
			if (!s.locked) {
				if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
				if (Math.abs(dy) > Math.abs(dx) * 1.15) {
					s.locked = "v";
					session.current = null;
					return;
				}
				s.locked = "h";
				setDragging(true);
			}
			if (s.locked !== "h") return;
			setP(1 - dx / DRAWER);
		}, [setP]),
		onPointerUp: (0, import_react.useCallback)((e) => {
			const s = session.current;
			if (!s || s.pointerId !== e.pointerId || s.from !== "open") return;
			if (s.locked === "h") finish();
			else session.current = null;
		}, [finish])
	};
}
function AppShell() {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const notes = useCampusStore((s) => s.notes);
	const unread = unreadCount(notes);
	const drawer = useRightDrawer();
	const composeOpen = useCampusStore((s) => s.composeOpen);
	const dropOpen = useCampusStore((s) => s.dropOpen);
	const setDropOpen = useCampusStore((s) => s.setDropOpen);
	const squareView = useCampusStore((s) => s.squareView);
	const setSquareView = useCampusStore((s) => s.setSquareView);
	const hideTabs = pathname.startsWith("/bud") || pathname.startsWith("/welcome");
	const [away, setAway] = (0, import_react.useState)(false);
	const lastY = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (!pathname.startsWith("/bud")) sessionStorage.setItem("unibud-last-path", pathname);
		if (pathname !== "/") setSquareView("feed");
	}, [pathname, setSquareView]);
	(0, import_react.useEffect)(() => {
		lastY.current = window.scrollY;
		const onScroll = () => {
			const y = window.scrollY;
			const down = y > lastY.current + 6;
			const up = y < lastY.current - 6;
			if (down && y > 24) setAway(true);
			else if (up || y < 16) setAway(false);
			lastY.current = y;
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [pathname]);
	const hidden = hideTabs ? false : away || squareView === "peek";
	const showPrimary = !hideTabs && squareView !== "peek";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: [
			hideTabs ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: cn("fixed inset-x-0 top-0 z-30 bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur-sm transition-transform duration-200", hidden ? "-translate-y-full" : "translate-y-0"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto flex h-12 max-w-3xl items-center px-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						"aria-label": "UNIBUD",
						className: "flex items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {
							size: "header",
							className: "object-left"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/search",
							"aria-label": "Search",
							title: "Search",
							className: "grid size-11 place-items-center rounded-full text-foreground hover:bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/notifications",
							"aria-label": "Notifications",
							title: "Notifications",
							className: "relative grid size-11 place-items-center rounded-full text-foreground hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-5" }), unread > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute top-1.5 right-1.5 grid min-w-4 place-items-center rounded-full bg-bud px-1 text-[10px] font-semibold text-bud-foreground",
								children: unread
							}) : null]
						})]
					})]
				}), hideTabs || squareView === "peek" ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrimaryNav, { className: "mx-auto mt-2 max-w-3xl" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("mx-auto min-h-dvh max-w-3xl", hideTabs || squareView === "peek" ? "" : showPrimary ? "pt-[calc(7.25rem+env(safe-area-inset-top))]" : "pt-[calc(3rem+env(safe-area-inset-top))]"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AskBudFab, { menuOpen: drawer.open || hidden || composeOpen || dropOpen }),
			dropOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropSheet, { onClose: () => setDropOpen(false) }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioRoot, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SideMenu, {
				open: drawer.open,
				progress: drawer.progress,
				dragging: drawer.dragging,
				onClose: drawer.close,
				onDrawerPointerDown: drawer.onDrawerPointerDown,
				onPointerMove: drawer.onPointerMove,
				onPointerUp: drawer.onPointerUp
			})
		]
	});
}
var SplitComponent = AppShell;
//#endregion
export { _app_gydk5KZU_exports as a, SplitComponent as component, stopDual as i, openDual as n, startDual as r, currentDual as t };
