import inventoryData from "@/data/inventory.json";

export type SpaceType = "cabinet" | "drawers" | "shelf";

export interface Item {
  name: string;
  tags?: string[];
}

export interface Section {
  id: string;
  name: string;
  items: Item[];
}

export interface Space {
  id: string;
  name: string;
  type: SpaceType;
  sections: Section[];
}

export interface SearchResult {
  item: Item;
  section: Section;
  space: Space;
}

export function buildSearchIndex(): SearchResult[] {
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

export function getSpace(id: string): Space | undefined {
  return (inventoryData.spaces as Space[]).find((s) => s.id === id);
}

export function getAllSpaces(): Space[] {
  return inventoryData.spaces as Space[];
}
