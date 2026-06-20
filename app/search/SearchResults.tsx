"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import SearchStatus from "@/components/SearchStatus";
import SearchResultsList from "@/components/SearchResultsList";
import PageHeader from "@/components/PageHeader";
import { searchAll } from "@/lib/fuse-search";
import type { SearchResult } from "@/lib/inventory";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useI18n } from "@/lib/i18n";

const LocateItemSheet = dynamic(
  () => import("@/components/LocateItemSheet"),
  { ssr: false },
);

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [locateResult, setLocateResult] = useState<SearchResult | null>(null);
  const debouncedQuery = useDebouncedValue(query, 200);
  const { t } = useI18n();

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

  useEffect(() => {
    setLocateResult(null);
  }, [query]);

  const results = debouncedQuery.trim() ? searchAll(debouncedQuery) : [];
  const closeLocateSheet = useCallback(() => setLocateResult(null), []);

  return (
    <>
      <div className="page-shell">
        <PageHeader title={t.search.title} backLabel={t.search.back} />

        <main id="main-content" className="mt-4">
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

          <div className="mt-4">
            {!query.trim() ? (
              <p className="mt-10 text-center text-sm text-zinc-500 dark:text-zinc-400">
                {t.search.typeToSearch}
              </p>
            ) : (
              <SearchResultsList
                results={results}
                selectedResult={locateResult}
                onSelect={setLocateResult}
                locateLabel={t.home.locate}
                nothingFoundTitle={t.search.nothingFound}
                nothingFoundHint={t.search.nothingFoundHint}
              />
            )}
          </div>
        </main>
      </div>

      {locateResult && (
        <LocateItemSheet result={locateResult} onClose={closeLocateSheet} />
      )}
    </>
  );
}
