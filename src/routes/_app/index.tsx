import { createFileRoute, Link, useLoaderData, useNavigate } from "@tanstack/react-router";
import { BadgeCheck, Bookmark, Heart, MessageCircle, MoreHorizontal, Play, Share2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Avatar } from "@/components/unibud/person";
import { CampusMoments } from "@/components/unibud/campus-moments";
import { ReelsStage } from "@/components/unibud/reels-stage";
import { EmptyState } from "@/components/unibud/empty";
import { communityById, personByHandle } from "@/lib/unibud/catalog";
import { relativeTime } from "@/lib/unibud/format";
import { useCampusStore } from "@/lib/unibud/campus-store";
import { useStudioStore } from "@/lib/studio/store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";
import { isVideoPost, likeKey, loopStream, postsForLane, SQUARE_LANES, type SquareLane } from "@/lib/unibud/square-stream";
import { addSquareReply, toggleCommentLike as toggleDbCommentLike, togglePostLike, toggleSave } from "@/lib/unibud/server";
import { bulkDeleteMyPosts } from "@/lib/social/server";
import { trackAnalyticsEvent } from "@/lib/analytics/server";
import { toast } from "sonner";
import type { DiscoveryItem, FeedPost } from "@/lib/unibud/types";
import { isSquareInteractiveTarget } from "@/lib/unibud/square-board";

const EMPTY_REPLIES: import("@/lib/unibud/spill-data").SpillReply[] = [];

export const Route = createFileRoute("/_app/")({ component: Square });

