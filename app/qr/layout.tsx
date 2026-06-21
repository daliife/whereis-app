import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site-metadata";
import { ca } from "@/lib/translations/ca";

export const metadata: Metadata = createPageMetadata({
  title: ca.qr.title,
  description:
    "Genera i imprimeix codis QR per obrir cada espai d'emmagatzematge directament des del mòbil.",
  path: "/qr/",
  noIndex: true,
});

export default function QRLayout({ children }: { children: React.ReactNode }) {
  return children;
}
