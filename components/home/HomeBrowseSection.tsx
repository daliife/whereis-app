"use client";

import Link from "next/link";
import SpaceIcon, { TYPE_COLOR_HOME } from "@/components/SpaceIcon";
import type { Space } from "@/lib/inventory";
import { useI18n } from "@/lib/i18n";
import { useHomeSearch } from "./HomeSearchContext";

interface Props {
  spaces: Space[];
}

export default function HomeBrowseSection({ spaces }: Props) {
  const { isSearching } = useHomeSearch();
  const { t } = useI18n();

  if (isSearching) return null;

  return (
    <section
      className="home-browse"
      aria-labelledby="home-browse-heading"
    >
      <header className="home-browse-header">
        <h2 id="home-browse-heading" className="home-browse-title">
          {t.home.browseHeading}
        </h2>
      </header>

      <div className="home-browse-grid">
        {spaces.map((space) => {
          const itemCount = space.sections.reduce(
            (acc, section) => acc + section.items.length,
            0,
          );

          return (
            <Link
              key={space.id}
              href={`/space/${space.id}`}
              className="card-focus-wrap list-item-optimized"
            >
              <div className="card-space">
                <div
                  className={`card-space-icon ${TYPE_COLOR_HOME[space.type] ?? "bg-zinc-100 text-zinc-500"}`}
                >
                  <SpaceIcon type={space.type} className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="card-kicker">{t.space.types[space.type]}</p>
                  <p className="card-title mt-0.5">{space.name}</p>
                  <p className="card-meta">{t.home.items(itemCount)}</p>
                </div>
                <svg
                  className="card-action-chevron"
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
          );
        })}
      </div>
    </section>
  );
}
