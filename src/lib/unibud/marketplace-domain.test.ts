import test from "node:test";
import assert from "node:assert/strict";
import {
  formatMinorAmount,
  isSafeImageUrl,
  validateListingDraft,
  validateMarketplaceCreateInput,
  type ListingDraft,
} from "./marketplace-domain.ts";

const validDraft = (overrides: Partial<ListingDraft> = {}): ListingDraft => ({
  kind: "service",
  title: "Laptop repair service",
  description: "Affordable laptop troubleshooting and repair for students on campus.",
  category: "services",
  currency: "NGN",
  priceMinor: 500000,
  priceBasis: "per_hour",
  location: "Campus / remote",
  imageUrls: [],
  verificationState: "unverified",
  status: "draft",
  ...overrides,
});

test("accepts a valid unpublished service draft", () => {
  assert.deepEqual(validateListingDraft(validDraft()), []);
});

test("rejects unsafe image URLs and published listings without photos", () => {
  const issues = validateListingDraft(validDraft({
    imageUrls: ["javascript:alert(1)"],
    status: "published",
  }));
  assert.ok(issues.some((issue) => issue.field === "imageUrls"));
});

test("requires condition and known defects for a used item marked for repair", () => {
  const issues = validateListingDraft(validDraft({
    kind: "preowned",
    condition: "parts_repair",
    knownDefects: " ",
  }));
  assert.ok(issues.some((issue) => issue.field === "knownDefects"));
});

test("requires availability and occupancy for accommodation", () => {
  const issues = validateListingDraft(validDraft({
    kind: "student_accommodation",
    occupancy: 0,
  }));
  assert.ok(issues.some((issue) => issue.field === "availableFrom"));
  assert.ok(issues.some((issue) => issue.field === "occupancy"));
});

test("formats only safe supported minor-unit prices", () => {
  assert.equal(formatMinorAmount(-1, "NGN"), "Price unavailable");
  assert.match(formatMinorAmount(125050, "NGN"), /1,250\.50/);
});

test("only HTTPS image URLs are accepted", () => {
  assert.equal(isSafeImageUrl("https://cdn.example.test/listing.jpg"), true);
  assert.equal(isSafeImageUrl("http://cdn.example.test/listing.jpg"), false);
  assert.equal(isSafeImageUrl("javascript:alert(1)"), false);
});


const validCreateInput = (overrides: Record<string, unknown> = {}) => ({
  kind: "service",
  category: "services",
  title: "Laptop repair service",
  description: "Affordable laptop troubleshooting and repair for students on campus.",
  priceKobo: 500000,
  priceNote: "starting",
  location: "Campus / remote",
  ...overrides,
});

test("server input guard accepts valid current-schema listing data", () => {
  assert.equal(validateMarketplaceCreateInput(validCreateInput()), null);
});

test("server input guard rejects unsupported kinds and categories", () => {
  assert.match(
    validateMarketplaceCreateInput(validCreateInput({ kind: "student_accommodation" })) ?? "",
    /supported listing type/i,
  );
  assert.match(
    validateMarketplaceCreateInput(validCreateInput({ category: "made_up" })) ?? "",
    /supported listing category/i,
  );
});

test("server input guard keeps stay listings in the accommodation category", () => {
  assert.match(
    validateMarketplaceCreateInput(validCreateInput({ kind: "stay", category: "food" })) ?? "",
    /accommodation/i,
  );
});

test("server input guard rejects malformed price notes and unsafe prices", () => {
  assert.match(
    validateMarketplaceCreateInput(validCreateInput({ priceNote: "x".repeat(81) })) ?? "",
    /price description/i,
  );
  assert.match(
    validateMarketplaceCreateInput(validCreateInput({ priceKobo: Number.MAX_SAFE_INTEGER + 1 })) ?? "",
    /positive whole number/i,
  );
});
