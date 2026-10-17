//#region node_modules/.nitro/vite/services/ssr/assets/types-DSXVAMNP.js
function kindFromMime(mime) {
	if (mime.startsWith("image/")) return "photo";
	if (mime.startsWith("video/")) return "video";
	if (mime.startsWith("audio/")) return "audio";
	return "file";
}
function mediaUrl(id) {
	return `/api/media/${id}`;
}
//#endregion
export { mediaUrl as n, kindFromMime as t };
