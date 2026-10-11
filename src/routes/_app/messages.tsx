import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar } from "@/components/unibud/person";
import { EmptyState } from "@/components/unibud/empty";
import { SignInCard, useAuthReady } from "@/components/unibud/sign-in-gate";
import { relativeTime } from "@/lib/unibud/format";
import { listChatPeople, listConversations, openConversation } from "@/lib/social/server";
import { CAMPUS_ROOMS, type RoomKind } from "@/lib/unibud/chat-rooms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/messages")({ component: ChatList });

type Tab = "direct" | RoomKind;

function ChatList() {
  const { user, isPending } = useAuthReady();
  const nav = useNavigate();
  const [tab, setTab] = useState<Tab>("direct");
  const convos = useQuery({
    queryKey: ["convos"],
    queryFn: () => listConversations(),
    enabled: Boolean(user),
  });
  const people = useQuery({
    queryKey: ["chat-people"],
    queryFn: () => listChatPeople(),
    enabled: Boolean(user) && tab === "direct",
  });

  if (isPending) return <div className="m-4 h-40 animate-pulse rounded-2xl bg-secondary" />;
  if (!user) {
    return (
      <main className="px-5 py-8">
        <p className="kicker">Messages</p>
        <h1 className="mt-1 font-display text-4xl">Chat</h1>
        <div className="mt-6">
          <SignInCard title="Sign in to chat" body="Direct, class, study and community conversations stay private." />
        </div>
      </main>
    );
  }

  async function start(handle: string) {
    try {
      const c = await openConversation({ data: { handle } });
      nav({ to: "/messages/$id", params: { id: c.id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start this conversation.");
    }
  }

  const rooms = CAMPUS_ROOMS.filter((r) => (tab === "direct" ? false : r.kind === tab));

  return (
    <main className="safe-bottom px-5 pt-6">
      <p className="kicker">Communication layer</p>
      <h1 className="mt-1 font-display text-4xl">Chat</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Direct messages, group, class, study and community conversations. Chat is not Connect, not Communities, not Board.
      </p>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {(
          [
            ["direct", "Direct"],
            ["group", "Groups"],
            ["class", "Classes"],
            ["study", "Study"],
            ["community", "Community"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "h-9 shrink-0 rounded-full px-4 text-sm font-medium",
              tab === id ? "bg-ink text-paper" : "bg-card text-muted-foreground ring-1 ring-border",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "direct" ? (
        <>
          <div className="mt-5 space-y-1">
            {(convos.data ?? []).map((c) => {
              const person = people.data?.find((p) => p.handle.toLowerCase() === c.peerHandle.toLowerCase());
              return (
                <Link
                  key={c.id}
                  to="/messages/$id"
                  params={{ id: c.id }}
                  className="flex items-center gap-3 rounded-2xl px-1 py-3 hover:bg-secondary"
                >
                  <span className="relative">
                    <Avatar name={person?.name ?? c.peerHandle} className="size-12" />
                    <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-success ring-2 ring-card" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{person?.name ?? `@${c.peerHandle}`}</p>
                      <span className="text-xs text-muted-foreground">{relativeTime(c.updatedAt)}</span>
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{c.lastBody}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          {!convos.data?.length ? (
            <EmptyState title="No threads yet" body="Message someone from Connect, or start a chat below." />
          ) : null}
          <h2 className="mt-8 text-sm font-medium">Suggested</h2>
          <ul className="mt-2">
            {(people.data ?? []).map((p) => (
              <li key={p.handle}>
                <button
                  type="button"
                  onClick={() => void start(p.handle)}
                  className="flex w-full items-center gap-3 py-3 text-left"
                >
                  <Avatar name={p.name} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">@{p.handle}</p>
                  </div>
                </button>
              </li>
            ))}
            {!people.isLoading && !people.data?.length ? (
              <li className="py-4 text-sm text-muted-foreground">
                No other student profiles are available yet.
              </li>
            ) : null}
            {people.isError ? (
              <li className="py-4 text-sm text-muted-foreground">
                Could not load people. Try refreshing this page.
              </li>
            ) : null}
          </ul>
        </>
      ) : (
        <ul className="mt-5 space-y-2">
          {rooms.map((r) => (
            <li key={r.id}>
              <Link
                to="/messages/$id"
                params={{ id: r.id }}
                className="block rounded-2xl bg-card p-4 ring-1 ring-border"
              >
                <p className="text-[11px] font-semibold tracking-wide text-bud uppercase">{r.kind}</p>
                <p className="mt-1 text-sm font-semibold">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.subtitle}</p>
                <p className="mt-2 truncate text-sm text-muted-foreground">{r.lastBody}</p>
              </Link>
            </li>
          ))}
          {rooms.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No {tab} chats yet.</p>
          ) : null}
        </ul>
      )}
    </main>
  );
}
