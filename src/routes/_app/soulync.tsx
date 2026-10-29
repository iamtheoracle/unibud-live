import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import {
  CalendarDays,
  Heart,
  LockKeyhole,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoCallout } from "@/components/unibud/demo-callout";

export const Route = createFileRoute("/_app/soulync")({ component: SouLync });

type SouLyncTab = "Discover" | "Likes" | "Matches" | "Date plans";
const tabs: SouLyncTab[] = ["Discover", "Likes", "Matches", "Date plans"];

function SouLync() {
  const [tab, setTab] = useState<SouLyncTab>("Discover");
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const [intent, setIntent] = useState("Meaningful connection");
  const [agePreference, setAgePreference] = useState("18+");
  const [area, setArea] = useState("");
  const [dateType, setDateType] = useState("Double date");
  const [venueIdea, setVenueIdea] = useState("");
  const [budget, setBudget] = useState("Moderate");
  const [timing, setTiming] = useState("Weekend");
  const [draftReady, setDraftReady] = useState(false);
  const [notice, setNotice] = useState("");

  function prepareDateDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setDraftReady(true);
    setNotice("Date idea prepared locally. No invitation, venue check, payment, or booking was created.");
  }

  function previewProfileSetup() {
    if (!adultConfirmed) {
      setNotice("Confirm that you are 18 or older before continuing to the profile setup preview.");
      return;
    }
    setNotice("Profile setup is a preview only. No account was created and no identity information was sent.");
  }

  const sectionCopy: Record<SouLyncTab, { title: string; body: string }> = {
    Discover: {
      title: "Your discovery space is ready",
      body: "Real eligible profiles will appear only after verified adult eligibility, privacy controls, blocks, preferences, and the authorized matching service are connected.",
    },
    Likes: {
      title: "Your likes will appear here",
      body: "Only authorized account activity will be shown. No sample likes or activity counts are generated.",
    },
    Matches: {
      title: "Mutual matches belong here",
      body: "A match must be mutual and confirmed by the server. This preview cannot create matches or start conversations.",
    },
    "Date plans": {
      title: "Your date plans will appear here",
      body: "A real plan needs participant consent, verified venue details, availability checks, clear cancellation terms, and safety guidance before confirmation.",
    },
  };

  return (
    <main className="safe-bottom mx-auto max-w-4xl px-5 pt-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="kicker">SOCIAL · PRIVATE BY DESIGN</p>
          <h1 className="mt-1 font-display text-4xl">SouLync</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Meet with intention. Build mutual connections. Plan real-world dates only when everyone opts in.
          </p>
        </div>
        <Button variant="outline" size="icon" aria-label="Dating preferences" aria-expanded={preferencesOpen} onClick={() => setPreferencesOpen((open) => !open)}>
          <SlidersHorizontal className="size-4" />
        </Button>
      </div>

      <DemoCallout>
        SouLync is an integration preview, not a live dating service. Profiles, likes, matching, age verification, blocks, reports, messaging, and bookings are not connected. No sample people or activity are shown.
      </DemoCallout>

      <section className="mt-5 rounded-3xl border border-border bg-card p-5 sm:p-7">
        <p className="kicker">MEET WITH INTENTION</p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl sm:text-4xl">
          Less endless swiping. More meaningful chemistry.
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Discover people according to your own boundaries, then choose whether you want to connect, meet for dinner, or plan a group outing.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={previewProfileSetup}>Preview profile setup <Heart className="ml-2 size-4" /></Button>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" checked={adultConfirmed} onChange={(event) => { setAdultConfirmed(event.target.checked); setNotice(""); }} />
            I confirm I am 18 or older
          </label>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          This checkbox is not identity or age verification. A production service must enforce eligibility server-side.
        </p>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <article className="rounded-2xl border border-border bg-card p-4">
          <Sparkles className="size-5 text-bud" />
          <h2 className="mt-3 font-medium">Intentional matching</h2>
          <p className="mt-1 text-sm text-muted-foreground">Preferences and relationship goals guide discovery.</p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-4">
          <CalendarDays className="size-5 text-bud" />
          <h2 className="mt-3 font-medium">Thoughtful date plans</h2>
          <p className="mt-1 text-sm text-muted-foreground">Coordinate timing, venue ideas, and budgets together.</p>
        </article>
        <article className="rounded-2xl border border-border bg-card p-4">
          <ShieldCheck className="size-5 text-bud" />
          <h2 className="mt-3 font-medium">Consent and safety</h2>
          <p className="mt-1 text-sm text-muted-foreground">Verification, block/report controls, and mutual consent are launch requirements.</p>
        </article>
      </div>

      {preferencesOpen && (
        <section className="mt-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
          <p className="kicker">YOUR BOUNDARIES</p>
          <h2 className="mt-1 text-xl font-medium">Dating preferences</h2>
          <p className="mt-1 text-sm text-muted-foreground">These values stay in this page session only and are not used for matching.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <label className="grid gap-1 text-sm">Relationship intention
              <select className="h-11 rounded-xl border border-border bg-background px-3" value={intent} onChange={(event) => setIntent(event.target.value)}>
                <option>Meaningful connection</option><option>Long-term relationship</option><option>Casual dating</option><option>Still exploring</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm">Age preference
              <select className="h-11 rounded-xl border border-border bg-background px-3" value={agePreference} onChange={(event) => setAgePreference(event.target.value)}>
                <option>18+</option><option>21+</option><option>25+</option>
              </select>
            </label>
            <label className="grid gap-1 text-sm">Preferred area
              <input className="h-11 rounded-xl border border-border bg-background px-3" value={area} onChange={(event) => setArea(event.target.value)} placeholder="City or neighbourhood" />
            </label>
          </div>
          <Button className="mt-4" variant="outline" onClick={() => setNotice("Preferences are temporary UI values. Nothing was saved or used to match you.")}>Keep local preferences</Button>
        </section>
      )}

      <section className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div><p className="kicker">MATCHING OPERATIONS</p><h2 className="mt-1 text-xl font-medium">Connection overview</h2></div>
          <span className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">Service not connected</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Eligible profiles", "Awaiting verified discovery"],
            ["Likes received", "Awaiting authorized activity"],
            ["Mutual matches", "Awaiting server confirmation"],
            ["Confirmed dates", "Awaiting booking confirmation"],
          ].map(([label, helper]) => (
            <div key={label} className="rounded-xl bg-background p-3">
              <p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold">—</p><p className="mt-1 text-xs text-muted-foreground">{helper}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="flex flex-wrap gap-2" aria-label="SouLync sections">
          {tabs.map((item) => <Button key={item} size="sm" variant={tab === item ? "default" : "outline"} aria-pressed={tab === item} onClick={() => { setTab(item); setNotice(""); }}>{item}</Button>)}
        </div>
        <div className="mt-3 rounded-2xl border border-border bg-card px-5 py-8 text-center" role="status">
          {tab === "Likes" ? <Heart className="mx-auto size-6 text-bud" /> : tab === "Matches" ? <UsersRound className="mx-auto size-6 text-bud" /> : tab === "Date plans" ? <CalendarDays className="mx-auto size-6 text-bud" /> : <Sparkles className="mx-auto size-6 text-bud" />}
          <h2 className="mt-3 text-lg font-medium">{sectionCopy[tab].title}</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">{sectionCopy[tab].body}</p>
          <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-3.5" /> No simulated activity</p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5">
        <p className="kicker">DATE STUDIO</p>
        <h2 className="mt-1 text-xl font-medium">Plan a date or outing</h2>
        <p className="mt-1 text-sm text-muted-foreground">Prepare a local idea only. Nothing is sent, booked, or shared.</p>
        <form className="mt-4 grid gap-3 sm:grid-cols-2" onSubmit={prepareDateDraft}>
          <label className="grid gap-1 text-sm">Date or outing type
            <select className="h-11 rounded-xl border border-border bg-background px-3" value={dateType} onChange={(event) => { setDateType(event.target.value); setDraftReady(false); }}>
              <option>Double date</option><option>Dinner date</option><option>Curated blind date</option><option>Coffee and conversation</option><option>Outdoor picnic</option><option>Games or activity date</option><option>Arts or gallery outing</option><option>Group outing</option><option>Virtual first date</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">Venue or area idea
            <input className="h-11 rounded-xl border border-border bg-background px-3" value={venueIdea} onChange={(event) => { setVenueIdea(event.target.value); setDraftReady(false); }} placeholder="A public café or area" />
          </label>
          <label className="grid gap-1 text-sm">Budget
            <select className="h-11 rounded-xl border border-border bg-background px-3" value={budget} onChange={(event) => { setBudget(event.target.value); setDraftReady(false); }}>
              <option>Low-cost</option><option>Moderate</option><option>Special occasion</option><option>Decide together</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">Timing
            <select className="h-11 rounded-xl border border-border bg-background px-3" value={timing} onChange={(event) => { setTiming(event.target.value); setDraftReady(false); }}>
              <option>Weekday</option><option>Weekend</option><option>Flexible</option><option>Choose together</option>
            </select>
          </label>
          <div className="sm:col-span-2"><Button type="submit">Prepare date idea <CalendarDays className="ml-2 size-4" /></Button></div>
        </form>
        {draftReady && <div className="mt-4 rounded-xl bg-secondary p-4" role="status"><p className="font-medium">Local date idea</p><p className="mt-1 text-sm">{dateType} · {budget} budget · {timing}{venueIdea.trim() ? ` · ${venueIdea.trim()}` : " · Venue not chosen"}</p><p className="mt-2 text-xs text-muted-foreground">Before any real plan is confirmed, all participants must opt in and venue, availability, cancellation, and safety details must be checked.</p></div>}
      </section>

      <aside className="mt-6 flex gap-3 rounded-2xl border border-border bg-secondary/50 p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0" />
        <div><h2 className="font-medium">Safety is part of the product</h2><p className="mt-1 text-sm text-muted-foreground">A production release needs server-enforced adult eligibility, consent, privacy controls, blocking/reporting, verified status, and participant confirmation. This page does not claim any of those services are live.</p></div>
      </aside>
      {notice && <p className="mt-4 rounded-xl bg-secondary p-3 text-sm" role="status">{notice}</p>}
      <p className="pb-8 pt-4 text-xs text-muted-foreground">SouLync · UNIBUD dating experience · UI integration preview only</p>
      <Link to="/" className="sr-only">Back to Square</Link>
    </main>
  );
}
