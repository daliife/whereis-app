"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ItemCard from "@/components/ItemCard";
import SpaceFloorPlan from "@/components/SpaceFloorPlan";
import SpaceIcon, { TYPE_COLOR } from "@/components/SpaceIcon";
import type { Space } from "@/lib/search";
import { searchWithinSpace } from "@/lib/search";
import { useI18n } from "@/lib/i18n";

export default function SpaceClient({ space }: { space: Space }) {
  const searchParams = useSearchParams();
  const highlightItem = searchParams.get("highlight") ?? "";
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "plan">("plan");
  const highlightRef = useRef<HTMLDivElement>(null);

  // Scroll to highlighted item after hydration
  useEffect(() => {
    if (highlightItem && highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightItem]);

  const localResults = query.trim() ? searchWithinSpace(space.id, query) : null;
  const { t } = useI18n();

  const itemCount = space.sections.reduce(
    (acc, section) => acc + section.items.length,
    0,
  );

  return (
    <div className="mx-auto max-w-6xl px-0 pb-12 sm:px-6 lg:px-8">
      {/* ── Sticky nav: back + title + search + toggle ── */}
      <div className="sticky top-0 z-10 border-b border-zinc-100 bg-zinc-50/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95 sm:top-4 sm:mt-4 sm:rounded-lg sm:border sm:bg-white sm:shadow-sm sm:dark:bg-zinc-900 lg:top-6">
        {/* Title row */}
        <div className="flex items-center gap-2 px-3 pt-3 pb-2 sm:px-4">
          <Link
            href="/"
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
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
          <h1 className="flex-1 truncate text-base font-bold text-zinc-900 dark:text-zinc-100 lg:text-lg">
            {space.name}
          </h1>
          <span className="hidden rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 sm:inline-flex">
            {t.home.items(itemCount)}
          </span>
        </div>

        {/* Sticky search bar */}
        {/* Search bar */}
        <div className="px-3 pb-2 sm:px-4">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={t.space.searchPlaceholder(space.name)}
            clearLabel={t.common.clearSearch}
          />
        </div>
        {/* View toggle — only visible when not searching */}
        {!query.trim() && (
          <div className="mx-3 mb-2 flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800 sm:mx-4 sm:max-w-sm">
            <button
              onClick={() => setView("list")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                view === "list"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
              }`}
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                aria-hidden="true"
              >
                <line x1="2" y1="4" x2="14" y2="4" />
                <line x1="2" y1="8" x2="14" y2="8" />
                <line x1="2" y1="12" x2="14" y2="12" />
              </svg>
              {t.space.listView}
            </button>
            <button
              onClick={() => setView("plan")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                view === "plan"
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400"
              }`}
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="5" height="5" rx="1" />
                <rect x="9" y="2" width="5" height="5" rx="1" />
                <rect x="2" y="9" width="5" height="5" rx="1" />
                <rect x="9" y="9" width="5" height="5" rx="1" />
              </svg>
              {t.space.planView}
            </button>
          </div>
        )}
        {query.trim() && (
          <div className="px-3 pb-2 text-center">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className="inline-flex rounded-lg px-2 py-1 text-sm font-semibold text-amber-600 transition-colors hover:bg-amber-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-amber-400 dark:hover:bg-amber-950/30"
            >
              {t.space.searchEverywhereBtn}
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 px-4 sm:px-0 lg:mt-6">
        {localResults ? (
          // Local search results
          localResults.length > 0 ? (
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {localResults.map((r, i) => (
                <ItemCard
                  key={`${r.space.id}-${r.section.id}-${r.item.name}-${i}`}
                  itemName={r.item.name}
                  spaceName={r.space.name}
                  sectionName={r.section.name}
                />
              ))}
            </div>
          ) : (
            <div className="mt-20 text-center">
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
              <p className="mt-1 text-sm text-slate-400">
                {t.space.nothingFoundHint}{" "}
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="font-medium text-amber-600 dark:text-amber-400"
                >
                  {t.space.searchEverywhereLink}
                </Link>
              </p>
            </div>
          )
        ) : // No active search: list or plan view
        view === "plan" ? (
          <div className="lg:max-w-5xl">
            <SpaceFloorPlan
              space={space}
              highlightItemName={highlightItem || undefined}
            />
          </div>
        ) : (
          // List view
          <div className="grid gap-y-8 lg:max-w-2xl">
            {space.sections.map((section) => (
              <div key={section.id}>
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  {section.name}
                </h2>
                <div className="flex flex-col gap-2">
                  {section.items.map((item, itemIndex) => {
                    const isHighlighted =
                      highlightItem.toLowerCase() === item.name.toLowerCase();
                    return (
                      <div
                        key={`${section.id}-${item.name}-${itemIndex}`}
                        ref={isHighlighted ? highlightRef : undefined}
                      >
                        <ItemCard
                          itemName={item.name}
                          spaceName={space.name}
                          sectionName={section.name}
                          highlighted={isHighlighted}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
