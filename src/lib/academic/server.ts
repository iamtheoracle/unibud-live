import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { courseByCode } from "@/lib/unibud/academic";
import { canTeach, type CampusRole } from "@/lib/unibud/roles";
import { notify } from "@/lib/unibud/server";
import { attendanceEventAction, canTransitionBoardSessionStatus, summarizeAttendanceEvents, type BoardSessionStatus } from "./session-policy";

async function loadEnrollments(userId: string) {
  const sql = await getSql();
  const rows = await sql`select * from enrollments where user_id = ${userId} order by course_code`;
  return rows.map((r) => ({
    id: String(r.id),
    code: String(r.course_code),
    title: String(r.course_title),
    semester: String(r.semester),
    sessionLabel: String(r.session_label),
    catalog: courseByCode(String(r.course_code)),
  }));
}

export const listEnrollments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => loadEnrollments(context.userId));

export const enrollCourse = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { code: string; semester?: string; sessionLabel?: string }) => input)
  .handler(async ({ context, data }) => {
    const cat = courseByCode(data.code);
    if (!cat) throw new Error("That course is not in the catalogue.");
    const sql = await getSql();
    const semester = data.semester || "Semester 1";
    const existing = await sql`select id from enrollments where user_id = ${context.userId} and course_code = ${cat.code} and semester = ${semester}`;
    if (!existing[0]) {
      await sql`insert into enrollments (id, user_id, course_code, course_title, semester, session_label)
        values (${crypto.randomUUID()}, ${context.userId}, ${cat.code}, ${cat.title}, ${semester}, ${data.sessionLabel || "2026/2027 Academic Session"})`;
    }
    return loadEnrollments(context.userId);
  });

export const dropCourse = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((code: string) => code)
  .handler(async ({ context, data: code }) => {
    const sql = await getSql();
    await sql`delete from enrollments where user_id = ${context.userId} and course_code = ${code}`;
    return loadEnrollments(context.userId);
  });

async function requireCourseAccess(userId: string, courseCode: string, mode: "read" | "teach") {
  const course = courseByCode(courseCode);
  if (!course) throw new Error("Course not found.");

  const sql = await getSql();
  const profiles = await sql<{ campus_role: string; handle: string }>`
    select campus_role, handle from student_profiles where user_id = ${userId} limit 1`;
  const profile = profiles[0];
  if (!profile) throw new Error("Complete your campus profile first.");

  const role = profile.campus_role as CampusRole;
  const isAssignedLecturer = canTeach(role) && profile.handle === course.lecturerHandle;
  if (mode === "teach" && !isAssignedLecturer) {
    throw new Error("Only the assigned lecturer can publish course announcements.");
  }
  if (mode === "read" && !isAssignedLecturer) {
    const enrollments = await sql`
      select id from enrollments
      where user_id = ${userId} and course_code = ${course.code}
      limit 1`;
    if (!enrollments[0]) throw new Error("Enroll in this course to access its announcements.");
  }
}

/** Open a course chat for currently enrolled students and its assigned lecturer. */
export const openCourseConversation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((courseCode: string) => courseCode)
  .handler(async ({ context, data: rawCode }) => {
    const course = courseByCode(rawCode);
    if (!course) throw new Error("Course not found.");
    await requireCourseAccess(context.userId, course.code, "read");
    const sql = await getSql();
    const lecturer = await sql`select user_id from student_profiles where handle = ${course.lecturerHandle} limit 1`;
    const inserted = await sql`insert into social_conversations (id, kind, title, created_by, course_code)
      values (${crypto.randomUUID()}, 'class', ${course.code + " · " + course.title}, ${context.userId}, ${course.code})
      on conflict (course_code) where kind = 'class' and course_code is not null do nothing returning id`;
    let id = inserted[0] ? String(inserted[0].id) : "";
    if (!id) {
      const found = await sql`select id from social_conversations where kind = 'class' and course_code = ${course.code} limit 1`;
      if (!found[0]) throw new Error("Could not open class chat. Please retry.");
      id = String(found[0].id);
    }
    await sql`insert into social_conversation_members (conversation_id, user_id)
      select ${id}, e.user_id from enrollments e where e.course_code = ${course.code}
      on conflict (conversation_id, user_id) do nothing`;
    if (lecturer[0]) {
      await sql`insert into social_conversation_members (conversation_id, user_id)
        values (${id}, ${String(lecturer[0].user_id)}) on conflict do nothing`;
    }
    return { id };
  });

