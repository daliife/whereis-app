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
  const debouncedQuery = useDebouncedValue(query, 200);
  const { t } = useI18n();

  const results = debouncedQuery.trim() ? searchAll(debouncedQuery) : [];
  const isSearching = query.trim().length > 0;

  const closeLocateSheet = useCallback(() => setLocateResult(null), []);

  useEffect(() => {
    setLocateResult(null);
  }, [query]);

  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
        {/* Header */}
        <header className="relative overflow-visible pb-5 pt-[max(1.5rem,env(safe-area-inset-top))] sm:pb-6 sm:pt-10 lg:pt-12">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <AppIcon size={28} />
              <h1 className="truncate text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-2xl lg:text-3xl">
                {t.home.appName}
              </h1>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <SettingsMenu />
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" aria-hidden="true" />
              <Link
                href="/qr"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 sm:w-auto sm:px-2.5"
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
          <p className="mt-1 pl-[38px] text-sm text-zinc-500 dark:text-zinc-400">
            {t.home.subtitle}
          </p>
        </header>

        <main id="main-content">
        {/* Primary flow: search */}
        <section aria-label={t.home.searchPlaceholder}>
          <div className="sticky top-0 isolate z-20 -mx-4 bg-zinc-50 px-4 pb-3 pt-2 backdrop-blur-sm dark:bg-zinc-950 sm:-mx-6 sm:px-6">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder={t.home.searchPlaceholder}
              clearLabel={t.common.clearSearch}
            />
            <SearchStatus
              query={debouncedQuery}
              resultCount={results.length}
              resultsLabel={t.home.results}
              nothingFoundLabel={t.home.nothingFound}
            />
            {!isSearching && (
              <p className="mt-2.5 text-center text-sm text-zinc-600 dark:text-zinc-400">
                {t.home.searchHint}
              </p>
            )}
          </div>

          {isSearching && (
            <div className="mt-4">
              {results.length > 0 ? (
                <>
                  <p className="mb-3 text-xs font-medium text-zinc-600 dark:text-zinc-400">
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
                          className="group block w-full rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950"
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
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <svg
                      className="h-6 w-6 text-zinc-400"
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
                  <p className="mt-4 text-base font-semibold text-zinc-700 dark:text-zinc-300">
                    {t.home.nothingFound}
                  </p>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {t.home.nothingFoundHint}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Secondary navigation: browse spaces */}
        <section
          className={`mt-10 border-t border-zinc-200 pt-8 dark:border-zinc-800 ${isSearching ? "opacity-80" : ""}`}
          aria-label={t.home.browseHeading}
        >
          <h2 className="mb-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {t.home.browseHeading}
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {spaces.map((space) => (
              <Link
                key={space.id}
                href={`/space/${space.id}`}
                className="group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950"
              >
                <div className="flex h-full items-center gap-3 rounded-lg border border-zinc-200/80 bg-white px-3.5 py-3 transition-colors group-hover:border-zinc-300 group-hover:bg-zinc-50/80 active:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:group-hover:border-zinc-700 dark:group-hover:bg-zinc-800/40 dark:active:bg-zinc-800/60">
                  <div
                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${TYPE_COLOR[space.type] ?? "bg-zinc-100 text-zinc-500"}`}
                  >
                    <SpaceIcon
                      type={space.type}
                      className="h-3.5 w-3.5"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {space.name}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                      {t.home.items(
                        space.sections.reduce(
                          (acc, s) => acc + s.items.length,
                          0,
                        ),
                      )}
                    </p>
                  </div>
                <svg
                  className="h-3.5 w-3.5 flex-shrink-0 text-zinc-400 dark:text-zinc-500"
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
            ))}
          </div>
        </section>
        </main>
      </div>

      {locateResult && (
        <LocateItemSheet
          result={locateResult}
          onClose={closeLocateSheet}
        />
      )}
    </>
  );
}
