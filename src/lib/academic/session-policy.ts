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
