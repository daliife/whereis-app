"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { useHomeSearch } from "./HomeSearchContext";

export default function HomeFooterNav() {
  const { setAboutOpen } = useHomeSearch();
  const { t } = useI18n();

  return (
    <nav className="home-more-links" aria-label={t.home.moreLinks}>
      <button
        type="button"
        onClick={() => setAboutOpen(true)}
        className="home-more-link"
      >
        <svg
          className="home-more-link-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {t.about.open}
      </button>
      <Link href="/qr" className="home-more-link">
        <svg
          className="home-more-link-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v6h-6v-2h4zM14 18h2v2h-2z"
          />
        </svg>
        {t.home.qrLink}
      </Link>
    </nav>
  );
}
