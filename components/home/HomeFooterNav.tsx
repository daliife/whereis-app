"use client";

import Link from "next/link";
import UiIcon from "@/components/icons/UiIcon";
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
        <UiIcon name="info" className="home-more-link-icon" />
        {t.about.open}
      </button>
      <Link href="/qr" className="home-more-link">
        <UiIcon name="qr" className="home-more-link-icon" />
        {t.home.qrLink}
      </Link>
    </nav>
  );
}
