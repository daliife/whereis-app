import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  addRecentSearch,
  getRecentSearches,
  getRecentSearchesSnapshot,
  subscribeRecentSearches,
} from "./recent-searches";

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

  it("returns the same snapshot reference until data changes", () => {
    addRecentSearch("alpha");

    const first = getRecentSearchesSnapshot();
    const second = getRecentSearchesSnapshot();

    expect(first).toBe(second);

    addRecentSearch("beta");
    const third = getRecentSearchesSnapshot();

    expect(third).not.toBe(first);
    expect(third).toEqual(["beta", "alpha"]);
  });

  it("notifies subscribers only when the list changes", () => {
    const listener = vi.fn();
    const unsubscribe = subscribeRecentSearches(listener);

    addRecentSearch("martell");
    expect(listener).toHaveBeenCalledTimes(1);

    addRecentSearch("martell");
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
  });
});
