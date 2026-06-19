"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import ItemCard from "@/components/ItemCard";
import SettingsMenu from "@/components/SettingsMenu";
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

  const totalItems = spaces.reduce(
    (acc, space) =>
      acc +
      space.sections.reduce((sum, section) => sum + section.items.length, 0),
    0,
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="flex flex-col gap-4 pt-10 pb-7 sm:flex-row sm:items-start sm:justify-between lg:pt-12">
        <div>
          <div className="flex items-center gap-2.5">
            <AppIcon size={28} />
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 lg:text-3xl">
              Stashly
            </h1>
          </div>
          <p className="mt-0.5 pl-[38px] text-sm text-zinc-500 dark:text-zinc-400">
            {t.home.subtitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1 pt-0.5">
          <SettingsMenu />
          <div className="mx-1.5 h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
          <Link
            href="/qr"
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-zinc-500 transition-colors hover:bg-amber-50 hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-zinc-400 dark:hover:bg-amber-950/30 dark:hover:text-amber-300"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v6h-6v-2h4zM14 18h2v2h-2z"
              />
            </svg>
            {t.home.qrLink}
          </Link>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:items-start">
        <div className="lg:sticky lg:top-6">
          {/* Sticky search bar */}
          <div className="sticky top-0 z-10 -mx-4 bg-zinc-50/90 px-4 pb-3 pt-2 backdrop-blur-sm dark:bg-zinc-950/90 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:rounded-lg lg:border lg:border-zinc-100 lg:bg-white lg:p-4 lg:shadow-sm lg:backdrop-blur-none lg:dark:border-zinc-800 lg:dark:bg-zinc-900">
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div onKeyDown={handleKeyDown}>
              <SearchBar
                value={query}
                onChange={setQuery}
                placeholder={t.home.searchPlaceholder}
                clearLabel={t.common.clearSearch}
                autoFocus
              />
            </div>
          </div>

          {!query.trim() && (
            <div className="mt-4 hidden rounded-lg border border-zinc-100 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:block">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {spaces.length}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                    {t.home.statsSpaces}
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {totalItems}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
                    {t.home.statsItems}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content: search results or space cards */}
        {query.trim() ? (
          <section className="mt-4 lg:mt-0">
            {results.length > 0 ? (
              <>
                <p className="mb-3 text-xs font-medium text-zinc-400">
                  {t.home.results(results.length)}
                </p>
                <div className="grid gap-2 md:grid-cols-2">
                  {results.slice(0, 6).map((r, i) => (
                    <Link
                      key={`${r.space.id}-${r.section.id}-${r.item.name}-${i}`}
                      href={`/space/${r.space.id}?highlight=${encodeURIComponent(r.item.name)}`}
                      className="group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950"
                    >
                      <ItemCard
                        itemName={r.item.name}
                        spaceName={r.space.name}
                        sectionName={r.section.name}
                      />
                    </Link>
                  ))}
                </div>
                {results.length > 6 && (
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="mx-auto mt-4 flex w-fit rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950"
                  >
                    {t.home.seeAll(results.length)}
                  </Link>
                )}
              </>
            ) : (
              <div className="mt-20 text-center lg:mt-28">
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
          <section className="mt-4 lg:mt-0">
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-400">
              {t.home.spacesHeading}
            </p>
            <div className="grid gap-2 md:grid-cols-2">
              {spaces.map((space) => (
                <Link
                  key={space.id}
                  href={`/space/${space.id}`}
                  className="group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950"
                >
                  <div className="flex h-full items-center gap-3.5 rounded-lg border border-zinc-100 bg-white px-4 py-4 transition-all active:bg-zinc-50 group-hover:border-amber-200 group-hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:active:bg-zinc-800 dark:group-hover:border-amber-900/70 lg:px-5 lg:py-5">
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
    </div>
  );
}
