import Fuse from "fuse.js";
import { buildSearchIndex, getSpace, type SearchResult } from "./inventory";

const FUSE_OPTIONS = {
  keys: ["item.name", "item.tags"],
  threshold: 0.35,
};

let globalFuse: Fuse<SearchResult> | null = null;
const spaceFuses = new Map<string, Fuse<SearchResult>>();

function getGlobalFuse(): Fuse<SearchResult> {
  if (!globalFuse) {
    globalFuse = new Fuse(buildSearchIndex(), FUSE_OPTIONS);
  }
  return globalFuse;
}

function buildSpaceIndex(spaceId: string): SearchResult[] {
  const space = getSpace(spaceId);
  if (!space) return [];

  const results: SearchResult[] = [];
  for (const section of space.sections) {
    for (const item of section.items) {
      results.push({ item, section, space });
    }
  }
  return results;
}

function getSpaceFuse(spaceId: string): Fuse<SearchResult> {
  let fuse = spaceFuses.get(spaceId);
  if (!fuse) {
    fuse = new Fuse(buildSpaceIndex(spaceId), FUSE_OPTIONS);
    spaceFuses.set(spaceId, fuse);
  }
  return fuse;
}

export function searchAll(query: string): SearchResult[] {
  if (!query.trim()) return [];
  return getGlobalFuse()
    .search(query)
    .map((r) => r.item);
}

export function searchWithinSpace(
  spaceId: string,
  query: string,
): SearchResult[] {
  if (!query.trim()) return [];
  return getSpaceFuse(spaceId)
    .search(query)
    .map((r) => r.item);
}
