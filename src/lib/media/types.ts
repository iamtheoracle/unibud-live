export type MediaKind = "photo" | "video" | "audio" | "file";

const MEDIA_KINDS: readonly MediaKind[] = ["photo", "video", "audio", "file"];

export function isMediaKind(value: unknown): value is MediaKind {
  return typeof value === "string" && MEDIA_KINDS.includes(value as MediaKind);
}
export type MediaStatus = "uploading" | "processing" | "ready" | "failed" | "deleted" | "awaiting_file";
export type MediaVisibility = "private" | "conversation" | "room" | "class" | "campus";

export type MediaAsset = {
  id: string;
  ownerId: string;
  kind: MediaKind;
  mimeType: string;
  fileName: string;
  fileSize: number;
  durationMs?: number;
  width?: number;
  height?: number;
  storagePath: string;
  status: MediaStatus;
  visibility: MediaVisibility;
  conversationId?: string;
  roomId?: string;
  error?: string;
  createdAt: string;
};

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export function kindFromMime(mime: string): MediaKind {
  if (mime.startsWith("image/")) return "photo";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return "file";
}

export function mediaUrl(id: string) {
  return `/api/media/${id}`;
}
