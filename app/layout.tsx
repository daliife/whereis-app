import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import SkipLink from "@/components/SkipLink";
import {
  createPageMetadata,
  defaultTitle,
  getBasePath,
  getMetadataBaseUrl,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/site-metadata";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const basePath = getBasePath();

export const metadata: Metadata = {
  metadataBase: new URL(getMetadataBaseUrl()),
  title: {
    default: defaultTitle,
    template: `%s · ${SITE_NAME}`,
  },
  ...createPageMetadata({ path: "/" }),
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: `${basePath}/icon.svg`,
    apple: `${basePath}/icon.svg`,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffdf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e10" },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem('stashly-theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ca" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans min-h-screen`}>
        <ThemeProvider>
          <I18nProvider>
            <SkipLink />
            {children}
            <ServiceWorkerRegistration />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
