import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

export type CalendarEventRow = {
  id: string;
  kind: string;
  title: string;
  startsAt: string;
  endsAt: string;
  status: string;
  participants: string[];
  sourceId: string | null;
  sourceType: string | null;
  notes: string;
};

function mapEvent(r: Record<string, unknown>): CalendarEventRow {
  let participants: string[] = [];
  try {
    participants = JSON.parse(String(r.participants || "[]")) as string[];
  } catch {
    participants = [];
  }
  return {
    id: String(r.id),
    kind: String(r.kind),
    title: String(r.title),
    startsAt: String(r.starts_at),
    endsAt: String(r.ends_at),
    status: String(r.status),
    participants,
    sourceId: r.source_id ? String(r.source_id) : null,
    sourceType: r.source_type ? String(r.source_type) : null,
    notes: String(r.notes || ""),
  };
}

async function hasConflict(userId: string, startsAt: string, endsAt: string, excludeId?: string) {
  const sql = await getSql();
  const rows = excludeId
    ? await sql`
        select id from calendar_events
        where user_id = ${userId}
          and status = ${"confirmed"}
          and id <> ${excludeId}
          and starts_at < ${endsAt}
          and ends_at > ${startsAt}
        limit 1
      `
    : await sql`
        select id from calendar_events
        where user_id = ${userId}
          and status = ${"confirmed"}
          and starts_at < ${endsAt}
          and ends_at > ${startsAt}
        limit 1
      `;
  return Boolean(rows[0]);
}

export const listMyCalendar = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const sql = await getSql();
      const rows = await sql`
        select * from calendar_events
        where user_id = ${context.userId}
        order by starts_at asc
      `;
      return rows.map((r) => mapEvent(r as Record<string, unknown>));
    } catch {
      return [] as CalendarEventRow[];
    }
  });

export const bookTutoring = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      tutorHandle: string;
      subject: string;
      startsAt: string;
      endsAt: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const starts = new Date(data.startsAt);
    const ends = new Date(data.endsAt);
    if (Number.isNaN(starts.getTime()) || Number.isNaN(ends.getTime()) || ends <= starts) {
      throw new Error("Choose a valid start and end time.");
    }
    if (await hasConflict(context.userId, starts.toISOString(), ends.toISOString())) {
      throw new Error("That time conflicts with something already on your calendar.");
    }
    const sql = await getSql();
    const bookingId = `tb_${crypto.randomUUID().slice(0, 10)}`;
    const eventId = `ce_${crypto.randomUUID().slice(0, 10)}`;
    const title = `Tutoring · ${data.subject.trim() || "Session"}`;
    const participants = JSON.stringify([data.tutorHandle.trim()]);

    await sql`
      insert into calendar_events (
        id, user_id, kind, title, starts_at, ends_at, status, participants, source_id, source_type, notes
      ) values (
        ${eventId}, ${context.userId}, ${"tutoring"}, ${title},
        ${starts.toISOString()}, ${ends.toISOString()}, ${"confirmed"},
        ${participants}, ${bookingId}, ${"tutoring_booking"}, ${""}
      )
    `;
    await sql`
      insert into tutoring_bookings (
        id, student_id, tutor_handle, subject, starts_at, ends_at, status, calendar_event_id
      ) values (
        ${bookingId}, ${context.userId}, ${data.tutorHandle.trim()}, ${data.subject.trim()},
        ${starts.toISOString()}, ${ends.toISOString()}, ${"confirmed"}, ${eventId}
      )
    `;
    const rows = await sql`select * from calendar_events where id = ${eventId} limit 1`;
    return mapEvent(rows[0] as Record<string, unknown>);
  });