export const postAnnouncement = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { courseCode: string; title: string; body: string }) => input)
  .handler(async ({ context, data }) => {
    await requireCourseAccess(context.userId, data.courseCode, "teach");
    const title = data.title.trim();
    const body = data.body.trim();
    if (!title || !body) throw new Error("Announcement title and body are required.");
    const sql = await getSql();
    await sql`insert into board_announcements (id, course_code, author_id, title, body)
      values (${crypto.randomUUID()}, ${data.courseCode}, ${context.userId}, ${title}, ${body})`;
    const recipients = await sql`
      select user_id from enrollments
      where course_code = ${data.courseCode} and user_id <> ${context.userId}`;
    const href = `/board/${data.courseCode.toLowerCase().replace(/\s+/g, "")}`;
    const deliveries = await Promise.allSettled(
      recipients.map((recipient) => notify(String(recipient.user_id), "class", title, body, href)),
    );
    if (deliveries.some((delivery) => delivery.status === "rejected")) {
      console.error("[academic] Some announcement notifications could not be saved.");
    }
    const rows = await sql`select * from board_announcements where course_code = ${data.courseCode} order by created_at desc`;
    return rows.map((r) => ({
      id: String(r.id),
      title: String(r.title),
      body: String(r.body),
      createdAt: String(r.created_at),
    }));
  });

export const listAnnouncements = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((courseCode: string) => courseCode)
  .handler(async ({ context, data: courseCode }) => {
    await requireCourseAccess(context.userId, courseCode, "read");
    const sql = await getSql();
    const rows = await sql`select * from board_announcements where course_code = ${courseCode} order by created_at desc`;
    return rows.map((r) => ({
      id: String(r.id),
      title: String(r.title),
      body: String(r.body),
      createdAt: String(r.created_at),
    }));
  });

async function requireSessionAccess(userId: string, sessionId: string, mode: "read" | "attend" | "manage") {
  const sql = await getSql();
  const sessions = await sql<{ id: string; course_code: string; lecturer_id: string; status: string }>`
    select id, course_code, lecturer_id, status from board_sessions where id = ${sessionId} limit 1`;
  const session = sessions[0];
  if (!session) throw new Error("Class session not found.");

  const isLecturer = session.lecturer_id === userId;
  if (mode === "attend" && session.status !== "live") {
    throw new Error("Attendance can only be recorded while the class session is live.");
  }
  if (mode === "manage" && !isLecturer) {
    throw new Error("Only the assigned session lecturer can view attendance.");
  }
  if (isLecturer) return { sql, session, isLecturer };

  const enrollments = await sql`
    select id from enrollments
    where user_id = ${userId} and course_code = ${session.course_code}
    limit 1`;
  if (!enrollments[0]) throw new Error("Enroll in this course to access the class session.");
  return { sql, session, isLecturer };
}

export const createBoardSession = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { courseCode: string; title: string; topic?: string; startsAt?: string; durationMinutes?: number }) => input)
  .handler(async ({ context, data }) => {
    await requireCourseAccess(context.userId, data.courseCode, "teach");
    const title = data.title.trim();
    const topic = (data.topic ?? "").trim();
    const durationMinutes = data.durationMinutes ?? 60;
    if (!title || title.length > 160) throw new Error("Session title must be between 1 and 160 characters.");
    if (topic.length > 500) throw new Error("Session topic must be 500 characters or fewer.");
    if (!Number.isInteger(durationMinutes) || durationMinutes < 5 || durationMinutes > 720) {
      throw new Error("Session duration must be between 5 and 720 minutes.");
    }
    let startsAt: Date | null = null;
    if (data.startsAt) {
      startsAt = new Date(data.startsAt);
      if (Number.isNaN(startsAt.getTime())) throw new Error("A valid session start time is required.");
    }
    const sql = await getSql();
    const id = crypto.randomUUID();
    const rows = await sql`
      insert into board_sessions (id, course_code, lecturer_id, title, topic, starts_at, duration_minutes)
      values (${id}, ${data.courseCode}, ${context.userId}, ${title}, ${topic}, ${startsAt?.toISOString() ?? null}, ${durationMinutes})
      returning id, course_code, title, topic, status, starts_at, duration_minutes, created_at`;
    const row = rows[0];
    return {
      id: String(row.id), courseCode: String(row.course_code), title: String(row.title),
      topic: String(row.topic), status: String(row.status),
      startsAt: row.starts_at ? String(row.starts_at) : null,
      durationMinutes: Number(row.duration_minutes), createdAt: String(row.created_at),
    };
  });

/** Change a class session's lifecycle only through authorized lecturer actions. */
export const setBoardSessionStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { sessionId: string; status: "live" | "ended" | "cancelled" }) => input)
  .handler(async ({ context, data }) => {
    const { sql, session } = await requireSessionAccess(context.userId, data.sessionId, "manage");
    if (!canTransitionBoardSessionStatus(session.status as BoardSessionStatus, data.status)) {
      throw new Error(`Invalid class session transition: ${session.status} → ${data.status}.`);
    }
    const rows = await sql`
      update board_sessions
      set status = ${data.status}, updated_at = now()
      where id = ${data.sessionId} and lecturer_id = ${context.userId} and status = ${session.status}
      returning id, status, updated_at`;
    if (!rows[0]) throw new Error("The class session changed before this update. Refresh and try again.");
    return { id: String(rows[0].id), status: String(rows[0].status), updatedAt: String(rows[0].updated_at) };
  });

