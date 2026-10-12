import { Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuthReady } from "@/components/unibud/sign-in-gate";
import {
  cancelConnectionRequest,
  getMyConnectState,
  openConversation,
  removeConnection,
  requestConnection,
  respondToConnectionRequest,
  setFollow,
} from "@/lib/social/server";

export function RelationActions({ handle }: { handle: string }) {
  const { user } = useAuthReady();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const state = useQuery({
    queryKey: ["connect-state"],
    queryFn: () => getMyConnectState(),
    enabled: Boolean(user),
  });
  const refresh = () => qc.invalidateQueries({ queryKey: ["connect-state"] });
  const request = useMutation({
    mutationFn: () => requestConnection({ data: { handle } }),
    onSuccess: async () => { toast.success("Connection request sent."); await refresh(); },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Could not send the request."),
  });
  const cancel = useMutation({
    mutationFn: () => cancelConnectionRequest({ data: { handle } }),
    onSuccess: async () => { toast.success("Request cancelled."); await refresh(); },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Could not cancel the request."),
  });
  const respond = useMutation({
    mutationFn: (accept: boolean) => respondToConnectionRequest({ data: { handle, accept } }),
    onSuccess: async (_result, accept) => { toast.success(accept ? "Connection accepted." : "Request declined."); await refresh(); },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Could not update the request."),
  });
  const remove = useMutation({
    mutationFn: () => removeConnection({ data: { handle } }),
    onSuccess: async () => { toast.success("Connection removed."); await refresh(); },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Could not remove the connection."),
  });
  const follow = useMutation({
    mutationFn: (following: boolean) => setFollow({ data: { handle, following } }),
    onSuccess: async (_result, following) => { toast.success(following ? "Following." : "Unfollowed."); await refresh(); },
    onError: (error: unknown) => toast.error(error instanceof Error ? error.message : "Could not update follow state."),
  });
  const busy = state.isLoading || state.isError || request.isPending || cancel.isPending || respond.isPending || remove.isPending || follow.isPending;
  const connected = Boolean(state.data?.connections.some((person) => person.handle === handle));
  const incoming = Boolean(state.data?.incoming.some((person) => person.handle === handle));
  const outgoing = Boolean(state.data?.outgoing.some((person) => person.handle === handle));
  const isFollowing = Boolean(state.data?.following.some((person) => person.handle === handle));

  if (!user) {
    return <Link to="/welcome" className="text-xs font-medium">Sign in to connect</Link>;
  }
  if (state.isError) {
    return <p className="text-xs text-muted-foreground">Connection actions are temporarily unavailable.</p>;
  }

  async function message() {
    try {
      const result = await openConversation({ data: { handle } });
      await navigate({ to: "/messages/$id", params: { id: result.id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not open the conversation.");
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {incoming ? (
        <>
          <Button size="sm" disabled={busy} onClick={() => respond.mutate(true)}>Accept</Button>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => respond.mutate(false)}>Decline</Button>
        </>
      ) : connected ? (
        <>
          <Button size="sm" variant="outline" disabled={busy} onClick={() => void message()}>Message</Button>
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => remove.mutate()}>Remove connection</Button>
        </>
      ) : outgoing ? (
        <Button size="sm" variant="outline" disabled={busy} onClick={() => cancel.mutate()}>Pending · Cancel</Button>
      ) : (
        <Button size="sm" disabled={busy} onClick={() => request.mutate()}>Connect</Button>
      )}
      <Button size="sm" variant="outline" disabled={busy} onClick={() => follow.mutate(!isFollowing)}>
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
}
