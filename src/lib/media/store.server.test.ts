import assert from "node:assert/strict";
import test from "node:test";
import { parseDataUrl } from "./store.server.ts";

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
