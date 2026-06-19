import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site-metadata";
import { ca } from "@/lib/translations/ca";

export const metadata: Metadata = createPageMetadata({
  title: ca.search.title,
  description:
    "Cerca a tots els armaris, calaixos i prestatges de casa des d'un sol lloc.",
  path: "/search/",
});

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
