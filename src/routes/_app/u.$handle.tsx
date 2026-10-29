import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Avatar } from "@/components/unibud/person";
import { DemoCallout } from "@/components/unibud/demo-callout";
import { getPublicProfileByHandle } from "@/lib/social/server";

export const Route = createFileRoute("/_app/u/$handle")({ component: PublicProfile });

function PublicProfile() {
  const { handle } = Route.useParams();
  const profile = useQuery({
    queryKey: ["public-profile", handle],
    queryFn: () => getPublicProfileByHandle({ data: handle }),
    enabled: Boolean(handle),
  });

  if (profile.isPending) {
    return <main className="px-5 py-12" aria-busy="true"><div className="h-20 animate-pulse rounded-2xl bg-secondary" /></main>;
  }

  if (profile.error || !profile.data) {
    return (
      <main className="px-5 py-12">
        <p className="kicker">Public profile</p>
        <h1 className="mt-2 font-display text-3xl">Profile unavailable</h1>
        <p className="mt-2 text-sm text-muted-foreground">No member profile was found for @{handle}. Sample profiles are not substituted.</p>
        <Link to="/connect" className="mt-4 inline-block text-sm font-medium">Back to Connect</Link>
      </main>
    );
  }

  return (
    <main className="safe-bottom mx-auto max-w-2xl px-5 pt-6">
      <p className="kicker">Public profile</p>
      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
        <Avatar name={profile.data.displayName} className="size-16 rounded-2xl text-lg" />
        <div className="min-w-0">
          <h1 className="font-display text-3xl">{profile.data.displayName}</h1>
          <p className="text-sm text-muted-foreground">@{profile.data.handle}</p>
          <span className="mt-1 inline-flex rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Verification not connected</span>
        </div>
      </div>
      <DemoCallout>
        This page shows only the saved display name and handle. It does not imply student verification and does not expose academic details, posts, relationship state, or private profile settings until those controls are stored and enforced by the server.
      </DemoCallout>
      <Link to="/connect" className="mt-5 inline-block text-sm font-medium">Back to Connect</Link>
    </main>
  );
}
