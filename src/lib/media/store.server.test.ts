import assert from "node:assert/strict";
import test from "node:test";
import { mediaStorageErrorStatus, parseDataUrl, readMediaBytes, removeMediaBytes, writeMediaBytes } from "./store.server.ts";

test("maps missing local or durable objects to 404", () => {
  assert.equal(mediaStorageErrorStatus(Object.assign(new Error("file missing"), { code: "ENOENT" })), 404);
  assert.equal(mediaStorageErrorStatus(new Error("Media object was not found in configured durable storage.")), 404);
});

test("maps object-storage outages and configuration failures to 503", () => {
  assert.equal(mediaStorageErrorStatus(new Error("Media object storage GET failed with status 503.")), 503);
  assert.equal(mediaStorageErrorStatus(new Error("Media object storage configuration is incomplete.")), 503);
  assert.equal(mediaStorageErrorStatus(new Error("network request failed")), 503);
});

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
      readMediaBytes("f4b8c5b4-08aa-4d6d-91e7-0e11a85d3210"),
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
      readMediaBytes("dce29b55-9a11-4a83-81f0-0d24e6c12d20"),
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
      readMediaBytes("b35c7a7a-cf72-49ce-8baf-8c7f2f4e1180"),
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
      writeMediaBytes("8e8e63b4-7d6f-4f38-a9ac-0c6f4ab30f8c", Buffer.from("payload")),
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
      removeMediaBytes("27b7d65c-f2c3-4a8f-90d1-3c5d79a6f040"),
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


test("rejects non-UUID media ids before accessing local or object storage", async () => {
  await assert.rejects(
    readMediaBytes("../../outside-media-root"),
    /Invalid media id/,
  );
  await assert.rejects(
    writeMediaBytes("../unsafe-media-id", Buffer.from("payload")),
    /Invalid media id/,
  );
  await assert.rejects(
    removeMediaBytes("not-a-media-id"),
    /Invalid media id/,
  );
});


test("rejects plain HTTP object storage endpoints in production before network access", async () => {
  const keys = [
    "MEDIA_S3_ENDPOINT",
    "MEDIA_S3_BUCKET",
    "MEDIA_S3_REGION",
    "MEDIA_S3_ACCESS_KEY_ID",
    "MEDIA_S3_SECRET_ACCESS_KEY",
    "NODE_ENV",
  ] as const;
  const previousEnv = new Map(keys.map((key) => [key, process.env[key]]));
  const previousFetch = globalThis.fetch;
  let fetchCalled = false;

  process.env.NODE_ENV = "production";
  process.env.MEDIA_S3_ENDPOINT = "http://storage.example.test";
  process.env.MEDIA_S3_BUCKET = "unibud-media";
  process.env.MEDIA_S3_REGION = "auto";
  process.env.MEDIA_S3_ACCESS_KEY_ID = "test-access-key";
  process.env.MEDIA_S3_SECRET_ACCESS_KEY = "test-secret-key";
  globalThis.fetch = async () => {
    fetchCalled = true;
    return new Response(null, { status: 200 });
  };

  try {
    await assert.rejects(
      readMediaBytes("f4b8c5b4-08aa-4d6d-91e7-0e11a85d3210"),
      /endpoint must use HTTPS/,
    );
    assert.equal(fetchCalled, false, "insecure endpoint must be rejected before sending credentials");
  } finally {
    globalThis.fetch = previousFetch;
    for (const key of keys) {
      const value = previousEnv.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

test("rejects object storage endpoint URLs containing embedded credentials", async () => {
  const keys = [
    "MEDIA_S3_ENDPOINT",
    "MEDIA_S3_BUCKET",
    "MEDIA_S3_REGION",
    "MEDIA_S3_ACCESS_KEY_ID",
    "MEDIA_S3_SECRET_ACCESS_KEY",
  ] as const;
  const previousEnv = new Map(keys.map((key) => [key, process.env[key]]));
  const previousFetch = globalThis.fetch;
  let fetchCalled = false;

  process.env.MEDIA_S3_ENDPOINT = "https://user:password@storage.example.test";
  process.env.MEDIA_S3_BUCKET = "unibud-media";
  process.env.MEDIA_S3_REGION = "auto";
  process.env.MEDIA_S3_ACCESS_KEY_ID = "test-access-key";
  process.env.MEDIA_S3_SECRET_ACCESS_KEY = "test-secret-key";
  globalThis.fetch = async () => {
    fetchCalled = true;
    return new Response(null, { status: 200 });
  };

  try {
    await assert.rejects(
      readMediaBytes("dce29b55-9a11-4a83-81f0-0d24e6c12d20"),
      /must not contain credentials/,
    );
    assert.equal(fetchCalled, false, "credential-bearing endpoint must be rejected before network access");
  } finally {
    globalThis.fetch = previousFetch;
    for (const key of keys) {
      const value = previousEnv.get(key);
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
