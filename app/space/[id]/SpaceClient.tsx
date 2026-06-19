"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SearchStatus from "@/components/SearchStatus";
import ItemCard from "@/components/ItemCard";
import SpaceFloorPlan from "@/components/SpaceFloorPlan";
import SpaceIcon, { TYPE_COLOR } from "@/components/SpaceIcon";
import type { Space } from "@/lib/inventory";
import { searchWithinSpace } from "@/lib/fuse-search";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { useI18n } from "@/lib/i18n";

export default function SpaceClient({ space }: { space: Space }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const highlightItem = searchParams.get("highlight") ?? "";
  const [query, setQuery] = useState("");
  const highlightRef = useRef<HTMLDivElement>(null);

  function locateItem(itemName: string) {
    setQuery("");
    router.replace(
      `/space/${space.id}?highlight=${encodeURIComponent(itemName)}`,
      { scroll: false },
    );
  }

  const debouncedQuery = useDebouncedValue(query, 200);

  useEffect(() => {
    if (!highlightItem || query.trim()) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const frame = requestAnimationFrame(() => {
      highlightRef.current?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [highlightItem, query]);

  const localResults = debouncedQuery.trim()
    ? searchWithinSpace(space.id, debouncedQuery)
    : null;
  const { t } = useI18n();

  const itemCount = space.sections.reduce(
    (acc, section) => acc + section.items.length,
    0,
  );

  return (
    <div className="mx-auto max-w-3xl pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-6 lg:max-w-4xl lg:px-8">
      <div className="sticky top-0 isolate z-20 border-b border-zinc-100 bg-zinc-50 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950 sm:top-4 sm:mx-0 sm:mt-4 sm:rounded-lg sm:border sm:bg-white sm:shadow-sm sm:dark:bg-zinc-900 lg:top-6">
        <div className="flex items-center gap-2 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-4 sm:pt-3">
          <Link
            href="/"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label={t.space.back}
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
          <div
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md ${TYPE_COLOR[space.type] ?? "bg-zinc-100 text-zinc-500"}`}
          >
            <SpaceIcon type={space.type} className="h-3.5 w-3.5" />
          </div>
          <h1 className="min-w-0 flex-1 truncate text-base font-bold text-zinc-900 dark:text-zinc-100 sm:text-lg">
            {space.name}
          </h1>
          <span className="flex-shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 sm:px-2.5 sm:py-1 sm:text-xs">
            {t.home.items(itemCount)}
          </span>
        </div>

        <div className="px-4 pb-3 sm:px-4">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={t.space.searchPlaceholder(space.name)}
            clearLabel={t.common.clearSearch}
          />
        </div>

        {query.trim() && (
          <div className="px-4 pb-3 text-center">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className="inline-flex rounded-lg px-2 py-1 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-amber-400 dark:hover:bg-amber-950/30"
            >
              {t.space.searchEverywhereBtn}
            </Link>
          </div>
        )}
      </div>

      <main id="main-content" className="relative z-0 mt-4 px-4 sm:px-0 lg:mt-6">
        <SearchStatus
          query={debouncedQuery}
          resultCount={localResults?.length ?? 0}
          resultsLabel={t.home.results}
          nothingFoundLabel={t.space.nothingFoundHere}
        />
        {localResults ? (
          localResults.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {localResults.map((r, i) => (
                <button
                  key={`${r.space.id}-${r.section.id}-${r.item.name}-${i}`}
                  type="button"
                  onClick={() => locateItem(r.item.name)}
                  className="group block w-full rounded-lg text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950"
                >
                  <ItemCard
                    itemName={r.item.name}
                    spaceName={r.space.name}
                    sectionName={r.section.name}
                  />
                </button>
              ))}
            </div>
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
                {t.space.nothingFoundHere}
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {t.space.nothingFoundHint}{" "}
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="font-medium text-amber-800 dark:text-amber-400"
                >
                  {t.space.searchEverywhereLink}
                </Link>
              </p>
            </div>
          )
        ) : (
          <SpaceFloorPlan
            space={space}
            highlightItemName={highlightItem || undefined}
            highlightItemRef={highlightRef}
          />
        )}
      </main>
    </div>
  );
}
