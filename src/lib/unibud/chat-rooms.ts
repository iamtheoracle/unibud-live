export type RoomKind = "group" | "class" | "study" | "community";

export type CampusRoom = {
  id: string;
  kind: RoomKind;
  title: string;
  subtitle: string;
  communityId?: string;
  lastBody: string;
  updatedAt: string;
  members: string[];
};

export const CAMPUS_ROOMS: CampusRoom[] = [];


export function campusRoomById(id: string) {
  return CAMPUS_ROOMS.find((r) => r.id === id);
}

export const ROOM_SEED: Record<string, { sender: string; body: string }[]> = {};
