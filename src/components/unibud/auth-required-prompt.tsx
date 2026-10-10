import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/brand/logo";

export function AuthRequiredPrompt({
  title = "Sign in to continue",
  body = "This part of UNIBUD needs an account. Guests can keep browsing the Board feed anytime.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <main className="mx-auto flex min-h-[70dvh] max-w-md flex-col justify-center px-6 py-12">
      <Wordmark size="sm" className="mb-8 max-w-[9rem]" />
      <p className="kicker">Account needed</p>
      <h1 className="mt-2 font-display text-3xl font-medium">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p>
      <div className="mt-8 flex flex-col gap-3">
        <Button asChild className="w-full">
          <Link to="/login" search={{ mode: "up" }}>
            Sign Up
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link to="/login" search={{ mode: "in" }}>
            Sign In
          </Link>
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link to="/board">Back to Board</Link>
        </Button>
      </div>
    </main>
  );
}
