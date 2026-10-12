import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { boardIdFor, courseByCode } from "@/lib/unibud/academic";
import { listBoardSessions, listEnrollments } from "@/lib/academic/server";
import { useCampusStore } from "@/lib/unibud/campus-store";
import { canTeach } from "@/lib/unibud/roles";
import { relativeTime } from "@/lib/unibud/format";
import { useAuthReady } from "@/components/unibud/sign-in-gate";

export const Route = createFileRoute("/_app/board")({ component: Board });

function Board() {
  const { user } = useAuthReady();
  const role = useCampusStore((s) => s.role ?? "student");
  const enrolled = useQuery({
    queryKey: ["enroll"],
    queryFn: () => listEnrollments(),
    enabled: Boolean(user),
  });
  const mine = enrolled.data ?? [];
  const courseCodes = mine.map((course) => course.code);
  const sessionsQuery = useQuery({
    queryKey: ["board-sessions", courseCodes],
    queryFn: async () => {
      const results = await Promise.all(courseCodes.map((code) => listBoardSessions({ data: code })));
      return results.flat().sort((a, b) => {
        const aTime = a.startsAt ? Date.parse(a.startsAt) : Date.parse(a.createdAt);
        const bTime = b.startsAt ? Date.parse(b.startsAt) : Date.parse(b.createdAt);
        return aTime - bTime;
      });
    },
    enabled: courseCodes.length > 0,
  });
  const sessions = sessionsQuery.data ?? [];

  return (
    <main className="safe-bottom px-5 pt-6">
      <p className="kicker">Board</p>
      <h1 className="mt-1 font-display text-4xl">Your classrooms</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Course rooms, persisted class sessions and attendance. Not Square. Not Chat.
      </p>

      {enrolled.isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading your enrolled courses…</p>
      ) : enrolled.isError ? (
        <p className="mt-6 text-sm text-destructive">Your courses could not be loaded. Try again shortly.</p>
      ) : mine.length ? (
        <ul className="mt-6 grid gap-3">
          {mine.map((course) => (
            <li key={course.id}>
              <Link
                to="/board/$id"
                params={{ id: boardIdFor(course.code) }}
                className="block rounded-2xl bg-card p-4 ring-1 ring-border"
              >
                <p className="text-[11px] font-semibold tracking-wide uppercase text-bud">{course.code}</p>
                <p className="mt-1 font-medium">{course.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{course.catalog?.lecturer} · {course.catalog?.programme}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          No enrolled courses yet. Choose courses in <Link to="/studies" className="font-medium">Studies</Link>.
        </p>
      )}

      {canTeach(role) ? (
        <Link to="/tutor" className="mt-5 inline-block text-sm font-medium">
          Open Tutor Mode
        </Link>
      ) : null}

      <section className="mt-8">
        <h2 className="font-display text-2xl">Class sessions</h2>
        {sessionsQuery.isLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading saved class sessions…</p>
        ) : sessionsQuery.isError ? (
          <p className="mt-3 text-sm text-destructive">Class sessions could not be loaded. Try again shortly.</p>
        ) : sessions.length ? (
          <ul className="mt-3 space-y-3">
            {sessions.map((session) => {
              const course = courseByCode(session.courseCode);
              return (
                <li key={session.id} className="rounded-2xl bg-card p-4 ring-1 ring-border">
                  <p className="text-[11px] font-semibold tracking-wide text-bud uppercase">{session.status}</p>
                  <h3 className="mt-1 font-medium">{session.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {session.courseCode} · {course?.lecturer ?? "Assigned lecturer"}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {session.topic || course?.title || "Class session"} · {relativeTime(session.startsAt ?? session.createdAt)} · {session.durationMinutes} min
                  </p>
                  {session.status === "available" ? (
                    <p className="mt-3 text-xs text-muted-foreground">Recording marked available. Playback is not yet connected to a verified recording source.</p>
                  ) : null}
                  <Link
                    to="/board/$id"
                    params={{ id: boardIdFor(session.courseCode) }}
                    className="mt-3 inline-flex h-9 items-center rounded-full bg-secondary px-3 text-sm"
                  >
                    Open Board
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No saved sessions for your enrolled courses yet. Assigned lecturers can create and start a session inside a course Board.
          </p>
        )}
      </section>
    </main>
  );
}
