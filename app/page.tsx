"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ItemCard from "@/components/ItemCard";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import ThemeToggle from "@/components/ThemeToggle";
import AppIcon from "@/components/AppIcon";
import SpaceIcon, { TYPE_COLOR } from "@/components/SpaceIcon";
import { getAllSpaces, searchAll } from "@/lib/search";
import { useI18n } from "@/lib/i18n";

const spaces = getAllSpaces();

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
      <header className="flex items-start justify-between pt-10 pb-7">
        <div>
          <div className="flex items-center gap-2.5">
            <AppIcon size={28} />
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Stashly
            </h1>
          </div>
          <p className="mt-0.5 pl-[38px] text-sm text-zinc-500 dark:text-zinc-400">
            {t.home.subtitle}
          </p>
        </div>
        <div className="flex items-center gap-0.5 pt-0.5">
          <ThemeToggle />
          <LocaleSwitcher />
          <div className="mx-1.5 h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
          <Link
            href="/qr"
            className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          >
            {t.home.qrLink}
          </Link>
        </div>
      </header>

      {/* Sticky search bar */}
      <div className="sticky top-0 z-10 -mx-4 bg-zinc-50/90 px-4 pb-3 pt-2 backdrop-blur-sm dark:bg-zinc-950/90">
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
              <p className="mb-3 text-xs font-medium text-zinc-400">
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
                  className="mt-4 block text-center text-sm font-medium text-amber-600 dark:text-amber-400"
                >
                  {t.home.seeAll(results.length)}
                </Link>
              )}
            </>
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
                {t.home.nothingFound}
              </p>
              <p className="mt-1 text-sm text-zinc-400">
                {t.home.nothingFoundHint}
              </p>
            </div>
          )}
        </section>
      ) : (
        <section className="mt-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-400">
            {t.home.spacesHeading}
          </p>
          <div className="flex flex-col gap-2">
            {spaces.map((space) => (
              <Link key={space.id} href={`/space/${space.id}`}>
                <div className="flex items-center gap-3.5 rounded-xl border border-zinc-100 bg-white px-4 py-4 transition-colors active:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:active:bg-zinc-800">
                  <div
                    className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${TYPE_COLOR[space.type] ?? "bg-slate-100 text-slate-500"}`}
                  >
                    <SpaceIcon
                      type={space.type}
                      className="h-[18px] w-[18px]"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {space.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {t.home.items(
                        space.sections.reduce(
                          (acc, s) => acc + s.items.length,
                          0,
                        ),
                      )}
                    </p>
                  </div>
                  <svg
                    className="h-4 w-4 flex-shrink-0 text-zinc-200 dark:text-zinc-700"
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
