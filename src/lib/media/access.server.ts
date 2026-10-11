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

  // Uploads must belong to exactly one protected scope. Inconsistent records
  // fail closed instead of letting membership in one scope bypass the other.
  if (conversationId && roomId) return false;

  if (String(row.visibility) === "conversation" && conversationId) {
    try {
      await assertConversationMember(userId, conversationId);
      return true;
    } catch {
      return false;
    }
  }

  if (String(row.visibility) === "room" || roomId) {
    if (!roomId) return false;
    return isRoomMember(userId, roomId);
  }

  return String(row.owner_id) === userId;
}
