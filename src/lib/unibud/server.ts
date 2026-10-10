import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { ensureCatalogSeed } from "./seed";
import {
  mapCommunity,
  mapDiscovery,
  mapListing,
  mapNote,
  mapPerson,
  mapPost,
  mapPostReply,
  mapProfile,
  mapUni,
} from "./map";
import type { ListingCategory, ListingKind, StudentProfile } from "./types";
import { canTeach, type CampusRole } from "./roles";
import { COMMUNITIES, DISCOVERY, LISTINGS, PEOPLE, POSTS, UNIVERSITIES } from "./catalog";

/** Production fallback when DB is unavailable — never surface fixture people/posts/communities. */
function emptyCatalog() {
  return {
    universities: UNIVERSITIES,
    people: [] as typeof PEOPLE,
    listings: [] as typeof LISTINGS,
    communities: [] as typeof COMMUNITIES,
    posts: [] as typeof POSTS,
    discovery: [] as typeof DISCOVERY,
    replies: [] as ReturnType<typeof mapPostReply>[],
  };
}

export const getCampusCatalog = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      await ensureCatalogSeed();
      const sql = await getSql();
      const universities = (await sql`select * from universities order by name`).map(mapUni);
      const people = (await sql`select * from directory_people order by name`).map(mapPerson);
      const listings = (
        await sql`select * from listings order by created_at desc`
      ).map(mapListing);
      const communities = (await sql`select * from communities order by members desc`).map(
        mapCommunity,
      );
      const posts = (
        await sql`select * from posts order by created_at desc limit 80`
      ).map(mapPost);
      const discovery = (await sql`select * from discovery_items`).map(mapDiscovery);
      let replies: ReturnType<typeof mapPostReply>[] = [];
      try {
        replies = (await sql`select * from post_replies order by created_at asc limit 800`).map((r) =>
          mapPostReply(r as Parameters<typeof mapPostReply>[0]),
        );
      } catch {
        replies = [];
      }
      return { universities, people, listings, communities, posts, discovery, replies };
    } catch (error) {
      console.error("[catalog] database unavailable, returning empty catalog (no fixtures)", error);
      return emptyCatalog();
    }
  },
);

export const getListing = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    await ensureCatalogSeed();
    const sql = await getSql();
    const rows = await sql`select * from listings where id = ${id} limit 1`;
    const listing = rows[0] ? mapListing(rows[0]) : null;
    if (!listing) return null;
    const sellerRows = await sql`select * from directory_people where handle = ${listing.sellerHandle} limit 1`;
    const seller = sellerRows[0] ? mapPerson(sellerRows[0]) : null;
    const related = (
      await sql`select * from listings where category = ${listing.category} and id <> ${id} order by saved_count desc limit 4`
    ).map(mapListing);
    return { listing, seller, related };
  });

export const searchCampus = createServerFn({ method: "GET" })
  .validator((q: string) => q.trim().toLowerCase())
  .handler(async ({ data: q }) => {
    await ensureCatalogSeed();
    if (!q) return { listings: [], people: [], communities: [] };
    const sql = await getSql();
    const like = `%${q}%`;
    const listings = (
      await sql`select * from listings where lower(title) like ${like} or lower(description) like ${like} or lower(category) like ${like} limit 12`
    ).map(mapListing);
    const people = (
      await sql`select * from directory_people where lower(name) like ${like} or lower(handle) like ${like} limit 8`
    ).map(mapPerson);
    const communities = (
      await sql`select * from communities where lower(name) like ${like} or lower(description) like ${like} limit 8`
    ).map(mapCommunity);
    return { listings, people, communities };
  });

export const listByCategory = createServerFn({ method: "GET" })
  .validator((category: ListingCategory | "all") => category)
  .handler(async ({ data: category }) => {
    await ensureCatalogSeed();
    const sql = await getSql();
    const rows =
      category === "all"
        ? await sql`select * from listings order by created_at desc`
        : await sql`select * from listings where category = ${category} order by created_at desc`;
    return rows.map(mapListing);
  });

async function handleFromName(name: string, userId: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 12) || "student";
  return `${base}${userId.slice(-4)}`;
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureCatalogSeed();
    const sql = await getSql();
    const rows = await sql`select * from student_profiles where user_id = ${context.userId} limit 1`;
    if (rows[0]) return mapProfile(rows[0]);
    return null;
  });

export const upsertMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: Partial<StudentProfile> & { displayName?: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql`select * from student_profiles where user_id = ${context.userId} limit 1`;
    const existingProfile = existing[0] ? mapProfile(existing[0]) : null;
    const displayName =
      (data.displayName ?? existingProfile?.displayName ?? "Student").trim() || "Student";
    const handle =
      data.handle?.replace(/[^a-z0-9_]/gi, "").toLowerCase() ||
      existingProfile?.handle ||
      (await handleFromName(displayName, context.userId));
    const universityId = data.universityId || existingProfile?.universityId || "unilag";
    const program = data.program ?? existingProfile?.program ?? "";
    const year = data.year ?? existingProfile?.year ?? "";
    const bio = data.bio ?? existingProfile?.bio ?? "";
    // Privilege roles cannot be self-assigned. Lecturer/moderator require platform grant.
    const requested = data.campusRole;
    const existingRole = existingProfile?.campusRole ?? "student";
    let campusRole = existingRole;
    if (requested === "student" || requested === "governor") {
      campusRole = requested;
    } else if (requested === "lecturer" || requested === "moderator") {
      campusRole = existingRole === "lecturer" || existingRole === "moderator" ? existingRole : "student";
    }
    const onboardingDone = data.onboardingDone ?? existingProfile?.onboardingDone ?? false;
    if (existing[0]) {
      await sql`update student_profiles set display_name = ${displayName}, handle = ${handle},
        university_id = ${universityId}, program = ${program}, year = ${year}, bio = ${bio},
        campus_role = ${campusRole}, onboarding_done = ${onboardingDone}
        where user_id = ${context.userId}`;
    } else {
      await sql`insert into student_profiles (user_id, display_name, handle, university_id, program, year, bio, campus_role, onboarding_done)
        values (${context.userId}, ${displayName}, ${handle}, ${universityId}, ${program}, ${year}, ${bio}, ${campusRole}, ${onboardingDone})`;
    }
    const rows = await sql`select * from student_profiles where user_id = ${context.userId} limit 1`;
    return mapProfile(rows[0]);
  });

export const toggleSave = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { kind: string; itemId: string; title: string; href: string }) => input)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql`select item_id from saves where user_id = ${context.userId} and kind = ${data.kind} and item_id = ${data.itemId}`;
    if (existing[0]) {
      await sql`delete from saves where user_id = ${context.userId} and kind = ${data.kind} and item_id = ${data.itemId}`;
      return { saved: false };
    }
    await sql`insert into saves (user_id, kind, itemId, title, href) values (${context.userId}, ${data.kind}, ${data.itemId}, ${data.title}, ${data.href})`;
    return { saved: true };
  });
