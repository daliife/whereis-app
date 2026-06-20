import { describe, expect, it } from "vitest";
import { ca } from "./translations/ca";
import { en } from "./translations/en";
import { es } from "./translations/es";

type TranslationTree = Record<string, unknown>;

function collectKeys(value: unknown, prefix = ""): string[] {
  if (typeof value === "function") {
    return prefix ? [prefix] : [];
  }

  if (Array.isArray(value) || value === null || typeof value !== "object") {
    return prefix ? [prefix] : [];
  }

  return Object.entries(value as TranslationTree).flatMap(([key, nested]) =>
    collectKeys(nested, prefix ? `${prefix}.${key}` : key),
  );
}

describe("translations", () => {
  it("keeps the same keys across ca, es and en", () => {
    const caKeys = collectKeys(ca).sort();
    const esKeys = collectKeys(es).sort();
    const enKeys = collectKeys(en).sort();

    expect(esKeys).toEqual(caKeys);
    expect(enKeys).toEqual(caKeys);
  });

  it("includes recently added home navigation strings", () => {
    expect(ca.home.orBrowseSpaces).toBe("Navega pels espais");
    expect(ca.common.goHome).toBeTruthy();
    expect(ca.home.itemTags).toBe("Etiquetes");
    expect(ca.search.recentSearches).toBe("Cerques recents");
    expect(es.home.orBrowseSpaces).not.toMatch(/^O /);
    expect(en.home.orBrowseSpaces).not.toMatch(/^Or /i);
  });

  it("does not expose removed settings.more key", () => {
    expect(collectKeys(ca)).not.toContain("settings.more");
  });
});
