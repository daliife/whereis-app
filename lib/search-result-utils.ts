import type { SearchResult } from "./inventory";

export function sameSearchResult(a: SearchResult, b: SearchResult) {
  return (
    a.space.id === b.space.id &&
    a.section.id === b.section.id &&
    a.item.name === b.item.name
  );
}
