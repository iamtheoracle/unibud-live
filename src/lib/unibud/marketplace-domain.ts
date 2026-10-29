export type ListingKind =
  | "goods"
  | "preowned"
  | "grocery"
  | "prepared_food"
  | "service"
  | "property_sale"
  | "property_rental"
  | "student_accommodation"
  | "short_stay";

export type PriceBasis =
  | "per_item"
  | "per_unit"
  | "per_kg"
  | "per_plate"
  | "per_hour"
  | "per_session"
  | "per_night"
  | "per_month"
  | "total"
  | "starting_at"
  | "negotiable"
  | "quote";

export type ItemCondition = "new" | "like_new" | "good" | "fair" | "parts_repair";

export interface ListingDraft {
  kind: ListingKind;
  title: string;
  description: string;
  category: string;
  currency: string;
  priceMinor: number;
  priceBasis: PriceBasis;
  location: string;
  quantity?: number;
  condition?: ItemCondition;
  knownDefects?: string;
  imageUrls: string[];
  availableFrom?: string;
  availableTo?: string;
  bedrooms?: number;
  guestCapacity?: number;
  occupancy?: number;
  depositMinor?: number;
  mandatoryFeesMinor?: number;
  amenities?: string[];
  rules?: string[];
  allergens?: string[];
  sellerRole?: "owner" | "agent" | "host" | "provider";
  verificationState: "unverified" | "pending" | "verified";
  status: "draft" | "published" | "paused" | "removed";
}

export interface ValidationIssue {
  field: keyof ListingDraft;
  message: string;
}

const supportedCurrencies = new Set(["NGN", "USD", "GBP", "EUR", "KES", "GHS", "ZAR"]);
const allowedKinds = new Set<ListingKind>([
  "goods", "preowned", "grocery", "prepared_food", "service",
  "property_sale", "property_rental", "student_accommodation", "short_stay",
]);
const allowedBases = new Set<PriceBasis>([
  "per_item", "per_unit", "per_kg", "per_plate", "per_hour", "per_session",
  "per_night", "per_month", "total", "starting_at", "negotiable", "quote",
]);

const requiresPositivePrice = (basis: PriceBasis) =>
  basis !== "negotiable" && basis !== "quote";

export function validateListingDraft(draft: ListingDraft): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const add = (field: keyof ListingDraft, message: string) => issues.push({ field, message });

  if (!allowedKinds.has(draft.kind)) add("kind", "Choose a supported listing type.");
  if (draft.title.trim().length < 4 || draft.title.trim().length > 100) {
    add("title", "Title must be between 4 and 100 characters.");
  }
  if (draft.description.trim().length < 20 || draft.description.trim().length > 5000) {
    add("description", "Description must be between 20 and 5,000 characters.");
  }
  if (!draft.category.trim() || draft.category.length > 80) add("category", "Choose a valid category.");
  if (!supportedCurrencies.has(draft.currency)) add("currency", "Choose a supported currency.");
  if (!allowedBases.has(draft.priceBasis)) add("priceBasis", "Choose a valid price basis.");
  if (!Number.isSafeInteger(draft.priceMinor) || draft.priceMinor < 0) {
    add("priceMinor", "Price must be a non-negative integer in minor currency units.");
  } else if (requiresPositivePrice(draft.priceBasis) && draft.priceMinor <= 0) {
    add("priceMinor", "Enter a price greater than zero.");
  }
  if (draft.location.trim().length < 2 || draft.location.length > 180) {
    add("location", "Add a general area or location.");
  }
  if (draft.imageUrls.length > 12) add("imageUrls", "A listing can have up to 12 photos.");
  if (draft.imageUrls.some((url) => !isSafeImageUrl(url))) {
    add("imageUrls", "Photos must use valid HTTPS URLs without embedded credentials.");
  }
  if (draft.kind === "preowned" && !draft.condition) {
    add("condition", "Describe the item's condition.");
  }
  if (draft.kind === "preowned" && draft.condition === "parts_repair" && !draft.knownDefects?.trim()) {
    add("knownDefects", "Describe the known fault or repair requirement.");
  }
  if ((draft.kind === "grocery" || draft.kind === "prepared_food") &&
      (!Number.isFinite(draft.quantity) || (draft.quantity ?? 0) <= 0)) {
    add("quantity", "Add a quantity greater than zero.");
  }
  if (["property_sale", "property_rental", "student_accommodation", "short_stay"].includes(draft.kind)) {
    if (!draft.availableFrom) add("availableFrom", "Add an availability date.");
    if (!Number.isSafeInteger(draft.occupancy) || (draft.occupancy ?? 0) < 1) {
      add("occupancy", "Specify how many people the space can accommodate.");
    }
  }
  if (draft.kind === "short_stay" && (!Number.isSafeInteger(draft.guestCapacity) || (draft.guestCapacity ?? 0) < 1)) {
    add("guestCapacity", "Specify the maximum guest capacity.");
  }
  if (draft.bedrooms !== undefined && (!Number.isSafeInteger(draft.bedrooms) || draft.bedrooms < 0)) {
    add("bedrooms", "Bedrooms must be a non-negative whole number.");
  }
  if (draft.depositMinor !== undefined && (!Number.isSafeInteger(draft.depositMinor) || draft.depositMinor < 0)) {
    add("depositMinor", "Deposit must be a non-negative integer in minor currency units.");
  }
  if (draft.mandatoryFeesMinor !== undefined && (!Number.isSafeInteger(draft.mandatoryFeesMinor) || draft.mandatoryFeesMinor < 0)) {
    add("mandatoryFeesMinor", "Mandatory fees must be a non-negative integer in minor currency units.");
  }
  if (draft.status === "published" && draft.imageUrls.length === 0) {
    add("imageUrls", "Add at least one real photo before publishing.");
  }
  if (draft.verificationState === "verified") {
    // This is only a client-side data consistency check. Actual verification must be server-authorized.
    if (!draft.sellerRole) add("sellerRole", "A seller role is required before verification can be represented.");
  }
  return issues;
}

