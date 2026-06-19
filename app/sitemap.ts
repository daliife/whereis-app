import type { MetadataRoute } from "next";
import { getAllSpaces } from "@/lib/inventory";
import { absoluteUrl } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/search/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/qr/"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const spaceRoutes: MetadataRoute.Sitemap = getAllSpaces().map((space) => ({
    url: absoluteUrl(`/space/${space.id}/`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...spaceRoutes];
}
