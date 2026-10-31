import assert from "node:assert/strict";
import test from "node:test";
import { assertAcademicRegistryReviewer, isAcademicRegistryReviewer } from "./review-auth.server.ts";

test("registry reviewer authorization is exact-match and fail-closed", () => {
  assert.equal(isAcademicRegistryReviewer("user-1", ""), false);
  assert.equal(isAcademicRegistryReviewer("user-1", " user-1, user-2 "), true);
  assert.equal(isAcademicRegistryReviewer("USER-1", "user-1"), false);
  assert.equal(isAcademicRegistryReviewer("user-3", "user-1,user-2"), false);
  assert.equal(isAcademicRegistryReviewer("", "user-1"), false);
  assert.throws(
    () => assertAcademicRegistryReviewer("user-3", "user-1,user-2"),
    /Forbidden/,
  );
});