export const commitService = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      title: string;
      startsAt: string;
      endsAt: string;
      serviceId?: string;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const starts = new Date(data.startsAt);
    const ends = new Date(data.endsAt);
    if (Number.isNaN(starts.getTime()) || Number.isNaN(ends.getTime()) || ends <= starts) {
      throw new Error("Choose a valid start and end time.");
    }
    if (await hasConflict(context.userId, starts.toISOString(), ends.toISOString())) {
      throw new Error("That time conflicts with something already on your calendar.");
    }
    const sql = await getSql();
    const commitmentId = `sc_${crypto.randomUUID().slice(0, 10)}`;
    const eventId = `ce_${crypto.randomUUID().slice(0, 10)}`;
    const title = data.title.trim() || "Community service";

    await sql`
      insert into calendar_events (
        id, user_id, kind, title, starts_at, ends_at, status, participants, source_id, source_type, notes
      ) values (
        ${eventId}, ${context.userId}, ${"service"}, ${title},
        ${starts.toISOString()}, ${ends.toISOString()}, ${"confirmed"},
        ${"[]"}, ${commitmentId}, ${"service_commitment"}, ${""}
      )
    `;
    await sql`
      insert into service_commitments (
        id, user_id, service_id, title, starts_at, ends_at, status, calendar_event_id
      ) values (
        ${commitmentId}, ${context.userId}, ${data.serviceId ?? null}, ${title},
        ${starts.toISOString()}, ${ends.toISOString()}, ${"confirmed"}, ${eventId}
      )
    `;
    const rows = await sql`select * from calendar_events where id = ${eventId} limit 1`;
    return mapEvent(rows[0] as Record<string, unknown>);
  });

export const cancelCalendarEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((eventId: string) => eventId)
  .handler(async ({ context, data: eventId }) => {
    const sql = await getSql();
    const rows = await sql`
      select * from calendar_events where id = ${eventId} and user_id = ${context.userId} limit 1
    `;
    if (!rows[0]) throw new Error("Event not found.");
    await sql`
      update calendar_events set status = ${"cancelled"}, updated_at = now()
      where id = ${eventId} and user_id = ${context.userId}
    `;
    const sourceType = String(rows[0].source_type || "");
    const sourceId = rows[0].source_id ? String(rows[0].source_id) : null;
    if (sourceType === "tutoring_booking" && sourceId) {
      await sql`update tutoring_bookings set status = ${"cancelled"} where id = ${sourceId}`;
    }
    if (sourceType === "service_commitment" && sourceId) {
      await sql`update service_commitments set status = ${"cancelled"} where id = ${sourceId}`;
    }
    return { ok: true as const };
  });

export const rescheduleCalendarEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { eventId: string; startsAt: string; endsAt: string }) => input)
  .handler(async ({ context, data }) => {
    const starts = new Date(data.startsAt);
    const ends = new Date(data.endsAt);
    if (Number.isNaN(starts.getTime()) || Number.isNaN(ends.getTime()) || ends <= starts) {
      throw new Error("Choose a valid start and end time.");
    }
    if (await hasConflict(context.userId, starts.toISOString(), ends.toISOString(), data.eventId)) {
      throw new Error("That time conflicts with something already on your calendar.");
    }
    const sql = await getSql();
    const rows = await sql`
      select * from calendar_events where id = ${data.eventId} and user_id = ${context.userId} limit 1
    `;
    if (!rows[0]) throw new Error("Event not found.");
    if (String(rows[0].status) === "cancelled") throw new Error("Cancelled events cannot be rescheduled.");
    await sql`
      update calendar_events
      set starts_at = ${starts.toISOString()}, ends_at = ${ends.toISOString()}, updated_at = now()
      where id = ${data.eventId} and user_id = ${context.userId}
    `;
    const sourceType = String(rows[0].source_type || "");
    const sourceId = rows[0].source_id ? String(rows[0].source_id) : null;
    if (sourceType === "tutoring_booking" && sourceId) {
      await sql`
        update tutoring_bookings
        set starts_at = ${starts.toISOString()}, ends_at = ${ends.toISOString()}
        where id = ${sourceId}
      `;
    }
    if (sourceType === "service_commitment" && sourceId) {
      await sql`
        update service_commitments
        set starts_at = ${starts.toISOString()}, ends_at = ${ends.toISOString()}
        where id = ${sourceId}
      `;
    }
    const next = await sql`select * from calendar_events where id = ${data.eventId} limit 1`;
    return mapEvent(next[0] as Record<string, unknown>);
  });