export function isSafeImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.length > 0 && !url.username && !url.password && value.length <= 2048;
  } catch {
    return false;
  }
}

export function formatMinorAmount(amountMinor: number, currency: string): string {
  if (!Number.isSafeInteger(amountMinor) || amountMinor < 0 || !supportedCurrencies.has(currency)) {
    return "Price unavailable";
  }
  const fractionDigits = currency === "NGN" || currency === "KES" || currency === "GHS" || currency === "ZAR" ? 2 : 2;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amountMinor / 100);
}


/**
 * Runtime guard for the current persisted marketplace schema.
 * Arc's richer listing kinds are deliberately not accepted until the DB and UI support them.
 */
export function validateMarketplaceCreateInput(input: {
  kind: unknown;
  category: unknown;
  title: unknown;
  description: unknown;
  priceKobo: unknown;
  priceNote: unknown;
  location: unknown;
  imageUrl: unknown;
}): string | null {
  const kinds = ["goods", "service", "stay"];
  const categories = [
    "accommodation", "food", "fashion", "electronics", "books",
    "beauty", "transport", "events", "services", "other",
  ];

  if (typeof input.kind !== "string" || !kinds.includes(input.kind)) {
    return "Choose a supported listing type.";
  }
  if (typeof input.category !== "string" || !categories.includes(input.category)) {
    return "Choose a supported listing category.";
  }
  if (input.kind === "stay" && input.category !== "accommodation") {
    return "Stay listings must use the accommodation category.";
  }
  if (input.category === "accommodation" && input.kind !== "stay") {
    return "Accommodation listings must use the stay listing type.";
  }
  if (input.category === "services" && input.kind !== "service") {
    return "Service listings must use the service listing type.";
  }
  if (typeof input.title !== "string" || input.title.trim().length < 4 || input.title.trim().length > 100) {
    return "Title must be between 4 and 100 characters.";
  }
  if (typeof input.description !== "string" || input.description.trim().length < 20 || input.description.trim().length > 5000) {
    return "Description must be between 20 and 5,000 characters.";
  }
  if (typeof input.priceKobo !== "number" || !Number.isSafeInteger(input.priceKobo) || input.priceKobo <= 0) {
    return "Price must be a positive whole number of minor currency units.";
  }
  if (typeof input.priceNote !== "string" || input.priceNote.trim().length < 1 || input.priceNote.trim().length > 80) {
    return "Price description must be between 1 and 80 characters.";
  }
  if (typeof input.location !== "string" || input.location.trim().length < 2 || input.location.trim().length > 180) {
    return "Location must be between 2 and 180 characters.";
  }
  if (typeof input.imageUrl !== "string" || input.imageUrl.trim().length > 2048 || !isSafeImageUrl(input.imageUrl.trim())) {
    return "Add a photo using a valid HTTPS image URL (maximum 2,048 characters).";
  }
  return null;
}
