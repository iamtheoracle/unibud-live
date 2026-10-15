import test from "node:test";
import assert from "node:assert/strict";
import {
  getWestAfricaSourceDiscoverySummary,
  WEST_AFRICA_COUNTRY_SCOPE,
} from "./west-africa-scope.ts";

test("West Africa scope includes all 16 countries in the chosen regional definition", () => {
  assert.equal(WEST_AFRICA_COUNTRY_SCOPE.length, 16);
  assert.deepEqual(
    new Set(WEST_AFRICA_COUNTRY_SCOPE.map((country) => country.countryCode)),
    new Set(["BJ", "BF", "CV", "CI", "GM", "GH", "GN", "GW", "LR", "ML", "MR", "NE", "NG", "SN", "SL", "TG"]),
  );
});

test("source-identified countries point to official ministry or regulator domains", () => {
  for (const country of WEST_AFRICA_COUNTRY_SCOPE) {
    if (country.sourceDiscoveryStatus === "source_identified") {
      assert.ok(country.officialSourceUrl, country.countryCode + " needs an official source URL");
      const url = new URL(country.officialSourceUrl);
      assert.ok(["https:", "http:"].includes(url.protocol));
      assert.ok(country.sourcePublisher);
    } else {
      assert.equal(country.officialSourceUrl, undefined);
    }
  }
});

test("country source discovery is not misrepresented as imported data", () => {
  assert.ok(WEST_AFRICA_COUNTRY_SCOPE.every((country) => country.importedRecords === 0));
  const summary = getWestAfricaSourceDiscoverySummary();
  assert.equal(summary.totalCountries, 16);
  assert.equal(summary.sourceIdentifiedCountries, 11);
  assert.equal(summary.discoveryRequiredCountries, 5);
  assert.equal(summary.importedRecords, 0);
});
