import assert from "node:assert/strict";
import test from "node:test";
import { isSafeShareSource, parseShareJson } from "./share.ts";

test("allows HTTPS, HTTP, and same-origin relative media URLs", () => {
  for (const src of [
    "https://cdn.example.test/media.mp4",
    "http://localhost:8080/media.mp4",
    "/api/media/123",
  ]) {
    assert.equal(isSafeShareSource(src), true, src);
  }
});

test("rejects executable, data, and protocol-relative media URLs", () => {
  for (const src of [
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "//evil.example.test/media.mp4",
    "/\\\\evil.example.test/media.mp4",
    "",
  ]) {
    assert.equal(isSafeShareSource(src), false, src);
  }
});

test("rejects unsafe source URLs when parsing stored share JSON", () => {
  assert.equal(parseShareJson(JSON.stringify({ kind: "file", src: "javascript:alert(1)" })), undefined);
});

test("rejects malformed share payloads and unknown kinds", () => {
  assert.equal(parseShareJson("{"), undefined);
  assert.equal(parseShareJson(JSON.stringify({ kind: "executable", src: "https://example.test/x" })), undefined);
});

test("accepts valid shared media payloads", () => {
  assert.deepEqual(parseShareJson(JSON.stringify({
    kind: "video",
    title: "Lecture clip",
    src: "https://cdn.example.test/lecture.mp4",
  })), {
    kind: "video",
    title: "Lecture clip",
    src: "https://cdn.example.test/lecture.mp4",
  });
});
