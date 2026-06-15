"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ItemCard from "@/components/ItemCard";
import { searchAll } from "@/lib/search";
import { useI18n } from "@/lib/i18n";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);

  // Keep URL in sync as the user types
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed) {
      router.replace(`/search?q=${encodeURIComponent(trimmed)}`, {
        scroll: false,
      });
    } else {
      router.replace("/search", { scroll: false });
    }
  }, [query, router]);

  const results = query.trim() ? searchAll(query) : [];
  const { t } = useI18n();

  return (
    <div className="mx-auto max-w-lg px-4 pb-12">
      {/* Header */}
      <header className="pt-8 pb-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
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

      {/* Sticky search bar */}
      <div className="sticky top-0 z-10 -mx-4 bg-zinc-50/90 px-4 pb-3 pt-2 backdrop-blur-sm dark:bg-zinc-950/90">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={t.home.searchPlaceholder}
          autoFocus
        />
      </div>

      {/* Results */}
      <div className="mt-4">
        {!query.trim() ? (
          <p className="mt-10 text-center text-slate-400">
            {t.search.typeToSearch}
          </p>
        ) : results.length > 0 ? (
          <>
            <p className="mb-3 text-xs font-medium text-zinc-400">
              {t.search.results(results.length)}
            </p>
            <div className="flex flex-col gap-2">
              {results.map((r, i) => (
                <Link
                  key={i}
                  href={`/space/${r.space.id}?highlight=${encodeURIComponent(r.item.name)}`}
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
          <div className="mt-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <svg
                className="h-6 w-6 text-slate-400"
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
            <p className="mt-1 text-sm text-slate-400">
              {t.search.nothingFoundHint}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
