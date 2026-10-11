import assert from "node:assert/strict";
import test from "node:test";
import { resolveQuadPrivacy, resolveStoredQuadPrivacy } from "./quad-privacy.ts";

test("defaults only an omitted privacy value to public", () => {
  assert.equal(resolveQuadPrivacy(undefined), "public");
});

test("accepts each supported explicit privacy value", () => {
  assert.equal(resolveQuadPrivacy("public"), "public");
  assert.equal(resolveQuadPrivacy("campus"), "campus");
  assert.equal(resolveQuadPrivacy("private"), "private");
});

test("rejects unknown, malformed, and null privacy values instead of making a Quad public", () => {
  for (const value of ["unknown", "Campus", "", null, 0, {}, true]) {
    assert.throws(() => resolveQuadPrivacy(value), /supported Quad privacy setting/);
  }
});

test("rejects unknown or missing stored privacy instead of treating it as public", async () => {
  for (const value of [undefined, null, "unknown", "", "Campus", 0, {}, true]) {
    assert.throws(() => resolveStoredQuadPrivacy(value), /invalid privacy setting/);
  }
});

test("accepts only valid stored privacy values", async () => {
  const { resolveStoredQuadPrivacy } = await import("./quad-privacy.ts");
  assert.equal(resolveStoredQuadPrivacy("public"), "public");
  assert.equal(resolveStoredQuadPrivacy("campus"), "campus");
  assert.equal(resolveStoredQuadPrivacy("private"), "private");
});
