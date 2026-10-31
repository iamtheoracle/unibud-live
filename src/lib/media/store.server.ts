import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "data", "media");

function assertDurableRuntime() {
  if (process.env.NETLIFY === "true" || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    throw new Error("Durable media storage is not configured for this serverless deployment.");
  }
}

export async function writeMediaBytes(id: string, bytes: Buffer) {
  assertDurableRuntime();
  await mkdir(ROOT, { recursive: true });
  const filePath = path.join(ROOT, id);
  await writeFile(filePath, bytes);
  return filePath;
}

export async function readMediaBytes(id: string) {
  assertDurableRuntime();
  return readFile(path.join(ROOT, id));
}

export async function removeMediaBytes(id: string) {
  assertDurableRuntime();
  try {
    await unlink(path.join(ROOT, id));
  } catch {
    /* already gone */
  }
}

export function parseDataUrl(dataUrl: string): { mime: string; bytes: Buffer } {
  const m = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
  if (!m) throw new Error("Invalid media payload");
  return { mime: m[1], bytes: Buffer.from(m[2], "base64") };
}
