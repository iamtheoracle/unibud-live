import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime, i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/react+tanstack__react-query.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { t as recordAudioEvent } from "./events-CplBO0C7.mjs";
import { A as Mic, D as Paperclip, G as Download, S as Plus, W as Ellipsis, X as ChevronLeft, d as Sparkles, it as ArrowUp, r as Volume2, t as X, u as Trash2 } from "../_libs/lucide-react.mjs";
import { g as cn } from "./router-DSOd9OgQ.mjs";
import { n as useAuthReady, t as SignInCard } from "./sign-in-gate-rXdNMVWJ.mjs";
import { o as courseByCode } from "./academic-yrmQUZab.mjs";
import { s as listEnrollments } from "./server-C79XTJTu.mjs";
import { n as mediaUrl } from "./types-DSXVAMNP.mjs";
import { a as retryBud, i as listBudConversations, n as deleteBudConversation, r as getBudThread, t as askBud } from "./server-Bn1J_VW6.mjs";
import { n as takeBudDraft } from "./draft-B9TP0WQX.mjs";
import { n as listBudMedia, o as uploadMedia, t as fileToDataUrl } from "./client-BADY-ptx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bud-BoyS7DH1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV_RE = /^NAV:(\/[A-Za-z0-9/_-]*)\s*$/m;
var LABELS = {
	"/": "Square",
	"/money": "Wallet",
	"/market": "Market",
	"/riff": "Riff",
	"/connect": "Connect",
	"/communities": "Communities",
	"/board": "UniBoard",
	"/studies": "Studies",
	"/watch": "Watch",
	"/profile": "Profile",
	"/settings": "Settings",
	"/fixer": "The Fixer",
	"/search": "Search"
};
function splitBudNav(text) {
	const m = text.match(NAV_RE);
	if (!m) return { body: text.trim() };
	const to = m[1];
	return {
		body: text.replace(NAV_RE, "").trim(),
		nav: {
			to,
			label: LABELS[to] ?? to.replace(/^\//, "")
		}
	};
}
/** Render Bud text as conversation, not raw markdown. */
function BudRichText({ text }) {
	const { body, nav } = splitBudNav(text);
	const blocks = body.split(/\n{2,}/).filter((b) => b.trim());
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3 text-sm leading-relaxed",
		children: [blocks.map((block, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Block, { text: block.trim() }, i)), nav ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: nav.to,
			className: "inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm font-medium text-paper",
			children: ["Open ", nav.label]
		}) : null]
	});
}
function Block({ text }) {
	const vis = text.match(/^\[\[bud-visual\]\]([\s\S]+)$/);
	if (vis) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-2xl bg-secondary p-3",
		dangerouslySetInnerHTML: { __html: vis[1] }
	});
	const heading = text.match(/^(#{1,3})\s+(.+)$/);
	if (heading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "font-semibold",
		children: inline(heading[2])
	});
	const lines = text.split("\n");
	if (lines.every((l) => /^\s*([-*]|\d+\.)\s+/.test(l))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-1 pl-4",
		children: lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "list-disc",
			children: inline(l.replace(/^\s*([-*]|\d+\.)\s+/, ""))
		}, i))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [i ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}) : null, inline(l)] }, i)) });
}
function inline(raw) {
	const out = [];
	const re = /(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|`[^`]+`|<u>[^<]+<\/u>)/g;
	let last = 0;
	let m;
	let k = 0;
	while (m = re.exec(raw)) {
		if (m.index > last) out.push(raw.slice(last, m.index));
		const token = m[0];
		if (token.startsWith("**")) out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: token.slice(2, -2) }, k));
		else if (token.startsWith("__") || token.startsWith("<u>")) {
			const inner = token.startsWith("__") ? token.slice(2, -2) : token.slice(3, -4);
			out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "underline decoration-foreground/40 underline-offset-2",
				children: inner
			}, k));
		} else if (token.startsWith("*")) out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: token.slice(1, -1) }, k));
		else out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded bg-secondary px-1 text-[0.85em]",
			children: token.slice(1, -1)
		}, k));
		k += 1;
		last = m.index + token.length;
	}
	if (last < raw.length) out.push(raw.slice(last));
	return out;
}
function plainBudText(text) {
	return splitBudNav(text).body.replace(/\*\*|__|#+\s+|`|<u>|<\/u>/g, "").replace(/\s+/g, " ").trim();
}
function ThreadMedia({ media, onRetry }) {
	const src = media.src || (media.mediaId ? mediaUrl(media.mediaId) : void 0);
	if (media.status === "generating") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-xs text-muted-foreground",
		children: "Generating… staying in this chat."
	});
	if (media.status === "failed") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-2 text-xs text-muted-foreground",
		children: ["Couldn’t generate that. ", onRetry ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "font-medium",
			onClick: onRetry,
			children: "Try again"
		}) : "Try again."]
	});
	if ((media.kind === "audio" || media.kind === "voice") && src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
		className: "mt-2 w-full max-w-[16rem]",
		src,
		controls: true,
		preload: "metadata"
	});
	if ((media.kind === "image" || media.kind === "gif") && src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt: "",
		className: cn("mt-2 max-h-64 w-full rounded-xl object-cover", media.kind === "gif" && "object-contain")
	});
	if (media.kind === "file" && src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
		href: src,
		className: "mt-2 block text-xs underline",
		download: true,
		children: media.name ?? "File"
	});
	return null;
}
function makeRec() {
	if (typeof window === "undefined") return null;
	const C = window.SpeechRecognition || window.webkitSpeechRecognition;
	if (!C) return null;
	const rec = new C();
	rec.lang = "en-NG";
	rec.interimResults = false;
	return rec;
}
function useBudVoice() {
	const [listening, setListening] = (0, import_react.useState)(false);
	const recRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		return () => {
			try {
				recRef.current?.stop();
			} catch {}
			if (typeof window !== "undefined") window.speechSynthesis?.cancel();
		};
	}, []);
	function listen(onText) {
		const rec = recRef.current ?? makeRec();
		recRef.current = rec;
		if (!rec) return false;
		rec.onresult = (ev) => {
			const t = ev.results[0]?.[0]?.transcript?.trim();
			if (t) onText(t);
		};
		rec.onend = () => setListening(false);
		try {
			rec.start();
			setListening(true);
			return true;
		} catch {
			setListening(false);
			return false;
		}
	}
	function stop() {
		try {
			recRef.current?.stop();
		} catch {}
		setListening(false);
	}
	function speak(text) {
		if (typeof window === "undefined" || !window.speechSynthesis) return;
		window.speechSynthesis.cancel();
		const u = new SpeechSynthesisUtterance(text);
		u.rate = .96;
		u.pitch = 1;
		window.speechSynthesis.speak(u);
	}
	return {
		listen,
		stop,
		speak,
		listening,
		canListen: typeof window !== "undefined" && Boolean(makeRec())
	};
}
var PROMPTS = [
	"What are we covering in CSC 301?",
	"Explain this simply",
	"Help with an assignment",
	"What topic comes next?",
	"Give me practice questions",
	"When is my exam?"
];
var ACTIVE_KEY = "unibud-bud-active";
var EMPTY_ATLAS = {
	lastGoal: "",
	understood: [],
	struggles: [],
	likes: []
};
function timeLabel(iso) {
	try {
		return new Date(iso).toLocaleTimeString([], {
			hour: "numeric",
			minute: "2-digit"
		});
	} catch {
		return "";
	}
}
function BudWorkspace() {
	const { user, isPending } = useAuthReady();
	const navigate = useNavigate();
	const qc = useQueryClient();
	useCampusStore((s) => s.role ?? "student");
	const [focusId, setFocusId] = (0, import_react.useState)(null);
	const [activeId, setActiveId] = (0, import_react.useState)(() => {
		if (typeof window === "undefined") return null;
		return sessionStorage.getItem(ACTIVE_KEY);
	});
	const [freshChat, setFreshChat] = (0, import_react.useState)(false);
	const [historyOpen, setHistoryOpen] = (0, import_react.useState)(false);
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [purpose, setPurpose] = (0, import_react.useState)("learn");
	const [purposeOpen, setPurposeOpen] = (0, import_react.useState)(false);
	const [coursesOpen, setCoursesOpen] = (0, import_react.useState)(false);
	const [recording, setRecording] = (0, import_react.useState)(false);
	const recRef = (0, import_react.useRef)(null);
	const recChunks = (0, import_react.useRef)([]);
	const [attachment, setAttachment] = (0, import_react.useState)(null);
	const [pendingUser, setPendingUser] = (0, import_react.useState)(null);
	const scroller = (0, import_react.useRef)(null);
	const fileRef = (0, import_react.useRef)(null);
	const inputRef = (0, import_react.useRef)(null);
	const voice = useBudVoice();
	const atlas = useCampusStore((s) => s.budAtlas) ?? EMPTY_ATLAS;
	const interests = useCampusStore((s) => s.interests);
	const convos = useQuery({
		queryKey: ["bud-convos"],
		queryFn: () => listBudConversations(),
		enabled: Boolean(user)
	});
	const mediaQ = useQuery({
		queryKey: ["bud-media"],
		queryFn: () => listBudMedia(),
		enabled: Boolean(user)
	});
	const enrolled = useQuery({
		queryKey: ["enroll"],
		queryFn: () => listEnrollments(),
		enabled: Boolean(user)
	});
	(0, import_react.useEffect)(() => {
		const id = sessionStorage.getItem("unibud-bud-media");
		if (!id) return;
		setFocusId(id);
		sessionStorage.removeItem("unibud-bud-media");
		recordAudioEvent({
			kind: "bud_media_open",
			budMediaId: id,
			surface: "bud"
		});
	}, []);
	(0, import_react.useEffect)(() => {
		const draft = takeBudDraft();
		if (draft) setPrompt(draft);
	}, []);
	const thread = useQuery({
		queryKey: ["bud", activeId],
		queryFn: () => getBudThread({ data: { conversationId: activeId ?? void 0 } }),
		enabled: Boolean(user) && Boolean(activeId)
	});
	const messages = activeId ? thread.data ?? [] : [];
	const empty = !activeId || messages.length === 0;
	(0, import_react.useEffect)(() => {
		if (activeId) sessionStorage.setItem(ACTIVE_KEY, activeId);
		else sessionStorage.removeItem(ACTIVE_KEY);
	}, [activeId]);
	(0, import_react.useEffect)(() => {
		if (freshChat) return;
		if (!activeId && convos.data?.length) setActiveId(convos.data[0].id);
	}, [
		activeId,
		convos.data,
		freshChat
	]);
	(0, import_react.useEffect)(() => {
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const el = scroller.current;
		if (!el) return;
		el.scrollTop = el.scrollHeight;
	}, [messages.length, thread.isFetching]);
	const ask = useMutation({
		mutationFn: (input) => askBud({ data: {
			prompt: input.text,
			conversationId: activeId ?? void 0,
			attachment: attachment ? {
				name: attachment.name,
				kind: attachment.kind,
				excerpt: attachment.excerpt
			} : input.media ? {
				name: input.media.name ?? "media",
				kind: input.media.kind
			} : void 0,
			media: input.media ?? attachment?.media,
			fromPath: typeof window !== "undefined" ? sessionStorage.getItem("unibud-last-path") ?? void 0 : void 0,
			atlas: {
				lastGoal: atlas?.lastGoal,
				understood: atlas?.understood,
				struggles: atlas?.struggles,
				likes: atlas?.likes?.length ? atlas.likes : interests
			}
		} }),
		onSuccess: async (r) => {
			setPrompt("");
			setAttachment(null);
			setPendingUser(null);
			setFreshChat(false);
			if ("conversationId" in r && r.conversationId && r.conversationId !== activeId) setActiveId(r.conversationId);
			await qc.invalidateQueries({ queryKey: ["bud"] });
			await qc.invalidateQueries({ queryKey: ["bud-convos"] });
		},
		onError: () => setPendingUser(null)
	});
	const remove = useMutation({
		mutationFn: (id) => deleteBudConversation({ data: { id } }),
		onSuccess: async (_, id) => {
			if (activeId === id) setActiveId(null);
			await qc.invalidateQueries({ queryKey: ["bud-convos"] });
			await qc.invalidateQueries({ queryKey: ["bud"] });
		}
	});
	const retry = useMutation({
		mutationFn: () => retryBud({ data: { conversationId: activeId } }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["bud"] });
		}
	});
	function send(text) {
		const t = text.trim();
		if (!t && !attachment?.media || ask.isPending) return;
		const tagged = !t ? attachment?.media?.kind === "voice" ? "Voice note" : "Sent media" : purpose === "learn" ? t : `[${purpose}] ${t}`;
		setPendingUser(tagged);
		setPrompt("");
		ask.mutate({
			text: tagged,
			media: attachment?.media
		});
	}
	function close() {
		if (typeof window !== "undefined" && window.history.length > 1) window.history.back();
		else navigate({ to: "/" });
	}
	async function onFile(file) {
		if (!file) return null;
		let excerpt;
		if (file.type.startsWith("text/") && file.size < 8e4) excerpt = (await file.text()).slice(0, 2e3);
		let media;
		const kind = file.type.startsWith("image/") ? file.type.includes("gif") ? "gif" : "image" : file.type.startsWith("audio/") ? "audio" : "file";
		try {
			const dataUrl = await fileToDataUrl(file);
			const up = await uploadMedia({ data: {
				dataUrl,
				fileName: file.name,
				mime: file.type
			} });
			media = {
				kind,
				name: file.name,
				status: "ready",
				mediaId: up.ok ? up.id : void 0,
				src: up.ok ? mediaUrl(up.id) : dataUrl
			};
		} catch {
			media = {
				kind,
				name: file.name,
				status: "failed"
			};
		}
		const next = {
			name: file.name,
			kind: file.type || "file",
			excerpt,
			media
		};
		setAttachment(next);
		return next;
	}
	async function toggleVoiceNote() {
		if (recording) {
			recRef.current?.stop();
			recRef.current?.stream.getTracks().forEach((t) => t.stop());
			recRef.current = null;
			setRecording(false);
			return;
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			const rec = new MediaRecorder(stream);
			recChunks.current = [];
			rec.ondataavailable = (e) => {
				if (e.data.size) recChunks.current.push(e.data);
			};
			rec.onstop = () => {
				(async () => {
					const blob = new Blob(recChunks.current, { type: rec.mimeType || "audio/webm" });
					const next = await onFile(new File([blob], `voice-${Date.now()}.webm`, { type: blob.type }));
					if (next?.media) {
						next.media.kind = "voice";
						next.name = "Voice note";
						setAttachment(next);
						setPendingUser("Voice note");
						ask.mutate({
							text: "Voice note",
							media: {
								...next.media,
								kind: "voice"
							}
						});
					}
				})();
			};
			recRef.current = rec;
			rec.start();
			setRecording(true);
		} catch {
			if (!voice.listen((t) => send(t))) setPrompt((p) => p || "Microphone isn’t available. Type instead.");
		}
	}
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-24 h-40 max-w-3xl animate-pulse rounded-2xl bg-secondary" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40 flex flex-col bg-background pt-[env(safe-area-inset-top)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BudTop, {
			onClose: close,
			onMenu: () => {}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto w-full max-w-3xl px-5 py-10",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignInCard, {
				title: "Talk to Bud",
				body: "Sign in so Bud can keep this conversation with you."
			})
		})]
	});
	const failed = ask.isError || ask.data && ask.data.ok === false;
	const busy = ask.isPending || retry.isPending;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-40 flex flex-col bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border pt-[env(safe-area-inset-top)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BudTop, {
					onClose: close,
					onMenu: () => {
						setMenuOpen((v) => !v);
						setHistoryOpen(false);
					}
				})
			}),
			menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute top-[calc(env(safe-area-inset-top)+3rem)] right-3 z-50 w-56 rounded-2xl bg-card p-1 shadow-soft ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-11 w-full items-center gap-2 rounded-xl px-3 text-sm hover:bg-secondary",
						onClick: () => {
							setFreshChat(true);
							setActiveId(null);
							sessionStorage.removeItem(ACTIVE_KEY);
							setHistoryOpen(false);
							setMenuOpen(false);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " New conversation"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex h-11 w-full items-center gap-2 rounded-xl px-3 text-sm hover:bg-secondary",
						onClick: () => {
							setHistoryOpen(true);
							setMenuOpen(false);
						},
						children: "History"
					}),
					activeId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "flex h-11 w-full items-center gap-2 rounded-xl px-3 text-sm text-destructive hover:bg-secondary",
						onClick: () => {
							remove.mutate(activeId);
							setMenuOpen(false);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Delete conversation"]
					}) : null
				]
			}) : null,
			historyOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute inset-0 z-50 flex flex-col bg-background pt-[env(safe-area-inset-top)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-12 items-center justify-between px-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 text-sm font-medium",
						children: "Conversations"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "grid size-11 place-items-center rounded-full",
						"aria-label": "Close history",
						onClick: () => setHistoryOpen(false),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex-1 overflow-y-auto px-3 pb-8",
					children: (convos.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-3 py-8 text-sm text-muted-foreground",
						children: "No conversations yet."
					}) : (convos.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "min-w-0 flex-1 rounded-xl px-3 py-3 text-left hover:bg-secondary",
							onClick: () => {
								setActiveId(c.id);
								setHistoryOpen(false);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: c.title
							}), c.preview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-0.5 truncate text-xs text-muted-foreground",
								children: c.preview
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "grid size-11 place-items-center text-muted-foreground",
							"aria-label": `Delete ${c.title}`,
							onClick: () => remove.mutate(c.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})]
					}, c.id))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: scroller,
				className: "mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-y-auto overscroll-contain px-4",
				children: empty && !busy && !pendingUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col justify-center py-10",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid size-12 place-items-center rounded-2xl bg-ink text-paper",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-6 font-display text-4xl",
							children: "Hey, I’m Bud."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground",
							children: "Talk, type, send a voice note, or drop in a photo. I’ll stay in this conversation."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-8 flex flex-wrap gap-2",
							children: PROMPTS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => send(p),
								className: "h-11 rounded-full bg-card px-4 text-sm ring-1 ring-border",
								children: p
							}, p))
						}),
						(enrolled.data ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "mt-6 text-left text-xs text-muted-foreground",
							onClick: () => setCoursesOpen(true),
							children: ["This semester · ", (enrolled.data ?? []).map((c) => c.code).join(" · ")]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 text-xs text-muted-foreground",
							children: "Add your courses in Studies when you want academic context."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4 py-5",
					children: [
						messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: cn("max-w-[88%]", m.role === "user" ? "ml-auto" : "mr-auto"),
							children: [
								m.role === "assistant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-1 text-[11px] font-medium text-muted-foreground",
									children: "Bud"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: cn("rounded-2xl px-4 py-3 text-sm leading-relaxed", m.role === "user" ? "bg-ink text-paper" : "bg-card ring-1 ring-border"),
									children: [m.role === "assistant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BudRichText, { text: m.content }) : m.content, m.media ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreadMedia, { media: m.media }) : null]
								}),
								m.role === "assistant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "grid size-9 place-items-center rounded-full text-muted-foreground",
											"aria-label": "Listen to Bud",
											onClick: () => voice.speak(plainBudText(m.content)),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" })
										}),
										m.media?.kind === "image" || m.media?.kind === "gif" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "h-9 rounded-full px-3 text-xs font-medium text-muted-foreground",
											onClick: () => {
												useCampusStore.getState().setPendingShare({
													kind: "bud",
													title: "From Bud",
													mediaId: m.media?.mediaId,
													src: m.media?.src
												});
												navigate({ to: "/messages" });
											},
											children: "Share"
										}) : null,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											className: "grid size-9 place-items-center rounded-full text-muted-foreground",
											"aria-label": "Save as notes",
											onClick: () => {
												const blob = new Blob([plainBudText(m.content)], { type: "text/plain" });
												const a = document.createElement("a");
												a.href = URL.createObjectURL(blob);
												a.download = "bud-notes.txt";
												a.click();
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" })
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: cn("mt-1 text-[11px] text-muted-foreground", m.role === "user" && "text-right"),
									children: timeLabel(m.createdAt)
								})
							]
						}, m.id)),
						pendingUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
							className: "ml-auto max-w-[88%]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl bg-ink px-4 py-3 text-sm leading-relaxed text-paper",
								children: [pendingUser, attachment?.media ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreadMedia, { media: attachment.media }) : null]
							})
						}) : null,
						busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mr-auto max-w-[88%]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-1 text-[11px] font-medium text-muted-foreground",
								children: "Bud"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-2xl bg-card px-4 py-3 text-sm text-muted-foreground ring-1 ring-border",
								children: /\b(image|gif|illustration)\b/i.test(pendingUser ?? "") ? "Generating… staying in this chat." : "Bud is thinking…"
							})]
						}) : null,
						failed && !busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "Bud couldn’t finish that."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "h-9 rounded-full px-3 text-sm font-medium ring-1 ring-border",
								onClick: () => activeId && retry.mutate(),
								children: "Try again"
							})]
						}) : null
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mx-auto w-full max-w-3xl px-3 pt-2",
				style: { paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" },
				onSubmit: (e) => {
					e.preventDefault();
					send(prompt);
				},
				children: [
					attachment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 overflow-hidden rounded-2xl bg-secondary px-3 py-2 text-xs",
						children: [attachment.media ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThreadMedia, { media: attachment.media }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate",
							children: attachment.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-1 text-muted-foreground",
							onClick: () => setAttachment(null),
							children: "Remove"
						})]
					}) : null,
					recording ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs text-muted-foreground",
						children: "Recording a voice note… tap the mic to send."
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center gap-2 overflow-x-auto text-[11px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("shrink-0 rounded-full px-3 py-1.5", purposeOpen ? "bg-ink text-paper" : "bg-secondary"),
							onClick: () => setPurposeOpen((v) => !v),
							children: purpose === "learn" ? "Learn" : purpose === "practice" ? "Practice" : purpose === "assignment" ? "Assignment" : purpose === "revision" ? "Revision" : "Exam prep"
						}), purposeOpen ? [
							"learn",
							"practice",
							"assignment",
							"revision",
							"exam"
						].map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("shrink-0 rounded-full px-3 py-1.5", purpose === id ? "bg-ink text-paper" : "bg-secondary"),
							onClick: () => {
								setPurpose(id);
								setPurposeOpen(false);
							},
							children: id === "learn" ? "Learn" : id === "practice" ? "Practice" : id === "assignment" ? "Assignment" : id === "revision" ? "Revision" : "Exam prep"
						}, id)) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-2 rounded-[1.75rem] bg-secondary p-1.5 ring-1 ring-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								ref: fileRef,
								type: "file",
								className: "hidden",
								onChange: (e) => {
									onFile(e.target.files?.[0]);
									e.target.value = "";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "grid size-11 shrink-0 place-items-center rounded-full text-muted-foreground",
								"aria-label": "Attach a file",
								onClick: () => fileRef.current?.click(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: cn("grid size-11 shrink-0 place-items-center rounded-full", recording || voice.listening ? "bg-ink text-paper" : "text-muted-foreground"),
								"aria-label": recording ? "Stop voice note" : "Voice note",
								onClick: () => void toggleVoiceNote(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								ref: inputRef,
								rows: 1,
								value: prompt,
								placeholder: "Message Bud",
								className: "max-h-28 min-h-11 flex-1 resize-none bg-transparent py-3 text-sm outline-none",
								onChange: (e) => {
									setPrompt(e.target.value);
									e.target.style.height = "auto";
									e.target.style.height = `${Math.min(e.target.scrollHeight, 112)}px`;
								},
								onKeyDown: (e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										send(prompt);
									}
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy || !prompt.trim() && !attachment?.media,
								"aria-label": "Send",
								className: "grid size-11 shrink-0 place-items-center rounded-full bg-ink text-paper disabled:opacity-30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "size-5" })
							})
						]
					})
				]
			}),
			coursesOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 z-20 bg-ink/40",
				onClick: () => setCoursesOpen(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-x-0 bottom-0 rounded-t-3xl bg-background p-5",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold",
							children: "This semester"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: "Bud uses these courses as context. They live in Studies and Board — not as another assistant."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2 text-sm",
							children: (enrolled.data ?? []).map((c) => {
								const sy = courseByCode(c.code);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									c.code,
									" · ",
									c.title
								] }), sy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: sy.topics.slice(0, 3).join(" · ")
								}) : null] }, c.id);
							})
						}),
						(mediaQ.data ?? []).length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 space-y-2",
							children: (mediaQ.data ?? []).slice(0, 4).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: cn("rounded-2xl bg-card p-3 ring-1 ring-border", focusId === m.id && "ring-bud"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: m.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: m.course
									}),
									m.mediaId && m.status === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
										className: "mt-2 w-full",
										src: mediaUrl(m.mediaId),
										controls: true,
										onPlay: () => recordAudioEvent({
											kind: "bud_media_play",
											budMediaId: m.id,
											surface: "bud"
										})
									}) : null
								]
							}, m.id))
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "mt-4 h-11 w-full rounded-full bg-secondary text-sm",
							onClick: () => setCoursesOpen(false),
							children: "Close"
						})
					]
				})
			}) : null
		]
	});
}
function BudTop({ onClose, onMenu }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mx-auto flex h-12 w-full max-w-3xl items-center justify-between px-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "grid size-11 place-items-center rounded-full",
				"aria-label": "Close Bud",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid size-7 place-items-center rounded-full bg-ink text-paper",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold",
					children: "Bud"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onMenu,
				className: "grid size-11 place-items-center rounded-full",
				"aria-label": "Conversation actions",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-5" })
			})
		]
	});
}
function Bud() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BudWorkspace, {});
}
//#endregion
export { Bud as component };
