"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ItemCard from "@/components/ItemCard";
import SpaceFloorPlan from "@/components/SpaceFloorPlan";
import type { Space } from "@/lib/search";
import { searchWithinSpace } from "@/lib/search";
import { useI18n } from "@/lib/i18n";

const TYPE_ICON: Record<string, string> = {
  cabinet: "🗄️",
  drawers: "🗂️",
  shelf: "📚",
};

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
          className="text-sm text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
        >
          {t.space.back}
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-3xl" role="img" aria-label={space.type}>
            {TYPE_ICON[space.type] ?? "📦"}
          </span>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {space.name}
            </h1>
            <p className="text-sm capitalize text-slate-400">{space.type}</p>
          </div>
        </div>
      </header>

      {/* Sticky search bar */}
      <div className="sticky top-0 z-10 -mx-4 bg-slate-50/90 px-4 pb-3 pt-2 backdrop-blur-sm dark:bg-slate-900/90">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={t.space.searchPlaceholder(space.name)}
        />
        {/* View toggle — only visible when not searching */}
        {!query.trim() && (
          <div className="mt-2 flex justify-center gap-1">
            <button
              onClick={() => setView("list")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                view === "list"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              }`}
            >
              ☰ {t.space.listView}
            </button>
            <button
              onClick={() => setView("plan")}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                view === "plan"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
              }`}
            >
              ⊞ {t.space.planView}
            </button>
          </div>
        )}
        {query.trim() && (
          <div className="mt-2 text-center">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className="text-sm font-medium text-indigo-600"
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
            <div className="mt-16 text-center">
              <p className="text-5xl">🔍</p>
              <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
                {t.space.nothingFoundHere}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {t.space.nothingFoundHint}{" "}
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="font-medium text-indigo-600"
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
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
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
