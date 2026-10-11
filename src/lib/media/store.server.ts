import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash, createHmac } from "node:crypto";

const ROOT = process.env.MEDIA_STORAGE_DIR || path.join(process.cwd(), "data", "media");
const AWS_ALGORITHM = "AWS4-HMAC-SHA256";

type S3Config = {
  endpoint: string;
  bucket: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

function s3Config(): S3Config | null {
  const endpoint = process.env.MEDIA_S3_ENDPOINT;
  const bucket = process.env.MEDIA_S3_BUCKET;
  const region = process.env.MEDIA_S3_REGION || "auto";
  const accessKeyId = process.env.MEDIA_S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.MEDIA_S3_SECRET_ACCESS_KEY;
  const configured = [endpoint, bucket, accessKeyId, secretAccessKey].filter(Boolean).length;
  if (configured === 0) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Durable media storage is not configured. Set MEDIA_S3_ENDPOINT, MEDIA_S3_BUCKET, MEDIA_S3_ACCESS_KEY_ID and MEDIA_S3_SECRET_ACCESS_KEY.");
    }
    return null;
  }
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error("Media object storage configuration is incomplete.");
  }
  let endpointUrl: URL;
  try {
    endpointUrl = new URL(endpoint);
  } catch {
    throw new Error("Media object storage endpoint must be a valid URL.");
  }
  const isLocalHttp = process.env.NODE_ENV !== "production"
    && endpointUrl.protocol === "http:"
    && ["localhost", "127.0.0.1", "[::1]"].includes(endpointUrl.hostname);
  if (endpointUrl.protocol !== "https:" && !isLocalHttp) {
    throw new Error("Media object storage endpoint must use HTTPS (HTTP is allowed only for local development).");
  }
  if (endpointUrl.username || endpointUrl.password || endpointUrl.search || endpointUrl.hash) {
    throw new Error("Media object storage endpoint must not contain credentials, query parameters, or a fragment.");
  }
  return { endpoint: endpointUrl.toString().replace(/\/$/, ""), bucket, region, accessKeyId, secretAccessKey };
}

function hmac(key: Buffer | string, value: string) {
  return createHmac("sha256", key).update(value, "utf8").digest();
}

function sha256(value: Buffer | string) {
  return createHash("sha256").update(value).digest("hex");
}

function objectRequest(config: S3Config, id: string, method: "GET" | "PUT" | "DELETE", bytes?: Buffer) {
  const endpoint = new URL(config.endpoint);
  const key = `${config.bucket}/${id}`;
  const canonicalUri = `${endpoint.pathname.replace(/\/$/, "")}/${key.split("/").map(encodeURIComponent).join("/")}`.replace(/^$/, "/");
  const url = new URL(endpoint.origin + (canonicalUri.startsWith("/") ? canonicalUri : `/${canonicalUri}`));
  const body = bytes ?? Buffer.alloc(0);
  const payloadHash = sha256(body);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const host = url.host;
  const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
  const canonicalRequest = [method, url.pathname, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const scope = `${dateStamp}/${config.region}/s3/aws4_request`;
  const stringToSign = [AWS_ALGORITHM, amzDate, scope, sha256(canonicalRequest)].join("\n");
  const kDate = hmac(`AWS4${config.secretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, config.region);
  const kService = hmac(kRegion, "s3");
  const kSigning = hmac(kService, "aws4_request");
  const signature = createHmac("sha256", kSigning).update(stringToSign, "utf8").digest("hex");
  const authorization = `${AWS_ALGORITHM} Credential=${config.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
  return { url, init: { method, headers: { Authorization: authorization, "x-amz-content-sha256": payloadHash, "x-amz-date": amzDate, ...(method === "PUT" ? { "Content-Type": "application/octet-stream" } : {}) }, ...(method === "PUT" ? { body } : {}) } as RequestInit };
}

async function objectStorageRequest(id: string, method: "GET" | "PUT" | "DELETE", bytes?: Buffer): Promise<Buffer | null | undefined> {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    throw new Error("Invalid media id.");
  }
  const config = s3Config();
  // undefined means object storage is not configured; null means a configured
  // object store explicitly reported that the requested object is missing.
  if (!config) return undefined;
  const { url, init } = objectRequest(config, id, method, bytes);
  // Signed S3 requests must never follow redirects: a redirect changes the signed host/path
  // and risks sending authenticated storage traffic to an unintended endpoint.
  const response = await fetch(url, { ...init, redirect: "error" });
  if (method === "GET" && response.status === 404) return null;
  if (method === "DELETE" && (response.ok || response.status === 404)) return Buffer.alloc(0);
  if (!response.ok) throw new Error(`Media object storage ${method} failed with status ${response.status}.`);
  return method === "GET" ? Buffer.from(await response.arrayBuffer()) : Buffer.alloc(0);
}

export async function writeMediaBytes(id: string, bytes: Buffer) {
  const stored = await objectStorageRequest(id, "PUT", bytes);
  if (stored !== undefined) return `s3://${process.env.MEDIA_S3_BUCKET}/${id}`;
  await mkdir(ROOT, { recursive: true });
  const filePath = path.join(ROOT, id);
  await writeFile(filePath, bytes);
  return filePath;
}

/** Map storage read failures to HTTP semantics without disguising outages as missing files. */
export function mediaStorageErrorStatus(error: unknown): 404 | 503 {
  if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") return 404;
  if (error instanceof Error && error.message === "Media object was not found in configured durable storage.") return 404;
  return 503;
}

export async function readMediaBytes(id: string) {
  const stored = await objectStorageRequest(id, "GET");
  if (stored !== undefined) {
    if (stored === null) throw new Error("Media object was not found in configured durable storage.");
    return stored;
  }
  if (process.env.NODE_ENV === "production") throw new Error("Durable media storage is not configured.");
  return readFile(path.join(ROOT, id));
}

export async function removeMediaBytes(id: string) {
  const stored = await objectStorageRequest(id, "DELETE");
  if (stored !== undefined) return;
  try {
    await unlink(path.join(ROOT, id));
  } catch {
    /* already gone */
  }
}

export function parseDataUrl(dataUrl: string, maxBytes?: number): { mime: string; bytes: Buffer } {
  const m = /^data:([^;,]+);base64,([A-Za-z0-9+/]*={0,2})$/.exec(dataUrl);
  if (!m) throw new Error("Invalid media payload");
  // Estimate decoded size before allocating a Buffer. This keeps oversized
  // Base64 requests from forcing an unnecessary second large memory allocation.
  const encoded = m[2];
  const estimatedBytes = Math.floor((encoded.length * 3) / 4) - (encoded.endsWith("==") ? 2 : encoded.endsWith("=") ? 1 : 0);
  if (maxBytes !== undefined && estimatedBytes > maxBytes) {
    throw new Error(`Media payload exceeds the ${maxBytes}-byte limit.`);
  }
  // Buffer.from(..., "base64") is intentionally permissive. Reject malformed
  // or non-canonical input instead of silently decoding a different payload.
  if (encoded.length % 4 !== 0 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)) {
    throw new Error("Invalid media payload");
  }
  const bytes = Buffer.from(encoded, "base64");
  if (bytes.toString("base64") !== encoded) throw new Error("Invalid media payload");
  if (maxBytes !== undefined && bytes.length > maxBytes) {
    throw new Error(`Media payload exceeds the ${maxBytes}-byte limit.`);
  }
  return { mime: m[1], bytes };
}
