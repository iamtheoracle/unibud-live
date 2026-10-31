import test from "node:test";
import assert from "node:assert/strict";
import { normalizeInstitutionCandidate, slugifyInstitutionName } from "./normalize.ts";

const candidate = {
  sourceId: "nuc-approved-directory",
  externalId: "reg-104",
  countryCode: "ng",
  institutionTypeCode: "polytechnic",
  institutionTypeLabel: "Federal Polytechnic",
  name: "Ékiti Technical College",
  ownershipType: "public" as const,
  officialWebsite: "https://example.edu.ng",
  operationalStatus: "active" as const,
  sourceUrl: "https://regulator.example.gov.ng/institutions",
  sourceRetrievedAt: "2026-10-15T00:00:00.000Z",
  sourceContentHash: "sha256:abc123",
};

test("normalizes names and creates a source-scoped identity key", () => {
  const result = normalizeInstitutionCandidate(candidate);
  assert.equal(result.countryCode, "NG");
  assert.equal(result.normalizedName, "ekiti technical college");
  assert.equal(result.slug, "ekiti-technical-college");
  assert.equal(result.identityKey, "NG:nuc-approved-directory:reg-104");
  assert.equal(result.verificationStatus, "pending_review");
  assert.deepEqual(result.warnings, ["Established year is unknown."]);
});

test("never upgrades imported candidates to verified automatically", () => {
  const result = normalizeInstitutionCandidate({
    ...candidate,
    sourceContentHash: undefined,
    ownershipType: "unknown",
    operationalStatus: "unknown",
    officialWebsite: null,
  });
  assert.equal(result.verificationStatus, "pending_review");
  assert.equal(result.warnings.length, 5);
});

test("rejects missing external IDs, institution names, and invalid source URLs", () => {
  assert.throws(() => normalizeInstitutionCandidate({ ...candidate, externalId: " " }), /external ID/);
  assert.throws(() => normalizeInstitutionCandidate({ ...candidate, name: " " }), /Institution name/);
  assert.throws(() => normalizeInstitutionCandidate({ ...candidate, sourceUrl: "javascript:alert(1)" }), /HTTP or HTTPS/);
});

test("slugification handles punctuation and diacritics", () => {
  assert.equal(slugifyInstitutionName("École Polytechnique (North)"), "ecole-polytechnique-north");
});

test("the same external identifier from different sources remains distinct", () => {
  const first = normalizeInstitutionCandidate(candidate);
  const second = normalizeInstitutionCandidate({ ...candidate, sourceId: "nbte-approved-directory" });
  assert.notEqual(first.identityKey, second.identityKey);
});

test("preserves non-Latin institution names in stable slugs", () => {
  assert.equal(slugifyInstitutionName("جامعة الملك سعود"), "جامعة-الملك-سعود");
  assert.equal(slugifyInstitutionName("東京工業大学"), "東京工業大学");
});

test("rejects missing source identity, invalid retrieval time, and credential-bearing URLs", () => {
  assert.throws(() => normalizeInstitutionCandidate({ ...candidate, sourceId: " " }), /registered source ID/);
  assert.throws(() => normalizeInstitutionCandidate({ ...candidate, sourceRetrievedAt: "not-a-date" }), /retrieval timestamp/);
  assert.throws(() => normalizeInstitutionCandidate({ ...candidate, sourceUrl: "https://user:secret@example.gov/" }), /embedded credentials/);
});
