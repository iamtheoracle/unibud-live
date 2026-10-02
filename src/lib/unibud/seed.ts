import { getSql } from "@/lib/db";
import { UNIVERSITIES } from "./catalog";

/** Seed only reference data (universities). User-generated content is never seeded. */
export async function ensureCatalogSeed() {
  const sql = await getSql();
  const rows = await sql<{ id: number }>`select id from catalog_seeded where id = 1`;
  if (rows.length > 0) return;

  for (const u of UNIVERSITIES) {
    await sql`insert into universities (id, name, short_name, city)
      values (${u.id}, ${u.name}, ${u.shortName}, ${u.city})
      on conflict (id) do nothing`;
  }
  await sql`insert into catalog_seeded (id, done) values (1, true) on conflict (id) do nothing`;
}
