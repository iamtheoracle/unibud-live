import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthReady } from "@/components/unibud/sign-in-gate";
import { submitFeedback, submitPublicFeedback } from "@/lib/feedback/server";

export const Route = createFileRoute("/_app/feedback")({ component: Feedback });

function Feedback() {
  const { user } = useAuthReady();
  const [body, setBody] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");

  const send = useMutation({
    mutationFn: async () => {
      if (user) {
        return submitFeedback({ data: { body, category, email } });
      }
      return submitPublicFeedback({ data: { body, category, email } });
    },
    onSuccess: () => {
      setBody("");
      toast.success("Saved. The UNIBUD team can read this in the feedback store.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not save feedback."),
  });

  return (
    <main className="safe-bottom px-5 pt-6">
      <p className="kicker">Product</p>
      <h1 className="mt-1 font-display text-3xl">Feedback</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Tell us what felt off. Submissions are stored in UNIBUD — not emailed automatically.
      </p>

      <div className="mt-6 space-y-3">
        <label className="block text-xs font-medium text-muted-foreground">
          Category
          <select
            className="mt-1 h-11 w-full rounded-xl bg-secondary px-3 text-sm text-ink"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="general">General</option>
            <option value="bud">Bud</option>
            <option value="board">Board</option>
            <option value="chat">Chat</option>
            <option value="bug">Bug</option>
          </select>
        </label>
        {!user ? (
          <label className="block text-xs font-medium text-muted-foreground">
            Email (optional)
            <Input
              className="mt-1"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="so we can follow up"
            />
          </label>
        ) : null}
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What should work better?"
          className="min-h-32"
        />
        <Button
          className="w-full"
          disabled={!body.trim() || send.isPending}
          onClick={() => send.mutate()}
        >
          {send.isPending ? "Saving…" : "Send feedback"}
        </Button>
      </div>
    </main>
  );
}
