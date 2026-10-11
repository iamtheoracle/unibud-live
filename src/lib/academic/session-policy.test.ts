import assert from "node:assert/strict";
import test from "node:test";
import { canTransitionBoardSessionStatus } from "./session-policy.ts";

test("allows only lecturer-controlled scheduled and live transitions", () => {
  assert.equal(canTransitionBoardSessionStatus("scheduled", "live"), true);
  assert.equal(canTransitionBoardSessionStatus("scheduled", "cancelled"), true);
  assert.equal(canTransitionBoardSessionStatus("live", "ended"), true);
});

test("rejects skipped, reversed, and recording-pipeline transitions", () => {
  const invalid: Array<["scheduled" | "live" | "ended" | "processing" | "available" | "cancelled", "scheduled" | "live" | "ended" | "processing" | "available" | "cancelled"]> = [
    ["scheduled", "ended"],
    ["live", "scheduled"],
    ["ended", "live"],
    ["ended", "available"],
    ["processing", "available"],
    ["cancelled", "live"],
    ["available", "ended"],
  ];
  for (const [current, next] of invalid) {
    assert.equal(canTransitionBoardSessionStatus(current, next), false, `${current} -> ${next}`);
  }
});
