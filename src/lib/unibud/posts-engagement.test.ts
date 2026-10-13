import { describe, it } from "node:test";
import assert from "node:assert/strict";

/**
 * Engagement rules (documented as executable tests):
 * - One like row per (user, post) — toggle removes, does not double-count.
 * - Soft-deleted posts are excluded from feeds when deleted_at is set.
 * - Replies sort newest-first for display.
 */
describe("posts engagement rules", () => {
  it("toggle like is binary per user", () => {
    const likes = new Set<string>();
    const user = "u1";
    const post = "p1";
    const key = `${user}:${post}`;
    likes.add(key);
    assert.equal(likes.has(key), true);
    assert.equal(likes.size, 1);
    likes.delete(key);
    assert.equal(likes.has(key), false);
    likes.add(key);
    likes.add(key);
    assert.equal(likes.size, 1);
  });

  it("newest-first reply order", () => {
    const replies = [
      { id: "a", createdAt: "2026-01-01T10:00:00Z" },
      { id: "b", createdAt: "2026-01-01T12:00:00Z" },
      { id: "c", createdAt: "2026-01-01T11:00:00Z" },
    ];
    const sorted = [...replies].sort((x, y) => y.createdAt.localeCompare(x.createdAt));
    assert.deepEqual(sorted.map((r) => r.id), ["b", "c", "a"]);
  });

  it("soft-deleted posts excluded from feed", () => {
    const posts = [
      { id: "1", deleted_at: null },
      { id: "2", deleted_at: "2026-01-01T00:00:00Z" },
      { id: "3", deleted_at: null },
    ];
    const feed = posts.filter((p) => !p.deleted_at);
    assert.deepEqual(feed.map((p) => p.id), ["1", "3"]);
  });
});
