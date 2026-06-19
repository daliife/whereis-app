"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { Section, Space } from "@/lib/inventory";
import { useI18n } from "@/lib/i18n";

interface Props {
  space: Space;
  highlightItemName?: string;
  /** Plan diagram only — for locate preview sheets */
  planOnly?: boolean;
  /** Smaller diagram for modals */
  compact?: boolean;
  /** Allow tapping sections on the diagram */
  interactive?: boolean;
  highlightItemRef?: RefObject<HTMLDivElement>;
}

export default function SpaceFloorPlan({
  space,
  highlightItemName,
  planOnly = false,
  compact = false,
  interactive = true,
  highlightItemRef,
}: Props) {
  const { t } = useI18n();
  const normalizedHighlight = highlightItemName?.toLowerCase() ?? "";

  const autoSection = normalizedHighlight
    ? (space.sections.find((section) =>
        section.items.some(
          (item) => item.name.toLowerCase() === normalizedHighlight,
        ),
      )?.id ?? null)
    : null;

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    autoSection ?? space.sections[0]?.id ?? null,
  );
  const activeRef = useRef<HTMLButtonElement>(null);

  const isDrawers = space.type === "drawers";
  const topSections = isDrawers
    ? []
    : space.sections.filter((section) => isAboveCabinet(section));
  const bodySections = isDrawers
    ? space.sections
    : space.sections.filter((section) => !isAboveCabinet(section));
  const selectedSection =
    space.sections.find((section) => section.id === selectedSectionId) ??
    space.sections[0];

  useEffect(() => {
    if (autoSection) {
      setSelectedSectionId(autoSection);
    }
  }, [autoSection]);

  useEffect(() => {
    if (autoSection && activeRef.current) {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      activeRef.current.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center",
      });
    }
  }, [autoSection]);

  return (
    <div className="flex flex-col gap-5" aria-label={space.name}>
      <div
        className={
          compact
            ? ""
            : "panel-elevated p-4"
        }
      >
        <div
          className={[
            "mx-auto flex w-full flex-col",
            compact ? "max-w-sm gap-1.5" : "max-w-sm gap-2",
            isDrawers ? "gap-1.5" : "gap-2",
          ].join(" ")}
        >
          {topSections.length > 0 && (
            <div className="rounded-lg border border-dashed border-amber-200/50 bg-amber-50/30 p-2 dark:border-amber-500/15 dark:bg-amber-950/15">
              {topSections.map((section) => (
                <PlanSectionButton
                  key={section.id}
                  section={section}
                  selected={selectedSectionId === section.id}
                  highlighted={sectionHasHighlight(
                    section,
                    normalizedHighlight,
                  )}
                  shape="top"
                  onClick={
                    interactive
                      ? () => setSelectedSectionId(section.id)
                      : undefined
                  }
                  refProp={
                    sectionHasHighlight(section, normalizedHighlight)
                      ? activeRef
                      : undefined
                  }
                  itemsLabel={t.home.items(section.items.length)}
                />
              ))}
            </div>
          )}

          <div
            className={[
              "relative overflow-hidden border bg-amber-50/20 shadow-inner shadow-amber-500/5 dark:bg-zinc-950/40 dark:shadow-amber-500/5",
              isDrawers
                ? "rounded-lg border-amber-200/40 p-2 dark:border-amber-500/15"
                : "rounded-t-lg rounded-b-md border-amber-200/50 p-2 dark:border-amber-500/20",
            ].join(" ")}
          >
            <div
              className={[
                "relative flex flex-col gap-1.5",
                isDrawers
                  ? compact
                    ? "min-h-[220px]"
                    : "min-h-[280px]"
                  : compact
                    ? "min-h-[260px]"
                    : "min-h-[320px]",
              ].join(" ")}
            >
              {bodySections.map((section) => {
                const hasHighlight = sectionHasHighlight(
                  section,
                  normalizedHighlight,
                );

                return (
                  <PlanSectionButton
                    key={section.id}
                    section={section}
                    selected={selectedSectionId === section.id}
                    highlighted={hasHighlight}
                    shape={
                      isDrawers
                        ? "drawer"
                        : isFloorSection(section)
                          ? "floor"
                          : "shelf"
                    }
                    onClick={
                      interactive
                        ? () => setSelectedSectionId(section.id)
                        : undefined
                    }
                    refProp={hasHighlight ? activeRef : undefined}
                    itemsLabel={t.home.items(section.items.length)}
                  />
                );
              })}
            </div>
          </div>

          {!isDrawers && !compact && (
            <div
              className="mx-auto grid w-[86%] grid-cols-2 gap-24 px-5"
              aria-hidden="true"
            >
              <div className="h-3 rounded-b bg-amber-300/70 dark:bg-amber-700/40" />
              <div className="h-3 rounded-b bg-amber-300/70 dark:bg-amber-700/40" />
            </div>
          )}
        </div>
      </div>

      {!planOnly && selectedSection && (
        <SectionItemsList
          section={selectedSection}
          normalizedHighlight={normalizedHighlight}
          highlightItemRef={highlightItemRef}
        />
      )}
    </div>
  );
}

