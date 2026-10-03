//#region node_modules/.nitro/vite/services/ssr/assets/draft-B9TP0WQX.js
/** Carry a Square/Riff line into Bud without making Bud a feed overlay. */
var BUD_DRAFT_KEY = "unibud-bud-draft";
function setBudDraft(text) {
	if (typeof window === "undefined") return;
	sessionStorage.setItem(BUD_DRAFT_KEY, text.slice(0, 800));
}
function takeBudDraft() {
	if (typeof window === "undefined") return "";
	const t = sessionStorage.getItem("unibud-bud-draft") ?? "";
	sessionStorage.removeItem(BUD_DRAFT_KEY);
	return t;
}
//#endregion
export { takeBudDraft as n, setBudDraft as t };
