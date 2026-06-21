import { describe, expect, it } from "vitest";
import inventoryData from "@/data/inventory.json";
import { buildSearchIndex, type Space } from "./inventory";
import { searchAll, searchWithinSpace } from "./fuse-search";

function firstSpaceWithItems(): {
  space: Space;
  itemName: string;
} {
  for (const space of inventoryData.spaces as Space[]) {
    for (const section of space.sections) {
      const item = section.items[0];
      if (item) {
        return { space, itemName: item.name };
      }
    }
  }
  throw new Error("inventory.json has no items");
}

function findItemUniqueToOneSpace(): {
  itemName: string;
  spaceId: string;
  otherSpaceId: string;
} | null {
  const index = buildSearchIndex();
  const spaceIdsByItem = new Map<string, Set<string>>();

  for (const entry of index) {
    const ids = spaceIdsByItem.get(entry.item.name) ?? new Set<string>();
    ids.add(entry.space.id);
    spaceIdsByItem.set(entry.item.name, ids);
  }

  for (const [itemName, spaceIds] of spaceIdsByItem) {
    if (spaceIds.size !== 1) continue;

    const spaceId = [...spaceIds][0];
    const otherSpace = (inventoryData.spaces as Space[]).find(
      (space) => space.id !== spaceId,
    );
    if (!otherSpace) continue;

    return { itemName, spaceId, otherSpaceId: otherSpace.id };
  }

  return null;
}

describe("fuse-search", () => {
  it("returns no results for empty queries", () => {
    const { space } = firstSpaceWithItems();

    expect(searchAll("")).toEqual([]);
    expect(searchAll("   ")).toEqual([]);
    expect(searchWithinSpace(space.id, "")).toEqual([]);
  });

  it("finds items by partial name", () => {
    const { itemName } = firstSpaceWithItems();
    const partial = itemName.slice(0, Math.min(4, itemName.length));

    const results = searchAll(partial);

    expect(results.length).toBeGreaterThan(0);
    expect(results.some((result) => result.item.name === itemName)).toBe(true);
  });

  it("finds items case-insensitively", () => {
    const { itemName } = firstSpaceWithItems();
    const query = itemName.toLowerCase();

    const results = searchAll(query);

    expect(results.some((result) => result.item.name === itemName)).toBe(true);
  });

  it("searchWithinSpace limits results to one space", () => {
    const { space, itemName } = firstSpaceWithItems();
    const results = searchWithinSpace(space.id, itemName);

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((result) => result.space.id === space.id)).toBe(true);
    expect(results.some((result) => result.item.name === itemName)).toBe(true);
  });

  it("searchWithinSpace excludes matches from other spaces", () => {
    const unique = findItemUniqueToOneSpace();
    expect(unique).not.toBeNull();

    const global = searchAll(unique!.itemName);
    const scoped = searchWithinSpace(unique!.otherSpaceId, unique!.itemName);

    expect(global.length).toBeGreaterThan(0);
    expect(scoped).toHaveLength(0);
  });
});
