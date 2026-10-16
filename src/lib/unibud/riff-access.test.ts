import assert from "node:assert/strict";
import test from "node:test";
import { resolveRiffAccess, visibleDeviceLocalRiffs } from "./riff-access.ts";

test("guest access cannot read or mutate device-local Riff state", () => {
  const access = resolveRiffAccess(false);
  const localRiffs = [{ id: "private-device-riff" }];

  assert.equal(access.canReadDeviceLocalState, false);
  assert.equal(access.canMutateDeviceLocalState, false);
  assert.deepEqual(visibleDeviceLocalRiffs(localRiffs, access), []);
});

test("authenticated access can use the current device-local Riff state", () => {
  const access = resolveRiffAccess(true);
  const localRiffs = [{ id: "member-device-riff" }];

  assert.equal(access.canReadDeviceLocalState, true);
  assert.equal(access.canMutateDeviceLocalState, true);
  assert.deepEqual(visibleDeviceLocalRiffs(localRiffs, access), localRiffs);
});

test("guest visibility never mutates the underlying local collection", () => {
  const localRiffs = [{ id: "member-device-riff" }];
  const visible = visibleDeviceLocalRiffs(localRiffs, resolveRiffAccess(false));

  assert.deepEqual(localRiffs, [{ id: "member-device-riff" }]);
  assert.deepEqual(visible, []);
});
