import type { MetadataRoute } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Matches --surface-page in globals.css / layout viewport themeColor */
const SURFACE_PAGE = "#f8f7f4";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Stashly · Troba-ho al moment",
    short_name: "Stashly",
    description:
      "Cerca on guardes qualsevol objecte de casa — armaris, calaixos i prestatges.",
    start_url: `${basePath}/`,
    scope: `${basePath}/`,
    display: "standalone",
    orientation: "portrait",
    background_color: SURFACE_PAGE,
    theme_color: SURFACE_PAGE,
    lang: "ca",
    icons: [
      {
        src: `${basePath}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: `${basePath}/apple-touch-icon.png`,
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${basePath}/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: `${basePath}/icon-512.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
