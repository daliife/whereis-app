import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import SkipLink from "@/components/SkipLink";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (basePath ? `https://example.com${basePath}` : "http://localhost:3000");

const appTitle = "Stashly · Troba-ho al moment";
const appDescription =
  "Troba-ho al moment. Cerca on guardes qualsevol objecte de casa — armaris, calaixos i prestatges.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: appTitle,
    template: "%s · Stashly",
  },
  description: appDescription,
  applicationName: "Stashly",
  authors: [{ name: "Stashly" }],
  creator: "Stashly",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  appleWebApp: {
    capable: true,
    title: "Stashly",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: `${basePath}/icon.svg`,
    apple: `${basePath}/icon.svg`,
  },
  openGraph: {
    type: "website",
    locale: "ca_ES",
    siteName: "Stashly",
    title: appTitle,
    description: appDescription,
  },
  twitter: {
    card: "summary",
    title: appTitle,
    description: appDescription,
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
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

// Inline script that sets dark class before first paint to avoid flicker
const themeScript = `(function(){try{var t=localStorage.getItem('stashly-theme');var d=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

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
      </head>
      <body
        className={`${inter.variable} font-sans min-h-screen bg-zinc-50 dark:bg-zinc-950`}
      >
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
