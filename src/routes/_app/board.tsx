import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BOARD_SESSIONS, SESSION_LIFECYCLE } from "@/lib/unibud/board-data";
import { boardIdFor } from "@/lib/unibud/academic";
import { listEnrollments } from "@/lib/academic/server";
import { useCampusStore } from "@/lib/unibud/campus-store";
import { canTeach } from "@/lib/unibud/roles";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { relativeTime } from "@/lib/unibud/format";
import { useAuthReady } from "@/components/unibud/sign-in-gate";
import { DemoCallout } from "@/components/unibud/demo-callout";

export const Route = createFileRoute("/_app/board")({ component: Board });

type BoardSection = "Overview" | "Courses" | "Learning" | "Tasks" | "Discussions" | "Discover";
const BOARD_SECTIONS: BoardSection[] = ["Overview", "Courses", "Learning", "Tasks", "Discussions", "Discover"];

function Board() {
  const { user } = useAuthReady();
  const [section, setSection] = useState<BoardSection>("Overview");
  const [resourceQuery, setResourceQuery] = useState("");
  const role = useCampusStore((s) => s.role ?? "student");
  const liveAttendance = useCampusStore((s) => s.liveAttendance);
  const livePresence = useCampusStore((s) => s.livePresence);
  const recordingWatched = useCampusStore((s) => s.recordingWatched);
  const markLivePresent = useCampusStore((s) => s.markLivePresent);
  const leaveLive = useCampusStore((s) => s.leaveLive);
  const rejoinLive = useCampusStore((s) => s.rejoinLive);
  const markRecordingWatched = useCampusStore((s) => s.markRecordingWatched);
  const enrolled = useQuery({
    queryKey: ["enroll"],
    queryFn: () => listEnrollments(),
    enabled: Boolean(user),
  });
  const mine = enrolled.data ?? [];
  const codes = new Set(mine.map((c) => c.code));
  const sessions = codes.size ? BOARD_SESSIONS.filter((s) => codes.has(s.course)) : [];

  return (
    <main className="safe-bottom px-5 pt-6">
      <p className="kicker">Board</p>
      <h1 className="mt-1 font-display text-4xl">Your classrooms</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Course rooms, live class, syllabus and attendance. Not Square. Not Chat.
      </p>
      <DemoCallout>
        The academic schedule and attendance controls are previews until your institution's authorized services are connected. Nothing here is an official university record.
      </DemoCallout>
      <nav aria-label="Board sections" className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {BOARD_SECTIONS.map((item) => (
          <Button key={item} size="sm" variant={section === item ? "primary" : "outline"} aria-pressed={section === item} onClick={() => setSection(item)}>
            {item}
          </Button>
        ))}
      </nav>
      {section === "Overview" && (
        <>
      {mine.length ? (
        <ul className="mt-6 grid gap-3">
          {mine.map((c) => (
            <li key={c.id}>
              <Link
                to="/board/$id"
                params={{ id: boardIdFor(c.code) }}
                className="block rounded-2xl bg-card p-4 ring-1 ring-border"
              >
                <p className="text-[11px] font-semibold tracking-wide uppercase text-bud">{c.code}</p>
                <p className="mt-1 font-medium">{c.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{c.catalog?.lecturer} · {c.catalog?.programme}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          Pick this semester’s courses in <Link to="/studies" className="font-medium">Studies</Link>.
        </p>
      )}

      <ol className="mt-8 flex gap-2 overflow-x-auto text-[10px] font-semibold tracking-wide uppercase text-muted-foreground">
        {SESSION_LIFECYCLE.map((step) => (
          <li key={step} className="shrink-0 rounded-full bg-secondary px-3 py-1">
            {step}
          </li>
        ))}
      </ol>
      {canTeach(role) ? (
        <Link to="/tutor" className="mt-4 inline-block text-sm font-medium">
          Open Tutor Mode
        </Link>
      ) : null}

      {sessions.length ? <ul className="mt-6 space-y-3">
        {sessions.map((s) => {
          const present = liveAttendance[s.id] === "present";
          const inRoom = livePresence[s.id] === "in";
          const watched = Boolean(recordingWatched[s.id]);
          return (
            <li key={s.id} className="rounded-2xl bg-card p-4 ring-1 ring-border">
              <p className="text-[11px] font-semibold tracking-wide text-bud uppercase">{s.status}</p>
              <h2 className="mt-1 font-medium">{s.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {s.course} · {s.lecturer} · {s.department}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {s.topic} · {relativeTime(s.startsAt)} · {s.durationMin} min
              </p>
              <p className="mt-3 text-xs">
                Your attendance:{" "}
                <span className={cn(present ? "text-success" : "text-muted-foreground")}>
                  {present ? (inRoom ? "Present" : "Left early") : "Not attended"}
                </span>
                {watched ? " · Recording played (does not change attendance)" : null}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link to="/board/$id" params={{ id: boardIdFor(s.course) }} className="grid h-9 place-items-center rounded-full bg-secondary px-3 text-sm">
                  Open Board
                </Link>
                {s.status === "live" && !inRoom ? (
                  <Button size="sm" onClick={() => (present ? rejoinLive(s.id) : markLivePresent(s.id))}>
                    {present ? "Rejoin live" : "Join live"}
                  </Button>
                ) : null}
                {s.status === "live" && inRoom ? (
                  <Button size="sm" variant="outline" onClick={() => leaveLive(s.id)}>
                    Leave
                  </Button>
                ) : null}
                {s.status === "available" ? (
                  <Button size="sm" variant="outline" onClick={() => markRecordingWatched(s.id)}>
                    Play recording
                  </Button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul> : (
        <p className="mt-6 text-sm text-muted-foreground">
          No live or recorded sessions are connected to your enrolled courses yet.
        </p>
      )}

        </>
      )}

      {section === "Courses" && (
        <section className="mt-6">
          <div className="flex items-end justify-between gap-3">
            <div><p className="kicker">COURSE DIRECTORY</p><h2 className="mt-1 font-display text-2xl">My courses</h2></div>
            <Link to="/studies" className="text-sm font-medium">Manage in Studies</Link>
          </div>
          {mine.length ? (
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {mine.map((course) => (
                <li key={course.id}>
                  <Link to="/board/$id" params={{ id: boardIdFor(course.code) }} className="block rounded-2xl bg-card p-4 ring-1 ring-border">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-bud">{course.code}</p>
                    <p className="mt-1 font-medium">{course.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{course.catalog?.lecturer} · {course.catalog?.programme}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-4 rounded-2xl bg-card p-5 ring-1 ring-border">
              <h3 className="font-medium">Your courses will appear here</h3>
              <p className="mt-1 text-sm text-muted-foreground">Choose this semester's courses in Studies. No course records are fabricated.</p>
              <Link to="/studies" className="mt-3 inline-block text-sm font-medium">Open Studies</Link>
            </div>
          )}
        </section>
      )}

      {section === "Learning" && (
        <section className="mt-6 rounded-2xl bg-card p-4 ring-1 ring-border">
          <p className="kicker">RESOURCE LIBRARY</p>
          <h2 className="mt-1 font-display text-2xl">Learning materials</h2>
          <label className="mt-4 flex h-11 items-center gap-2 rounded-xl border border-border px-3">
            <span aria-hidden="true">⌕</span>
            <input className="min-w-0 flex-1 bg-transparent text-sm outline-none" value={resourceQuery} onChange={(event) => setResourceQuery(event.target.value)} placeholder="Search notes, slides, readings and recordings" aria-label="Search learning materials" />
          </label>
          <div className="mt-4 rounded-xl bg-secondary p-4" role="status">
            <h3 className="font-medium">{resourceQuery.trim() ? "No connected resources found" : "Your learning library is waiting"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{resourceQuery.trim() ? "A search cannot return academic records until the authorized resource service is connected." : "Approved notes, PDFs, slides, readings, lecture recordings and podcasts will be organised by course here."}</p>
          </div>
        </section>
      )}

      {section === "Tasks" && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <section className="rounded-2xl bg-card p-4 ring-1 ring-border"><p className="kicker">TO DO</p><h2 className="mt-1 text-xl font-medium">Assignments and deadlines</h2><p className="mt-2 text-sm text-muted-foreground">Assignments and due dates require a connected course and assessment service.</p></section>
          <section className="rounded-2xl bg-card p-4 ring-1 ring-border"><p className="kicker">YOUR RESULTS</p><h2 className="mt-1 text-xl font-medium">Progress and feedback</h2><p className="mt-2 text-sm text-muted-foreground">Grades and feedback remain private and appear only from authorized academic records. No scores are fabricated.</p></section>
        </div>
      )}

      {section === "Discussions" && (
        <section className="mt-6 rounded-2xl bg-card p-5 ring-1 ring-border">
          <p className="kicker">COURSE CONVERSATIONS</p><h2 className="mt-1 font-display text-2xl">Questions and collaboration</h2>
          <p className="mt-2 text-sm text-muted-foreground">Board keeps academic context close to your courses; it does not create a separate messaging system.</p>
          <Link to="/messages" className="mt-4 inline-block text-sm font-medium">Open Chat</Link>
        </section>
      )}

      {section === "Discover" && (
        <section className="mt-6 rounded-2xl bg-card p-5 ring-1 ring-border">
          <p className="kicker">ACADEMIC OPPORTUNITIES</p><h2 className="mt-1 font-display text-2xl">Explore beyond your courses</h2>
          <p className="mt-2 text-sm text-muted-foreground">Verified scholarships, research, seminars, workshops and external learning resources will be labelled by source when available. The discovery provider is not connected yet.</p>
        </section>
      )}

    </main>
  );
}