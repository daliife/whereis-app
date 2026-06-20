"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SearchStatus from "@/components/SearchStatus";
import ItemCard from "@/components/ItemCard";
import EmptyState from "@/components/EmptyState";
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

  function handleSectionSelect(sectionId: string) {
    if (!highlightItem) return;

    const highlightSection = space.sections.find((section) =>
      section.items.some(
        (item) => item.name.toLowerCase() === highlightItem.toLowerCase(),
      ),
    );

    if (highlightSection?.id !== sectionId) {
      router.replace(`/space/${space.id}`, { scroll: false });
    }
  }

  return (
    <div className="page-shell page-shell--wide page-shell--flush-x">
      <div className="page-toolbar">
        <div className="flex items-center gap-2 px-4 pb-2 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <Link
            href="/"
            className="btn-toolbar-icon flex-shrink-0"
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
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${TYPE_COLOR[space.type] ?? "bg-zinc-100 text-zinc-500"}`}
          >
            <SpaceIcon type={space.type} className="h-5 w-5" />
          </div>
          <h1 className="page-header-title min-w-0 flex-1 truncate">
            {space.name}
          </h1>
          <span className="badge-neutral">
            {t.home.items(itemCount)}
          </span>
        </div>

        <div className="px-4 pb-3">
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
              className="btn-text-link-underline"
            >
              {t.space.searchEverywhereBtn}
            </Link>
          </div>
        )}
      </div>

      <main id="main-content" className="mt-4 px-4 sm:px-0">
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
                  className="card-focus-wrap list-item-optimized"
                >
                  <ItemCard
                    itemName={r.item.name}
                    tags={r.item.tags}
                    spaceName={r.space.name}
                    sectionName={r.section.name}
                    embedded
                    showAction
                    locateLabel={t.home.locate}
                  />
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              title={t.space.nothingFoundHere}
              hint={
                <>
                  {t.space.nothingFoundHint}{" "}
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="btn-text-link-underline"
                  >
                    {t.space.searchEverywhereLink}
                  </Link>
                </>
              }
            />
          )
        ) : (
          <SpaceFloorPlan
            space={space}
            highlightItemName={highlightItem || undefined}
            highlightItemRef={highlightRef}
            onSectionSelect={handleSectionSelect}
          />
        )}
      </main>
    </div>
  );
}
