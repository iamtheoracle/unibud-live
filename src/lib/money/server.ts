import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapRequest, mapTx } from "@/lib/unibud/map";
import { notify } from "@/lib/unibud/server";
import type { RequestStatus } from "@/lib/unibud/types";

const DEMO_NOTE =
  "Demo ledger only. No real money moved. No bank, card, or NELFUND rail is connected.";

const MIN_DEMO_AMOUNT_KOBO = 10_000;
const MAX_DEMO_AMOUNT_KOBO = 50_000_000;

function assertDemoAmount(kobo: number, label: string) {
  if (!Number.isSafeInteger(kobo) || kobo < MIN_DEMO_AMOUNT_KOBO || kobo > MAX_DEMO_AMOUNT_KOBO) {
    throw new Error(`${label} must be between ₦100 and ₦500,000 in demo mode.`);
  }
}

async function ensureWallet(userId: string) {
  const sql = await getSql();
  await sql`insert into wallets (user_id, balance_kobo) values (${userId}, 0) on conflict (user_id) do nothing`;
  const rows = await sql<{ balance_kobo: number }>`select balance_kobo from wallets where user_id = ${userId}`;
  return rows[0]?.balance_kobo ?? 0;
}

async function loadWallet(userId: string) {
  const balanceKobo = await ensureWallet(userId);
  const sql = await getSql();
  const tx = (
    await sql`select * from wallet_tx where user_id = ${userId} order by created_at desc limit 40`
  ).map(mapTx);
  const requests = (
    await sql`select * from payment_requests where user_id = ${userId} order by created_at desc limit 40`
  ).map(mapRequest);
  const funding = await sql<{
    program: string;
    status: string;
    notes: string;
    updated_at: string;
  }>`select program, status, notes, updated_at from funding_notes where user_id = ${userId} limit 1`;
  return {
    balanceKobo,
    demo: true as const,
    disclaimer: DEMO_NOTE,
    tx,
    requests,
    funding: funding[0] ?? {
      program: "nelfund",
      status: "exploring",
      notes: "",
      updated_at: new Date().toISOString(),
    },
  };
}

export const getWallet = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => loadWallet(context.userId));

export const addDemoFunds = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((kobo: number) => kobo)
  .handler(async ({ context, data: kobo }) => {
    assertDemoAmount(kobo, "Demo top-up");
    const sql = await getSql();
    await ensureWallet(context.userId);
    await sql`update wallets set balance_kobo = balance_kobo + ${kobo}, updated_at = now() where user_id = ${context.userId}`;
    await sql`insert into wallet_tx (id, user_id, type, amount_kobo, status, counterparty, note)
      values (${crypto.randomUUID()}, ${context.userId}, ${"demo_topup"}, ${kobo}, ${"demo_recorded"}, ${"UNIBUD demo"}, ${"Demo funds added. Not a real deposit."})`;
    await notify(
      context.userId,
      "money",
      "Demo funds added",
      "This is a simulated ledger entry. No real money moved.",
      "/money",
    );
    return loadWallet(context.userId);
  });

export const sendDemoMoney = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { handle: string; kobo: number; note: string }) => input)
  .handler(async ({ context, data }) => {
    assertDemoAmount(data.kobo, "Demo send");
    const sql = await getSql();
    await ensureWallet(context.userId);
    if (typeof data.handle !== "string" || data.handle.length > 80 || typeof data.note !== "string" || data.note.length > 500) {
      throw new Error("Demo send details are invalid.");
    }
    const handle = data.handle.replace(/^@/, "").trim().toLowerCase();
    if (!handle) throw new Error("Choose someone to pay");
    const debited = await sql<{ balance_kobo: number }>`update wallets set balance_kobo = balance_kobo - ${data.kobo}, updated_at = now()
      where user_id = ${context.userId} and balance_kobo >= ${data.kobo} returning balance_kobo`;
    if (!debited[0]) throw new Error("Not enough demo balance");
    await sql`insert into wallet_tx (id, user_id, type, amount_kobo, status, counterparty, note)
      values (${crypto.randomUUID()}, ${context.userId}, ${"send"}, ${data.kobo}, ${"demo_recorded"}, ${handle}, ${data.note.trim() || "Demo send. No real money moved."})`;
    await notify(
      context.userId,
      "money",
      "Demo send recorded",
      `Simulated send to @${handle}. ${DEMO_NOTE}`,
      "/money",
    );
    return loadWallet(context.userId);
  });

export const withdrawDemo = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { kobo: number; destination: string }) => input)
  .handler(async ({ context, data }) => {
    assertDemoAmount(data.kobo, "Demo withdrawal");
    const sql = await getSql();
    await ensureWallet(context.userId);
    if (typeof data.destination !== "string" || !data.destination.trim() || data.destination.length > 255) {
      throw new Error("Demo destination is invalid.");
    }
    const debited = await sql<{ balance_kobo: number }>`update wallets set balance_kobo = balance_kobo - ${data.kobo}, updated_at = now()
      where user_id = ${context.userId} and balance_kobo >= ${data.kobo} returning balance_kobo`;
    if (!debited[0]) throw new Error("Not enough demo balance");
    await sql`insert into wallet_tx (id, user_id, type, amount_kobo, status, counterparty, note)
      values (${crypto.randomUUID()}, ${context.userId}, ${"withdraw"}, ${data.kobo}, ${"demo_recorded"}, ${data.destination.trim()}, ${"Demo withdrawal recorded. No payout rail is connected."})`;
    await notify(
      context.userId,
      "money",
      "Demo withdrawal recorded",
      "No bank payout happened. This is a simulated ledger entry.",
      "/money",
    );
    return loadWallet(context.userId);
  });

