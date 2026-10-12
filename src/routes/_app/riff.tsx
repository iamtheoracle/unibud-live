import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Flag, Heart, MessageCircle, Repeat2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Avatar } from "@/components/unibud/person";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { setBudDraft } from "@/lib/bud/draft";
import { RiffMark } from "@/components/brand/identity-marks";
import { createRiff, listRiffs, reportRiff, toggleRiffFollow, toggleRiffLike } from "@/lib/riff/server";
import { relativeTime } from "@/lib/unibud/format";
import { cn } from "@/lib/utils";
import { CHALLENGES } from "@/lib/unibud/discover-data";

export const Route = createFileRoute("/_app/riff")({ component: Riff });

const TOPICS = ["all", "music", "tech", "games", "culture", "learning", "space"] as const;
type Topic = (typeof TOPICS)[number];
type RiffPost = {
  id: string;
  authorUserId: string;
  authorHandle: string;
  body: string;
  communityId: string | null;
  quotePostId: string | null;
  mediaId: string | null;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  likeCount: number;
  followCount: number;
  liked: boolean;
  following: boolean;
};

function Riff() {
  const { user } = useCurrentUserState();
  const userId = user?.id ?? null;
  const [posts, setPosts] = useState<RiffPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [draft, setDraft] = useState("");
  const [quoting, setQuoting] = useState<string | null>(null);
  const [topic, setTopic] = useState<Topic>("all");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    let active = true;
    if (!userId) {
      setPosts([]);
      setLoadError("");
      setLoading(false);
      return () => { active = false; };
    }
    setLoading(true);
    setLoadError("");
    listRiffs({ data: { limit: 30 } })
      .then((rows) => { if (active) setPosts(rows as RiffPost[]); })
      .catch(() => { if (active) setLoadError("Riff could not load. Please try again."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId]);

  const visiblePosts = useMemo(() => {
    if (topic === "all") return posts;
    return posts.filter((post) => `${post.body} ${post.communityId ?? ""}`.toLowerCase().includes(topic));
  }, [posts, topic]);

  async function submitRiff(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim() || posting) return;
    setPosting(true);
    try {
      const post = await createRiff({ data: { body: draft.trim(), quotePostId: quoting ?? undefined } });
      setPosts((current) => [post as RiffPost, ...current.filter((item) => item.id !== post.id)]);
      setDraft("");
      setQuoting(null);
      toast.success("Riff published.");
    } catch {
      toast.error("Riff could not be published. Your draft is still here.");
    } finally {
      setPosting(false);
    }
  }

  async function likePost(postId: string) {
    try {
      const result = await toggleRiffLike({ data: { postId } });
      setPosts((current) => current.map((post) => post.id === postId ? { ...post, liked: result.liked, likeCount: result.likeCount } : post));
    } catch {
      toast.error("Like could not be saved.");
    }
  }

  async function followPost(postId: string) {
    try {
      const result = await toggleRiffFollow({ data: { postId } });
      setPosts((current) => current.map((post) => post.id === postId ? { ...post, following: result.following, followCount: result.followCount } : post));
    } catch {
      toast.error("Follow could not be saved.");
    }
  }

  async function reportPost(postId: string) {
    try {
      await reportRiff({ data: { postId, reason: "other" } });
      toast.success("Report submitted for review.");
    } catch {
      toast.error("Report could not be submitted.");
    }
  }

  return (
    <main className="safe-bottom bg-card">
      <header className="px-5 pt-6">
        <div className="flex items-center gap-3">
          <RiffMark size={44} className="riff-mark-header" />
          <div>
            <p className="kicker">Conversation</p>
            <h1 className="mt-0.5 font-display text-4xl">Riff</h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Short posts that can become a whole conversation. Not Square. Not Chat. Not a profile tab.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Text posts and replies only for now. Riff media sharing is not available yet.
        </p>
      </header>

      <div className="mt-4 flex gap-2 overflow-x-auto px-5">
        {TOPICS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTopic(id)}
            className={cn("h-9 shrink-0 rounded-full px-4 text-sm capitalize", topic === id ? "bg-ink text-paper" : "bg-card ring-1 ring-border")}
          >
            {id}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto px-5 pb-2">
        {CHALLENGES.map((challenge) => (
          <button
            key={challenge.id}
            type="button"
            className="w-44 shrink-0 rounded-2xl bg-secondary p-3 text-left"
            onClick={() => setDraft((current) => current || `${challenge.title}: ${challenge.body}`)}
          >
            <p className="text-[11px] font-medium text-bud">Writing prompt</p>
            <p className="mt-1 text-sm font-medium">{challenge.title}</p>
          </button>
        ))}
      </div>

      {user ? (
        <form className="mt-2 border-y border-border px-5 py-4" onSubmit={submitRiff}>
          {quoting ? (
            <p className="mb-2 text-xs text-muted-foreground">
              Quoting a Riff ·{" "}
              <button type="button" className="underline" onClick={() => setQuoting(null)}>cancel</button>
            </p>
          ) : null}
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value.slice(0, 10000))}
            maxLength={10000}
            placeholder="Start a Riff."
            className="min-h-20 w-full resize-none bg-transparent text-sm outline-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{draft.length}/10,000</span>
            <Button type="submit" size="sm" disabled={!draft.trim() || posting}>
              {posting ? "Publishing…" : "Drop"}
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-4 px-5 text-sm text-muted-foreground">Sign in to read and join shared Riff conversations.</p>
      )}

      <div aria-live="polite">
        {loading ? <p className="px-5 py-8 text-sm text-muted-foreground">Loading Riffs…</p> : null}
        {loadError ? (
          <div className="px-5 py-8">
            <p className="text-sm text-muted-foreground">{loadError}</p>
            <Button className="mt-3" variant="outline" size="sm" onClick={() => window.location.reload()}>Try again</Button>
          </div>
        ) : null}
        {!loading && !loadError && user && visiblePosts.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground">
            {posts.length === 0 ? "No Riffs yet. Start the first conversation." : "No Riffs match this topic."}
          </p>
        ) : null}
        {visiblePosts.map((post) => (
          <RiffCard
            key={post.id}
            post={post}
            onQuote={() => setQuoting(post.id)}
            onLike={() => void likePost(post.id)}
            onFollow={() => void followPost(post.id)}
            onReport={() => void reportPost(post.id)}
          />
        ))}
      </div>
    </main>
  );
}

