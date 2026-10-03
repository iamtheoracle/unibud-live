import path from "node:path";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
//#region node_modules/.nitro/vite/services/ssr/assets/store.server-BHpVpEmr.js
var ROOT = path.join(process.cwd(), "data", "media");
async function writeMediaBytes(id, bytes) {
	await mkdir(ROOT, { recursive: true });
	const filePath = path.join(ROOT, id);
	await writeFile(filePath, bytes);
	return filePath;
}
async function readMediaBytes(id) {
	return readFile(path.join(ROOT, id));
}
async function removeMediaBytes(id) {
	try {
		await unlink(path.join(ROOT, id));
	} catch {}
}
function parseDataUrl(dataUrl) {
	const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
	if (!m) throw new Error("Invalid media payload");
	return {
		mime: m[1],
		bytes: Buffer.from(m[2], "base64")
	};
}
//#endregion
export { writeMediaBytes as i, readMediaBytes as n, removeMediaBytes as r, parseDataUrl as t };
