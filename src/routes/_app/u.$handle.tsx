import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@/components/unibud/person";
import { RelationActions } from "@/components/unibud/relation-actions";
import { SignInCard, useAuthReady } from "@/components/unibud/sign-in-gate";
import { getPublicProfile, listPublicProfilePosts } from "@/lib/social/server";
import { relativeTime } from "@/lib/unibud/format";
import { uniById } from "@/lib/unibud/catalog";

export const Route = createFileRoute("/_app/u/$handle")({ component: PublicProfile });

function PublicProfile() {
  const { handle } = Route.useParams();
  const { user, isPending } = useAuthReady();
  const profile = useQuery({
    queryKey: ["public-profile", handle],
    queryFn: () => getPublicProfile({ data: handle }),
    enabled: Boolean(user),
  });
  const posts = useQuery({
    queryKey: ["profile-posts", handle],
    queryFn: () => listPublicProfilePosts({ data: handle }),
    enabled: Boolean(user) && Boolean(profile.data),
  });

  if (isPending) return <div className="m-4 h-40 animate-pulse rounded-2xl bg-secondary" />;
  if (!user) {
    return <main className="px-5 py-8"><SignInCard title="Sign in to view profiles" body="UNIBUD profiles are loaded from registered member accounts." /></main>;
  }
  if (profile.isLoading) return <div className="m-4 h-40 animate-pulse rounded-2xl bg-secondary" />;
  if (profile.isError) {
    return (
      <main className="px-5 py-12">
        <p className="text-sm text-destructive">Could not load this profile.</p>
        <Link to="/connect" className="mt-4 inline-block text-sm font-medium">Back to Connect</Link>
      </main>
    );
  }
  if (!profile.data) {
    return (
      <main className="px-5 py-12">
        <p className="text-sm text-muted-foreground">No registered UNIBUD member has that username.</p>
        <Link to="/connect" className="mt-4 inline-block text-sm font-medium">Back to Connect</Link>
      </main>
    );
  }

  const person = profile.data;
  const university = uniById(person.universityId);

  return (
    <main className="safe-bottom px-5 pt-6">
      <p className="kicker">Registered member</p>
      <div className="mt-4 flex items-start gap-4">
        <Avatar name={person.name} className="size-16 rounded-2xl text-lg" />
        <div className="min-w-0">
          <h1 className="break-words font-display text-3xl">{person.name}</h1>
          <p className="text-sm text-muted-foreground">@{person.handle}</p>
          {person.isSelf ? <p className="mt-1 text-xs text-bud">Your profile</p> : null}
        </div>
      </div>
      {person.bio ? <p className="mt-4 text-sm leading-relaxed">{person.bio}</p> : null}
      <dl className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-2xl bg-card p-3 ring-1 ring-border">
          <dt className="text-xs text-muted-foreground">University</dt>
          <dd className="mt-1 font-medium">{university?.name || person.universityId || "Not added"}</dd>
        </div>
        <div className="rounded-2xl bg-card p-3 ring-1 ring-border">
          <dt className="text-xs text-muted-foreground">Programme</dt>
          <dd className="mt-1 font-medium">{person.program || "Not added"}</dd>
        </div>
        <div className="rounded-2xl bg-card p-3 ring-1 ring-border">
          <dt className="text-xs text-muted-foreground">Year</dt>
          <dd className="mt-1 font-medium">{person.year || "Not added"}</dd>
        </div>
        <div className="rounded-2xl bg-card p-3 ring-1 ring-border">
          <dt className="text-xs text-muted-foreground">Role</dt>
          <dd className="mt-1 font-medium">{person.role}</dd>
        </div>
      </dl>
      {!person.isSelf ? (
        <div className="mt-5">
          <RelationActions handle={person.handle} />
        </div>
      ) : null}
      <section className="mt-8">
        <h2 className="font-display text-2xl">Posts</h2>
        {posts.isLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading posts…</p>
        ) : posts.isError ? (
          <p className="mt-3 text-sm text-muted-foreground">Posts could not be loaded.</p>
        ) : posts.data?.length ? (
          <ul className="mt-3 space-y-3">
            {posts.data.map((post) => (
              <li key={post.id} className="rounded-2xl bg-card p-4 ring-1 ring-border">
                <p className="text-sm leading-relaxed">{post.body}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {post.communityName} · {relativeTime(post.createdAt)}{post.kind === "reel" ? " · Reel" : ""}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">No posts are available to you from this member yet.</p>
        )}
      </section>
      <Link to="/connect" className="mt-5 inline-flex text-sm font-medium">Back to Connect</Link>
    </main>
  );
}
