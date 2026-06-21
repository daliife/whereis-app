import { describe, expect, it } from "vitest";
import { buildSearchIndex } from "./inventory";
import { searchAll } from "./fuse-search";

describe("fuse-search with tags", () => {
  it("finds items by tag", () => {
    const tagged = buildSearchIndex().find(
      (entry) => entry.item.tags && entry.item.tags.length > 0,
    );
    expect(tagged).toBeDefined();

    const tag = tagged!.item.tags![0];
    const results = searchAll(tag);

    expect(
      results.some((result) => result.item.name === tagged!.item.name),
    ).toBe(true);
  });
});
