import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar } from "@/components/unibud/person";
import { SignInCard, useAuthReady } from "@/components/unibud/sign-in-gate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  cancelConnectionRequest,
  getMyConnectState,
  listConnectPeople,
  openConversation,
  removeConnection,
  requestConnection,
  respondToConnectionRequest,
  setFollow,
} from "@/lib/social/server";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/connect")({ component: Connect });

type Tab = "discover" | "requests" | "sent" | "connections" | "following" | "followers";
type ConnectPerson = {
  userId: string;
  handle: string;
  name: string;
  universityId: string;
  program: string;
  year: string;
  bio: string;
};

const TABS: Array<[Tab, string]> = [
  ["discover", "Discover"],
  ["requests", "Requests"],
  ["sent", "Sent"],
  ["connections", "Connections"],
  ["following", "Following"],
  ["followers", "Followers"],
];

function Connect() {
  const [tab, setTab] = useState<Tab>("discover");
  const [q, setQ] = useState("");
  const { user, isPending } = useAuthReady();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const relations = useQuery({
    queryKey: ["connect-state"],
    queryFn: () => getMyConnectState(),
    enabled: Boolean(user),
  });
  const directory = useQuery({
    queryKey: ["connect-directory", q],
    queryFn: () => listConnectPeople({ data: { query: q } }),
    enabled: Boolean(user) && tab === "discover",
  });
  const refresh = async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ["connect-state"] }),
      qc.invalidateQueries({ queryKey: ["connect-directory"] }),
    ]);
  };
  const request = useMutation({
    mutationFn: (handle: string) => requestConnection({ data: { handle } }),
    onSuccess: async (result) => {
      toast.success(result.alreadyPending ? "Request is already pending." : "Connection request sent.");
      await refresh();
    },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Could not send the request."),
  });
  const respond = useMutation({
    mutationFn: (input: { handle: string; accept: boolean }) => respondToConnectionRequest({ data: input }),
    onSuccess: async (_result, input) => {
      toast.success(input.accept ? "Connection accepted." : "Request declined.");
      await refresh();
    },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Could not update the request."),
  });
  const cancel = useMutation({
    mutationFn: (handle: string) => cancelConnectionRequest({ data: { handle } }),
    onSuccess: async () => { toast.success("Request cancelled."); await refresh(); },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Could not cancel the request."),
  });
  const remove = useMutation({
    mutationFn: (handle: string) => removeConnection({ data: { handle } }),
    onSuccess: async () => { toast.success("Connection removed."); await refresh(); },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Could not remove the connection."),
  });
  const follow = useMutation({
    mutationFn: (input: { handle: string; following: boolean }) => setFollow({ data: input }),
    onSuccess: async (_result, input) => {
      toast.success(input.following ? "Following." : "Unfollowed.");
      await refresh();
    },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Could not update follow state."),
  });

  if (isPending) return <div className="m-4 h-40 animate-pulse rounded-2xl bg-secondary" />;
  if (!user) {
    return <main className="px-5 py-8"><SignInCard title="Sign in to Connect" body="Discover registered UNIBUD profiles and manage real connection requests." /></main>;
  }

  const state = relations.data;
  const shown: ConnectPerson[] = tab === "discover"
    ? directory.data ?? []
    : tab === "requests"
      ? state?.incoming ?? []
      : tab === "sent"
        ? state?.outgoing ?? []
        : tab === "connections"
          ? state?.connections ?? []
          : tab === "following"
            ? state?.following ?? []
            : state?.followers ?? [];
  const busy = request.isPending || respond.isPending || cancel.isPending || remove.isPending || follow.isPending;

  async function message(person: ConnectPerson) {
    try {
      const result = await openConversation({ data: { handle: person.handle } });
      await navigate({ to: "/messages/$id", params: { id: result.id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not open the conversation.");
    }
  }

  return (
    <main className="safe-bottom px-5 pt-6">
      <p className="kicker">People</p>
      <h1 className="mt-1 font-display text-4xl">Connect</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Discover registered UNIBUD members. Connection requests and follows are saved to your account.
      </p>
      <div className="mt-5">
        <Input
          value={q}
          onChange={(event) => setQ(event.target.value)}
          placeholder="Search names, handles, programmes or universities"
          aria-label="Search registered UNIBUD profiles"
        />
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "relative h-9 shrink-0 rounded-full px-4 text-sm font-medium",
              tab === id ? "bg-ink text-paper" : "bg-card text-muted-foreground ring-1 ring-border",
            )}
          >
            {label}
            {id === "requests" && state?.incoming.length ? (
              <span className="ml-1 inline-flex min-w-4 justify-center rounded-full bg-bud px-1 text-[10px] text-bud-foreground">
                {state.incoming.length}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {tab === "discover" ? (
        <section className="mt-5 rounded-3xl bg-ink px-6 py-7 text-paper">
          <p className="kicker text-bud">Real people, real connections</p>
          <h2 className="mt-3 font-display text-3xl text-paper">Find your next collaborator.</h2>
          <p className="mt-3 text-sm text-paper/70">
            Only profiles that have joined UNIBUD appear here. Empty results mean there are no matching registered profiles yet.
          </p>
        </section>
      ) : null}

      {relations.isLoading || (tab === "discover" && directory.isLoading) ? (
        <div className="mt-5 space-y-3">
          <div className="h-24 animate-pulse rounded-2xl bg-secondary" />
          <div className="h-24 animate-pulse rounded-2xl bg-secondary" />
        </div>
      ) : relations.isError || (tab === "discover" && directory.isError) ? (
        <div className="mt-5 rounded-2xl border border-border p-4">
          <p className="text-sm font-medium">Connect could not load.</p>
          <p className="mt-1 text-sm text-muted-foreground">Check your connection and try again.</p>
          <Button size="sm" variant="outline" className="mt-3" onClick={() => { void relations.refetch(); void directory.refetch(); }}>
            Try again
          </Button>
        </div>
      ) : (
        <ul className="mt-5 space-y-3">
          {shown.map((person) => {
            const connected = Boolean(state?.connections.some((item) => item.handle === person.handle));
            const outgoingPending = Boolean(state?.outgoing.some((item) => item.handle === person.handle));
            const incomingPending = Boolean(state?.incoming.some((item) => item.handle === person.handle));
            const isFollowing = Boolean(state?.following.some((item) => item.handle === person.handle));
            return (
              <li key={person.userId} className="rounded-2xl bg-card p-3 ring-1 ring-border">
                <div className="flex items-center gap-3">
                  <Link to="/u/$handle" params={{ handle: person.handle }}>
                    <Avatar name={person.name} className="size-12" />
                  </Link>
                  <Link to="/u/$handle" params={{ handle: person.handle }} className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{person.name}</p>
                    <p className="truncate text-xs text-muted-foreground">@{person.handle}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {[person.program, person.year ? `Year ${person.year}` : "", person.universityId].filter(Boolean).join(" · ")}
                    </p>
                    {person.bio ? <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{person.bio}</p> : null}
                  </Link>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tab === "requests" ? (
                    <>
                      <Button size="sm" disabled={busy} onClick={() => respond.mutate({ handle: person.handle, accept: true })}>Accept</Button>
                      <Button size="sm" variant="outline" disabled={busy} onClick={() => respond.mutate({ handle: person.handle, accept: false })}>Decline</Button>
                    </>
                  ) : tab === "sent" ? (
                    <Button size="sm" variant="outline" disabled={busy} onClick={() => cancel.mutate(person.handle)}>Pending · Cancel</Button>
                  ) : tab === "connections" ? (
                    <>
                      <Button size="sm" variant="outline" disabled={busy} onClick={() => void message(person)}>Message</Button>
                      <Button size="sm" variant="ghost" disabled={busy} onClick={() => remove.mutate(person.handle)}>Remove connection</Button>
                    </>
                  ) : (
                    <>
                      {connected ? (
                        <Button size="sm" variant="outline" disabled={busy} onClick={() => void message(person)}>Message</Button>
                      ) : incomingPending ? (
                        <Button size="sm" disabled={busy} onClick={() => respond.mutate({ handle: person.handle, accept: true })}>Accept request</Button>
                      ) : outgoingPending ? (
                        <Button size="sm" variant="outline" disabled={busy} onClick={() => cancel.mutate(person.handle)}>Pending · Cancel</Button>
                      ) : (
                        <Button size="sm" disabled={busy} onClick={() => request.mutate(person.handle)}>Connect</Button>
                      )}
                      <Button size="sm" variant="outline" disabled={busy} onClick={() => follow.mutate({ handle: person.handle, following: !isFollowing })}>
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Button>
                      {tab === "followers" && connected ? (
                        <Button size="sm" variant="ghost" disabled={busy} onClick={() => remove.mutate(person.handle)}>Remove connection</Button>
                      ) : null}
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {!relations.isLoading && !(tab === "discover" && directory.isLoading) && shown.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {tab === "discover" ? "No registered profiles match that search yet." : "Nothing here yet."}
        </p>
      ) : null}
    </main>
  );
}
