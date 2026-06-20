import { describe, expect, it } from "vitest";
import { searchAll, searchWithinSpace } from "./fuse-search";

describe("fuse-search", () => {
  it("returns no results for empty queries", () => {
    expect(searchAll("")).toEqual([]);
    expect(searchAll("   ")).toEqual([]);
    expect(searchWithinSpace("armari-1", "")).toEqual([]);
  });

  it("finds items by partial name", () => {
    const results = searchAll("Barbacoa");

    expect(results.length).toBeGreaterThan(0);
    expect(results.some((result) => result.item.name === "Barbacoa")).toBe(true);
  });

  it("finds items case-insensitively", () => {
    const results = searchAll("barbacoa");

    expect(results.some((result) => result.item.name === "Barbacoa")).toBe(true);
  });

  it("searchWithinSpace limits results to one space", () => {
    const results = searchWithinSpace("armari-2", "Borrassa");

    expect(results.length).toBe(2);
    expect(results.every((result) => result.space.id === "armari-2")).toBe(true);
    expect(results.map((result) => result.item.name)).toEqual(
      expect.arrayContaining([
        "Borrassa (damunt)",
        "Borrassa (2n prestatge)",
      ]),
    );
  });

  it("searchWithinSpace excludes matches from other spaces", () => {
    const global = searchAll("Borrassa");
    const scoped = searchWithinSpace("armari-1", "Borrassa");

    expect(global.length).toBeGreaterThan(scoped.length);
    expect(scoped).toHaveLength(0);
  });
});
