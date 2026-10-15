import test from "node:test";
import assert from "node:assert/strict";
import { normalizeCountryCode } from "./types.ts";

test("normalizes ISO alpha-2 country codes", () => {
  assert.equal(normalizeCountryCode(" ng "), "NG");
  assert.equal(normalizeCountryCode("Us"), "US");
});

test("rejects country names and malformed codes rather than guessing", () => {
  assert.throws(() => normalizeCountryCode("Nigeria"), /two-letter ISO/);
  assert.throws(() => normalizeCountryCode("N"), /two-letter ISO/);
  assert.throws(() => normalizeCountryCode("N1"), /two-letter ISO/);
});

test("rejects blank country codes", () => {
  assert.throws(() => normalizeCountryCode("  "), /two-letter ISO/);
});