function RiffCard({ post, onQuote, onLike, onFollow, onReport }: {
  post: RiffPost;
  onQuote: () => void;
  onLike: () => void;
  onFollow: () => void;
  onReport: () => void;
}) {
  const author = post.authorHandle || "member";
  const displayName = author === "you" ? "You" : author === "member" ? "UNIBUD member" : author;
  const hasProfile = author !== "you" && author !== "member";
  return (
    <article className="border-b border-border px-5 py-4">
      <div className="flex gap-3">
        <Avatar name={displayName} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {hasProfile ? <Link to="/u/$handle" params={{ handle: author }} className="hover:underline">{displayName}</Link> : displayName}
            {hasProfile ? <span className="ml-1 font-normal text-muted-foreground">@{author}</span> : null}
            <span className="ml-1 font-normal text-muted-foreground">· {relativeTime(post.createdAt)}</span>
          </p>
          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{post.body}</p>
          {post.quotePostId ? (
            <p className="mt-2 rounded-xl bg-secondary px-3 py-2 text-xs text-muted-foreground">Includes a quoted Riff.</p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-muted-foreground">
            <button type="button" onClick={onLike} className={cn("inline-flex h-9 items-center gap-1.5 text-sm", post.liked && "text-bud")} aria-label={post.liked ? "Unlike Riff" : "Like Riff"}>
              <Heart className={cn("size-4", post.liked && "fill-bud")} />{post.likeCount || ""}
            </button>
            <Link to="/riff/$id" params={{ id: post.id }} className="inline-flex h-9 items-center gap-1.5 text-sm">
              <MessageCircle className="size-4" />{post.replyCount || ""}
            </Link>
            <button type="button" onClick={onQuote} className="inline-flex h-9 items-center gap-1.5 text-sm" aria-label="Quote Riff">
              <Repeat2 className="size-4" />
            </button>
            <button type="button" onClick={onFollow} className={cn("inline-flex h-9 items-center gap-1.5 text-sm", post.following && "text-ink")} aria-label={post.following ? "Unfollow conversation" : "Follow conversation"}>
              <Bookmark className={cn("size-4", post.following && "fill-ink")} />
            </button>
            <Link to="/bud" className="inline-flex h-9 items-center gap-1.5 text-sm" aria-label="Ask Bud" onClick={() => setBudDraft(`A Riff by @${author}: “${post.body}”\nHelp me think about this. Stay as Bud.`)}>
              <Sparkles className="size-4" />
            </Link>
            <button type="button" className="inline-flex h-9 items-center gap-1.5 text-sm" onClick={onReport} aria-label="Report Riff">
              <Flag className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
