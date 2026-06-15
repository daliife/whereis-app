import Fuse from "fuse.js";
import inventoryData from "@/data/inventory.json";

export interface Item {
  name: string;
  tags: string[];
}

export interface Section {
  id: string;
  name: string;
  items: Item[];
}

export interface Space {
  id: string;
  name: string;
  type: string;
  sections: Section[];
}

export interface SearchResult {
  item: Item;
  section: Section;
  space: Space;
}

// Flatten all items with their parent context into a single list
function buildSearchIndex(): SearchResult[] {
  const results: SearchResult[] = [];
  for (const space of inventoryData.spaces as Space[]) {
    for (const section of space.sections) {
      for (const item of section.items) {
        results.push({ item, section, space });
      }
    }
  }
  return results;
}

const searchIndex = buildSearchIndex();

const globalFuse = new Fuse(searchIndex, {
  keys: ["item.name", "item.tags"],
  threshold: 0.35,
  includeScore: true,
});

export function searchAll(query: string): SearchResult[] {
  if (!query.trim()) return [];
  return globalFuse.search(query).map((r) => r.item);
}

export function searchWithinSpace(
  spaceId: string,
  query: string,
): SearchResult[] {
  if (!query.trim()) return [];
  const spaceIndex = searchIndex.filter((r) => r.space.id === spaceId);
  const spaceFuse = new Fuse(spaceIndex, {
    keys: ["item.name", "item.tags"],
    threshold: 0.35,
    includeScore: true,
  });
  return spaceFuse.search(query).map((r) => r.item);
}

export function getSpace(id: string): Space | undefined {
  return (inventoryData.spaces as Space[]).find((s) => s.id === id);
}

export function getAllSpaces(): Space[] {
  return inventoryData.spaces as Space[];
}
