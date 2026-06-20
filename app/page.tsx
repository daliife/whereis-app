"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SearchStatus from "@/components/SearchStatus";
import SearchResultsList from "@/components/SearchResultsList";
import SettingsMenu from "@/components/SettingsMenu";
import AppBrandLink from "@/components/AppBrandLink";
import SpaceIcon, { TYPE_COLOR_HOME } from "@/components/SpaceIcon";
import { getAllSpaces } from "@/lib/inventory";
import { searchAll } from "@/lib/fuse-search";
import type { SearchResult } from "@/lib/inventory";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useI18n } from "@/lib/i18n";

const LocateItemSheet = dynamic(
  () => import("@/components/LocateItemSheet"),
  { ssr: false },
);

const AboutSheet = dynamic(() => import("@/components/AboutSheet"), {
  ssr: false,
});

const spaces = getAllSpaces();

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [locateResult, setLocateResult] = useState<SearchResult | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 200);
  const { t } = useI18n();

  const results = debouncedQuery.trim() ? searchAll(debouncedQuery) : [];
  const isSearching = query.trim().length > 0;

  const closeLocateSheet = useCallback(() => setLocateResult(null), []);
  const closeAbout = useCallback(() => setAboutOpen(false), []);

  const goHome = useCallback(() => {
    setQuery("");
    setLocateResult(null);
    setAboutOpen(false);
  }, []);

  useEffect(() => {
    setLocateResult(null);
  }, [query]);

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
        <header className="relative overflow-visible pb-2 pt-[max(1rem,env(safe-area-inset-top))] sm:pb-3 sm:pt-8">
          <div className="flex items-center justify-between gap-3">
            <AppBrandLink onNavigate={goHome} />
            <SettingsMenu onOpenAbout={() => setAboutOpen(true)} />
          </div>
        </header>

        <main id="main-content" className="mt-4 sm:mt-6">
          <section
            className="home-primary"
            aria-labelledby="home-search-heading"
          >
            <header className="home-primary-header">
              <h2 id="home-search-heading" className="home-primary-title">
                {t.home.searchHeading}
              </h2>
            </header>

            <div className="home-primary-field">
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder={t.home.searchPlaceholder}
                clearLabel={t.common.clearSearch}
                prominent
                autoFocusDesktop
              />
            </div>
            <SearchStatus
              query={debouncedQuery}
              resultCount={results.length}
              resultsLabel={t.home.results}
              nothingFoundLabel={t.home.nothingFound}
            />

            {isSearching && (
              <div className="search-results-divider">
                <SearchResultsList
                  results={results}
                  selectedResult={locateResult}
                  onSelect={setLocateResult}
                  locateLabel={t.home.locate}
                  nothingFoundTitle={t.home.nothingFound}
                  nothingFoundHint={t.home.nothingFoundHint}
                  footer={
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className={`home-browse-link ${results.length === 0 ? "-mt-2" : ""}`}
                    >
                      {t.home.orBrowseSpaces}
                    </button>
                  }
                />
              </div>
            )}
          </section>

          {!isSearching && (
            <section
              className="home-browse"
              aria-labelledby="home-browse-heading"
            >
              <header className="home-browse-header">
                <h2 id="home-browse-heading" className="home-browse-title">
                  {t.home.browseHeading}
                </h2>
              </header>

              <div className="home-browse-grid">
                {spaces.map((space) => {
                  const itemCount = space.sections.reduce(
                    (acc, s) => acc + s.items.length,
                    0,
                  );

                  return (
                    <Link
                      key={space.id}
                      href={`/space/${space.id}`}
                      className="group card-focus-wrap"
                    >
                      <div className="card-space">
                        <div
                          className={`card-space-icon ${TYPE_COLOR_HOME[space.type] ?? "bg-zinc-100 text-zinc-500"}`}
                        >
                          <SpaceIcon type={space.type} className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="card-kicker">
                            {t.space.types[space.type]}
                          </p>
                          <p className="card-title mt-0.5">{space.name}</p>
                          <p className="card-meta">{t.home.items(itemCount)}</p>
                        </div>
                        <svg
                          className="h-4 w-4 flex-shrink-0 text-zinc-300 transition-colors group-hover:text-amber-600 dark:text-zinc-600 dark:group-hover:text-amber-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <nav
            className="home-more-links"
            aria-label={t.home.moreLinks}
          >
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
        </main>
      </div>

      {aboutOpen && <AboutSheet onClose={closeAbout} />}

      {locateResult && (
        <LocateItemSheet
          result={locateResult}
          onClose={closeLocateSheet}
        />
      )}
    </>
  );
}
