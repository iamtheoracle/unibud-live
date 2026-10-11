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
  if (!value || value.startsWith("//") || /[\u0000-\u001f\u007f]/.test(value)) return false;
  if (value.startsWith("/")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function parseShareJson(raw?: string): ChatShare | undefined {
  if (!raw) return undefined;
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
    const share = value as Record<string, unknown>;
    if (!["audio", "video", "photo", "bud", "file"].includes(String(share.kind))) return undefined;
    if (share.src !== undefined && (typeof share.src !== "string" || !isSafeShareSource(share.src))) return undefined;
    if (share.title !== undefined && typeof share.title !== "string") return undefined;
    if (share.mediaId !== undefined && typeof share.mediaId !== "string") return undefined;
    if (share.audioId !== undefined && typeof share.audioId !== "string") return undefined;
    if (share.budMediaId !== undefined && typeof share.budMediaId !== "string") return undefined;
    if (share.duration !== undefined && typeof share.duration !== "string") return undefined;
    return share as unknown as ChatShare;
  } catch {
    return undefined;
  }
}
