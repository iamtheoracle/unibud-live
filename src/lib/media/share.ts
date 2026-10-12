export type ChatShare = {
  kind: "audio" | "video" | "photo" | "bud" | "file";
  title?: string;
  audioId?: string;
  budMediaId?: string;
  mediaId?: string;
  src?: string;
  duration?: string;
};

/** Only allow navigable web URLs or same-origin relative paths for shared media. */
export function isSafeShareSource(src: string): boolean {
  const value = src.trim();
  const hasControlCharacters = [...value].some((character) => {
    const code = character.charCodeAt(0);
    return code <= 0x1f || code === 0x7f;
  });
  if (!value || value.startsWith("//") || value.includes("\\") || hasControlCharacters) return false;
  if (value.startsWith("/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

const MAX_SHARE_JSON_CHARS = 12_000;
const MAX_SHARE_TITLE_CHARS = 255;
const MAX_SHARE_ID_CHARS = 200;
const MAX_SHARE_SRC_CHARS = 2_048;
const MAX_SHARE_DURATION_CHARS = 50;

export function parseShareJson(raw?: string): ChatShare | undefined {
  if (!raw || raw.length > MAX_SHARE_JSON_CHARS) return undefined;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
    const share = value as Record<string, unknown>;
    if (!["audio", "video", "photo", "bud", "file"].includes(String(share.kind))) return undefined;
    if (share.src !== undefined && (typeof share.src !== "string" || share.src.length > MAX_SHARE_SRC_CHARS || !isSafeShareSource(share.src))) return undefined;
    if (share.title !== undefined && (typeof share.title !== "string" || share.title.length > MAX_SHARE_TITLE_CHARS)) return undefined;
    if (share.mediaId !== undefined && (typeof share.mediaId !== "string" || share.mediaId.length > MAX_SHARE_ID_CHARS)) return undefined;
    if (share.audioId !== undefined && (typeof share.audioId !== "string" || share.audioId.length > MAX_SHARE_ID_CHARS)) return undefined;
    if (share.budMediaId !== undefined && (typeof share.budMediaId !== "string" || share.budMediaId.length > MAX_SHARE_ID_CHARS)) return undefined;
    if (share.duration !== undefined && (typeof share.duration !== "string" || share.duration.length > MAX_SHARE_DURATION_CHARS)) return undefined;
    return share as unknown as ChatShare;
  } catch {
    return undefined;
  }
}
