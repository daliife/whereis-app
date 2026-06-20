import { describe, expect, it } from "vitest";
import { searchAll } from "./fuse-search";

describe("fuse-search with tags", () => {
  it("finds items by tag synonym", () => {
    const results = searchAll("trepant");
    expect(results.some((result) => result.item.name.includes("Taladro"))).toBe(
      true,
    );
  });
});
