import { beforeEach, describe, expect, it } from "vitest";
import { addRecentSearch, getRecentSearches } from "./recent-searches";

describe("recent-searches", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores unique recent queries with newest first", () => {
    addRecentSearch("barbacoa");
    addRecentSearch("trepant");
    addRecentSearch("barbacoa");

    expect(getRecentSearches()).toEqual(["barbacoa", "trepant"]);
  });

  it("ignores very short queries", () => {
    addRecentSearch("a");
    expect(getRecentSearches()).toEqual([]);
  });

  it("keeps at most five entries", () => {
    addRecentSearch("one");
    addRecentSearch("two");
    addRecentSearch("three");
    addRecentSearch("four");
    addRecentSearch("five");
    addRecentSearch("six");

    expect(getRecentSearches()).toHaveLength(5);
    expect(getRecentSearches()[0]).toBe("six");
  });
});
