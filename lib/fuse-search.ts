import Fuse from "fuse.js";
import { buildSearchIndex, type SearchResult } from "./inventory";

const searchIndex = buildSearchIndex();
const fuse = new Fuse(searchIndex, {
  keys: ["item.name", "item.tags"],
  threshold: 0.35,
});

export function searchAll(query: string): SearchResult[] {
  if (!query.trim()) return [];
  return fuse.search(query).map((r) => r.item);
}

export function searchWithinSpace(
  spaceId: string,
  query: string,
): SearchResult[] {
  if (!query.trim()) return [];
  return fuse
    .search(query)
    .map((r) => r.item)
    .filter((r) => r.space.id === spaceId);
}
