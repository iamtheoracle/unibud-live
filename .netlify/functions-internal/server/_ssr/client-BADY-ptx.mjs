import { i as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Bj0T-8qm.mjs";
import { r as createSsrRpc } from "./server-3ArcV-Gz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-BADY-ptx.js
var uploadMedia = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("1e34b454461a6dea40d1f75c4b85357e086fb4e0350f590a0cb2b7baf30bbc6d"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(createSsrRpc("4b67e236f662d21a514c1937cbb9192a0f87191084893d4256798edbdd6860c3"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("be48a0f7ff4ac4a713dc48106173eab8f5d42407ded7d0b7a2512b978ab688ad"));
var listBudMedia = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("00140fc91cf7581c81ea598be246f72e93008a3cf361df9bb14b5b748b8efcda"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("ca3cf27d519d4b2ee189844c3ff263d589aab31ee430ae843c459f01e888a2d3"));
var listRoomMessages = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((roomId) => roomId).handler(createSsrRpc("c59528282e2807d52b219965f187d917a45b81da80e2a8c2a2e7a23bf968eec2"));
var sendRoomMessage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("57ec43f815e73a4bfe062db1cc8a54381a5d2aa1730d731bc37c01f83d393909"));
var persistAudioEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("177b8d6828ab6e008c4bf0f0386fc55cbc5edc338277cdbb6ea2a747cb36efe6"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("fcf21d5703f16cd08eec2aa81458aad1deffa615bc77a99740351d060cd17a2f"));
function fileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const r = new FileReader();
		r.onload = () => resolve(String(r.result));
		r.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that file"));
		r.readAsDataURL(file);
	});
}
//#endregion
export { sendRoomMessage as a, persistAudioEvent as i, listBudMedia as n, uploadMedia as o, listRoomMessages as r, fileToDataUrl as t };
