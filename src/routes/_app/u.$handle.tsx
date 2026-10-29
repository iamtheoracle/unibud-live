import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { DemoCallout } from "@/components/unibud/demo-callout";

export const Route = createFileRoute("/_app/u/$handle")({ component: PublicProfile });

function PublicProfile() {
  const { handle } = Route.useParams();

  return (
    <main className="safe-bottom mx-auto max-w-2xl px-5 pt-8">
      <p className="kicker">Public profile</p>
      <div className="mt-4 rounded-3xl border border-border bg-card p-6">
        <ShieldAlert className="size-7 text-muted-foreground" />
        <h1 className="mt-3 font-display text-3xl">Profile visibility is not connected</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We cannot safely show a public profile for @{handle} yet. This build has no server-enforced profile visibility or verified identity status, so it will not substitute a sample profile or reveal profile details.
        </p>
        <DemoCallout>
          This is an intentional privacy safeguard. Public identity, academic details, posts, follows, connections, and verification badges must wait until their visibility and verification rules are stored and enforced by the server.
        </DemoCallout>
        <Link to="/connect" className="mt-5 inline-block text-sm font-medium">Back to Connect</Link>
      </div>
    </main>
  );
}
