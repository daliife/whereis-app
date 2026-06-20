import { readFileSync } from "node:fs";
import inventoryData from "@/data/inventory.json";
import { describe, expect, it } from "vitest";
import { validateInventory } from "./validate-inventory";

describe("validateInventory", () => {
  it("accepts the current inventory.json", () => {
    const result = validateInventory(inventoryData);

    expect(result.errors).toEqual([]);
    expect(result.spaceCount).toBe(3);
    expect(result.warnings).toEqual([]);
  });

  it("reports duplicate space ids", () => {
    const result = validateInventory({
      spaces: [
        { id: "dup", name: "One", type: "cabinet", sections: [] },
        { id: "dup", name: "Two", type: "cabinet", sections: [] },
      ],
    });

    expect(result.errors).toContain("duplicate space id: dup");
  });

  it("reports invalid space types", () => {
    const result = validateInventory({
      spaces: [
        {
          id: "bad-type",
          name: "Bad",
          type: "closet",
          sections: [{ id: "a", name: "A", items: [{ name: "Thing" }] }],
        },
      ],
    });

    expect(result.errors.some((error) => error.includes("type must be one of"))).toBe(
      true,
    );
  });

  it("reports empty item names", () => {
    const result = validateInventory({
      spaces: [
        {
          id: "space",
          name: "Space",
          type: "cabinet",
          sections: [{ id: "section", name: "Section", items: [{ name: "  " }] }],
        },
      ],
    });

    expect(result.errors.some((error) => error.includes(".name must be"))).toBe(
      true,
    );
  });

  it("warns about duplicate item names within the same space", () => {
    const result = validateInventory({
      spaces: [
        {
          id: "space",
          name: "Space",
          type: "cabinet",
          sections: [
            {
              id: "a",
              name: "A",
              items: [{ name: "Martell", tags: ["eines"] }],
            },
            {
              id: "b",
              name: "B",
              items: [{ name: "martell", tags: ["eines"] }],
            },
          ],
        },
      ],
    });

    expect(result.errors).toEqual([]);
    expect(result.warnings.some((warning) => warning.includes("duplicate item name"))).toBe(
      true,
    );
  });
});

describe("validate-inventory script data", () => {
  it("matches the file on disk", () => {
    const fileInventory = JSON.parse(readFileSync("data/inventory.json", "utf8"));
    const result = validateInventory(fileInventory);

    expect(result.errors).toEqual([]);
  });
});