export const payListingDemo = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { listingId: string; kobo: number; sellerHandle: string; title: string }) => input)
  .handler(async ({ context, data }) => {
    assertDemoAmount(data.kobo, "Demo marketplace payment");
    if (!data.listingId.trim() || data.listingId.length > 200 || !data.sellerHandle.trim() || data.sellerHandle.length > 80 || data.title.length > 255) {
      throw new Error("Marketplace payment details are invalid.");
    }
    const sql = await getSql();
    await ensureWallet(context.userId);
    const debited = await sql<{ balance_kobo: number }>`update wallets set balance_kobo = balance_kobo - ${data.kobo}, updated_at = now()
      where user_id = ${context.userId} and balance_kobo >= ${data.kobo} returning balance_kobo`;
    if (!debited[0]) throw new Error("Not enough demo balance");
    await sql`insert into wallet_tx (id, user_id, type, amount_kobo, status, counterparty, note)
      values (${crypto.randomUUID()}, ${context.userId}, ${"market_pay"}, ${data.kobo}, ${"demo_recorded"}, ${data.sellerHandle}, ${`Demo payment for “${data.title}”. No real money moved.`})`;
    await notify(
      context.userId,
      "market",
      "Demo marketplace payment",
      `Recorded against “${data.title}”. Not a real transfer.`,
      "/money",
    );
    return loadWallet(context.userId);
  });

export const createMoneyRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: { handles: string[]; kobo: number; note: string; split?: boolean }) => input,
  )
  .handler(async ({ context, data }) => {
    assertDemoAmount(data.kobo, "Demo request");
    if (!Array.isArray(data.handles) || data.handles.length === 0 || data.handles.length > 100) {
      throw new Error("Choose between 1 and 100 people.");
    }
    if (typeof data.note !== "string" || data.note.length > 500) {
      throw new Error("Demo request note must be 500 characters or fewer.");
    }
    const handles = [...new Set(data.handles
      .filter((h): h is string => typeof h === "string")
      .map((h) => h.replace(/^@/, "").trim().toLowerCase())
      .filter((h) => h.length > 0 && h.length <= 80))];
    if (handles.length === 0) throw new Error("Choose at least one valid person");
    const per = data.split ? Math.round(data.kobo / handles.length) : data.kobo;
    if (per < MIN_DEMO_AMOUNT_KOBO) throw new Error("Each split request must be at least ₦100.");
    const sql = await getSql();
    for (const handle of handles) {
      await sql`insert into payment_requests (id, user_id, direction, peer_handle, amount_kobo, note, status)
        values (${crypto.randomUUID()}, ${context.userId}, ${"out"}, ${handle}, ${per}, ${data.note.trim() || "Demo request"}, ${"pending"})`;
    }
    await notify(
      context.userId,
      "request",
      data.split ? "Split request created" : "Money request created",
      "These are demo requests. Nobody was charged.",
      "/money",
    );
    return loadWallet(context.userId);
  });

export const updateMoneyRequest = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string; status: RequestStatus }) => input)
  .handler(async ({ context, data }) => {
    const allowedStatuses = new Set<RequestStatus>(["pending", "accepted", "declined", "paid", "expired", "cancelled"]);
    if (!allowedStatuses.has(data.status)) throw new Error("Invalid request status.");
    const sql = await getSql();
    if (data.status === "paid") {
      // Only the first pending/accepted -> paid transition may record demo credit.
      // The guarded UPDATE and RETURNING prevent repeated requests from crediting twice.
      const changed = await sql<{ amount_kobo: number; peer_handle: string }>`
        update payment_requests set status = ${data.status}
        where id = ${data.id} and user_id = ${context.userId} and status in ('pending', 'accepted')
        returning amount_kobo, peer_handle`;
      const row = changed[0];
      if (row) {
        await ensureWallet(context.userId);
        await sql`update wallets set balance_kobo = balance_kobo + ${row.amount_kobo}, updated_at = now() where user_id = ${context.userId}`;
        await sql`insert into wallet_tx (id, user_id, type, amount_kobo, status, counterparty, note)
          values (${crypto.randomUUID()}, ${context.userId}, ${"receive"}, ${row.amount_kobo}, ${"demo_recorded"}, ${row.peer_handle}, ${"Demo request marked paid. No real money received."})`;
      }
    } else {
      await sql`update payment_requests set status = ${data.status}
        where id = ${data.id} and user_id = ${context.userId} and status = ${"pending"}`;
    }
    return loadWallet(context.userId);
  });

export const saveFundingNotes = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { program: string; status: string; notes: string }) => input)
  .handler(async ({ context, data }) => {
    if (
      typeof data.program !== "string" || !data.program.trim() || data.program.length > 80 ||
      typeof data.status !== "string" || !data.status.trim() || data.status.length > 80 ||
      typeof data.notes !== "string" || data.notes.length > 4_000
    ) {
      throw new Error("Funding notes must have a program and status under 80 characters and notes under 4,000 characters.");
    }
    const sql = await getSql();
    await sql`insert into funding_notes (user_id, program, status, notes, updated_at)
      values (${context.userId}, ${data.program.trim()}, ${data.status.trim()}, ${data.notes}, now())
      on conflict (user_id) do update set program = ${data.program.trim()}, status = ${data.status.trim()}, notes = ${data.notes}, updated_at = now()`;
    return loadWallet(context.userId);
  });
