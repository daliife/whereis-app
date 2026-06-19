"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SearchStatus from "@/components/SearchStatus";
import ItemCard from "@/components/ItemCard";
import SettingsMenu from "@/components/SettingsMenu";
import AppIcon from "@/components/AppIcon";
import SpaceIcon, { TYPE_COLOR } from "@/components/SpaceIcon";
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

function sameResult(a: SearchResult, b: SearchResult) {
  return (
    a.space.id === b.space.id &&
    a.section.id === b.section.id &&
    a.item.name === b.item.name
  );
}

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

  useEffect(() => {
    setLocateResult(null);
  }, [query]);

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
        {/* Header */}
        <header className="relative overflow-visible pb-2 pt-[max(1rem,env(safe-area-inset-top))] sm:pb-3 sm:pt-8">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <AppIcon size={36} />
              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl">
                  {t.home.appName}
                </h1>
              </div>
              <button
                type="button"
                onClick={() => setAboutOpen(true)}
                className="btn-header-action h-9 w-9"
                aria-label={t.about.open}
              >
                <svg
                  className="h-5 w-5"
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
              </button>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <SettingsMenu />
              <Link
                href="/qr"
                className="btn-header-action h-9 w-9 gap-1.5 text-xs font-semibold sm:w-auto sm:px-2.5"
                aria-label={t.home.qrLink}
              >
                <svg
                  className="h-4 w-4 shrink-0"
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
                <span className="hidden sm:inline">{t.home.qrLink}</span>
              </Link>
            </div>
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
              {!isSearching && (
                <p className="home-primary-hint">{t.home.searchHint}</p>
              )}
            </header>

            <div className="home-primary-field">
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder={t.home.searchPlaceholder}
                clearLabel={t.common.clearSearch}
                prominent
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
                {results.length > 0 ? (
                  <>
                    <p className="meta-count mb-3">
                      {t.home.results(results.length)}
                    </p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      {results.map((r, i) => {
                        const isActive =
                          locateResult !== null && sameResult(locateResult, r);

                        return (
                          <button
                            key={`${r.space.id}-${r.section.id}-${r.item.name}-${i}`}
                            type="button"
                            onClick={() => setLocateResult(r)}
                            className="group card-focus-wrap"
                          >
                            <ItemCard
                              itemName={r.item.name}
                              spaceName={r.space.name}
                              sectionName={r.section.name}
                              highlighted={isActive}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <svg
                        className="h-5 w-5 text-zinc-500 dark:text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                        />
                      </svg>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      {t.home.nothingFound}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {t.home.nothingFoundHint}
                    </p>
                  </div>
                )}
              </div>
            )}
          </section>

          {!isSearching && (
            <>
              <div className="flow-or" role="separator" aria-label={t.home.flowOr}>
                <span className="flow-or-line" aria-hidden="true" />
                <span className="flow-or-label">{t.home.flowOr}</span>
                <span className="flow-or-line" aria-hidden="true" />
              </div>

              <section
                className="home-browse"
                aria-labelledby="home-browse-heading"
              >
                <header className="home-browse-header">
                  <h2 id="home-browse-heading" className="home-browse-title">
                    {t.home.browseHeading}
                  </h2>
                  <p className="home-browse-hint">{t.home.browseSubheading}</p>
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
                            className={`card-space-icon ${TYPE_COLOR[space.type] ?? "bg-zinc-100 text-zinc-500"}`}
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
                            className="h-4 w-4 flex-shrink-0 text-zinc-300 transition-colors group-hover:text-zinc-500 dark:text-zinc-600 dark:group-hover:text-zinc-400"
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
            </>
          )}
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
