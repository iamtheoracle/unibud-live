/** Only active audio may be newly shared or used for playback analytics. */
export function isAudioAvailableForSharing(status: unknown): boolean {
  return status === "active";
}

/** Existing audio can be reported regardless of status, but not played/shared after restriction. */
export function canRecordAudioEvent(status: unknown, kind: unknown): boolean {
  if (kind === "report") return status === "active" || status === "reported" || status === "restricted" || status === "removed";
  return isAudioAvailableForSharing(status);
}
