import { useState, useCallback } from "react";
import type { BudMessage } from "@/lib/unibud/types";

/** Ephemeral guest Bud thread — not persisted server-side. */
export function useGuestThread() {
  const [guestMessages, setGuestMessages] = useState<BudMessage[]>([]);

  const appendUser = useCallback((content: string) => {
    setGuestMessages((cur) => [
      ...cur,
      {
        id: crypto.randomUUID(),
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const appendAssistant = useCallback((content: string) => {
    setGuestMessages((cur) => [
      ...cur,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);

  const clear = useCallback(() => setGuestMessages([]), []);

  const history = guestMessages.slice(-6).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  return { guestMessages, appendUser, appendAssistant, clear, history };
}

export function guestReplyText(r: {
  ok?: boolean;
  text?: string;
  error?: string;
}): string {
  if (r.ok && typeof r.text === "string") return r.text;
  if (typeof r.error === "string") return r.error;
  return "Bud could not reply.";
}
