import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  absoluteUrl,
  createPageMetadata,
  defaultTitle,
  getBasePath,
  getMetadataBaseUrl,
  getSiteUrl,
  SITE_NAME,
} from "./site-metadata";

describe("site-metadata", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("getBasePath reads NEXT_PUBLIC_BASE_PATH", () => {
    process.env.NEXT_PUBLIC_BASE_PATH = "/whereis-app";
    expect(getBasePath()).toBe("/whereis-app");
  });

  it("getBasePath defaults to empty string", () => {
    delete process.env.NEXT_PUBLIC_BASE_PATH;
    expect(getBasePath()).toBe("");
  });

  it("getSiteUrl prefers NEXT_PUBLIC_SITE_URL", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.org/";
    expect(getSiteUrl()).toBe("https://example.org");
  });

  it("getMetadataBaseUrl strips base path from site url", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/whereis-app";
    process.env.NEXT_PUBLIC_BASE_PATH = "/whereis-app";
    expect(getMetadataBaseUrl()).toBe("https://example.com");
  });

  it("absoluteUrl normalizes paths", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://stashly.test";
    expect(absoluteUrl("search")).toBe("https://stashly.test/search");
    expect(absoluteUrl("/space/armari-1/")).toBe(
      "https://stashly.test/space/armari-1/",
    );
  });

  it("createPageMetadata builds canonical page metadata", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://stashly.test";

    const metadata = createPageMetadata({
      title: "Cerca",
      path: "/search/",
    });

    expect(metadata.title).toBe("Cerca");
    expect(metadata.alternates?.canonical).toBe("https://stashly.test/search/");
    expect(metadata.openGraph?.title).toBe(`Cerca · ${SITE_NAME}`);
    expect(metadata.robots).toEqual({
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    });
  });

  it("createPageMetadata supports noIndex routes", () => {
    const metadata = createPageMetadata({ noIndex: true });

    expect(metadata.robots).toEqual({ index: false, follow: false });
    expect(metadata.openGraph?.title).toBe(defaultTitle);
  });
});
