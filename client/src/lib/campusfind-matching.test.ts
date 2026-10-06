import { describe, expect, it } from "vitest";
import { SEED_ITEMS } from "./campusfind-data";
import { findMatches } from "./campusfind-matching";
import { FEATURED_LOST_EARBUDS } from "./campusfind-samples";

const candidates = [FEATURED_LOST_EARBUDS, ...SEED_ITEMS];

describe("CampusFind weighted matching", () => {
  it("ranks the requested earbuds example first at 94%", () => {
    const results = findMatches(FEATURED_LOST_EARBUDS, candidates, { limit: 3 });
    expect(results).toHaveLength(3);
    expect(results[0].item.name).toBe("Black Wireless Earbuds");
    expect(results[0].score).toBe(94);
    expect(results[0]).toMatchObject({ categoryScore: 40, locationScore: 29, dateScore: 25 });
    expect(results.map((result) => result.score)).toEqual([94, 89, 65]);
  });

  it("gives all 40 category and 35 location points and discounts a one-day date gap", () => {
    const wallet = SEED_ITEMS.find((item) => item.id === "lost-wallet-1");
    expect(wallet).toBeDefined();
    const results = findMatches(wallet!, [wallet!, ...SEED_ITEMS]);
    expect(results[0]).toMatchObject({ score: 100, categoryScore: 40, locationScore: 35, dateScore: 25 });
  });

  it("returns no match for same-status or different-category items", () => {
    const sameStatus = { ...FEATURED_LOST_EARBUDS, id: "another-lost-item" };
    const otherCategory = { ...SEED_ITEMS[0], category: "Bags" as const };
    expect(findMatches(FEATURED_LOST_EARBUDS, [sameStatus])).toEqual([]);
    expect(findMatches(FEATURED_LOST_EARBUDS, [otherCategory])).toEqual([]);
  });

  it("keeps every ranked result between zero and the 100-point maximum", () => {
    const results = findMatches(FEATURED_LOST_EARBUDS, candidates);
    expect(results.every((result) => result.score > 0 && result.score <= 100)).toBe(true);
    expect(results.map((result) => result.score)).toEqual(
      [...results].map((result) => result.score).sort((a, b) => b - a),
    );
  });
});