function Square() {
  const catalog = useLoaderData({ from: "/_app" });
  const nav = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const onboardingDone = useCampusStore((s) => s.onboardingDone);

  useEffect(() => {
    if (isPending) return;
    try {
      if (!sessionStorage.getItem("unibud-guest-browse")) {
        sessionStorage.setItem("unibud-guest-browse", "1");
      }
    } catch {
      /* ignore */
    }
    if (user && !onboardingDone) void nav({ to: "/welcome" });
  }, [user, isPending, onboardingDone, nav]);

  const [lane, setLane] = useState<SquareLane>("on-stream");
  const [peekStart, setPeekStart] = useState<string | undefined>();
  const [shown, setShown] = useState(10);
  const [category, setCategory] = useState<NonNullable<FeedPost["category"]> | "all">("all");
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [deletingPosts, setDeletingPosts] = useState(false);
  const localPosts = useCampusStore((s) => s.localPosts);
  const following = useCampusStore((s) => s.following);
  const connections = useCampusStore((s) => s.connections);
  const interests = useCampusStore((s) => s.interests);
  const likeCounts = useCampusStore((s) => s.likeCounts);
  const searches: string[] = [];
  const setComposeOpen = useCampusStore((s) => s.setComposeOpen);
  const setDropOpen = useCampusStore((s) => s.setDropOpen);
  const setSquareView = useCampusStore((s) => s.setSquareView);
  const sentinel = useRef<HTMLDivElement | null>(null);

  const merged = useMemo(() => {
    const base = (catalog.posts ?? []) as FeedPost[];
    const locals = (localPosts ?? []) as FeedPost[];
    return [...locals, ...base];
  }, [catalog.posts, localPosts]);

  const categorizedPosts = useMemo(
    () => category === "all" ? merged : merged.filter((post) => (post.category ?? "general") === category),
    [merged, category],
  );
  const lanePosts = useMemo(
    () => postsForLane(categorizedPosts, lane, { following, interests, universityId: "unilag", likeCounts, searches }, connections),
    [categorizedPosts, lane, following, connections, interests, likeCounts, searches],
  );

  const stream = useMemo(() => loopStream(lanePosts, shown), [lanePosts, shown]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setShown((n) => n + 8);
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lane, lanePosts.length]);

  if (isPending || (user && !onboardingDone)) {
    return <div className="m-4 h-48 animate-pulse rounded-3xl bg-secondary" />;
  }

  function openPeek(id: string) {
    setPeekStart(id);
    setLane("peek");
    setSquareView("peek");
  }

  async function deleteSelectedPosts() {
    if (!selectedPostIds.length || deletingPosts) return;
    const confirmed = window.confirm(`Delete ${selectedPostIds.length} selected post(s)? This cannot be undone.`);
    if (!confirmed) return;
    setDeletingPosts(true);
    try {
      const result = await bulkDeleteMyPosts({ data: { postIds: selectedPostIds } });
      setSelectedPostIds([]);
      if (result.notDeletedIds.length) toast.message(`${result.deletedIds.length} deleted. ${result.notDeletedIds.length} were not deleted because they are not yours or no longer exist.`);
      else toast.success(`${result.deletedIds.length} post(s) deleted.`);
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete selected posts.");
    } finally { setDeletingPosts(false); }
  }

  function chooseLane(v: SquareLane) {
    setLane(v);
    setSquareView(v === "peek" ? "peek" : "feed");
    if (v !== "peek") setPeekStart(undefined);
    setShown(10);
  }

  return (
    <main className="bg-card">
      {lane === "peek" ? (
        <div className="relative bg-ink">
          <div className="absolute top-0 right-0 left-0 z-20 px-4 py-3">
            <StreamPicker lane={lane} onChange={chooseLane} dark />
          </div>
          <ReelsStage source={lanePosts.length ? lanePosts : merged} startId={peekStart} />
        </div>
      ) : (
        <div
          className="min-h-[60dvh]"
          onClick={(e) => {
            if (isSquareInteractiveTarget(e.target)) return;
            void nav({ to: "/bud" });
          }}
        >
          <div className="px-4 pt-3">
            <p className="kicker">The UNIBUD world</p>
            <div className="mt-1 flex items-start justify-between gap-3">
              <h1 className="font-display text-5xl font-medium">Square</h1>
              <button
                type="button"
                className="grid size-11 place-items-center text-2xl leading-none text-ink"
                aria-label="Drop"
                data-square-interactive
                onClick={() => setDropOpen(true)}
              >
                +
              </button>
            </div>
          </div>
          <div className="mt-3">
            <CampusMoments
              signedIn
              onCreate={() => {
                const studio = useStudioStore.getState();
                studio.setIntent("story");
                studio.setMode("story");
                studio.setDest("story");
                studio.setView("camera");
                setComposeOpen(true);
              }}
            />
          </div>
          <StreamPicker lane={lane} onChange={chooseLane} />
          <div className="flex gap-2 overflow-x-auto px-4 py-3" aria-label="Filter posts by topic">
            {([
              ["all", "All topics"], ["general", "General"], ["learning", "Learning"], ["campus", "Campus"],
              ["opportunity", "Opportunities"], ["culture", "Culture"], ["question", "Questions"], ["announcement", "Announcements"],
            ] as const).map(([value, label]) => (
              <button key={value} type="button" onClick={() => { setCategory(value); setShown(10); if (user) void trackAnalyticsEvent({ data: { eventName: "category_filter", pagePath: "/", contentId: value } }).catch(() => {}); }} aria-pressed={category === value}
                className={cn("shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium", category === value ? "border-ink bg-ink text-paper" : "border-border bg-background text-muted-foreground")}>{label}</button>
            ))}
          </div>
          {selectedPostIds.length ? <div className="sticky top-12 z-20 flex items-center justify-between gap-3 border-y border-border bg-background/95 px-4 py-3 backdrop-blur-sm">
            <span className="text-sm">{selectedPostIds.length} selected</span>
            <button type="button" disabled={deletingPosts} onClick={() => void deleteSelectedPosts()} className="rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{deletingPosts ? "Deleting…" : "Delete selected"}</button>
          </div> : null}
          <LaneFeed lane={lane} stream={stream} discovery={lane === "off-rails" ? (catalog.discovery ?? []) : []} sentinel={sentinel} onOpenPeek={openPeek}
            selectedPostIds={selectedPostIds} onTogglePostSelection={(id, checked) => setSelectedPostIds((ids) => checked ? [...new Set([...ids, id])] : ids.filter((item) => item !== id))} />
        </div>
      )}
    </main>
  );
}

