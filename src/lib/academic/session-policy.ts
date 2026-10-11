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
