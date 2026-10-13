import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowUp, ChevronLeft, MoreHorizontal, Plus, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuthReady } from "@/components/unibud/sign-in-gate";
import {
  askBud,
  askBudGuest,
  deleteBudConversation,
  getBudThread,
  listBudConversations,
  retryBud,
} from "@/lib/bud/server";
import type { BudMessage } from "@/lib/unibud/types";
import { cn } from "@/lib/utils";
import { BudRichText } from "@/components/bud/rich-text";
import { guestReplyText, useGuestThread } from "@/components/bud/guest-thread";

const PROMPTS = [
  "Explain this simply",
  "Help me understand a topic",
  "What should I learn next?",
  "Give me practice questions",
];

const ACTIVE_KEY = "unibud-bud-active";

export function BudWorkspace() {
  const { user, isPending } = useAuthReady();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [activeId, setActiveId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(ACTIVE_KEY);
  });
  const [freshChat, setFreshChat] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [pendingUser, setPendingUser] = useState<string | null>(null);
  const guest = useGuestThread();
  const scroller = useRef<HTMLDivElement>(null);

  const convos = useQuery({
    queryKey: ["bud-convos"],
    queryFn: () => listBudConversations(),
    enabled: Boolean(user),
  });

  const thread = useQuery({
    queryKey: ["bud", activeId],
    queryFn: () => getBudThread({ data: { conversationId: activeId ?? undefined } }),
    enabled: Boolean(user) && Boolean(activeId),
  });

  const messages: BudMessage[] = !user ? guest.guestMessages : activeId ? (thread.data ?? []) : [];
  const empty = !user ? guest.guestMessages.length === 0 : !activeId || messages.length === 0;

  useEffect(() => {
    if (activeId) sessionStorage.setItem(ACTIVE_KEY, activeId);
    else sessionStorage.removeItem(ACTIVE_KEY);
  }, [activeId]);

  useEffect(() => {
    if (freshChat) return;
    if (!activeId && convos.data?.length) setActiveId(convos.data[0].id);
  }, [activeId, convos.data, freshChat]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, pendingUser]);

  const ask = useMutation({
    mutationFn: async (input: { text: string }) => {
      if (!user) {
        return askBudGuest({ data: { prompt: input.text, history: guest.history } });
      }
      return askBud({
        data: {
          prompt: input.text,
          conversationId: activeId ?? undefined,
        },
      });
    },
    onSuccess: async (r) => {
      if (!user) {
        guest.appendAssistant(guestReplyText(r as { ok?: boolean; text?: string; error?: string }));
        setPendingUser(null);
        setPrompt("");
        return;
      }
      setPendingUser(null);
      setPrompt("");
      if ("conversationId" in r && r.conversationId && r.conversationId !== activeId) {
        setActiveId(r.conversationId);
      }
      await qc.invalidateQueries({ queryKey: ["bud"] });
      await qc.invalidateQueries({ queryKey: ["bud-convos"] });
    },
    onError: () => {
      setPendingUser(null);
      if (!user) {
        guest.appendAssistant("Bud could not reply right now. You can try again.");
      }
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteBudConversation({ data: { id } }),
    onSuccess: async (_, id) => {
      if (activeId === id) setActiveId(null);
      await qc.invalidateQueries({ queryKey: ["bud-convos"] });
      await qc.invalidateQueries({ queryKey: ["bud"] });
    },
  });

  const retry = useMutation({
    mutationFn: () => retryBud({ data: { conversationId: activeId! } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["bud"] });
    },
  });

  function send(text: string) {
    const t = text.trim();
    if (!t || ask.isPending) return;
    setPendingUser(t);
    setPrompt("");
    if (!user) {
      guest.appendUser(t);
      ask.mutate({ text: t });
      return;
    }
    ask.mutate({ text: t });
  }

  function close() {
    if (typeof window !== "undefined" && window.history.length > 1) window.history.back();
    else void navigate({ to: "/" });
  }

  if (isPending) {
    return (
      <div className="fixed inset-0 z-40 bg-background">
        <div className="mx-auto mt-24 h-40 max-w-3xl animate-pulse rounded-2xl bg-secondary" />
      </div>
    );
  }

  const isGuest = !user;
  const failed = ask.isError || (ask.data && ask.data.ok === false);
  const busy = ask.isPending || retry.isPending;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-background">
      <div className="border-b border-border pt-[env(safe-area-inset-top)]">
        <header className="flex h-12 items-center justify-between px-1">
          <button type="button" className="grid size-11 place-items-center rounded-full" aria-label="Back" onClick={close}>
            <ChevronLeft className="size-5" />
          </button>
          <p className="text-sm font-medium">Bud</p>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full"
            aria-label="Conversation actions"
            onClick={() => {
              setMenuOpen((v) => !v);
              setHistoryOpen(false);
            }}
          >
            <MoreHorizontal className="size-5" />
          </button>
        </header>
      </div>

      {isGuest ? (
        <div className="border-b border-border bg-secondary/60 px-4 py-2 text-center text-xs text-muted-foreground">
          Guest mode: conversations are not saved.{" "}
          <a href="/login" className="underline">
            Sign in
          </a>{" "}
          to keep them.
        </div>
      ) : null}

      {menuOpen ? (
        <div className="absolute top-[calc(env(safe-area-inset-top)+3rem)] right-3 z-50 w-56 rounded-2xl bg-card p-1 shadow-soft ring-1 ring-border">
          <button
            type="button"
            className="flex h-11 w-full items-center gap-2 rounded-xl px-3 text-sm hover:bg-secondary"
            onClick={() => {
              setFreshChat(true);
              setActiveId(null);
              guest.clear();
              sessionStorage.removeItem(ACTIVE_KEY);
              setMenuOpen(false);
            }}
          >
            <Plus className="size-4" /> New conversation
          </button>
          {user ? (
            <button
              type="button"
              className="flex h-11 w-full items-center gap-2 rounded-xl px-3 text-sm hover:bg-secondary"
              onClick={() => {
                setHistoryOpen(true);
                setMenuOpen(false);
              }}
            >
              History
            </button>
          ) : null}
          {activeId ? (
            <button
              type="button"
              className="flex h-11 w-full items-center gap-2 rounded-xl px-3 text-sm text-destructive hover:bg-secondary"
              onClick={() => {
                remove.mutate(activeId);
                setMenuOpen(false);
              }}
            >
              <Trash2 className="size-4" /> Delete conversation
            </button>
          ) : null}
        </div>
      ) : null}

      {historyOpen ? (
        <div className="absolute inset-0 z-50 flex flex-col bg-background pt-[env(safe-area-inset-top)]">
          <div className="flex h-12 items-center justify-between px-2">
            <p className="px-3 text-sm font-medium">Conversations</p>
            <button type="button" className="grid size-11 place-items-center rounded-full" aria-label="Close history" onClick={() => setHistoryOpen(false)}>
              <X className="size-5" />
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto px-3 pb-8">
            {(convos.data ?? []).length === 0 ? (
              <p className="px-3 py-8 text-sm text-muted-foreground">No conversations yet.</p>
            ) : (
              (convos.data ?? []).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="w-full rounded-xl px-3 py-3 text-left hover:bg-secondary"
                    onClick={() => {
                      setActiveId(c.id);
                      setHistoryOpen(false);
                    }}
                  >
                    <p className="truncate text-sm font-medium">{c.title}</p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}

      <div ref={scroller} className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-y-auto overscroll-contain px-4">
        {empty && !busy && !pendingUser ? (
          <div className="flex flex-1 flex-col justify-center py-10">
            <span className="grid size-12 place-items-center rounded-2xl bg-ink text-paper">
              <Sparkles className="size-5" />
            </span>
            <h1 className="mt-6 font-display text-4xl">Hey, I'm Bud.</h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Ask anything. I'll keep this conversation going.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              {PROMPTS.map((p) => (
                <button key={p} type="button" onClick={() => send(p)} className="h-11 rounded-full bg-card px-4 text-sm ring-1 ring-border">
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-5">
            {messages.map((m) => (
              <article key={m.id} className={cn("max-w-[88%]", m.role === "user" ? "ml-auto" : "mr-auto")}>
                {m.role === "assistant" ? <p className="mb-1 text-[11px] font-medium text-muted-foreground">Bud</p> : null}
                <div className={cn("rounded-2xl px-4 py-3 text-sm leading-relaxed", m.role === "user" ? "bg-ink text-paper" : "bg-card ring-1 ring-border")}>
                  {m.role === "assistant" ? <BudRichText text={m.content} /> : m.content}
                </div>
              </article>
            ))}
            {pendingUser ? (
              <article className="ml-auto max-w-[88%]">
                <div className="rounded-2xl bg-ink px-4 py-3 text-sm text-paper">{pendingUser}</div>
              </article>
            ) : null}
            {busy ? (
              <p className="text-xs text-muted-foreground" aria-live="polite">
                Bud is typing…
              </p>
            ) : null}
            {failed ? <p className="text-xs text-destructive">Something went wrong. Try again.</p> : null}
          </div>
        )}
      </div>

      <div className="border-t border-border px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
        <div className="mx-auto flex max-w-3xl items-end gap-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(prompt);
              }
            }}
            rows={1}
            placeholder="Message Bud…"
            className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl bg-secondary px-4 py-3 text-sm outline-none"
          />
          <button
            type="button"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-paper disabled:opacity-40"
            aria-label="Send"
            disabled={busy || !prompt.trim()}
            onClick={() => send(prompt)}
          >
            <ArrowUp className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
