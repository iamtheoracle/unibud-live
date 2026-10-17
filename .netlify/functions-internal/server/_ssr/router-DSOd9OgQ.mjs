import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as useRouter, V as redirect, _ as createFileRoute, d as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, u as Scripts, v as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, r as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { i as createServerFn, n as __exportAll } from "./ssr.mjs";
import { L as string, N as number, P as object, R as union, j as literal } from "../_libs/@better-auth/core+[...].mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as getSql } from "./db-CZ1suuUF.mjs";
import { a as getListing, i as getCampusCatalog, r as createSsrRpc } from "./server-3ArcV-Gz.mjs";
import { l as TriangleAlert } from "../_libs/lucide-react.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as auth } from "./server-3Ms4XWlD.mjs";
import { n as readMediaBytes } from "./store.server-BHpVpEmr.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-BMNH7Y3X.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function isUnauthorized(error) {
	if (!error || typeof error !== "object") return false;
	const e = error;
	return e.message === "Unauthorized" || e.status === 401;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-DSOd9OgQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-destructive",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-medium",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted-foreground",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-o6Lm26Dn.css";
var APP_NAME = "UNIBUD";
var queryClient = new QueryClient({ defaultOptions: { queries: {
	staleTime: 2e4,
	retry: 1,
	refetchOnWindowFocus: false
} } });
var fetchSessionUser = createServerFn({ method: "GET" }).handler(createSsrRpc("2c4985e96c199268f7f639534cb5e8e31d6b19d43286bf77416413db60ffde26"));
var Route$46 = createRootRoute({
	beforeLoad: async () => ({ sessionUser: await fetchSessionUser() }),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "UNIBUD — people, ideas, culture, and learning in one place."
			},
			{
				name: "theme-color",
				content: "#f7f7f8"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/brand/unibud-32.png"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/brand/unibud-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&display=swap"
			}
		]
	}),
	component: Root
});
function Root() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
				client: queryClient,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
					theme: "light",
					position: "top-center",
					toastOptions: { className: "bg-card text-foreground border-border" }
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-secondary", className),
		...props
	});
}
var $$splitComponentImporter$38 = () => import("../_app-gydk5KZU.mjs").then((n) => n.a);
var Route$45 = createFileRoute("/_app")({
	loader: () => getCampusCatalog(),
	component: lazyRouteComponent($$splitComponentImporter$38, "component"),
	pendingComponent: Pending
});
function Pending() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-6 h-48 w-full rounded-2xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-4 h-32 w-full rounded-2xl" })
		]
	});
}
var $$splitComponentImporter$37 = () => import("./login-D_ZYpXKd.mjs");
var Route$44 = createFileRoute("/login")({
	validateSearch: (s) => ({ mode: s.mode === "up" ? "up" : s.mode === "in" ? "in" : void 0 }),
	component: lazyRouteComponent($$splitComponentImporter$37, "component")
});
var $$splitComponentImporter$36 = () => import("../_app-lVe-8PZd.mjs");
var Route$43 = createFileRoute("/_app/")({ component: lazyRouteComponent($$splitComponentImporter$36, "component") });
var $$splitComponentImporter$35 = () => import("./board-Cv3Cw1l_.mjs");
var Route$42 = createFileRoute("/_app/board")({ component: lazyRouteComponent($$splitComponentImporter$35, "component") });
var $$splitComponentImporter$34 = () => import("./bud-BoyS7DH1.mjs");
var Route$41 = createFileRoute("/_app/bud")({ component: lazyRouteComponent($$splitComponentImporter$34, "component") });
var $$splitComponentImporter$33 = () => import("./communities-CNuLX6Dv.mjs");
var Route$40 = createFileRoute("/_app/communities")({ component: lazyRouteComponent($$splitComponentImporter$33, "component") });
var $$splitComponentImporter$32 = () => import("./connect-JRxtN__S.mjs");
var Route$39 = createFileRoute("/_app/connect")({ component: lazyRouteComponent($$splitComponentImporter$32, "component") });
var $$splitComponentImporter$31 = () => import("./creator-C_WoBTkP.mjs");
var Route$38 = createFileRoute("/_app/creator")({ component: lazyRouteComponent($$splitComponentImporter$31, "component") });
/** Discovery is mixed into Square. This was a second destination. */
var Route$37 = createFileRoute("/_app/discovery")({ beforeLoad: () => {
	throw redirect({ to: "/" });
} });
var $$splitComponentImporter$30 = () => import("./feedback-BW1jen1E.mjs");
var Route$36 = createFileRoute("/_app/feedback")({ component: lazyRouteComponent($$splitComponentImporter$30, "component") });
var $$splitComponentImporter$29 = () => import("./fixer-rEA1cPhJ.mjs");
var Route$35 = createFileRoute("/_app/fixer")({ component: lazyRouteComponent($$splitComponentImporter$29, "component") });
var $$splitComponentImporter$28 = () => import("./help-DDjn9x03.mjs");
var Route$34 = createFileRoute("/_app/help")({ component: lazyRouteComponent($$splitComponentImporter$28, "component") });
var $$splitComponentImporter$27 = () => import("./live-BsVxdlcc.mjs");
var Route$33 = createFileRoute("/_app/live")({ component: lazyRouteComponent($$splitComponentImporter$27, "component") });
var $$splitComponentImporter$26 = () => import("./market-CBt_UIbT.mjs");
var Route$32 = createFileRoute("/_app/market")({
	validateSearch: (s) => ({ cat: typeof s.cat === "string" ? s.cat : "all" }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./messages-Cxsbc3IS.mjs");
var Route$31 = createFileRoute("/_app/messages")({ component: lazyRouteComponent($$splitComponentImporter$25, "component") });
var $$splitComponentImporter$24 = () => import("./money-CDYmzfUE.mjs");
var Route$30 = createFileRoute("/_app/money")({
	validateSearch: (s) => ({ tab: typeof s.tab === "string" ? s.tab : "wallet" }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./news-BMFXyWGF.mjs");
var Route$29 = createFileRoute("/_app/news")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./notifications-B3zO95Cs.mjs");
var Route$28 = createFileRoute("/_app/notifications")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./podcasts-CBtBM6_G.mjs");
var Route$27 = createFileRoute("/_app/podcasts")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./profile-yCnqzjSm.mjs");
var Route$26 = createFileRoute("/_app/profile")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./riff-BcNkM6Cv.mjs");
var Route$25 = createFileRoute("/_app/riff")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./saved-CXs2FJdC.mjs");
var Route$24 = createFileRoute("/_app/saved")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./search-CdzEY2M_.mjs");
var Route$23 = createFileRoute("/_app/search")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./sell-Bkqeq9J7.mjs");
var Route$22 = createFileRoute("/_app/sell")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./settings-CbrOjdrn.mjs");
var Route$21 = createFileRoute("/_app/settings")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
/** Square is the social feed. This path used to be a second feed. */
var Route$20 = createFileRoute("/_app/social")({ beforeLoad: () => {
	throw redirect({ to: "/" });
} });
var Route$19 = createFileRoute("/_app/spill")({ beforeLoad: () => {
	throw redirect({ to: "/riff" });
} });
var $$splitComponentImporter$14 = () => import("./studies-D_oMTaAA.mjs");
var Route$18 = createFileRoute("/_app/studies")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./tutor-CiqEliAF.mjs");
var Route$17 = createFileRoute("/_app/tutor")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
/** Peek lives on Square. /watch was a second video surface. */
var Route$16 = createFileRoute("/_app/watch")({ beforeLoad: () => {
	if (typeof sessionStorage !== "undefined") sessionStorage.setItem("unibud-square-mode", "peek");
	throw redirect({ to: "/" });
} });
var $$splitComponentImporter$12 = () => import("./welcome-C5kw7pi3.mjs");
var Route$15 = createFileRoute("/_app/welcome")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./audio._id-DIVFERtO.mjs");
var Route$14 = createFileRoute("/_app/audio/$id")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./board._id-CZrGrfLZ.mjs");
var Route$13 = createFileRoute("/_app/board/$id")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./bud.communities-Dy0b30jx.mjs");
var Route$12 = createFileRoute("/_app/bud/communities")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./bud.fixer-BF60ssWf.mjs");
var Route$11 = createFileRoute("/_app/bud/fixer")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("../_communityId-CvJ5teTG.mjs");
var Route$10 = createFileRoute("/_app/communities/$communityId")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./communities._id-CHelrx9j.mjs");
var Route$9 = createFileRoute("/_app/communities/$id")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./market-ZHcItc8G.mjs");
var Route$8 = createFileRoute("/_app/market/")({
	validateSearch: (s) => ({ cat: typeof s.cat === "string" ? s.cat : "all" }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./market._id-C-PUMQen.mjs");
var Route$7 = createFileRoute("/_app/market/$id")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("../_listingId-WHZry4Xf.mjs");
var Route$6 = createFileRoute("/_app/market/$listingId")({
	loader: ({ params }) => getListing({ data: params.listingId }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./messages._id-wBrAqHl5.mjs");
var Route$5 = createFileRoute("/_app/messages/$id")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./riff._id-U_W_hwZ8.mjs");
var Route$4 = createFileRoute("/_app/riff/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var Route$3 = createFileRoute("/_app/spill/$id")({ beforeLoad: ({ params }) => {
	throw redirect({
		to: "/riff/$id",
		params: { id: params.id }
	});
} });
var $$splitComponentImporter = () => import("./u._handle-DBYsFseo.mjs");
var Route$2 = createFileRoute("/_app/u/$handle")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route$1 = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var Route = createFileRoute("/api/media/$id")({ server: { handlers: { GET: async ({ params }) => {
	const id = params.id;
	const row = (await (await getSql())`select mime_type, status, visibility from media_assets where id = ${id} limit 1`)[0];
	if (!row || String(row.status) === "deleted") return new Response("Gone", { status: 404 });
	if (String(row.status) !== "ready") return new Response("Not ready", { status: 409 });
	try {
		const bytes = await readMediaBytes(id);
		return new Response(bytes, { headers: {
			"Content-Type": String(row.mime_type),
			"Cache-Control": "private, max-age=3600",
			"X-Content-Type-Options": "nosniff"
		} });
	} catch {
		return new Response("Missing file", { status: 404 });
	}
} } } });
var AppRoute = Route$45.update({
	id: "/_app",
	getParentRoute: () => Route$46
});
var LoginRoute = Route$44.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$46
});
var AppIndexRoute = Route$43.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppRoute
});
var AppBoardRoute = Route$42.update({
	id: "/board",
	path: "/board",
	getParentRoute: () => AppRoute
});
var AppBudRoute = Route$41.update({
	id: "/bud",
	path: "/bud",
	getParentRoute: () => AppRoute
});
var AppCommunitiesRoute = Route$40.update({
	id: "/communities",
	path: "/communities",
	getParentRoute: () => AppRoute
});
var AppConnectRoute = Route$39.update({
	id: "/connect",
	path: "/connect",
	getParentRoute: () => AppRoute
});
var AppCreatorRoute = Route$38.update({
	id: "/creator",
	path: "/creator",
	getParentRoute: () => AppRoute
});
var AppDiscoveryRoute = Route$37.update({
	id: "/discovery",
	path: "/discovery",
	getParentRoute: () => AppRoute
});
var AppFeedbackRoute = Route$36.update({
	id: "/feedback",
	path: "/feedback",
	getParentRoute: () => AppRoute
});
var AppFixerRoute = Route$35.update({
	id: "/fixer",
	path: "/fixer",
	getParentRoute: () => AppRoute
});
var AppHelpRoute = Route$34.update({
	id: "/help",
	path: "/help",
	getParentRoute: () => AppRoute
});
var AppLiveRoute = Route$33.update({
	id: "/live",
	path: "/live",
	getParentRoute: () => AppRoute
});
var AppMarketRoute = Route$32.update({
	id: "/market",
	path: "/market",
	getParentRoute: () => AppRoute
});
var AppMessagesRoute = Route$31.update({
	id: "/messages",
	path: "/messages",
	getParentRoute: () => AppRoute
});
var AppMoneyRoute = Route$30.update({
	id: "/money",
	path: "/money",
	getParentRoute: () => AppRoute
});
var AppNewsRoute = Route$29.update({
	id: "/news",
	path: "/news",
	getParentRoute: () => AppRoute
});
var AppNotificationsRoute = Route$28.update({
	id: "/notifications",
	path: "/notifications",
	getParentRoute: () => AppRoute
});
var AppPodcastsRoute = Route$27.update({
	id: "/podcasts",
	path: "/podcasts",
	getParentRoute: () => AppRoute
});
var AppProfileRoute = Route$26.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AppRoute
});
var AppRiffRoute = Route$25.update({
	id: "/riff",
	path: "/riff",
	getParentRoute: () => AppRoute
});
var AppSavedRoute = Route$24.update({
	id: "/saved",
	path: "/saved",
	getParentRoute: () => AppRoute
});
var AppSearchRoute = Route$23.update({
	id: "/search",
	path: "/search",
	getParentRoute: () => AppRoute
});
var AppSellRoute = Route$22.update({
	id: "/sell",
	path: "/sell",
	getParentRoute: () => AppRoute
});
var AppSettingsRoute = Route$21.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => AppRoute
});
var AppSocialRoute = Route$20.update({
	id: "/social",
	path: "/social",
	getParentRoute: () => AppRoute
});
var AppSpillRoute = Route$19.update({
	id: "/spill",
	path: "/spill",
	getParentRoute: () => AppRoute
});
var AppStudiesRoute = Route$18.update({
	id: "/studies",
	path: "/studies",
	getParentRoute: () => AppRoute
});
var AppTutorRoute = Route$17.update({
	id: "/tutor",
	path: "/tutor",
	getParentRoute: () => AppRoute
});
var AppWatchRoute = Route$16.update({
	id: "/watch",
	path: "/watch",
	getParentRoute: () => AppRoute
});
var AppWelcomeRoute = Route$15.update({
	id: "/welcome",
	path: "/welcome",
	getParentRoute: () => AppRoute
});
var AppAudioIdRoute = Route$14.update({
	id: "/audio/$id",
	path: "/audio/$id",
	getParentRoute: () => AppRoute
});
var AppBoardIdRoute = Route$13.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AppBoardRoute
});
var AppBudCommunitiesRoute = Route$12.update({
	id: "/communities",
	path: "/communities",
	getParentRoute: () => AppBudRoute
});
var AppBudFixerRoute = Route$11.update({
	id: "/fixer",
	path: "/fixer",
	getParentRoute: () => AppBudRoute
});
var AppCommunitiesCommunityIdRoute = Route$10.update({
	id: "/$communityId",
	path: "/$communityId",
	getParentRoute: () => AppCommunitiesRoute
});
var AppCommunitiesIdRoute = Route$9.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AppCommunitiesRoute
});
var AppMarketIndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => AppMarketRoute
});
var AppMarketIdRoute = Route$7.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AppMarketRoute
});
var AppMarketListingIdRoute = Route$6.update({
	id: "/$listingId",
	path: "/$listingId",
	getParentRoute: () => AppMarketRoute
});
var AppMessagesIdRoute = Route$5.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AppMessagesRoute
});
var AppRiffIdRoute = Route$4.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AppRiffRoute
});
var AppSpillIdRoute = Route$3.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AppSpillRoute
});
var AppUHandleRoute = Route$2.update({
	id: "/u/$handle",
	path: "/u/$handle",
	getParentRoute: () => AppRoute
});
var ApiAuthSplatRoute = Route$1.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$46
});
var ApiMediaIdRoute = Route.update({
	id: "/api/media/$id",
	path: "/api/media/$id",
	getParentRoute: () => Route$46
});
var AppBoardRouteChildren = { AppBoardIdRoute };
var AppBoardRouteWithChildren = AppBoardRoute._addFileChildren(AppBoardRouteChildren);
var AppBudRouteChildren = {
	AppBudCommunitiesRoute,
	AppBudFixerRoute
};
var AppBudRouteWithChildren = AppBudRoute._addFileChildren(AppBudRouteChildren);
var AppCommunitiesRouteChildren = {
	AppCommunitiesCommunityIdRoute,
	AppCommunitiesIdRoute
};
var AppCommunitiesRouteWithChildren = AppCommunitiesRoute._addFileChildren(AppCommunitiesRouteChildren);
var AppMarketRouteChildren = {
	AppMarketIdRoute,
	AppMarketListingIdRoute,
	AppMarketIndexRoute
};
var AppMarketRouteWithChildren = AppMarketRoute._addFileChildren(AppMarketRouteChildren);
var AppMessagesRouteChildren = { AppMessagesIdRoute };
var AppMessagesRouteWithChildren = AppMessagesRoute._addFileChildren(AppMessagesRouteChildren);
var AppRiffRouteChildren = { AppRiffIdRoute };
var AppRiffRouteWithChildren = AppRiffRoute._addFileChildren(AppRiffRouteChildren);
var AppSpillRouteChildren = { AppSpillIdRoute };
var AppRouteChildren = {
	AppBoardRoute: AppBoardRouteWithChildren,
	AppBudRoute: AppBudRouteWithChildren,
	AppCommunitiesRoute: AppCommunitiesRouteWithChildren,
	AppConnectRoute,
	AppCreatorRoute,
	AppDiscoveryRoute,
	AppFeedbackRoute,
	AppFixerRoute,
	AppHelpRoute,
	AppLiveRoute,
	AppMarketRoute: AppMarketRouteWithChildren,
	AppMessagesRoute: AppMessagesRouteWithChildren,
	AppMoneyRoute,
	AppNewsRoute,
	AppNotificationsRoute,
	AppPodcastsRoute,
	AppProfileRoute,
	AppRiffRoute: AppRiffRouteWithChildren,
	AppSavedRoute,
	AppSearchRoute,
	AppSellRoute,
	AppSettingsRoute,
	AppSocialRoute,
	AppSpillRoute: AppSpillRoute._addFileChildren(AppSpillRouteChildren),
	AppStudiesRoute,
	AppTutorRoute,
	AppWatchRoute,
	AppWelcomeRoute,
	AppIndexRoute,
	AppAudioIdRoute,
	AppUHandleRoute
};
var rootRouteChildren = {
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	LoginRoute,
	ApiAuthSplatRoute,
	ApiMediaIdRoute
};
var routeTree = Route$46._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		defaultPreload: "intent",
		scrollRestoration: true
	});
}
//#endregion
export { isUnauthorized as _, Route$6 as a, Route$9 as c, Route$14 as d, Route$30 as f, cn as g, Skeleton as h, Route$5 as i, Route$10 as l, Route$44 as m, Route$2 as n, Route$7 as o, Route$32 as p, Route$4 as r, Route$8 as s, router_exports as t, Route$13 as u };
