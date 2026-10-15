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
});

test("each source has an official HTTP(S) URL and a documented review caveat", () => {
  for (const source of NIGERIA_ACADEMIC_SOURCES) {
    assert.ok(["http:", "https:"].includes(new URL(source.officialUrl).protocol));
    assert.ok(source.licenceOrTerms && source.licenceOrTerms.length > 10);
  }
});
