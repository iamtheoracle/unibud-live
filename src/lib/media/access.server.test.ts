import assert from "node:assert/strict";
import test from "node:test";
import { canReadMedia } from "./access.server.ts";

const ownerId = "user-a";
const otherId = "user-b";

function access(overrides: Record<string, unknown> = {}) {
  return {
    userId: otherId,
    row: { owner_id: ownerId, visibility: "private", ...overrides },
    assertConversationMember: async () => undefined,
    isRoomMember: async () => true,
  };
}

test("private media is readable only by its owner", async () => {
  assert.equal(await canReadMedia({ ...access(), userId: ownerId }), true);
  assert.equal(await canReadMedia(access()), false);
});

test("conversation media requires current conversation membership", async () => {
  const options = access({ visibility: "conversation", conversation_id: "conversation-1" });
  assert.equal(await canReadMedia(options), true);
  assert.equal(await canReadMedia({
    ...options,
    assertConversationMember: async () => { throw new Error("membership revoked"); },
  }), false);
});

test("room media requires current room membership", async () => {
  const options = access({ visibility: "room", room_id: "room-1" });
  assert.equal(await canReadMedia(options), true);
  assert.equal(await canReadMedia({ ...options, isRoomMember: async () => false }), false);
});

test("room-scoped media without a room id is denied", async () => {
  assert.equal(await canReadMedia(access({ visibility: "room" })), false);
});

test("inconsistent media records with both conversation and room ids fail closed", async () => {
  assert.equal(await canReadMedia(access({
    visibility: "conversation",
    conversation_id: "conversation-1",
    room_id: "room-1",
  })), false);
});

test("conversation visibility without a conversation id falls back to owner-only access", async () => {
  assert.equal(await canReadMedia(access({ visibility: "conversation" })), false);
  assert.equal(await canReadMedia({
    ...access({ visibility: "conversation" }),
    userId: ownerId,
  }), true);
});
