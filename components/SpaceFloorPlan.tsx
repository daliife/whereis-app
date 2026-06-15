"use client";

import { useEffect, useRef, useState } from "react";
import type { Space } from "@/lib/search";
import { useI18n } from "@/lib/i18n";

interface Props {
  space: Space;
  highlightItemName?: string;
}

export default function SpaceFloorPlan({ space, highlightItemName }: Props) {
  const { t } = useI18n();
  const normalizedHighlight = highlightItemName?.toLowerCase() ?? "";

  // Auto-expand the section that contains the highlighted item
  const autoSection = normalizedHighlight
    ? (space.sections.find((s) =>
        s.items.some((i) => i.name.toLowerCase() === normalizedHighlight),
      )?.id ?? null)
    : null;

  const [expanded, setExpanded] = useState<string | null>(autoSection);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (autoSection && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [autoSection]);

  const isDrawers = space.type === "drawers";

  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
      role="list"
      aria-label={space.name}
    >
      {space.sections.map((section, idx) => {
        const isExp = expanded === section.id;
        const hasHighlight = section.items.some(
          (i) => i.name.toLowerCase() === normalizedHighlight,
        );

        return (
          <div key={section.id} role="listitem">
            {/* Section header row — acts as the visual shelf/drawer front */}
            <button
              ref={hasHighlight ? activeRef : undefined}
              onClick={() => setExpanded(isExp ? null : section.id)}
              className={[
                "flex w-full items-center gap-3 px-4 py-4 text-left transition-colors",
                idx > 0
                  ? "border-t border-slate-100 dark:border-slate-700/60"
                  : "",
                hasHighlight
                  ? "bg-amber-50 dark:bg-amber-900/20"
                  : isExp
                    ? "bg-slate-50 dark:bg-slate-700"
                    : "hover:bg-slate-50 active:bg-slate-100 dark:hover:bg-slate-700 dark:active:bg-slate-600",
              ].join(" ")}
              aria-expanded={isExp}
            >
              {/* Physical decoration: drawer handle vs shelf label */}
              <span className="flex w-6 flex-shrink-0 flex-col items-center gap-[3px]">
                {isDrawers ? (
                  // Three horizontal lines = drawer handle
                  <>
                    <span className="block h-px w-5 rounded-full bg-slate-400 dark:bg-slate-500" />
                    <span className="block h-px w-5 rounded-full bg-slate-400 dark:bg-slate-500" />
                    <span className="block h-px w-5 rounded-full bg-slate-400 dark:bg-slate-500" />
                  </>
                ) : (
                  // Shelf letter label (A, B, C…)
                  <span className="text-[10px] font-bold uppercase leading-none text-slate-400 dark:text-slate-500">
                    {String.fromCharCode(65 + idx)}
                  </span>
                )}
              </span>

              {/* Section name + item count */}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm font-semibold leading-snug ${
                    hasHighlight
                      ? "text-amber-800 dark:text-amber-300"
                      : "text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {section.name}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  {t.home.items(section.items.length)}
                </p>
              </div>

              {/* Count badge */}
              <span
                className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${
                  hasHighlight
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                }`}
              >
                {section.items.length}
              </span>

              {/* Expand/collapse chevron */}
              <svg
                className={`h-4 w-4 flex-shrink-0 text-slate-300 transition-transform duration-200 dark:text-slate-600 ${
                  isExp ? "rotate-90" : ""
                }`}
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
            </button>

            {/* Expanded: item list inside the shelf/drawer */}
            {isExp && (
              <div
                className={`border-t border-slate-100 px-4 pb-4 pt-3 dark:border-slate-700/60 ${
                  hasHighlight
                    ? "bg-amber-50/40 dark:bg-amber-900/10"
                    : "bg-slate-50/60 dark:bg-slate-900/30"
                }`}
              >
                <div className="flex flex-col gap-1.5">
                  {section.items.map((item) => {
                    const isHighlighted =
                      item.name.toLowerCase() === normalizedHighlight;
                    return (
                      <div
                        key={item.name}
                        className={`rounded-xl px-3 py-2.5 text-sm leading-snug ${
                          isHighlighted
                            ? "border border-amber-300 bg-amber-100 font-semibold text-amber-900 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                            : "border border-slate-100 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {item.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
