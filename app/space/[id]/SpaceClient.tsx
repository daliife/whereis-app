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

  return (
    <div className="mx-auto max-w-lg px-4 pb-12">
      {/* Header */}
      <header className="pt-8 pb-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
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
        <div className="mt-2 flex items-center gap-3">
          <div
            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${TYPE_COLOR[space.type] ?? "bg-zinc-100 text-zinc-500"}`}
          >
            <SpaceIcon type={space.type} className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {space.name}
            </h1>
            <p className="text-sm capitalize text-zinc-400">{space.type}</p>
          </div>
        </div>
      </header>

      {/* Sticky search bar */}
      <div className="sticky top-0 z-10 -mx-4 bg-zinc-50/90 px-4 pb-3 pt-2 backdrop-blur-sm dark:bg-zinc-950/90">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={t.space.searchPlaceholder(space.name)}
        />
        {/* View toggle — only visible when not searching */}
        {!query.trim() && (
          <div className="mt-2 flex rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-800">
            <button
              onClick={() => setView("list")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-all ${
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
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-all ${
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
          <div className="mt-2 text-center">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className="text-sm font-medium text-amber-600 dark:text-amber-400"
            >
              {t.space.searchEverywhereBtn}
            </Link>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mt-4">
        {localResults ? (
          // Local search results
          localResults.length > 0 ? (
            <div className="flex flex-col gap-2">
              {localResults.map((r, i) => (
                <ItemCard
                  key={i}
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
          <SpaceFloorPlan
            space={space}
            highlightItemName={highlightItem || undefined}
          />
        ) : (
          // List view
          space.sections.map((section) => (
            <div key={section.id} className="mb-8">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-400">
                {section.name}
              </h2>
              <div className="flex flex-col gap-2">
                {section.items.map((item) => {
                  const isHighlighted =
                    highlightItem.toLowerCase() === item.name.toLowerCase();
                  return (
                    <div
                      key={item.name}
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
          ))
        )}
      </div>
    </div>
  );
}
