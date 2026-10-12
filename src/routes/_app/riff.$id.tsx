import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar } from "@/components/unibud/person";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getRiff, replyToRiff, toggleRiffFollow } from "@/lib/riff/server";
import { relativeTime } from "@/lib/unibud/format";

export const Route = createFileRoute("/_app/riff/$id")({ component: RiffThread });

type RiffReply = {
  id: string;
  postId: string;
  parentReplyId: string | null;
  authorUserId: string;
  authorHandle: string;
  body: string;
  createdAt: string;
};
type RiffThreadData = {
  id: string;
  authorUserId: string;
  authorHandle: string;
  body: string;
  createdAt: string;
  replyCount: number;
  likeCount: number;
  followCount: number;
  liked: boolean;
  following: boolean;
  replies: RiffReply[];
};

function RiffThread() {
  const { id } = Route.useParams();
  const { user } = useCurrentUserState();
  const userId = user?.id ?? null;
  const [thread, setThread] = useState<RiffThreadData | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [draft, setDraft] = useState("");
  const [parent, setParent] = useState<string | undefined>();
  const [sending, setSending] = useState(false);
  const [followingBusy, setFollowingBusy] = useState(false);

  useEffect(() => {
    let active = true;
    setThread(null);
    setLoadError("");
    if (!userId) {
      setLoading(false);
      return () => { active = false; };
    }
    setLoading(true);
    getRiff({ data: { postId: id } })
      .then((result) => { if (active) setThread(result as RiffThreadData); })
      .catch(() => { if (active) setLoadError("This Riff could not be found or loaded."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, userId]);

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim() || sending || !thread) return;
    setSending(true);
    try {
      const reply = await replyToRiff({ data: { postId: id, body: draft.trim(), parentReplyId: parent } });
      setThread((current) => current ? { ...current, replies: [reply as RiffReply, ...current.replies], replyCount: current.replyCount + 1 } : current);
      setDraft("");
      setParent(undefined);
      toast.success("Reply published.");
    } catch {
      toast.error("Reply could not be published. Your draft is still here.");
    } finally {
      setSending(false);
    }
  }

  async function toggleFollow() {
    if (!thread || followingBusy) return;
    setFollowingBusy(true);
    try {
      const result = await toggleRiffFollow({ data: { postId: id } });
      setThread((current) => current ? { ...current, following: result.following, followCount: result.followCount } : current);
    } catch {
      toast.error("Follow could not be saved.");
    } finally {
      setFollowingBusy(false);
    }
  }

  if (!user) {
    return (
      <main className="px-5 py-10">
        <p className="text-sm text-muted-foreground">Sign in to read and join shared Riff conversations.</p>
        <Link to="/riff" className="mt-3 inline-block text-sm font-medium">Back to Riff</Link>
      </main>
    );
  }

  if (loading) {
    return <main className="px-5 py-10"><p className="text-sm text-muted-foreground">Loading conversation…</p></main>;
  }

  if (loadError || !thread) {
    return (
      <main className="px-5 py-10">
        <p className="text-sm text-muted-foreground">{loadError || "This Riff is unavailable."}</p>
        <Link to="/riff" className="mt-3 inline-block text-sm font-medium">Back to Riff</Link>
      </main>
    );
  }

  const author = thread.authorHandle || "member";
  const displayName = author === "you" ? "You" : author === "member" ? "UNIBUD member" : author;

  return (
    <main className="safe-bottom px-5 pt-6">
      <Link to="/riff" className="text-xs font-medium text-muted-foreground">Riff</Link>
      <article className="mt-4 border-b border-border pb-5">
        <div className="flex gap-3">
          <Avatar name={displayName} className="size-12" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{displayName}</p>
            <p className="text-xs text-muted-foreground">{author !== "member" && author !== "you" ? `@${author} · ` : ""}{relativeTime(thread.createdAt)}</p>
          </div>
        </div>
        <p className="mt-4 whitespace-pre-wrap break-words text-base leading-relaxed">{thread.body}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span>{thread.likeCount} likes</span>
          <span>{thread.replyCount} replies</span>
          <span>{thread.followCount} following</span>
        </div>
        <Button className="mt-4" size="sm" variant={thread.following ? "outline" : "primary"} disabled={followingBusy} onClick={() => void toggleFollow()}>
          {thread.following ? "Following this conversation" : "Follow conversation"}
        </Button>
      </article>

      <h2 className="mt-6 text-sm font-medium">Conversation · newest replies first</h2>
      {thread.replies.length ? (
        <ul className="mt-3 space-y-3">
          {thread.replies.map((reply) => {
            const handle = reply.authorHandle || "member";
            const name = handle === "you" ? "You" : handle === "member" ? "UNIBUD member" : handle;
            const parentBody = reply.parentReplyId ? thread.replies.find((candidate) => candidate.id === reply.parentReplyId)?.body : null;
            return (
              <li key={reply.id} className="rounded-2xl bg-card p-3 ring-1 ring-border">
                <p className="text-xs text-muted-foreground">{name} · {relativeTime(reply.createdAt)}</p>
                {parentBody ? <p className="mt-1 text-[11px] text-muted-foreground">Replying: {parentBody}</p> : null}
                <p className="mt-1 whitespace-pre-wrap break-words text-sm">{reply.body}</p>
                <button type="button" className="mt-2 text-xs font-medium" onClick={() => setParent(reply.id)}>Reply</button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No replies yet. Start the conversation.</p>
      )}

      <form className="mt-6" onSubmit={send}>
        {parent ? (
          <p className="mb-1 text-xs text-muted-foreground">
            Replying to a reply ·{" "}
            <button type="button" className="underline" onClick={() => setParent(undefined)}>cancel</button>
          </p>
        ) : null}
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value.slice(0, 10000))}
          maxLength={10000}
          placeholder="Join the conversation"
          className="min-h-16 w-full rounded-xl bg-secondary px-3 py-2 text-sm outline-none"
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{draft.length}/10,000</span>
          <Button size="sm" type="submit" disabled={!draft.trim() || sending}>{sending ? "Replying…" : "Reply"}</Button>
        </div>
      </form>
    </main>
  );
}
