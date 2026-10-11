export type BoardSessionStatus = "scheduled" | "live" | "ended" | "processing" | "available" | "cancelled";

/**
 * Only the lecturer-controlled transitions are accepted here.
 * Recording processing/availability require a future trusted recording pipeline.
 */
export function canTransitionBoardSessionStatus(
  current: BoardSessionStatus,
  next: BoardSessionStatus,
): boolean {
  return (current === "scheduled" && (next === "live" || next === "cancelled"))
    || (current === "live" && next === "ended");
}

export type AttendanceEventKind = "join" | "leave";

/** Keep attendance events in a valid join/leave sequence and make retries harmless. */
export function attendanceEventAction(
  lastKind: AttendanceEventKind | null,
  nextKind: AttendanceEventKind,
): "record" | "duplicate" | "invalid" {
  if (lastKind === nextKind) return "duplicate";
  if (nextKind === "leave" && lastKind !== "join") return "invalid";
  return "record";
}

export type AttendanceRosterEvent = {
  userId: string;
  kind: string;
  createdAt: string;
};

export function summarizeAttendanceEvents(events: AttendanceRosterEvent[]) {
  const byUser = new Map<string, { userId: string; joined?: string; left?: string }>();
  for (const event of events) {
    const current = byUser.get(event.userId) ?? { userId: event.userId };
    if (event.kind === "join") {
      if (!current.joined) current.joined = event.createdAt;
      delete current.left;
    } else if (event.kind === "leave" && current.joined) {
      current.left = event.createdAt;
    }
    byUser.set(event.userId, current);
  }
  return [...byUser.values()];
}