function SectionItemsList({
  section,
  normalizedHighlight,
  highlightItemRef,
}: {
  section: Section;
  normalizedHighlight: string;
  highlightItemRef?: RefObject<HTMLDivElement>;
}) {
  const { t } = useI18n();

  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-2">
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {section.name}
        </h2>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          {t.home.items(section.items.length)}
        </p>
      </div>

      <ul className="flex flex-col gap-1.5">
        {section.items.map((item, itemIndex) => {
          const isHighlighted =
            item.name.toLowerCase() === normalizedHighlight;
          const ref =
            isHighlighted && highlightItemRef ? highlightItemRef : undefined;

          return (
            <li key={`${section.id}-${item.name}-${itemIndex}`}>
              <div
                ref={ref}
                className={[
                  "flex items-center gap-3 rounded-lg border px-3 py-2.5",
                  isHighlighted
                    ? "border-amber-400/60 border-l-[3px] border-l-amber-500 bg-amber-50/60 pl-[calc(0.75rem-2px)] dark:border-amber-600/50 dark:bg-amber-950/20"
                    : "border-zinc-200/80 bg-white dark:border-zinc-800 dark:bg-zinc-900",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md",
                    isHighlighted
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                  ].join(" ")}
                >
                  <ItemIcon />
                </span>
                <span
                  className={[
                    "min-w-0 flex-1 text-sm leading-snug",
                    isHighlighted
                      ? "font-medium text-zinc-900 dark:text-zinc-100"
                      : "text-zinc-700 dark:text-zinc-300",
                  ].join(" ")}
                >
                  {item.name}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ItemIcon() {
  return (
    <svg
      className="h-3.5 w-3.5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  );
}

function PlanSectionButton({
  section,
  selected,
  highlighted,
  shape,
  onClick,
  refProp,
  itemsLabel,
}: {
  section: Section;
  selected: boolean;
  highlighted: boolean;
  shape: "drawer" | "floor" | "shelf" | "top";
  onClick?: () => void;
  refProp?: RefObject<HTMLButtonElement | HTMLDivElement>;
  itemsLabel: string;
}) {
  const isDrawer = shape === "drawer";
  const isFloor = shape === "floor";
  const Tag = onClick ? "button" : "div";
  const isStatic = !onClick;

  return (
    <Tag
      ref={refProp as RefObject<HTMLButtonElement & HTMLDivElement>}
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={[
        isStatic
          ? "flex w-full items-center gap-3 text-left"
          : "group flex w-full items-center gap-3 text-left transition-colors",
        onClick
          ? "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          : "",
        isDrawer || isFloor ? "min-h-[64px]" : "min-h-[58px]",
        isDrawer
          ? "rounded-md border px-3 py-3 shadow-sm"
          : isFloor
            ? "rounded-md border px-3 py-2.5"
            : shape === "top"
              ? "rounded-md border px-3 py-2.5"
              : "rounded-sm border px-3 py-3",
        selected || highlighted
          ? "border-amber-300 bg-amber-50 text-amber-900 shadow-sm ring-1 ring-amber-300 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200 dark:ring-amber-700"
          : isStatic
            ? "border-zinc-200 bg-zinc-100 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300"
            : "border-zinc-200 bg-white text-zinc-800 hover:border-amber-200 hover:bg-amber-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-amber-900 dark:hover:bg-amber-950/10",
      ].join(" ")}
      aria-pressed={onClick ? selected : undefined}
    >
      <span
        className={[
          "flex flex-shrink-0 items-center justify-center rounded text-[11px] font-bold tabular-nums",
          isDrawer ? "h-6 w-8" : "h-6 w-6",
          selected || highlighted
            ? "bg-amber-200 text-amber-900 dark:bg-amber-800 dark:text-amber-100"
            : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
        ].join(" ")}
      >
        {sectionNumber(section.name)}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold leading-snug">
          {section.name}
        </span>
        <span className="mt-0.5 block text-xs text-zinc-600 dark:text-zinc-400">{itemsLabel}</span>
      </span>

      {isDrawer && (
        <span
          className={[
            "h-1.5 w-10 flex-shrink-0 rounded-full",
            selected || highlighted
              ? "bg-amber-300 dark:bg-amber-700"
              : isStatic
                ? "bg-zinc-200 dark:bg-zinc-700"
                : "bg-zinc-200 group-hover:bg-amber-200 dark:bg-zinc-700 dark:group-hover:bg-amber-900",
          ].join(" ")}
          aria-hidden="true"
        />
      )}
    </Tag>
  );
}

function sectionHasHighlight(section: Section, normalizedHighlight: string) {
  return section.items.some(
    (item) => item.name.toLowerCase() === normalizedHighlight,
  );
}

function isAboveCabinet(section: Section) {
  const label = `${section.id} ${section.name}`.toLowerCase();
  return label.includes("sobre");
}

function isFloorSection(section: Section) {
  const label = `${section.id} ${section.name}`.toLowerCase();
  return label.includes("terra");
}

function sectionNumber(name: string) {
  const match = name.match(/\d+/);
  if (match) return match[0];
  return name.slice(0, 1).toUpperCase();
}
