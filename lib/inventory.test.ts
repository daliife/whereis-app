import { describe, expect, it } from "vitest";
import inventoryData from "@/data/inventory.json";
import {
  buildSearchIndex,
  getAllSpaces,
  getSpace,
  type Space,
} from "./inventory";

describe("inventory", () => {
  it("loads spaces from inventory.json", () => {
    expect(getAllSpaces()).toHaveLength(inventoryData.spaces.length);
  });

  it("getSpace returns a space by id", () => {
    for (const space of inventoryData.spaces as Space[]) {
      expect(getSpace(space.id)).toEqual(space);
    }
  });

  it("getSpace returns undefined for unknown ids", () => {
    expect(getSpace("does-not-exist")).toBeUndefined();
  });

  it("buildSearchIndex flattens every item with section and space", () => {
    const index = buildSearchIndex();
    const expectedCount = (inventoryData.spaces as Space[]).reduce(
      (total, space) =>
        total +
        space.sections.reduce(
          (sectionTotal, section) => sectionTotal + section.items.length,
          0,
        ),
      0,
    );

    expect(index).toHaveLength(expectedCount);
    expect(
      index.every((entry) => entry.item && entry.section && entry.space),
    ).toBe(true);
  });
});
