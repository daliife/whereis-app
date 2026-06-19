import type { Metadata } from "next";

export const SITE_NAME = "Stashly";
export const SITE_TAGLINE = "Troba-ho al moment";
export const SITE_DESCRIPTION =
  "Cerca on guardes qualsevol objecte de casa — armaris, calaixos i prestatges. Escaneja un QR i troba-ho al moment.";

export const SITE_KEYWORDS = [
  "inventari casa",
  "organització",
  "on està",
  "armari",
  "calaixos",
  "prestatges",
  "cerca objectes",
  "QR",
  "Stashly",
];

export const defaultTitle = `${SITE_NAME} · ${SITE_TAGLINE}`;

export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}

/** Canonical site origin including base path (no trailing slash). */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  const basePath = getBasePath();
  if (basePath) {
    return `https://example.com${basePath}`;
  }

  return "http://localhost:3000";
}

/**
 * Origin for metadataBase — without basePath when Next.js prepends it via next.config.
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase
 */
export function getMetadataBaseUrl(): string {
  const siteUrl = getSiteUrl();
  const basePath = getBasePath();

  if (basePath && siteUrl.endsWith(basePath)) {
    const origin = siteUrl.slice(0, -basePath.length);
    return origin || siteUrl;
  }

  return siteUrl;
}

/** Build an absolute URL for a route path (e.g. `/search/`). */
export function absoluteUrl(path: string): string {
  const site = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${site}${normalized}`;
}

const sharedOpenGraph = {
  type: "website" as const,
  locale: "ca_ES",
  alternateLocale: ["es_ES", "en_US"],
  siteName: SITE_NAME,
};

const sharedTwitter = {
  card: "summary_large_image" as const,
};

/** Per-page metadata — pass `title` for section pages (uses root title template). */
export function createPageMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
} = {}): Metadata {
  const pageTitle = title ? `${title} · ${SITE_NAME}` : defaultTitle;
  const url = absoluteUrl(path);

  const metadata: Metadata = {
    description,
    keywords: SITE_KEYWORDS,
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "utilities",
    referrer: "origin-when-cross-origin",
    formatDetection: {
      telephone: false,
      email: false,
      address: false,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: { index: true, follow: true },
        },
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...sharedOpenGraph,
      title: pageTitle,
      description,
      url,
    },
    twitter: {
      ...sharedTwitter,
      title: pageTitle,
      description,
    },
  };

  if (title) {
    metadata.title = title;
  }

  return metadata;
}
