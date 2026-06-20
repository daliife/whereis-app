"use client";

import AppBrandLink from "@/components/AppBrandLink";
import SettingsMenu from "@/components/SettingsMenu";
import { useHomeSearch } from "./HomeSearchContext";

export default function HomeHeader() {
  const { goHome, setAboutOpen } = useHomeSearch();

  return (
    <header className="relative overflow-visible pb-2 pt-[max(1rem,env(safe-area-inset-top))] sm:pb-3 sm:pt-8">
      <div className="flex items-center justify-between gap-3">
        <AppBrandLink onNavigate={goHome} />
        <SettingsMenu onOpenAbout={() => setAboutOpen(true)} />
      </div>
    </header>
  );
}
