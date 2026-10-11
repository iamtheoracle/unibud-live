import { test } from "node:test";
import assert from "node:assert/strict";
import { applyQualifyingShare, emptyLync, localDayKey } from "./lync.ts";

test("app open does not change Lync — only applyQualifyingShare does", () => {
  const s = emptyLync();
  assert.equal(s.count, 0);
  assert.equal(s.status, "inactive");
});

test("same-day share does not double count", () => {
  const day = new Date("2026-10-05T12:00:00");
  const a = applyQualifyingShare(emptyLync(), day);
  const b = applyQualifyingShare(a.state, new Date("2026-10-05T18:00:00"));
  assert.equal(a.state.count, 1);
  assert.equal(b.state.count, 1);
  assert.equal(b.events.length, 0);
});

test("consecutive days grow Lync and activate at threshold 2", () => {
  const d1 = new Date("2026-10-05T12:00:00");
  const d2 = new Date("2026-10-06T12:00:00");
  const a = applyQualifyingShare(emptyLync(), d1);
  const b = applyQualifyingShare(a.state, d2);
  assert.equal(a.state.count, 1);
  assert.equal(a.state.status, "inactive");
  assert.equal(b.state.count, 2);
  assert.equal(b.state.status, "active");
  assert.ok(b.events.some((e) => e.type === "lync_activated"));
});

test("gap breaks active Lync", () => {
  let s = emptyLync();
  s = applyQualifyingShare(s, new Date("2026-10-01T12:00:00")).state;
  s = applyQualifyingShare(s, new Date("2026-10-02T12:00:00")).state;
  assert.equal(s.status, "active");
  const broken = applyQualifyingShare(s, new Date("2026-10-05T12:00:00"));
  assert.ok(broken.events.some((e) => e.type === "lync_broken"));
  assert.equal(broken.state.count, 1);
});

test("localDayKey stable format", () => {
  assert.match(localDayKey(new Date("2026-10-05T23:00:00")), /^\d{4}-\d{2}-\d{2}$/);
});
