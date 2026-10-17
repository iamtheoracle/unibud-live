import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as useCampusStore } from "./campus-store-VLAQ_aP0.mjs";
import { r as useStudioStore } from "./store-Q3creU_Y.mjs";
import { t as UnibudMusic } from "./service-BZMn3SFN.mjs";
import { t as Button } from "./button-CoXdmm_3.mjs";
import { u as personByHandle } from "./catalog-DxoFHR0q.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as Route$14 } from "./router-DSOd9OgQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audio._id-DIVFERtO.js
var import_jsx_runtime = require_jsx_runtime();
function AudioPage() {
	const { id } = Route$14.useParams();
	const originals = useCampusStore((s) => s.originalAudios ?? []);
	const saved = useCampusStore((s) => s.savedAudioIds ?? []);
	const saveAudio = useCampusStore((s) => s.saveAudio);
	const unsaveAudio = useCampusStore((s) => s.unsaveAudio);
	const reportAudio = useCampusStore((s) => s.reportAudio);
	const setComposeOpen = useCampusStore((s) => s.setComposeOpen);
	const localPosts = useCampusStore((s) => s.localPosts);
	const audio = originals.find((a) => a.audioId === id);
	if (!audio) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-5 py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "That audio isn’t on UNIBUD."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mt-3 inline-block text-sm font-medium",
			children: "Back to Square"
		})]
	});
	const item = audio;
	const person = personByHandle(item.creatorHandle ?? "");
	const uses = localPosts.filter((p) => p.audioId === item.audioId || item.usedBy.includes(p.id));
	const on = saved.includes(item.audioId);
	function useIt() {
		if (item.status === "removed" || item.status === "restricted") {
			toast.message("This audio isn’t available.");
			return;
		}
		const studio = useStudioStore.getState();
		studio.snapshot();
		studio.addMix({
			id: `oa-${item.audioId}`,
			kind: "catalogue",
			name: item.title,
			src: item.src,
			volume: .85,
			mute: false,
			fadeIn: 0,
			fadeOut: 0,
			artistName: person?.name ?? item.creatorHandle,
			trackId: item.audioId
		});
		studio.setMusicRef({
			providerId: "unibud-original",
			trackId: item.audioId,
			audioId: item.audioId,
			title: item.title,
			artistName: person?.name ?? item.creatorHandle,
			startMs: 0,
			durationMs: item.durationMs,
			entitlement: "free",
			sourceType: "ORIGINAL_AUDIO",
			creatorHandle: item.creatorHandle
		});
		studio.setView("camera");
		setComposeOpen(true);
		toast.message(`Using “${item.title}” — still ${person?.name ?? item.creatorHandle}’s original.`);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "px-5 py-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "kicker",
				children: audio.sourceType === "LICENSED_MUSIC" ? "Music" : "Original audio"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl",
				children: audio.title
			}),
			audio.sourceType === "ORIGINAL_AUDIO" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"by",
					" ",
					audio.creatorHandle ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/u/$handle",
						params: { handle: audio.creatorHandle },
						className: "font-medium text-ink",
						children: person?.name ?? audio.creatorHandle
					}) : "a UNIBUD creator",
					audio.claimedOriginal ? " · claimed original — reports still apply" : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [audio.artistName, " · licensed catalogue"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: [
					audio.usageCount,
					" use",
					audio.usageCount === 1 ? "" : "s",
					audio.durationMs ? ` · ${(audio.durationMs / 1e3).toFixed(1)}s` : "",
					audio.status !== "active" ? ` · ${audio.status}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "secondary",
						disabled: audio.sourceType === "LICENSED_MUSIC" && !UnibudMusic.ready(),
						onClick: () => {
							if (audio.src) {
								document.getElementById("audio-preview")?.play();
								return;
							}
							toast.message(audio.sourceType === "LICENSED_MUSIC" ? UnibudMusic.reason() : "This original has no detached stem yet. Use audio still attaches the credit.");
						},
						children: "Preview"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: useIt,
						disabled: audio.status !== "active",
						children: "Use audio"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => on ? unsaveAudio(audio.audioId) : saveAudio(audio.audioId),
						children: on ? "Saved" : "Save"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => reportAudio(audio.audioId, "rights"),
						children: "Report"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => {
							useCampusStore.getState().setPendingShare({
								kind: "audio",
								audioId: audio.audioId,
								title: audio.title
							});
							toast.message("Open a chat and attach Audio — or share from Chat.");
						},
						children: "Share"
					})
				]
			}),
			audio.src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
				id: "audio-preview",
				className: "mt-3 w-full",
				src: audio.src,
				controls: true
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase",
				children: "Used in"
			}),
			uses.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-2",
				children: uses.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "font-medium",
						children: ["@", p.authorHandle]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [" — ", p.body.slice(0, 80)]
					})]
				}, p.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "The original post is the first use. Reuses will list here."
			}),
			!UnibudMusic.ready() && audio.sourceType === "LICENSED_MUSIC" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-xs text-muted-foreground",
				children: UnibudMusic.reason()
			}) : null
		]
	});
}
//#endregion
export { AudioPage as component };
