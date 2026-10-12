export type MediaAccessRow = {
  owner_id: unknown;
  visibility: unknown;
  conversation_id?: unknown;
  room_id?: unknown;
};

export async function canReadMedia({
  userId,
  row,
  assertConversationMember,
  isRoomMember,
}: {
  userId: string;
  row: MediaAccessRow;
  assertConversationMember: (userId: string, conversationId: string) => Promise<unknown>;
  isRoomMember: (userId: string, roomId: string) => Promise<boolean>;
}): Promise<boolean> {
  const conversationId = row.conversation_id == null ? "" : String(row.conversation_id);
  const roomId = row.room_id == null ? "" : String(row.room_id);
  const visibility = String(row.visibility);
  const isOwner = String(row.owner_id) === userId;

  // A media record may have one protected scope, never two.
  if (conversationId && roomId) return false;

  if (visibility === "conversation") {
    // A room ID must not be treated as a substitute for a missing conversation ID.
    if (roomId) return false;
    // Legacy/malformed conversation records remain owner-only.
    if (!conversationId) return isOwner;
    try {
      await assertConversationMember(userId, conversationId);
      return true;
    } catch {
      return false;
    }
  }

  if (visibility === "room") {
    // Room visibility must match room metadata exactly.
    if (conversationId || !roomId) return false;
    try {
      return await isRoomMember(userId, roomId);
    } catch {
      return false;
    }
  }

  // Private or unknown visibility is never shared by membership metadata.
  return isOwner;
}