function StreamPicker({
  lane,
  onChange,
  dark,
}: {
  lane: SquareLane;
  onChange: (v: SquareLane) => void;
  dark?: boolean;
}) {
  const [busy, setBusy] = useState<SquareLane | null>(null);
  function pick(id: SquareLane) {
    if (id === lane) return;
    setBusy(id);
    onChange(id);
    window.setTimeout(() => setBusy(null), 180);
  }
  return (
    <nav
      className={cn("square-lanes", !dark && "mt-3")}
      aria-label="Square feeds"
      data-dark={dark ? "true" : undefined}
    >
      {SQUARE_LANES.map((item) => {
        const on = lane === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className="square-lane"
            data-on={on ? "true" : undefined}
            data-busy={busy === item.id ? "true" : undefined}
            aria-current={on ? "page" : undefined}
            onClick={() => pick(item.id)}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}

function LaneFeed({
  lane,
  stream,
  discovery,
  sentinel,
  onOpenPeek,
  selectedPostIds,
  onTogglePostSelection,
}: {
  lane: SquareLane;
  stream: FeedPost[];
  discovery: DiscoveryItem[];
  sentinel: React.RefObject<HTMLDivElement | null>;
  onOpenPeek: (id: string) => void;
  selectedPostIds: string[];
  onTogglePostSelection: (id: string, checked: boolean) => void;
}) {
  if (!stream.length) {
    const copy =
      lane === "buddies"
        ? { title: "Buddies is quiet", body: "Connect with people and follow a few voices. Their posts land here." }
        : lane === "quad-drop"
          ? { title: "Nothing on Quad Drop yet", body: "Campus and university activity will gather here as people post." }
          : { title: "Square is still waking up", body: "Drop something, or come back as the world starts moving." };
    return (
      <div className="px-4 py-8">
        <EmptyState title={copy.title} body={copy.body} />
      </div>
    );
  }
  return (
    <div className="mt-1">
      {stream.map((p, i) => {
        const spark = lane === "off-rails" && discovery.length ? discovery[i % discovery.length] : null;
        const showSpark = Boolean(spark) && i > 0 && i % 5 === 0 && !p.id.includes("~");
        return (
          <div key={p.id}>
            {showSpark && spark ? <DiscoveryCard item={spark} /> : null}
            <FeedItem post={p} onOpenPeek={onOpenPeek} selected={selectedPostIds.includes(likeKey(p.id))} onToggleSelection={onTogglePostSelection} />
          </div>
        );
      })}
      <div ref={sentinel} className="h-16" aria-hidden />
    </div>
  );
}

function DiscoveryCard({ item }: { item: DiscoveryItem }) {
  return (
    <article className="border-b border-border px-5 py-4" data-square-interactive>
      <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">{item.kicker}</p>
      <p className="mt-1 text-sm font-semibold">{item.title}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
    </article>
  );
}

function postUrl(id: string) {
  if (typeof window === "undefined") return `/?p=${id}`;
  return `${window.location.origin}/?p=${likeKey(id)}`;
}

async function sharePost(post: FeedPost) {
  const url = postUrl(post.id);
  try {
    if (navigator.share) {
      await navigator.share({ title: "UNIBUD", text: post.body, url });
      return;
    }
  } catch {
    /* cancelled */
  }
  try {
    await navigator.clipboard.writeText(url);
    toast.success("Link copied.");
  } catch {
    toast.message(url);
  }
}

function FeedItem({ post, onOpenPeek, selected, onToggleSelection }: { post: FeedPost; onOpenPeek: (id: string) => void; selected: boolean; onToggleSelection: (id: string, checked: boolean) => void }) {
  const person = personByHandle(post.authorHandle);
  const community = communityById(post.communityId);
  const key = likeKey(post.id);
  const liked = useCampusStore((s) => s.liked[key]);
  const count = useCampusStore((s) => s.likeCounts[key] ?? 0);
  const toggleLike = useCampusStore((s) => s.toggleLike);
  const localReplies = useCampusStore((s) => s.postReplies[key] ?? EMPTY_REPLIES);
  const addPostReply = useCampusStore((s) => s.addPostReply);
  const hidePost = useCampusStore((s) => s.hidePost);
  const saved = useCampusStore((s) => (s.savedPosts ?? []).includes(key));
  const toggleSavePost = useCampusStore((s) => s.toggleSavePost);
  const { user } = useCurrentUserState();
  const [replySort, setReplySort] = useState<"newest" | "oldest">("newest");
  const articleRef = useRef<HTMLElement | null>(null);
  const viewSent = useRef(false);
  useEffect(() => {
    const element = articleRef.current;
    if (!user || !element || viewSent.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5) && !viewSent.current) {
        viewSent.current = true;
        void trackAnalyticsEvent({ data: { eventName: "post_view", pagePath: "/", contentId: key } }).catch(() => {});
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [user, key]);
  const catalog = useLoaderData({ from: "/_app" });
  const dbReplies = (catalog.replies ?? [])
    .filter((r) => r.postId === key)
    .map((r) => ({
      id: r.id,
      authorHandle: r.authorHandle,
      body: r.body,
      parentId: r.parentId,
      createdAt: r.createdAt,
    }));
  const localIds = new Set(localReplies.map((r) => r.id));
  const replies = [...dbReplies.filter((r) => !localIds.has(r.id)), ...localReplies].sort((a, b) => {
    const difference = new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime();
    return replySort === "newest" ? difference : -difference;
  });
  const following = useCampusStore((s) => s.following);
  const follow = useCampusStore((s) => s.follow);
  const unfollow = useCampusStore((s) => s.unfollow);
  const reportPost = useCampusStore((s) => s.reportPost);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [reply, setReply] = useState("");
  const name = person?.name ?? post.authorHandle;
  const video = isVideoPost(post);

  return (
    <article ref={articleRef} data-square-interactive className="border-b border-border px-5 py-4">
      <div className="flex gap-3">
        {user && post.authorUserId === user.id ? <input type="checkbox" aria-label={`Select post by @${post.authorHandle}`} checked={selected}
          onChange={(event) => onToggleSelection(key, event.currentTarget.checked)} className="mt-3 size-4 shrink-0 accent-current" /> : null}
        <Link to="/u/$handle" params={{ handle: post.authorHandle }} className="shrink-0">
          <Avatar name={name} className="size-11" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                <Link to="/u/$handle" params={{ handle: post.authorHandle }} className="hover:underline">
                  {name}
                </Link>
                {person?.verified ? <BadgeCheck className="ml-1 inline size-3.5 text-bud" /> : null}
                <span className="ml-1 font-normal text-muted-foreground">@{post.authorHandle}</span>
                <span className="ml-1 font-normal text-muted-foreground">· {relativeTime(post.createdAt)}</span>
              </p>
              {community ? (
                <Link to="/communities/$id" params={{ id: community.id }} className="text-[11px] font-medium text-bud">
                  {community.name}
                </Link>
              ) : null}
            </div>
            <button type="button" className="grid size-9 place-items-center text-muted-foreground" onClick={() => setMenu((v) => !v)} aria-label="More">
              <MoreHorizontal className="size-4" />
            </button>
          </div>
          {menu ? (
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <button type="button" className="rounded-full bg-secondary px-3 py-1" onClick={() => { following.includes(post.authorHandle) ? unfollow(post.authorHandle) : follow(post.authorHandle); setMenu(false); }}>
                {following.includes(post.authorHandle) ? "Unfollow" : "Follow"}
              </button>
              <button type="button" className="rounded-full bg-secondary px-3 py-1" onClick={() => { hidePost(key); setMenu(false); }}>
                Hide
              </button>
              <button type="button" className="rounded-full bg-secondary px-3 py-1" onClick={() => { reportPost(key); toast.message("Report noted."); setMenu(false); }}>
                Report
              </button>
            </div>
          ) : null}
          <p className="mt-2 text-sm leading-relaxed">{post.body}</p>
          {post.image ? (
            video ? (
              <button type="button" className="relative mt-3 block w-full overflow-hidden rounded-2xl" onClick={() => onOpenPeek(post.id)}>
                <img src={post.image} alt="" className="max-h-80 w-full object-cover" />
                <span className="absolute inset-0 grid place-items-center bg-ink/20"><Play className="size-10 text-paper" /></span>
              </button>
            ) : (
              <img src={post.image} alt="" className="mt-3 max-h-80 w-full rounded-2xl object-cover" />
            )
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-muted-foreground">
            <button type="button" onClick={() => { toggleLike(key); if (user) { void togglePostLike({ data: key }).catch(() => {}); if (!liked) void trackAnalyticsEvent({ data: { eventName: "post_like", pagePath: "/", contentId: key } }).catch(() => {}); } }} className={cn("inline-flex h-9 items-center gap-1.5 text-sm", liked && "text-bud")}>
              <Heart className={cn("size-4", liked && "fill-bud")} />
              {count || ""}
            </button>
            <button type="button" onClick={() => setOpen((v) => !v)} className="inline-flex h-9 items-center gap-1.5 text-sm">
              <MessageCircle className="size-4" />
              {replies.length || ""}
            </button>
            <button type="button" onClick={() => { if (user) void trackAnalyticsEvent({ data: { eventName: "post_share", pagePath: "/", contentId: key } }).catch(() => {}); void sharePost(post); }} className="inline-flex h-9 items-center gap-1.5 text-sm" aria-label="Share">
              <Share2 className="size-4" />
            </button>
            <button type="button" onClick={() => { toggleSavePost(key); if (user) void toggleSave({ data: { kind: "post", itemId: key, title: post.body.slice(0, 80), href: postUrl(post.id) } }).catch(() => {}); }} className={cn("inline-flex h-9 items-center gap-1.5 text-sm", saved && "text-ink")} aria-label="Save">
              <Bookmark className={cn("size-4", saved && "fill-ink")} />
            </button>
          </div>
          {open ? (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Replies</span>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">Sort
                  <select aria-label="Sort replies" value={replySort} onChange={(event) => setReplySort(event.target.value as "newest" | "oldest")} className="rounded-full border border-border bg-background px-2 py-1 text-foreground">
                    <option value="newest">Newest first</option><option value="oldest">Oldest first</option>
                  </select>
                </label>
              </div>
              {replies.map((r) => (
                <p key={r.id} className="text-sm text-muted-foreground">
                  <span className="font-medium text-ink">@{r.authorHandle}</span> {r.body}
                </p>
              ))}
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!reply.trim()) return;
                  const body = reply.trim();
                  addPostReply(key, { id: crypto.randomUUID(), authorHandle: "you", body, createdAt: new Date().toISOString() });
                  if (user) void addSquareReply({ data: { postId: key, body } }).then(() => trackAnalyticsEvent({ data: { eventName: "post_comment", pagePath: "/", contentId: key } })).catch(() => {});
                  setReply("");
                }}
              >
                <input className="h-9 min-w-0 flex-1 rounded-full bg-secondary px-3 text-sm outline-none" placeholder="Reply…" value={reply} onChange={(e) => setReply(e.target.value)} />
                <button type="submit" className="rounded-full bg-ink px-4 text-sm text-paper">Send</button>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
