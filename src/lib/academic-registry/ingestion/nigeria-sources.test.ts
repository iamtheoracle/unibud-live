import test from "node:test";
import assert from "node:assert/strict";
import { enabledNigeriaAcademicSources, NIGERIA_ACADEMIC_SOURCES } from "./nigeria-sources.ts";

test("Nigeria source inventory covers the main regulator categories without pretending to scrape them", () => {
  assert.ok(NIGERIA_ACADEMIC_SOURCES.some((source) => source.id.includes("nuc")));
  assert.ok(NIGERIA_ACADEMIC_SOURCES.some((source) => source.id.includes("nbte")));
  assert.ok(NIGERIA_ACADEMIC_SOURCES.some((source) => source.id.includes("ncce")));
  assert.ok(NIGERIA_ACADEMIC_SOURCES.some((source) => source.id.includes("fme")));
  assert.ok(NIGERIA_ACADEMIC_SOURCES.every((source) => source.countryCode === "NG"));
});

test("unreviewed source adapters remain disabled", () => {
  assert.equal(enabledNigeriaAcademicSources().length, 0);
  assert.ok(NIGERIA_ACADEMIC_SOURCES.every((source) => source.enabled === false));
  assert.ok(NIGERIA_ACADEMIC_SOURCES.every((source) => source.automationPermission === "not_reviewed"));
  assert.ok(NIGERIA_ACADEMIC_SOURCES.every((source) => source.adapterStatus === "not_implemented"));
  assert.ok(NIGERIA_ACADEMIC_SOURCES.every((source) => canImportAcademicSource(source) === false));
  assert.ok(NIGERIA_ACADEMIC_SOURCES.every((source) => (source.coverageDomains?.length ?? 0) > 0));
  assert.ok(NIGERIA_ACADEMIC_SOURCES.every((source) => (source.reviewCaveats?.length ?? 0) > 0));
});

test("each source has an official HTTP(S) URL and a documented review caveat", () => {
  for (const source of NIGERIA_ACADEMIC_SOURCES) {
    assert.ok(["http:", "https:"].includes(new URL(source.officialUrl).protocol));
    assert.ok(source.licenceOrTerms && source.licenceOrTerms.length > 10);
  }
});

test("includes the official NBTE public register but keeps it disabled pending reuse review", () => {
  const source = NIGERIA_ACADEMIC_SOURCES.find((item) => item.id === "ng-nbte-digital-public-register");
  assert.ok(source);
  assert.equal(source.officialUrl, "https://digitalnbte.nbte.gov.ng/Public");
  assert.equal(source.enabled, false);
  assert.ok(source.reviewCaveats?.some((note) => note.includes("reuse licence")));
});

test("preserves NCCE local categories and warns about source data quality", () => {
  const source = NIGERIA_ACADEMIC_SOURCES.find((item) => item.id === "ng-ncce-accredited-colleges");
  assert.ok(source);
  assert.ok(source.reviewCaveats?.some((note) => note.includes("NCE-awarding")));
  assert.ok(source.reviewCaveats?.some((note) => note.includes("placeholder")));
});

test("a source can run only after terms approval, adapter configuration, and explicit enablement", () => {
  const source = NIGERIA_ACADEMIC_SOURCES[0];
  assert.equal(canImportAcademicSource({
    ...source,
    automationPermission: "approved",
    adapterStatus: "verified",
    enabled: true,
  }), true);
  assert.equal(canImportAcademicSource({
    ...source,
    automationPermission: "not_reviewed",
    adapterStatus: "configured",
    enabled: true,
  }), false);
  assert.equal(canImportAcademicSource({
    ...source,
    automationPermission: "approved",
    adapterStatus: "configured",
    enabled: true,
  }), false);
});
