import assert from "node:assert/strict";
import test from "node:test";
import { parseDataUrl, readMediaBytes, removeMediaBytes, writeMediaBytes } from "./store.server.ts";

test("parses valid Base64 media data URLs", () => {
  const parsed = parseDataUrl("data:text/plain;base64,aGVsbG8=");
  assert.equal(parsed.mime, "text/plain");
  assert.equal(parsed.bytes.toString("utf8"), "hello");
});

test("rejects payloads above the configured byte limit", () => {
  assert.throws(
    () => parseDataUrl("data:application/octet-stream;base64,aGVsbG8=", 4),
    /byte limit/,
  );
});

test("rejects malformed Base64 before decoding", () => {
  for (const encoded of ["A=", "abc", "AB=="]) {
    assert.throws(
      () => parseDataUrl(`data:application/octet-stream;base64,${encoded}`),
      /Invalid media payload/,
    );
  }
});

test("accepts empty Base64 payloads as valid encoding", () => {
  const parsed = parseDataUrl("data:application/octet-stream;base64,");
  assert.equal(parsed.bytes.length, 0);
});


test("does not fall back to local files when configured object storage reports a missing object", async () => {
  const keys = [
    "MEDIA_S3_ENDPOINT",
    "MEDIA_S3_BUCKET",
    "MEDIA_S3_REGION",
    "MEDIA_S3_ACCESS_KEY_ID",
    "MEDIA_S3_SECRET_ACCESS_KEY",
  ] as const;
  const previousEnv = new Map(keys.map((key) => [key, process.env[key]]));
  const previousFetch = globalThis.fetch;

  process.env.MEDIA_S3_ENDPOINT = "https://storage.example.test";
  process.env.MEDIA_S3_BUCKET = "unibud-media";
  process.env.MEDIA_S3_REGION = "auto";
  process.env.MEDIA_S3_ACCESS_KEY_ID = "test-access-key";
  process.env.MEDIA_S3_SECRET_ACCESS_KEY = "test-secret-key";
  globalThis.fetch = async () => new Response(null, { status: 404 });

  try {
    await assert.rejects(
      readMediaBytes("definitely-missing-object-storage-test"),
      /not found in configured durable storage/,
    );
  } finally {
    globalThis.fetch = previousFetch;
    for (const key of keys) {
      const value = previousEnv.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});


test("does not fall back to local files when configured object storage returns a server error", async () => {
  const keys = [
    "MEDIA_S3_ENDPOINT",
    "MEDIA_S3_BUCKET",
    "MEDIA_S3_REGION",
    "MEDIA_S3_ACCESS_KEY_ID",
    "MEDIA_S3_SECRET_ACCESS_KEY",
  ] as const;
  const previousEnv = new Map(keys.map((key) => [key, process.env[key]]));
  const previousFetch = globalThis.fetch;

  process.env.MEDIA_S3_ENDPOINT = "https://storage.example.test";
  process.env.MEDIA_S3_BUCKET = "unibud-media";
  process.env.MEDIA_S3_REGION = "auto";
  process.env.MEDIA_S3_ACCESS_KEY_ID = "test-access-key";
  process.env.MEDIA_S3_SECRET_ACCESS_KEY = "test-secret-key";
  globalThis.fetch = async () => new Response("upstream failure", { status: 503 });

  try {
    await assert.rejects(
      readMediaBytes("object-storage-error-test"),
      /Media object storage GET failed with status 503/,
    );
  } finally {
    globalThis.fetch = previousFetch;
    for (const key of keys) {
      const value = previousEnv.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("rejects incomplete object storage configuration instead of silently using local storage", async () => {
  const keys = [
    "MEDIA_S3_ENDPOINT",
    "MEDIA_S3_BUCKET",
    "MEDIA_S3_REGION",
    "MEDIA_S3_ACCESS_KEY_ID",
    "MEDIA_S3_SECRET_ACCESS_KEY",
  ] as const;
  const previousEnv = new Map(keys.map((key) => [key, process.env[key]]));

  process.env.MEDIA_S3_ENDPOINT = "https://storage.example.test";
  process.env.MEDIA_S3_BUCKET = "unibud-media";
  process.env.MEDIA_S3_REGION = "auto";
  process.env.MEDIA_S3_ACCESS_KEY_ID = "test-access-key";
  delete process.env.MEDIA_S3_SECRET_ACCESS_KEY;

  try {
    await assert.rejects(
      readMediaBytes("incomplete-object-storage-config-test"),
      /Media object storage configuration is incomplete/,
    );
  } finally {
    for (const key of keys) {
      const value = previousEnv.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});


test("failed object storage writes reject instead of falling back to local disk", async () => {
  const keys = [
    "MEDIA_S3_ENDPOINT",
    "MEDIA_S3_BUCKET",
    "MEDIA_S3_REGION",
    "MEDIA_S3_ACCESS_KEY_ID",
    "MEDIA_S3_SECRET_ACCESS_KEY",
  ] as const;
  const previousEnv = new Map(keys.map((key) => [key, process.env[key]]));
  const previousFetch = globalThis.fetch;

  process.env.MEDIA_S3_ENDPOINT = "https://storage.example.test";
  process.env.MEDIA_S3_BUCKET = "unibud-media";
  process.env.MEDIA_S3_REGION = "auto";
  process.env.MEDIA_S3_ACCESS_KEY_ID = "test-access-key";
  process.env.MEDIA_S3_SECRET_ACCESS_KEY = "test-secret-key";
  globalThis.fetch = async (_input, init) => {
    assert.equal(init?.method, "PUT");
    return new Response("upstream failure", { status: 503 });
  };

  try {
    await assert.rejects(
      writeMediaBytes("object-storage-put-error-test", Buffer.from("payload")),
      /Media object storage PUT failed with status 503/,
    );
  } finally {
    globalThis.fetch = previousFetch;
    for (const key of keys) {
      const value = previousEnv.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("failed object storage deletes surface an error instead of claiming cleanup succeeded", async () => {
  const keys = [
    "MEDIA_S3_ENDPOINT",
    "MEDIA_S3_BUCKET",
    "MEDIA_S3_REGION",
    "MEDIA_S3_ACCESS_KEY_ID",
    "MEDIA_S3_SECRET_ACCESS_KEY",
  ] as const;
  const previousEnv = new Map(keys.map((key) => [key, process.env[key]]));
  const previousFetch = globalThis.fetch;

  process.env.MEDIA_S3_ENDPOINT = "https://storage.example.test";
  process.env.MEDIA_S3_BUCKET = "unibud-media";
  process.env.MEDIA_S3_REGION = "auto";
  process.env.MEDIA_S3_ACCESS_KEY_ID = "test-access-key";
  process.env.MEDIA_S3_SECRET_ACCESS_KEY = "test-secret-key";
  globalThis.fetch = async (_input, init) => {
    assert.equal(init?.method, "DELETE");
    return new Response("upstream failure", { status: 503 });
  };

  try {
    await assert.rejects(
      removeMediaBytes("object-storage-delete-error-test"),
      /Media object storage DELETE failed with status 503/,
    );
  } finally {
    globalThis.fetch = previousFetch;
    for (const key of keys) {
      const value = previousEnv.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
