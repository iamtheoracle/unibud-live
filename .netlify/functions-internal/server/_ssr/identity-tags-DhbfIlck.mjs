//#region node_modules/.nitro/vite/services/ssr/assets/identity-tags-DhbfIlck.js
var IDENTITY_TAGS = [
	{
		id: "creator",
		label: "Creator"
	},
	{
		id: "athlete",
		label: "Athlete"
	},
	{
		id: "artist",
		label: "Artist"
	},
	{
		id: "musician",
		label: "Musician"
	},
	{
		id: "entrepreneur",
		label: "Entrepreneur"
	},
	{
		id: "leader",
		label: "Student leader",
		academic: true
	},
	{
		id: "class-rep",
		label: "Class representative",
		academic: true
	}
];
var SOCIAL_PLATFORMS = [
	{
		id: "instagram",
		label: "Instagram",
		host: "instagram.com"
	},
	{
		id: "tiktok",
		label: "TikTok",
		host: "tiktok.com"
	},
	{
		id: "youtube",
		label: "YouTube",
		host: "youtube.com"
	},
	{
		id: "x",
		label: "X",
		host: "x.com"
	},
	{
		id: "spotify",
		label: "Spotify",
		host: "open.spotify.com"
	}
];
function tagLabel(id) {
	return IDENTITY_TAGS.find((t) => t.id === id)?.label ?? id;
}
function hostAllowed(hostname) {
	const host = hostname.replace(/^www\./, "").toLowerCase();
	return SOCIAL_PLATFORMS.some((p) => {
		const want = p.host.replace(/^www\./, "").toLowerCase();
		return host === want || host.endsWith(`.${want}`);
	});
}
function isSafeExternalUrl(url) {
	try {
		const u = new URL(url);
		if (u.protocol !== "https:" && u.protocol !== "http:") return false;
		return hostAllowed(u.hostname);
	} catch {
		return false;
	}
}
//#endregion
export { tagLabel as i, SOCIAL_PLATFORMS as n, isSafeExternalUrl as r, IDENTITY_TAGS as t };
