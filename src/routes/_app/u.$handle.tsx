import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@/components/unibud/person";
import { RelationActions } from "@/components/unibud/relation-actions";
import { SignInCard, useAuthReady } from "@/components/unibud/sign-in-gate";
import { getPublicProfile } from "@/lib/social/server";
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
          <dd className="mt-1 font-medium">{university?.name ?? person.universityId || "Not added"}</dd>
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
      <section className="mt-8 rounded-2xl border border-border p-4">
        <h2 className="text-sm font-semibold">Member activity</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Public posts and profile activity will appear here when their persisted feed and privacy rules are connected. This page does not substitute sample posts for a real member’s activity.
        </p>
      </section>
      <Link to="/connect" className="mt-5 inline-flex text-sm font-medium">Back to Connect</Link>
    </main>
  );
}
