"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SearchStatus from "@/components/SearchStatus";
import ItemCard from "@/components/ItemCard";
import { searchAll } from "@/lib/fuse-search";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useI18n } from "@/lib/i18n";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebouncedValue(query, 200);

  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed) {
      router.replace(`/search?q=${encodeURIComponent(trimmed)}`, {
        scroll: false,
      });
    } else {
      router.replace("/search", { scroll: false });
    }
  }, [debouncedQuery, router]);

  const results = debouncedQuery.trim() ? searchAll(debouncedQuery) : [];
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-3xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
      {/* Header */}
      <header className="pb-4 pt-[max(1.5rem,env(safe-area-inset-top))] sm:pt-8 lg:pt-12">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          aria-label={t.search.back}
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {t.search.title}
        </h1>
      </header>

      <main id="main-content">
      {/* Sticky search bar */}
      <div className="sticky top-0 isolate z-20 -mx-4 bg-zinc-50 px-4 pb-3 pt-2 backdrop-blur-sm dark:bg-zinc-950 sm:-mx-6 sm:px-6">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={t.home.searchPlaceholder}
          clearLabel={t.common.clearSearch}
          autoFocus
        />
        <SearchStatus
          query={debouncedQuery}
          resultCount={results.length}
          resultsLabel={t.search.results}
          nothingFoundLabel={t.search.nothingFound}
        />
      </div>

      {/* Results */}
      <div className="mt-4 lg:mt-6">
        {!query.trim() ? (
          <p className="mt-10 text-center text-zinc-600 dark:text-zinc-400">
            {t.search.typeToSearch}
          </p>
        ) : results.length > 0 ? (
          <>
            <p className="mb-3 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {t.search.results(results.length)}
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {results.map((r, i) => (
                <Link
                  key={`${r.space.id}-${r.section.id}-${r.item.name}-${i}`}
                  href={`/space/${r.space.id}?highlight=${encodeURIComponent(r.item.name)}`}
                  className="group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950"
                >
                  <ItemCard
                    itemName={r.item.name}
                    spaceName={r.space.name}
                    sectionName={r.section.name}
                  />
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="py-10 text-center sm:mt-20">
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
              {t.search.nothingFound}
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {t.search.nothingFoundHint}
            </p>
          </div>
        )}
      </div>
      </main>
    </div>
  );
}