export const listBoardSessions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((courseCode: string) => courseCode)
  .handler(async ({ context, data: courseCode }) => {
    const course = courseByCode(courseCode);
    if (!course) throw new Error("Course not found.");
    const sql = await getSql();
    const profiles = await sql<{ user_id: string; campus_role: string; handle: string }>`
      select user_id, campus_role, handle from student_profiles where user_id = ${context.userId} limit 1`;
    const profile = profiles[0];
    if (!profile) throw new Error("Complete your campus profile first.");
    const isAssignedLecturer = canTeach(profile.campus_role as CampusRole) && profile.handle === course.lecturerHandle;
    if (!isAssignedLecturer) {
      const enrollment = await sql`
        select id from enrollments where user_id = ${context.userId} and course_code = ${course.code} limit 1`;
      if (!enrollment[0]) throw new Error("Enroll in this course to access its class sessions.");
    }
    const rows = await sql`
      select id, course_code, title, topic, status, starts_at, duration_minutes, created_at
      from board_sessions where course_code = ${course.code}
      order by starts_at asc nulls last, created_at desc`;
    return rows.map((r) => ({
      id: String(r.id), courseCode: String(r.course_code), title: String(r.title),
      topic: String(r.topic), status: String(r.status),
      startsAt: r.starts_at ? String(r.starts_at) : null,
      durationMinutes: Number(r.duration_minutes), createdAt: String(r.created_at),
    }));
  });

export const logAttendance = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { sessionId: string; kind: "join" | "leave"; eventKey?: string }) => input)
  .handler(async ({ context, data }) => {
    if (data.kind !== "join" && data.kind !== "leave") {
      throw new Error("Attendance event must be a join or leave.");
    }
    const { sql } = await requireSessionAccess(context.userId, data.sessionId, "attend");
    const eventKey = data.eventKey?.trim();
    if (eventKey && (eventKey.length > 120 || !/^[a-zA-Z0-9:_-]+$/.test(eventKey))) {
      throw new Error("Invalid attendance event key.");
    }
    const latestRows = await sql`
      select kind from attendance_events
      where session_id = ${data.sessionId} and user_id = ${context.userId}
      order by created_at desc limit 1`;
    const latestValue = latestRows[0] ? String(latestRows[0].kind) : null;
    const latestKind = latestValue === "join" || latestValue === "leave" ? latestValue : null;
    const action = attendanceEventAction(latestKind, data.kind);
    if (action === "duplicate") return { ok: true, duplicate: true };
    if (action === "invalid") {
      throw new Error("Join the live class before recording that you left.");
    }
    if (eventKey) {
      const scopedEventKey = `${data.kind}:${eventKey}`;
      await sql`
        insert into attendance_events (id, session_id, user_id, kind, event_key)
        values (${crypto.randomUUID()}, ${data.sessionId}, ${context.userId}, ${data.kind}, ${scopedEventKey})
        on conflict (session_id, user_id, event_key) where event_key is not null do nothing`;
    } else {
      await sql`insert into attendance_events (id, session_id, user_id, kind)
        values (${crypto.randomUUID()}, ${data.sessionId}, ${context.userId}, ${data.kind})`;
    }
    return { ok: true };
  });

export const listAttendance = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((sessionId: string) => sessionId)
  .handler(async ({ context, data: sessionId }) => {
    const { sql } = await requireSessionAccess(context.userId, sessionId, "manage");
    const rows = await sql`select user_id, kind, created_at from attendance_events where session_id = ${sessionId} order by created_at`;
    return summarizeAttendanceEvents(rows.map((row) => ({
      userId: String(row.user_id),
      kind: String(row.kind),
      createdAt: String(row.created_at),
    })));
  });

/** Return only the signed-in user's attendance events for a session. */
export const getMySessionAttendance = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((sessionId: string) => sessionId)
  .handler(async ({ context, data: sessionId }) => {
    const { sql } = await requireSessionAccess(context.userId, sessionId, "read");
    const rows = await sql`
      select kind, created_at from attendance_events
      where session_id = ${sessionId} and user_id = ${context.userId}
      order by created_at`;
    return rows.map((row) => ({ kind: String(row.kind), createdAt: String(row.created_at) }));
  });

export const askInClass = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { sessionId: string; body: string }) => input)
  .handler(async ({ context, data }) => {
    const body = data.body.trim();
    if (!body || body.length > 4000) throw new Error("Question must be between 1 and 4000 characters.");
    const { sql } = await requireSessionAccess(context.userId, data.sessionId, "read");
    await sql`insert into class_questions (id, session_id, user_id, body)
      values (${crypto.randomUUID()}, ${data.sessionId}, ${context.userId}, ${body})`;
    const rows = await sql`select id, body, created_at from class_questions where session_id = ${data.sessionId} order by created_at`;
    return rows.map((r) => ({ id: String(r.id), body: String(r.body), createdAt: String(r.created_at) }));
  });

export const listClassQuestions = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((sessionId: string) => sessionId)
  .handler(async ({ context, data: sessionId }) => {
    const { sql } = await requireSessionAccess(context.userId, sessionId, "read");
    const rows = await sql`select id, body, created_at from class_questions where session_id = ${sessionId} order by created_at`;
    return rows.map((r) => ({ id: String(r.id), body: String(r.body), createdAt: String(r.created_at) }));
  });
