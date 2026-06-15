"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ItemCard from "@/components/ItemCard";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import { getAllSpaces, searchAll } from "@/lib/search";
import { useI18n } from "@/lib/i18n";

const spaces = getAllSpaces();

const TYPE_ICON: Record<string, string> = {
  cabinet: "🗄️",
  drawers: "🗂️",
  shelf: "📚",
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { t } = useI18n();

  const results = query.trim() ? searchAll(query) : [];

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 pb-12">
      {/* Header */}
      <header className="flex items-start justify-between pt-10 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Stashly
          </h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            {t.home.subtitle}
          </p>
        </div>
        <div className="mt-1 flex flex-col items-end gap-2">
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
          <Link
            href="/qr"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            {t.home.qrLink}
          </Link>
        </div>
      </header>

      {/* Sticky search bar */}
      <div className="sticky top-0 z-10 -mx-4 bg-slate-50/90 px-4 pb-3 pt-2 backdrop-blur-sm dark:bg-slate-900/90">
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div onKeyDown={handleKeyDown}>
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder={t.home.searchPlaceholder}
            autoFocus
          />
        </div>
      </div>

      {/* Content: search results or space cards */}
      {query.trim() ? (
        <section className="mt-4">
          {results.length > 0 ? (
            <>
              <p className="mb-2 text-sm text-slate-400">
                {t.home.results(results.length)}
              </p>
              <div className="flex flex-col gap-2">
                {results.slice(0, 5).map((r, i) => (
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
              {results.length > 5 && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}`}
                  className="mt-3 block text-center text-sm font-medium text-indigo-600 underline underline-offset-2"
                >
                  {t.home.seeAll(results.length)}
                </Link>
              )}
            </>
          ) : (
            <div className="mt-16 text-center">
              <p className="text-5xl">🔍</p>
              <p className="mt-4 text-lg font-semibold text-slate-700 dark:text-slate-300">
                {t.home.nothingFound}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {t.home.nothingFoundHint}
              </p>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            {t.home.spacesHeading}
          </h2>
          <div className="flex flex-col gap-3">
            {spaces.map((space) => (
              <Link key={space.id} href={`/space/${space.id}`}>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm transition-colors active:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:active:bg-slate-700">
                  <span className="text-3xl" role="img" aria-label={space.type}>
                    {TYPE_ICON[space.type] ?? "📦"}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">
                      {space.name}
                    </p>
                    <p className="text-sm text-slate-400">
                      {t.home.items(
                        space.sections.reduce(
                          (acc, s) => acc + s.items.length,
                          0,
                        ),
                      )}
                    </p>
                  </div>
                  <svg
                    className="ml-auto h-4 w-4 flex-shrink-0 text-slate-300 dark:text-slate-600"
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
      )}
    </div>
  );
}
