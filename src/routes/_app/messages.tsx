import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar } from "@/components/unibud/person";
import { EmptyState } from "@/components/unibud/empty";
import { SignInCard, useAuthReady } from "@/components/unibud/sign-in-gate";
import { relativeTime } from "@/lib/unibud/format";
import { createConversation, listChatPeople, listConversations, openConversation } from "@/lib/social/server";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/messages")({ component: ChatList });

type Tab = "direct" | "group" | "class" | "study" | "community";

function ChatList() {
  const { user, isPending } = useAuthReady();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("direct");
  const [groupTitle, setGroupTitle] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const convos = useQuery({
    queryKey: ["convos"],
    queryFn: () => listConversations(),
    enabled: Boolean(user),
  });
  const people = useQuery({
    queryKey: ["chat-people"],
    queryFn: () => listChatPeople(),
    enabled: Boolean(user) && (tab === "direct" || tab === "group"),
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

  const rooms = (convos.data ?? []).filter((conversation) => conversation.kind === tab);

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
      ) : tab === "group" ? (
        <section className="mt-5 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Create a group chat</h2>
            <p className="mt-1 text-xs text-muted-foreground">Choose real UNIBUD profiles. You can add up to 99 other members.</p>
            <input
              value={groupTitle}
              onChange={(event) => setGroupTitle(event.target.value)}
              maxLength={120}
              placeholder="Group name (optional)"
              className="mt-3 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
            />
            <div className="mt-3 max-h-64 space-y-1 overflow-y-auto">
              {(people.data ?? []).map((person) => {
                const selected = selectedMembers.includes(person.userId);
                return (
                  <label key={person.userId} className="flex cursor-pointer items-center gap-3 rounded-xl px-2 py-2 hover:bg-secondary">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => setSelectedMembers((current) => selected ? current.filter((id) => id !== person.userId) : current.length < 99 ? [...current, person.userId] : current)}
                    />
                    <Avatar name={person.name} className="size-9" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{person.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">@{person.handle}</span>
                    </span>
                  </label>
                );
              })}
              {!people.isLoading && !people.data?.length ? <p className="py-4 text-sm text-muted-foreground">No other student profiles are available yet.</p> : null}
            </div>
            <button
              type="button"
              disabled={selectedMembers.length < 1}
              onClick={async () => {
                try {
                  const created = await createConversation({ data: { memberIds: selectedMembers, title: groupTitle, kind: "group" } });
                  setGroupTitle("");
                  setSelectedMembers([]);
                  await qc.invalidateQueries({ queryKey: ["convos"] });
                  nav({ to: "/messages/$id", params: { id: created.id } });
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Could not create the group.");
                }
              }}
              className="mt-4 h-10 w-full rounded-full bg-ink px-4 text-sm font-medium text-paper disabled:cursor-not-allowed disabled:opacity-40"
            >
              Create group · {selectedMembers.length} selected
            </button>
          </div>
          <ul className="space-y-2">
            {rooms.map((conversation) => (
              <li key={conversation.id}>
                <Link to="/messages/$id" params={{ id: conversation.id }} className="block rounded-2xl bg-card p-4 ring-1 ring-border">
                  <p className="text-[11px] font-semibold tracking-wide text-bud uppercase">group</p>
                  <p className="mt-1 text-sm font-semibold">{conversation.title || "Untitled group chat"}</p>
                  <p className="mt-2 truncate text-sm text-muted-foreground">{conversation.lastBody || "No messages yet"}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{conversation.memberCount} members · {relativeTime(conversation.updatedAt)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <ul className="mt-5 space-y-2">
          {rooms.map((conversation) => (
            <li key={conversation.id}>
              <Link
                to="/messages/$id"
                params={{ id: conversation.id }}
                className="block rounded-2xl bg-card p-4 ring-1 ring-border"
              >
                <p className="text-[11px] font-semibold tracking-wide text-bud uppercase">{conversation.kind}</p>
                <p className="mt-1 text-sm font-semibold">{conversation.title || (conversation.peerHandle ? `@${conversation.peerHandle}` : `Untitled ${conversation.kind} chat`)}</p>
                <p className="mt-2 truncate text-sm text-muted-foreground">{conversation.lastBody || "No messages yet"}</p>
                <p className="mt-2 text-xs text-muted-foreground">{conversation.memberCount} members · {relativeTime(conversation.updatedAt)}</p>
              </Link>
            </li>
          ))}
          {convos.isLoading ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Loading your conversations…</p>
          ) : null}
          {!convos.isLoading && rooms.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">No {tab} conversations yet. Open a chat from its course or Quad once you have access.</p>
          ) : null}
          {convos.isError ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Could not load conversations. Refresh and try again.</p>
          ) : null}
        </ul>
      )}
    </main>
  );
}
