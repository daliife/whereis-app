"use client";

import type { Space } from "@/lib/inventory";
import { HomeSearchProvider } from "./HomeSearchContext";
import HomeHeader from "./HomeHeader";
import HomeSearchSection from "./HomeSearchSection";
import HomeBrowseSection from "./HomeBrowseSection";
import HomeFooterNav from "./HomeFooterNav";

interface Props {
  spaces: Space[];
}

export default function HomePageClient({ spaces }: Props) {
  return (
    <HomeSearchProvider>
      <div className="page-shell">
        <HomeHeader />

        <main id="main-content" className="mt-4 sm:mt-6">
          <HomeSearchSection />
          <HomeBrowseSection spaces={spaces} />
          <HomeFooterNav />
        </main>
      </div>
    </HomeSearchProvider>
  );
}
