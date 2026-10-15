import test from "node:test";
import assert from "node:assert/strict";
import { isPgliteAllowed } from "./database-url.ts";

test("embedded storage requires an explicit local-development opt-in", () => {
  assert.equal(
    isPgliteAllowed({ serverless: false, production: false, enabled: false }),
    false,
  );
  assert.equal(
    isPgliteAllowed({ serverless: false, production: false, enabled: true }),
    true,
  );
});

test("embedded storage is denied in production even on a non-serverless host", () => {
  assert.equal(
    isPgliteAllowed({ serverless: false, production: true, enabled: true }),
    false,
  );
});

test("embedded storage is denied in serverless runtimes", () => {
  assert.equal(
    isPgliteAllowed({ serverless: true, production: false, enabled: true }),
    false,
  );
  assert.equal(
    isPgliteAllowed({ serverless: true, production: true, enabled: true }),
    false,
  );
});

test("a configured PostgreSQL URL always disables embedded storage", () => {
  assert.equal(
    isPgliteAllowed({
      databaseUrl: "postgres://example",
      serverless: false,
      production: false,
      enabled: true,
    }),
    false,
  );
});

test("blank database URLs do not count as configured PostgreSQL", () => {
  assert.equal(
    isPgliteAllowed({
      databaseUrl: "   ",
      serverless: false,
      production: false,
      enabled: true,
    }),
    true,
  );
});
