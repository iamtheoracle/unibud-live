import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, Flag, Heart, MessageCircle, Repeat2, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Avatar } from "@/components/unibud/person";
import { Button } from "@/components/ui/button";
import { communityById, personByHandle } from "@/lib/unibud/catalog";
import { relativeTime } from "@/lib/unibud/format";
import { useCampusStore } from "@/lib/unibud/campus-store";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/utils";
import type { SpillPost } from "@/lib/unibud/spill-data";
import { CHALLENGES } from "@/lib/unibud/discover-data";
import { setBudDraft } from "@/lib/bud/draft";
import { RiffMark } from "@/components/brand/identity-marks";

export const Route = createFileRoute("/_app/riff")({ component: Riff });

const TOPICS = ["all", "music", "tech", "games", "culture", "learning", "space"] as const;

function Riff() {
  const { user } = useCurrentUserState();
  const spills = useCampusStore((s) => s.spills);
  const addSpill = useCampusStore((s) => s.addSpill);
  const flagged = useCampusStore((s) => s.flaggedSpills);
  const followed = useCampusStore((s) => s.followedRiffs ?? []);
  const [draft, setDraft] = useState("");
  const [quoting, setQuoting] = useState<string | null>(null);
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("all");

  const list = useMemo(() => {
    const base = spills.filter((s) => !flagged.includes(s.id));
    if (topic === "all") return base;
    const needle = topic;
    return base.filter((s) => `${s.body} ${s.communityId ?? ""}`.toLowerCase().includes(needle));
  }, [spills, flagged, topic]);

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
      </header>

      <div className="mt-4 flex gap-2 overflow-x-auto px-5">
        {TOPICS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setTopic(id)}
            className={`h-9 shrink-0 rounded-full px-3 text-sm ${topic === id ? "bg-ink text-paper" : "bg-secondary"}`}
          >
            {id}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto px-5">
        {CHALLENGES.map((c) => (
          <button
            key={c.id}
            type="button"
            className="w-44 shrink-0 rounded-2xl bg-secondary p-3 text-left"
            onClick={() => setDraft((d) => d || `${c.title}: ${c.body}`)}
          >
            <p className="text-[11px] font-medium text-muted-foreground">Open challenge</p>
            <p className="mt-1 text-sm font-medium">{c.title}</p>
          </button>
        ))}
      </div>

      <form
        className="mt-2 border-y border-border px-5 py-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          addSpill(draft.trim(), user ? "you" : "guest", quoting ? { quoteId: quoting } : undefined);
          setDraft("");
          setQuoting(null);
        }}
      >
        {!user ? (
          <p className="mb-2 text-[11px] text-muted-foreground">
            Guest Riff — on this device only. Sign in to keep it.
          </p>
        ) : null}
        {quoting ? (
          <p className="mb-2 text-xs text-muted-foreground">
            Quoting a Riff ·{" "}
            <button type="button" className="underline" onClick={() => setQuoting(null)}>
              cancel
            </button>
          </p>
        ) : null}
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Roast, rizz, gossip, or gist…"
          className="min-h-20 w-full resize-none bg-transparent text-sm outline-none"
        />
        <div className="mt-2 flex items-center justify-between">
          <button
            type="button"
            className="text-xs text-muted-foreground underline"
            onClick={() => {
              const key = "unibud-guest-bud-invites";
              const n = Number(sessionStorage.getItem(key) || "0");
              if (!user && n >= 3) {
                toast.error("Guest Bud limit reached. Sign in for more.");
                return;
              }
              if (!user) sessionStorage.setItem(key, String(n + 1));
              setBudDraft(draft.trim() || "Invite Bud into this Riff.");
              window.location.href = "/bud";
            }}
          >
            Invite Bud
          </button>
          <Button type="submit" size="sm" disabled={!draft.trim()}>
            Drop
          </Button>
        </div>
      </form>

      {followed.length ? (
        <p className="px-5 pt-4 text-xs text-muted-foreground">
          Following {followed.length} conversation{followed.length === 1 ? "" : "s"} on this device.
        </p>
      ) : null}

      <div>
        {list.map((s) => (
          <RiffCard key={s.id} spill={s} onQuote={() => setQuoting(s.id)} />
        ))}
      </div>
    </main>
  );
}

function RiffCard({ spill, onQuote }: { spill: SpillPost; onQuote: () => void }) {
  const person = personByHandle(spill.authorHandle);
  const name = person?.name ?? (spill.authorHandle === "you" ? "You" : spill.authorHandle);
  const community = spill.communityId ? communityById(spill.communityId) : undefined;
  const liked = useCampusStore((s) => s.liked[spill.id]);
  const count = useCampusStore((s) => s.likeCounts[spill.id] ?? 0);
  const toggleLike = useCampusStore((s) => s.toggleLike);
  const flagSpill = useCampusStore((s) => s.flagSpill);
  const followRiff = useCampusStore((s) => s.followRiff);
  const followed = useCampusStore((s) => (s.followedRiffs ?? []).includes(spill.id));

  return (
    <article className="border-b border-border px-5 py-4">
      <div className="flex items-start gap-3">
        <Avatar name={name} />
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <p className="truncate text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">@{spill.authorHandle}</p>
            <p className="ml-auto text-xs text-muted-foreground">{relativeTime(spill.createdAt)}</p>
          </div>
          {community ? (
            <p className="text-xs text-muted-foreground">{community.name}</p>
          ) : null}
          <p className="mt-1 text-sm leading-relaxed">{spill.body}</p>
          {spill.quotedFrom ? (
            <div className="mt-2 rounded-xl bg-secondary px-3 py-2 text-xs text-muted-foreground">
              From Square · @{spill.quotedFrom.handle}: {spill.quotedFrom.body}
            </div>
          ) : null}
          {spill.video ? (
            <img src={spill.video} alt="" className="mt-3 h-40 w-full rounded-2xl object-cover" />
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-muted-foreground">
            <button
              type="button"
              onClick={() => toggleLike(spill.id)}
              className={cn("inline-flex h-9 items-center gap-1.5 text-sm", liked && "text-bud")}
            >
              <Heart className={cn("size-4", liked && "fill-bud")} />
              {count || ""}
            </button>
            <Link
              to="/riff/$id"
              params={{ id: spill.id }}
              className="inline-flex h-9 items-center gap-1.5 text-sm"
            >
              <MessageCircle className="size-4" />
              {spill.replies.length || ""}
            </Link>
            <button type="button" onClick={onQuote} className="inline-flex h-9 items-center gap-1.5 text-sm" aria-label="Quote">
              <Repeat2 className="size-4" />
            </button>
            <button
              type="button"
              className={cn("inline-flex h-9 items-center gap-1.5 text-sm", followed && "text-ink")}
              onClick={() => followRiff(spill.id)}
              aria-label="Follow conversation"
            >
              <Bookmark className={cn("size-4", followed && "fill-ink")} />
            </button>
            <Link
              to="/bud"
              className="inline-flex h-9 items-center gap-1.5 text-sm"
              aria-label="Ask Bud"
              onClick={() =>
                setBudDraft(`A Riff by @${spill.authorHandle}: “${spill.body}”\nHelp me think about this. Stay as Bud.`)
              }
            >
              <Sparkles className="size-4" />
            </Link>
            <button
              type="button"
              className="inline-flex h-9 items-center gap-1.5 text-sm"
              onClick={() => {
                flagSpill(spill.id);
                toast.success("Report noted. This is not The Fixer.");
              }}
              aria-label="Report"
            >
              <Flag className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
