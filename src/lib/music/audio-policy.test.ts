import assert from "node:assert/strict";
import test from "node:test";
import { canRecordAudioEvent, isAudioAvailableForSharing } from "./audio-policy.ts";

test("only active audio can be newly shared or played", () => {
  assert.equal(isAudioAvailableForSharing("active"), true);
  for (const status of ["reported", "restricted", "removed", undefined, null, "", "ACTIVE", 0]) {
    assert.equal(isAudioAvailableForSharing(status), false, String(status));
  }
});

test("non-report events cannot be recorded against restricted or removed audio", () => {
  assert.equal(canRecordAudioEvent("active", "preview"), true);
  for (const status of ["reported", "restricted", "removed", undefined, null]) {
    assert.equal(canRecordAudioEvent(status, "preview"), false, String(status));
  }
});

test("report events remain recordable for known audio statuses", () => {
  for (const status of ["active", "reported", "restricted", "removed"]) {
    assert.equal(canRecordAudioEvent(status, "report"), true);
  }
  assert.equal(canRecordAudioEvent(undefined, "report"), false);
});
