//#region node_modules/.nitro/vite/services/ssr/assets/events-CplBO0C7.js
var events = [];
function recordAudioEvent(e) {
	events.push({
		...e,
		id: `ae-${Date.now()}-${events.length}`,
		at: (/* @__PURE__ */ new Date()).toISOString()
	});
}
//#endregion
export { recordAudioEvent as t };
