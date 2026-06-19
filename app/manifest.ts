import type { MetadataRoute } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
    background_color: "#fffbeb",
    theme_color: "#fffbeb",
    lang: "ca",
    icons: [
      {
        src: `${basePath}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
