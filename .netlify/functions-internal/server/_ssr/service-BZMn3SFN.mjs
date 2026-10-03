//#region node_modules/.nitro/vite/services/ssr/assets/service-BZMn3SFN.js
var active = {
	id: "unibud-none",
	name: "UNIBUD Music",
	status: "unprovisioned",
	reason: "UNIBUD attaches licensed music to posts. It is not a streaming app. A catalogue partner (Apple Music, Spotify, or another licensed provider) is not connected yet — search stays empty. You can still sample original audio from other people.",
	async search(_q) {
		return [];
	},
	async browse() {
		return {
			tracks: [],
			artists: [],
			albums: []
		};
	},
	async artist() {
		return null;
	},
	async album() {
		return null;
	},
	async track() {
		return null;
	},
	async playback() {
		return null;
	},
	async licensing() {
		return null;
	},
	async listenLink() {
		return null;
	},
	capabilities: {
		search: false,
		metadata: false,
		artwork: false,
		preview: false,
		playback: false,
		deepLink: false,
		favorites: false,
		authorization: false,
		commercialUse: false,
		synchronization: false,
		territories: false,
		affiliate: false,
		attribution: false
	}
};
function musicProvider() {
	return active;
}
/** UNIBUD Music Service — Mix never talks to a file picker for commercial tracks. */
var UnibudMusic = {
	status() {
		return musicProvider().status;
	},
	reason() {
		return musicProvider().reason;
	},
	ready() {
		return musicProvider().status === "licensed" || musicProvider().status === "preview";
	},
	search(q) {
		return musicProvider().search(q);
	},
	browse() {
		return musicProvider().browse();
	},
	track(id) {
		return musicProvider().track(id);
	},
	preview(trackId) {
		return musicProvider().playback(trackId, "preview");
	},
	playable(trackId) {
		return musicProvider().playback(trackId, "stream");
	},
	licensing(trackId) {
		return musicProvider().licensing(trackId);
	},
	listenLink(trackId) {
		return musicProvider().listenLink(trackId);
	},
	capabilities() {
		return musicProvider().capabilities;
	},
	async select(track, startMs = 0) {
		const play = track.rights.studioUse ? await musicProvider().playback(track.id, "stream") : await musicProvider().playback(track.id, "preview");
		const ref = {
			providerId: track.providerId,
			trackId: track.id,
			title: track.title,
			artistName: track.artistName,
			artwork: track.artwork,
			startMs,
			durationMs: track.durationMs,
			entitlement: track.entitlement
		};
		return {
			mix: {
				id: `cat-${track.id}`,
				kind: "catalogue",
				name: track.artistName ? `${track.title} · ${track.artistName}` : track.title,
				src: play?.url,
				volume: .8,
				mute: false,
				fadeIn: 0,
				fadeOut: 0,
				start: startMs / 1e3,
				trackId: track.id,
				providerId: track.providerId,
				artistName: track.artistName
			},
			ref,
			play
		};
	},
	entitlementLabel(e) {
		if (e === "unavailable") return "Not available here";
		if (e === "preview") return "Preview only";
		if (e === "premium") return "Needs Music+";
		if (e === "ads") return "With ads";
		return "Licensed";
	}
};
//#endregion
export { UnibudMusic as t };
