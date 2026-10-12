import assert from "node:assert/strict";
import test from "node:test";
import { attendanceEventAction, canTransitionBoardSessionStatus, summarizeAttendanceEvents } from "./session-policy.ts";

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

test("attendance join/leave sequencing is valid and duplicate retries are harmless", () => {
  assert.equal(attendanceEventAction(null, "join"), "record");
  assert.equal(attendanceEventAction("join", "join"), "duplicate");
  assert.equal(attendanceEventAction("join", "leave"), "record");
  assert.equal(attendanceEventAction("leave", "join"), "record");
  assert.equal(attendanceEventAction("leave", "leave"), "duplicate");
  assert.equal(attendanceEventAction(null, "leave"), "invalid");
  assert.equal(attendanceEventAction("leave", "leave"), "duplicate");
});

test("attendance roster clears an old leave when a student rejoins", () => {
  assert.deepEqual(summarizeAttendanceEvents([
    { userId: "student-a", kind: "join", createdAt: "2026-10-11T10:00:00Z" },
    { userId: "student-a", kind: "leave", createdAt: "2026-10-11T10:15:00Z" },
    { userId: "student-a", kind: "join", createdAt: "2026-10-11T10:20:00Z" },
  ]), [
    { userId: "student-a", joined: "2026-10-11T10:00:00Z" },
  ]);
});

test("attendance roster ignores leave events that have no preceding join", () => {
  assert.deepEqual(summarizeAttendanceEvents([
    { userId: "student-a", kind: "leave", createdAt: "2026-10-11T10:15:00Z" },
  ]), [
    { userId: "student-a" },
  ]);
});
