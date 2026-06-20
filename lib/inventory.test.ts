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
    expect(getSpace("armari-1")?.name).toBe("Armari soterrani esquerra");
    expect(getSpace("calaixera")?.type).toBe("drawers");
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
    expect(index.every((entry) => entry.item && entry.section && entry.space)).toBe(
      true,
    );
  });

  it("uses updated section naming without pis", () => {
    const armari = getSpace("armari-1");
    expect(armari?.sections.map((section) => section.name)).toContain(
      "3r prestatge",
    );
    expect(
      armari?.sections.some((section) => section.name.toLowerCase().includes("pis")),
    ).toBe(false);
  });
});
