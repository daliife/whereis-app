"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import SearchField from "@/components/SearchField";
import SearchStatus from "@/components/SearchStatus";
import SearchResultsList from "@/components/SearchResultsList";
import { searchAll } from "@/lib/fuse-search";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useI18n } from "@/lib/i18n";
import { useHomeSearch } from "./HomeSearchContext";

const LocateItemSheet = dynamic(() => import("@/components/LocateItemSheet"), {
  ssr: false,
});

const AboutSheet = dynamic(() => import("@/components/AboutSheet"), {
  ssr: false,
});

export default function HomeSearchSection() {
  const {
    query,
    setQuery,
    isSearching,
    locateResult,
    setLocateResult,
    aboutOpen,
    setAboutOpen,
  } = useHomeSearch();
  const debouncedQuery = useDebouncedValue(query, 200);
  const { t } = useI18n();

  const results = debouncedQuery.trim() ? searchAll(debouncedQuery) : [];

  useEffect(() => {
    setLocateResult(null);
  }, [query, setLocateResult]);

  return (
    <>
      <section className="home-primary" aria-labelledby="home-search-heading">
        <header className="home-primary-header">
          <h2 id="home-search-heading" className="home-primary-title">
            {t.home.searchHeading}
          </h2>
        </header>

        <div className="home-primary-field">
          <SearchField
            value={query}
            onChange={setQuery}
            label={t.common.searchLabel}
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
              itemTagsLabel={t.home.itemTags}
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

      {aboutOpen && <AboutSheet onClose={() => setAboutOpen(false)} />}

      {locateResult && (
        <LocateItemSheet
          result={locateResult}
          onClose={() => setLocateResult(null)}
        />
      )}
    </>
  );
}
