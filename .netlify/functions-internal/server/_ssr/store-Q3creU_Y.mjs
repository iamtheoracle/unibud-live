import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-Q3creU_Y.js
var OPEN = {
	minAccountDays: 0,
	minConnections: 0,
	minFollowers: 0,
	minAge: 0,
	requireVerified: false,
	requireCreator: false,
	maxStrikes: 99,
	regions: []
};
var DEFAULT_POLICY = {
	call: { ...OPEN },
	live: {
		...OPEN,
		maxStrikes: 2
	},
	stream: {
		...OPEN,
		minAccountDays: 7,
		minConnections: 5,
		requireCreator: true,
		maxStrikes: 0
	}
};
function accountDays(startedAt) {
	const ms = Date.now() - new Date(startedAt).getTime();
	return Math.max(0, Math.floor(ms / 864e5));
}
function evaluate(feature, standing, policy) {
	const rule = policy[feature] ?? OPEN;
	const days = accountDays(standing.startedAt);
	const missing = [];
	if (days < rule.minAccountDays) missing.push({
		key: "minAccountDays",
		have: `${days}d`,
		need: `${rule.minAccountDays}d on UNIBUD`
	});
	if (standing.connections < rule.minConnections) missing.push({
		key: "minConnections",
		have: `${standing.connections}`,
		need: `${rule.minConnections} connections`
	});
	if (standing.followers < rule.minFollowers) missing.push({
		key: "minFollowers",
		have: `${standing.followers}`,
		need: `${rule.minFollowers} followers`
	});
	if (rule.minAge && (standing.age ?? 0) < rule.minAge) missing.push({
		key: "minAge",
		have: standing.age != null ? `${standing.age}` : "unknown",
		need: `${rule.minAge}+`
	});
	if (rule.requireVerified && !standing.verified) missing.push({
		key: "requireVerified",
		have: "unverified",
		need: "a verified account"
	});
	if (rule.requireCreator && !standing.creator) missing.push({
		key: "requireCreator",
		have: "standard",
		need: "Creator pack"
	});
	if (standing.strikes > rule.maxStrikes) missing.push({
		key: "maxStrikes",
		have: `${standing.strikes} strikes`,
		need: `at most ${rule.maxStrikes}`
	});
	if (rule.regions.length && standing.region && !rule.regions.includes(standing.region)) missing.push({
		key: "regions",
		have: standing.region,
		need: "an available region"
	});
	return {
		feature,
		ok: missing.length === 0,
		missing
	};
}
var NEUTRAL_ADJUST = {
	exposure: 0,
	contrast: 0,
	highlights: 0,
	shadows: 0,
	saturation: 0,
	vibrance: 0,
	temperature: 0,
	tint: 0,
	sharpness: 0,
	clarity: 0,
	vignette: 0,
	grain: 0,
	fade: 0
};
var DEFAULT_CAMERA = {
	grid: "off",
	level: false,
	mirrorFront: true,
	hdr: true,
	stabilize: true,
	timer: 0,
	quality: "1080",
	fps: 30,
	flash: "off",
	saveOriginal: true,
	locationMeta: false,
	audio: true,
	handsFree: false,
	greenScreen: false,
	dual: false,
	teleprompter: false
};
function draftFrom(s) {
	return {
		id: `d-${Date.now()}`,
		kind: s.mode === "story" ? "story" : s.video ? "peek" : s.image ? "photo" : "write",
		dest: s.dest,
		caption: s.caption,
		image: s.image,
		originalImage: s.originalImage,
		video: s.video,
		clips: s.clips,
		filterId: s.filterId,
		filterAmount: s.filterAmount,
		adjust: s.adjust,
		aspect: s.mode === "peek" || s.mode === "story" ? "9:16" : "original",
		music: s.music,
		mix: s.mix,
		overlays: s.overlays,
		effectId: s.effectId,
		audience: s.audience,
		topic: s.topic,
		place: s.place,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
var useStudioStore = create()(persist((set, get) => ({
	view: "camera",
	mode: "post",
	intent: "post",
	dest: "square",
	facing: "environment",
	zoom: 1,
	prefs: DEFAULT_CAMERA,
	premium: false,
	clips: [],
	caption: "",
	filterId: "original",
	filterAmount: 1,
	adjust: { ...NEUTRAL_ADJUST },
	effectId: "none",
	favoriteEffects: [],
	recentEffects: [],
	overlays: [],
	mix: [],
	clipVolume: 1,
	clipMute: false,
	audience: "everyone",
	topic: "",
	place: "",
	drafts: [],
	library: [],
	picked: [],
	policy: DEFAULT_POLICY,
	standing: {
		startedAt: (/* @__PURE__ */ new Date(Date.now() - 3456e6)).toISOString(),
		strikes: 0,
		verified: false
	},
	live: {
		on: false,
		title: "",
		viewers: 0,
		lines: []
	},
	undo: [],
	redo: [],
	dualStatus: "off",
	chroma: {
		on: false,
		plate: "#111114",
		tolerance: .38,
		feather: .16
	},
	faceOn: false,
	setView: (view) => set({ view }),
	setMode: (mode) => set({
		mode,
		dest: mode === "story" ? "story" : mode === "peek" ? "peek" : mode === "live" ? "live" : "square"
	}),
	setIntent: (intent) => set({ intent }),
	setDest: (dest, messageId) => set({
		dest,
		messageId
	}),
	setFacing: (facing) => set({ facing }),
	setZoom: (zoom) => set({ zoom: Math.max(1, Math.min(4, zoom)) }),
	patchPrefs: (v) => set((s) => ({ prefs: {
		...s.prefs,
		...v
	} })),
	setPremium: (premium) => set({ premium }),
	setImage: (src, original) => set((s) => ({
		image: src,
		originalImage: original ?? s.originalImage ?? src,
		view: "photo"
	})),
	setVideo: (src) => set((s) => ({
		video: src,
		clips: s.clips.length ? s.clips : [{
			id: `c-${Date.now()}`,
			src,
			duration: 0,
			trimStart: 0,
			trimEnd: 0,
			speed: 1
		}],
		view: "video"
	})),
	addClip: (clip) => set((s) => ({
		clips: [...s.clips, clip],
		video: s.video ?? clip.src
	})),
	patchClip: (id, v) => set((s) => ({ clips: s.clips.map((c) => c.id === id ? {
		...c,
		...v
	} : c) })),
	removeClip: (id) => set((s) => ({ clips: s.clips.filter((c) => c.id !== id) })),
	moveClip: (id, dir) => set((s) => {
		const i = s.clips.findIndex((c) => c.id === id);
		if (i < 0) return s;
		const j = i + dir;
		if (j < 0 || j >= s.clips.length) return s;
		const next = [...s.clips];
		const [item] = next.splice(i, 1);
		next.splice(j, 0, item);
		return { clips: next };
	}),
	setCaption: (caption) => set({ caption }),
	setFilter: (filterId, amount) => set((s) => ({
		filterId,
		filterAmount: amount ?? s.filterAmount
	})),
	patchAdjust: (v) => set((s) => ({ adjust: {
		...s.adjust,
		...v
	} })),
	resetEdit: () => set((s) => ({
		image: s.originalImage ?? s.image,
		filterId: "original",
		filterAmount: 1,
		adjust: { ...NEUTRAL_ADJUST },
		effectId: "none"
	})),
	setEffect: (effectId) => set((s) => ({
		effectId,
		recentEffects: [effectId, ...s.recentEffects.filter((x) => x !== effectId)].slice(0, 12)
	})),
	toggleFavEffect: (id) => set((s) => ({ favoriteEffects: s.favoriteEffects.includes(id) ? s.favoriteEffects.filter((x) => x !== id) : [...s.favoriteEffects, id] })),
	addOverlay: (o) => set((s) => ({ overlays: [...s.overlays, o] })),
	patchOverlay: (id, v) => set((s) => ({ overlays: s.overlays.map((o) => o.id === id ? {
		...o,
		...v
	} : o) })),
	removeOverlay: (id) => set((s) => ({ overlays: s.overlays.filter((o) => o.id !== id) })),
	setMusic: (music) => set({ music }),
	setMusicRef: (musicRef) => set({
		musicRef,
		music: musicRef?.title
	}),
	setClipVolume: (clipVolume) => set({ clipVolume }),
	setClipMute: (clipMute) => set({ clipMute }),
	addMix: (t) => set((s) => ({ mix: [...s.mix, t] })),
	patchMix: (id, v) => set((s) => ({ mix: s.mix.map((x) => x.id === id ? {
		...x,
		...v
	} : x) })),
	removeMix: (id) => set((s) => ({ mix: s.mix.filter((x) => x.id !== id) })),
	moveMix: (id, dir) => set((s) => {
		const i = s.mix.findIndex((x) => x.id === id);
		const j = i + dir;
		if (i < 0 || j < 0 || j >= s.mix.length) return s;
		const next = [...s.mix];
		const [item] = next.splice(i, 1);
		next.splice(j, 0, item);
		return { mix: next };
	}),
	setDualStatus: (dualStatus) => set({ dualStatus }),
	patchChroma: (v) => set((s) => ({ chroma: {
		...s.chroma,
		...v
	} })),
	setFaceOn: (faceOn) => set({ faceOn }),
	setAudience: (audience) => set({ audience }),
	setTopic: (topic) => set({ topic }),
	setPlace: (place) => set({ place }),
	addLibrary: (item) => set((s) => ({ library: [item, ...s.library.filter((x) => x.id !== item.id)].slice(0, 80) })),
	toggleFavorite: (id) => set((s) => ({ library: s.library.map((x) => x.id === id ? {
		...x,
		favorite: !x.favorite
	} : x) })),
	togglePicked: (id) => set((s) => ({ picked: s.picked.includes(id) ? s.picked.filter((x) => x !== id) : [...s.picked, id] })),
	clearPicked: () => set({ picked: [] }),
	saveDraft: () => set((s) => ({ drafts: [draftFrom(s), ...s.drafts].slice(0, 12) })),
	loadDraft: (id) => set((s) => {
		const d = s.drafts.find((x) => x.id === id);
		if (!d) return s;
		return {
			caption: d.caption,
			image: d.image,
			originalImage: d.originalImage,
			video: d.video,
			clips: d.clips,
			filterId: d.filterId,
			filterAmount: d.filterAmount,
			adjust: d.adjust,
			dest: d.dest,
			overlays: d.overlays ?? [],
			effectId: d.effectId ?? "none",
			music: d.music,
			mix: d.mix ?? [],
			view: d.image ? "photo" : d.video ? "video" : "write"
		};
	}),
	clearProject: () => set({
		image: void 0,
		originalImage: void 0,
		video: void 0,
		clips: [],
		caption: "",
		filterId: "original",
		filterAmount: 1,
		adjust: { ...NEUTRAL_ADJUST },
		overlays: [],
		effectId: "none",
		music: void 0,
		mix: [],
		picked: [],
		view: "camera"
	}),
	snapshot: () => set((s) => ({
		undo: [...s.undo, {
			clips: s.clips,
			overlays: s.overlays,
			mix: s.mix
		}].slice(-20),
		redo: []
	})),
	undoLast: () => set((s) => {
		const last = s.undo[s.undo.length - 1];
		if (!last) return s;
		return {
			clips: last.clips,
			overlays: last.overlays,
			mix: last.mix,
			undo: s.undo.slice(0, -1),
			redo: [...s.redo, {
				clips: s.clips,
				overlays: s.overlays,
				mix: s.mix
			}].slice(-20)
		};
	}),
	redoLast: () => set((s) => {
		const last = s.redo[s.redo.length - 1];
		if (!last) return s;
		return {
			clips: last.clips,
			overlays: last.overlays,
			mix: last.mix,
			redo: s.redo.slice(0, -1),
			undo: [...s.undo, {
				clips: s.clips,
				overlays: s.overlays,
				mix: s.mix
			}].slice(-20)
		};
	}),
	startLive: (title) => set({
		live: {
			on: true,
			title,
			viewers: 1,
			lines: [],
			startedAt: (/* @__PURE__ */ new Date()).toISOString()
		},
		view: "live",
		mode: "live"
	}),
	addLiveLine: (line) => set((s) => ({ live: {
		...s.live,
		lines: [...s.live.lines, line].slice(-40)
	} })),
	endLive: () => set((s) => ({
		live: {
			...s.live,
			on: false
		},
		view: "camera"
	})),
	patchPolicy: (v) => set((s) => ({ policy: {
		...s.policy,
		...v
	} }))
}), {
	name: "unibud-studio",
	merge: (persisted, current) => {
		const p = persisted ?? {};
		return {
			...current,
			...p,
			prefs: {
				...DEFAULT_CAMERA,
				...p.prefs ?? {}
			},
			policy: {
				...DEFAULT_POLICY,
				...p.policy ?? {}
			},
			mode: p.mode === "post" || p.mode === "story" || p.mode === "peek" || p.mode === "live" ? p.mode : "post",
			intent: p.intent === "post" || p.intent === "story" || p.intent === "peek" || p.intent === "reel" ? p.intent : "post"
		};
	},
	partialize: (s) => ({
		prefs: s.prefs,
		premium: s.premium,
		drafts: s.drafts.slice(0, 8),
		library: s.library.slice(0, 40),
		favoriteEffects: s.favoriteEffects,
		policy: s.policy,
		standing: s.standing
	})
}));
//#endregion
export { evaluate as n, useStudioStore as r, NEUTRAL_ADJUST as t };
