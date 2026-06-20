"use client";

import { useSyncExternalStore } from "react";
import {
  getRecentSearchesSnapshot,
  subscribeRecentSearches,
} from "@/lib/recent-searches";
import { useI18n } from "@/lib/i18n";

interface Props {
  onSelect: (query: string) => void;
  hidden?: boolean;
}

export default function RecentSearches({ onSelect, hidden = false }: Props) {
  const { t } = useI18n();
  const searches = useSyncExternalStore(
    subscribeRecentSearches,
    getRecentSearchesSnapshot,
    () => [],
  );

  if (hidden || searches.length === 0) return null;

  return (
    <div className="mt-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
        {t.search.recentSearches}
      </p>
      <ul className="mt-1.5 flex flex-wrap gap-1.5">
        {searches.map((query) => (
          <li key={query}>
            <button
              type="button"
              onClick={() => onSelect(query)}
              className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-raised))] px-2.5 py-1 text-xs font-medium text-zinc-700 transition-colors hover:border-[rgb(var(--brand-border)/0.55)] hover:bg-[rgb(var(--brand-soft)/0.35)] dark:text-zinc-300"
            >
              {query}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
