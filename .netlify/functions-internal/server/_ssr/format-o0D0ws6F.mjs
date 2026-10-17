//#region node_modules/.nitro/vite/services/ssr/assets/format-o0D0ws6F.js
var naira = new Intl.NumberFormat("en-NG", {
	style: "currency",
	currency: "NGN",
	maximumFractionDigits: 0
});
function formatNaira(kobo) {
	return naira.format(Math.round(kobo / 100));
}
function koboFromNairaInput(raw) {
	const cleaned = raw.replace(/[^\d.]/g, "");
	if (!cleaned) return null;
	const nairaValue = Number(cleaned);
	if (!Number.isFinite(nairaValue) || nairaValue < 0) return null;
	return Math.round(nairaValue * 100);
}
function relativeTime(iso) {
	const then = new Date(iso).getTime();
	const delta = Math.max(0, Date.now() - then);
	const mins = Math.floor(delta / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours}h`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days}d`;
	return new Date(iso).toLocaleDateString("en-NG", {
		day: "numeric",
		month: "short"
	});
}
function initials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("") || "U";
}
//#endregion
export { relativeTime as i, initials as n, koboFromNairaInput as r, formatNaira as t };
