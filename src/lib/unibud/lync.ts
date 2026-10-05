/**
 * Lync — UNIBUD consistent-sharing activity (product language for a sharing streak).
 * Reality First: never invent Lync counts, bonuses, or notifications without real state.
 */

export type LyncStatus = "inactive" | "active" | "broken";

export type LyncState = {
  /** Consecutive days with at least one qualifying share. */
  count: number;
  status: LyncStatus;
  /** ISO date (YYYY-MM-DD) of the last qualifying share day, local calendar. */
  lastShareDay: string | null;
  /** ISO datetime of the last qualifying share. */
  lastShareAt: string | null;
  /** ISO datetime when the current Lync became active. */
  startedAt: string | null;
  /** Days until the next configured bonus milestone (null if none). */
  daysToNextBonus: number | null;
  /** Last bonus milestone reached (count), if any. */
  lastBonusAtCount: number | null;
};

export type LyncConfig = {
  /** Shares on consecutive calendar days required before status becomes active. */
  activationShares: number;
  /** Bonus milestones measured in Lync count (days). Empty = no bonuses yet. */
  bonusMilestones: number[];
};

/** Configurable activation — do not hard-code product magic numbers elsewhere. */
export const DEFAULT_LYNC_CONFIG: LyncConfig = {
  activationShares: 2,
  bonusMilestones: [],
};

export function emptyLync(): LyncState {
  return {
    count: 0,
    status: "inactive",
    lastShareDay: null,
    lastShareAt: null,
    startedAt: null,
    daysToNextBonus: null,
    lastBonusAtCount: null,
  };
}

/** Calendar day key in local time. */
export function localDayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function dayOffset(dayKey: string, days: number): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return localDayKey(dt);
}

function nextBonusDistance(count: number, milestones: number[]): number | null {
  const next = milestones.filter((n) => n > count).sort((a, b) => a - b)[0];
  return next == null ? null : next - count;
}

export type LyncEvent = {
  type:
    | "lync_started"
    | "lync_activated"
    | "lync_grew"
    | "lync_broken"
    | "lync_bonus_unlocked"
    | "lync_milestone_near";
  at: string;
  count: number;
  milestone?: number;
};

/**
 * Apply one qualifying share. Opening the app does not call this.
 * Same-day shares do not increase the count twice.
 */
export function applyQualifyingShare(
  prev: LyncState,
  at: Date = new Date(),
  config: LyncConfig = DEFAULT_LYNC_CONFIG,
): { state: LyncState; events: LyncEvent[] } {
  const day = localDayKey(at);
  const atIso = at.toISOString();
  const events: LyncEvent[] = [];

  if (prev.lastShareDay === day) {
    return { state: { ...prev, lastShareAt: atIso }, events };
  }

  let count = prev.count;
  let status = prev.status;
  let startedAt = prev.startedAt;
  let lastBonusAtCount = prev.lastBonusAtCount;

  if (prev.lastShareDay == null) {
    count = 1;
    status = config.activationShares <= 1 ? "active" : "inactive";
    if (status === "active") {
      startedAt = atIso;
      events.push({ type: "lync_activated", at: atIso, count });
    } else {
      events.push({ type: "lync_started", at: atIso, count });
    }
  } else if (prev.lastShareDay === dayOffset(day, -1)) {
    count = prev.count + 1;
    if (status !== "active" && count >= config.activationShares) {
      status = "active";
      startedAt = startedAt ?? atIso;
      events.push({ type: "lync_activated", at: atIso, count });
    } else if (status === "active") {
      events.push({ type: "lync_grew", at: atIso, count });
    } else {
      events.push({ type: "lync_started", at: atIso, count });
    }
  } else {
    if (prev.status === "active" && prev.count > 0) {
      events.push({ type: "lync_broken", at: atIso, count: prev.count });
    }
    count = 1;
    status = config.activationShares <= 1 ? "active" : "inactive";
    startedAt = status === "active" ? atIso : null;
    events.push({ type: status === "active" ? "lync_activated" : "lync_started", at: atIso, count });
  }

  for (const m of config.bonusMilestones) {
    if (count === m && lastBonusAtCount !== m) {
      lastBonusAtCount = m;
      events.push({ type: "lync_bonus_unlocked", at: atIso, count, milestone: m });
    }
  }

  const state: LyncState = {
    count,
    status,
    lastShareDay: day,
    lastShareAt: atIso,
    startedAt,
    daysToNextBonus: nextBonusDistance(count, config.bonusMilestones),
    lastBonusAtCount,
  };
  return { state, events };
}

/** Natural product copy — never "7-day streak". */
export function lyncMessage(state: LyncState, event?: LyncEvent): string {
  if (event?.type === "lync_broken") return "You broke your Lync.";
  if (event?.type === "lync_activated") return "Lync started.";
  if (event?.type === "lync_bonus_unlocked") return "Your Lync bonus is ready.";
  if (event?.type === "lync_grew" && state.status === "active") {
    if (state.daysToNextBonus === 2) return "Your Lync is 2 days from its first bonus.";
    if (state.daysToNextBonus === 1) return "Your Lync bonus is almost here.";
    return "Your Lync is growing.";
  }
  if (state.status === "active") return "Your Lync is alive.";
  if (state.count > 0) return "Keep your Lync going.";
  return "Share something real to start a Lync.";
}
