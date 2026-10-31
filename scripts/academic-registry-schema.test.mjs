import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { PGlite } from "@electric-sql/pglite";

const root = process.cwd();
const migrations = [
  "0030_global_academic_registry.sql",
  "0031_academic_registry_evidence_hardening.sql",
  "0032_academic_registry_ingestion_integrity.sql",
];

test("academic registry migrations enforce evidence, source identity, and idempotency", async () => {
  const db = new PGlite({ dataDir: "memory://" });
  try {
    for (const name of migrations) {
      await db.exec(await readFile(join(root, "migrations", name), "utf8"));
    }

    // Compile every public registry read against the isolated schema. This catches
    // drift between the SQL handlers and the durable migration contract.
    const serverSource = await readFile(join(root, "src/lib/academic-registry/server.ts"), "utf8");
    const searchCall = serverSource.indexOf("return sql.query<AcademicInstitutionSearchResult>(");
    assert.notEqual(searchCall, -1, "institution search SQL must remain discoverable for schema verification");
    const searchTickStart = serverSource.indexOf("`", searchCall);
    const searchTickEnd = serverSource.indexOf("`,", searchTickStart);
    assert.ok(searchTickStart >= 0 && searchTickEnd > searchTickStart, "institution search SQL must be a template string");
    const searchSql = serverSource
      .slice(searchTickStart + 1, searchTickEnd)
      .replace('${clauses.join(" and ")}', "i.country_code = $1")
      .replaceAll("$${limitParam}", "$2")
      .replaceAll("$${offsetParam}", "$3");
    try {
      await db.query(searchSql, ["NG", 20, 0]);
    } catch (error) {
      throw new Error("Institution search SQL failed: " + String(error));
    }

    const detailQueries = [];
    let detailCursor = 0;
    while (true) {
      const callStart = serverSource.indexOf("sql.query<SerializableAcademicRecord>(", detailCursor);
      if (callStart === -1) break;
      const tickStart = serverSource.indexOf("`", callStart);
      const tickEnd = serverSource.indexOf("`,", tickStart);
      if (tickStart === -1 || tickEnd === -1) break;
      const parameterReference = serverSource.indexOf("[data.institutionId]", tickEnd);
      if (parameterReference === -1 || parameterReference - tickEnd > 80) {
        detailCursor = tickEnd + 2;
        continue;
      }
      detailQueries.push(serverSource.slice(tickStart + 1, tickEnd));
      detailCursor = parameterReference + 1;
    }
    assert.ok(detailQueries.length >= 8, "all institution detail SQL reads must be covered");
    for (const [index, query] of detailQueries.entries()) {
      try {
        await db.query(query, ["inst-1"]);
      } catch (error) {
        throw new Error("Institution detail SQL query " + (index + 1) + " failed: " + String(error));
      }
    }

    await db.query("insert into academic_countries (code, name) values ('NG', 'Nigeria')");
    await db.query(
      "insert into academic_sources (id, country_code, publisher_name, source_type, source_url) values ($1, 'NG', $2, 'regulator', $3)",
      ["source-nuc", "National Universities Commission", "https://www.nuc.edu.ng/"],
    );
    await db.query(
      "insert into academic_sources (id, country_code, publisher_name, source_type, source_url) values ($1, 'NG', $2, 'regulator', $3)",
      ["source-nbte", "National Board for Technical Education", "https://www.nbte.gov.ng/"],
    );

    await assert.rejects(
      db.query(
        "insert into academic_institution_types (id, country_code, code, label, verification_status) values ('type-unreviewed', 'NG', 'university', 'University', 'verified')",
      ),
      /academic_institution_types_evidence_gate/,
    );

    await db.query(
      "insert into academic_institution_types (id, country_code, code, label, verification_status, source_id, verified_at) values ('type-university', 'NG', 'university', 'University', 'verified', 'source-nuc', now())",
    );

    await assert.rejects(
      db.query(
        "insert into academic_institutions (id, country_code, institution_type_id, name, slug, verification_status) values ('bad-inst', 'NG', 'type-university', 'Unproven Institution', 'unproven-institution', 'verified')",
      ),
      /academic_institutions_evidence_gate/,
    );

    await db.query(
      "insert into academic_institutions (id, country_code, institution_type_id, name, slug, verification_status, source_id, verified_at) values ('inst-1', 'NG', 'type-university', 'Verified Institution', 'verified-institution', 'verified', 'source-nuc', now())",
    );

    await db.query(
      "insert into academic_institutions (id, country_code, institution_type_id, name, slug, verification_status, source_id) values ('inst-pending', 'NG', 'type-university', 'Pending Institution', 'pending-institution', 'pending_review', 'source-nuc')",
    );

    // Exercise the exact reviewer decision SQL used by the server function.
    const reviewMarker = serverSource.indexOf("with updated as (");
    const reviewTickStart = serverSource.lastIndexOf("`", reviewMarker);
    const reviewTickEnd = serverSource.indexOf("`,", reviewMarker);
    assert.ok(reviewMarker >= 0 && reviewTickStart >= 0 && reviewTickEnd > reviewTickStart);
    const reviewSql = serverSource.slice(reviewTickStart + 1, reviewTickEnd);
    const reviewed = await db.query(reviewSql, [
      "inst-pending",
      "verify",
      "review-audit-1",
      "Official registry evidence checked by reviewer.",
      "reviewer-1",
    ]);
    assert.equal(reviewed.rows[0]?.verificationStatus, "verified");
    const auditRows = await db.query(
      "select id, review_status, reviewer_id from academic_source_assertions where entity_id = 'inst-pending'",
    );
    assert.equal(auditRows.rows.length, 1);
    assert.equal(auditRows.rows[0].review_status, "accepted");
    assert.equal(auditRows.rows[0].reviewer_id, "reviewer-1");
    const secondReview = await db.query(reviewSql, [
      "inst-pending",
      "reject",
      "review-audit-2",
      "Attempted second review should not change a reviewed record.",
      "reviewer-2",
    ]);
    assert.equal(secondReview.rows.length, 0);

    await assert.rejects(
      db.query(
        "insert into academic_campuses (id, institution_id, name, verification_status) values ('campus-bad', 'inst-1', 'Unverified Campus', 'verified')",
      ),
      /academic_campuses_evidence_gate/,
    );

    await db.query(
      "insert into academic_campuses (id, institution_id, name, verification_status, source_id, verified_at) values ('campus-1', 'inst-1', 'Main Campus', 'verified', 'source-nuc', now())",
    );

    await assert.rejects(
      db.query(
        "insert into academic_institution_aliases (id, institution_id, alias, verification_status) values ('alias-bad', 'inst-1', 'Old Name', 'verified')",
      ),
      /academic_institution_aliases_evidence_gate/,
    );

    await db.query(
      "insert into academic_institution_aliases (id, institution_id, alias, verification_status, source_id, verified_at) values ('alias-1', 'inst-1', 'Verified Former Name', 'verified', 'source-nuc', now())",
    );

    await db.query(
      "insert into academic_import_runs (id, source_id, importer_name, idempotency_key) values ('run-1', 'source-nuc', 'nuc-adapter', 'snapshot-2026-10-31')",
    );
    await assert.rejects(
      db.query(
        "insert into academic_import_runs (id, source_id, importer_name, idempotency_key) values ('run-duplicate', 'source-nuc', 'nuc-adapter', 'snapshot-2026-10-31')",
      ),
      /academic_import_runs_source_idempotency_uq/,
    );

    await db.query(
      "insert into academic_external_identifiers (id, source_id, country_code, entity_type, entity_id, external_id, source_record_url) values ('ext-1', 'source-nuc', 'NG', 'institution', 'inst-1', 'same-registry-id', 'https://www.nuc.edu.ng/registry/1')",
    );
    await assert.rejects(
      db.query(
        "insert into academic_external_identifiers (id, source_id, country_code, entity_type, entity_id, external_id, source_record_url) values ('ext-duplicate', 'source-nuc', 'NG', 'institution', 'inst-1', 'same-registry-id', 'https://www.nuc.edu.ng/registry/1')",
      ),
      /academic_external_identifiers_source_id_entity_type_externa_key/,
    );
    await db.query(
      "insert into academic_external_identifiers (id, source_id, country_code, entity_type, entity_id, external_id, source_record_url) values ('ext-2', 'source-nbte', 'NG', 'institution', 'inst-1', 'same-registry-id', 'https://www.nbte.gov.ng/registry/1')",
    );

    await assert.rejects(
      db.query(
        "insert into academic_entity_match_reviews (id, country_code, entity_type, left_entity_id, right_entity_id, match_method, review_status) values ('match-bad', 'NG', 'institution', 'inst-1', 'inst-2', 'manual', 'accepted')",
      ),
      /academic_entity_match_reviews_check/,
    );
    await db.query(
      "insert into academic_entity_match_reviews (id, country_code, entity_type, left_entity_id, right_entity_id, match_method, evidence_source_id, reviewer_id, reviewed_at, review_status) values ('match-1', 'NG', 'institution', 'inst-1', 'inst-2', 'manual', 'source-nuc', 'reviewer-1', now(), 'accepted')",
    );

    await assert.rejects(
      db.query(
        "insert into academic_import_record_results (id, import_run_id, source_id, entity_type, external_id, outcome) values ('result-bad', 'run-1', 'source-nuc', 'institution', 'broken-record', 'failed')",
      ),
      /academic_import_record_results_check/,
    );
    await db.query(
      "insert into academic_import_record_results (id, import_run_id, source_id, entity_type, external_id, outcome, error_message) values ('result-1', 'run-1', 'source-nuc', 'institution', 'broken-record', 'failed', 'Source payload did not validate')",
    );
  } finally {
    await db.close();
  }
});
