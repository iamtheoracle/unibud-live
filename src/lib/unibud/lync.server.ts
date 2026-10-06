import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  applyQualifyingShare,
  emptyLync,
  lyncMessage,
  type LyncEvent,
  type LyncState,
} from "./lync";
import { notify } from "./server";

function rowToState(row: Record<string, unknown> | undefined): LyncState {
  if (!row) return emptyLync();
  return {
    count: Number(row.count ?? 0),
    status: (row.status as LyncState["status"]) || "inactive",
    lastShareDay: (row.last_share_day as string) || null,
    lastShareAt: row.last_share_at ? String(row.last_share_at) : null,
    startedAt: row.started_at ? String(row.started_at) : null,
    daysToNextBonus: row.days_to_next_bonus == null ? null : Number(row.days_to_next_bonus),
    lastBonusAtCount: row.last_bonus_at_count == null ? null : Number(row.last_bonus_at_count),
  };
}

export const getMyLync = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const sql = await getSql();
      const rows = await sql`select * from user_lync where user_id = ${context.userId} limit 1`;
      return rowToState(rows[0] as Record<string, unknown> | undefined);
    } catch {
      return emptyLync();
    }
  });

/** Record a qualifying share for the signed-in user. Not called on app open. */
export const recordLyncShare = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    let prev = emptyLync();
    try {
      const rows = await sql`select * from user_lync where user_id = ${context.userId} limit 1`;
      prev = rowToState(rows[0] as Record<string, unknown> | undefined);
    } catch {
      return { state: emptyLync(), events: [] as LyncEvent[], message: "Lync storage is not ready." };
    }

    const { state, events } = applyQualifyingShare(prev);
    await sql`
      insert into user_lync (
        user_id, count, status, last_share_day, last_share_at, started_at,
        days_to_next_bonus, last_bonus_at_count, updated_at
      ) values (
        ${context.userId}, ${state.count}, ${state.status}, ${state.lastShareDay},
        ${state.lastShareAt}, ${state.startedAt}, ${state.daysToNextBonus},
        ${state.lastBonusAtCount}, now()
      )
      on conflict (user_id) do update set
        count = excluded.count,
        status = excluded.status,
        last_share_day = excluded.last_share_day,
        last_share_at = excluded.last_share_at,
        started_at = excluded.started_at,
        days_to_next_bonus = excluded.days_to_next_bonus,
        last_bonus_at_count = excluded.last_bonus_at_count,
        updated_at = now()
    `;

    for (const ev of events) {
      const id = `ly_${crypto.randomUUID().slice(0, 12)}`;
      await sql`
        insert into lync_events (id, user_id, type, count, milestone)
        values (${id}, ${context.userId}, ${ev.type}, ${ev.count}, ${ev.milestone ?? null})
      `;
      if (ev.type === "lync_activated" || ev.type === "lync_broken" || ev.type === "lync_bonus_unlocked") {
        try {
          await notify(context.userId, "social", lyncMessage(state, ev), lyncMessage(state, ev), "/profile");
        } catch {
          /* non-fatal */
        }
      }
    }

    return { state, events, message: lyncMessage(state, events[0]) };
  });
