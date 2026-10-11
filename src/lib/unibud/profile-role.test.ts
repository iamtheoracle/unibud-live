import test from "node:test";
import assert from "node:assert/strict";
import { resolveProfileRole } from "./profile-role.ts";

test("profile edits cannot grant privileged campus roles", () => {
  assert.equal(resolveProfileRole("governor"), "student");
  assert.equal(resolveProfileRole("lecturer"), "student");
  assert.equal(resolveProfileRole("moderator"), "student");
});

test("existing role is retained unless user downgrades to student", () => {
  assert.equal(resolveProfileRole(undefined, "lecturer"), "lecturer");
  assert.equal(resolveProfileRole("governor", "moderator"), "moderator");
  assert.equal(resolveProfileRole("student", "governor"), "student");
});
