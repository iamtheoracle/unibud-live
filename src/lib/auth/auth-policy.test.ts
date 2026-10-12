import assert from "node:assert/strict";
import test from "node:test";
import { hasProductionAuthConfiguration, shouldRejectDisabledAuth } from "./auth-policy.ts";

test("allows the shared development identity only in local no-database development", () => {
  assert.equal(shouldRejectDisabledAuth({
    databaseConfigured: false,
    isProduction: false,
    gateIdentityEnabled: false,
  }), false);
});

test("rejects disabled auth whenever a real database is configured", () => {
  assert.equal(shouldRejectDisabledAuth({
    databaseConfigured: true,
    isProduction: false,
    gateIdentityEnabled: false,
  }), true);
});

test("rejects disabled auth in production even when the database is missing", () => {
  assert.equal(shouldRejectDisabledAuth({
    databaseConfigured: false,
    isProduction: true,
    gateIdentityEnabled: false,
  }), true);
});

test("allows the explicitly enabled verified gate identity", () => {
  assert.equal(shouldRejectDisabledAuth({
    databaseConfigured: true,
    isProduction: true,
    gateIdentityEnabled: true,
  }), false);
});


test("allows preview auth defaults only outside production", () => {
  assert.equal(hasProductionAuthConfiguration({ isProduction: false }), true);
});

test("requires per-app issuer, client credentials, stable URL, and secret in production", () => {
  assert.equal(hasProductionAuthConfiguration({ isProduction: true }), false);
  assert.equal(hasProductionAuthConfiguration({
    isProduction: true,
    issuer: "https://auth.example.test",
    clientId: "app-client",
    clientSecret: "client-secret",
    baseURL: "https://unibud.example.test",
    secret: "stable-better-auth-secret",
  }), true);
});

test("rejects incomplete or whitespace-only production auth configuration", () => {
  assert.equal(hasProductionAuthConfiguration({
    isProduction: true,
    issuer: "https://auth.example.test",
    clientId: "app-client",
    clientSecret: "client-secret",
    baseURL: "https://unibud.example.test",
    secret: "  ",
  }), false);
});
