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
