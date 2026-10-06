import { describe, expect, it } from "vitest";
import { CAMPUS_STATS, MOST_REPORTED_LOCATIONS, SEED_ITEMS } from "./campusfind-data";
import { CATEGORIES, LOCATIONS } from "./campusfind-types";

describe("CampusFind demo data", () => {
  it("includes at least one item from every requested category and named campus location", () => {
    expect(CATEGORIES.filter((category) => !SEED_ITEMS.some((item) => item.category === category))).toEqual([]);
    expect(LOCATIONS.filter((location) => !SEED_ITEMS.some((item) => item.location === location))).toEqual([]);
  });

  it("uses the requested landing statistics and busiest-location counts", () => {
    expect(CAMPUS_STATS.map(({ value, label }) => `${value} ${label}`)).toEqual([
      "127+ Items Reported",
      "84 Successful Matches",
      "12 Active Today",
      "95% Match Accuracy",
    ]);
    expect(MOST_REPORTED_LOCATIONS.map(({ name, count }) => [name, count])).toEqual([
      ["Library", 24],
      ["Cafeteria", 18],
      ["Main Block", 15],
    ]);
  });
});
