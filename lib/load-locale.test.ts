import { describe, expect, it } from "vitest";
import { loadLocale } from "./load-locale";

describe("loadLocale", () => {
  it("loads catalan synchronously from bundle", async () => {
    const ca = await loadLocale("ca");
    expect(ca.home.appName).toBe("Stashly");
  });

  it("lazy-loads spanish and english dictionaries", async () => {
    const es = await loadLocale("es");
    const en = await loadLocale("en");

    expect(es.home.searchHeading).toContain("Buscar");
    expect(en.home.searchHeading).toContain("Search");
  });
});
