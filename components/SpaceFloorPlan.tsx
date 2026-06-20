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
  /** Lock highlighted section in read-only plan (e.g. locate sheet) */
  highlightSectionId?: string;
  highlightItemRef?: RefObject<HTMLDivElement>;
  /** Called when the user picks a section (e.g. to clear URL highlight) */
  onSectionSelect?: (sectionId: string) => void;
}

export default function SpaceFloorPlan({
  space,
  highlightItemName,
  planOnly = false,
  compact = false,
  interactive = true,
  highlightSectionId,
  highlightItemRef,
  onSectionSelect,
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
  const [planExpanded, setPlanExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
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

  useEffect(() => {
    if (compact || planOnly) return;

    const media = window.matchMedia("(max-width: 639px)");
    function update() {
      const mobile = media.matches;
      setIsMobile(mobile);
      setPlanExpanded(!mobile);
    }
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [compact, planOnly]);

  const activeSectionId =
    !interactive && highlightSectionId
      ? highlightSectionId
      : selectedSectionId;

  function selectSection(sectionId: string) {
    setSelectedSectionId(sectionId);
    onSectionSelect?.(sectionId);
  }

  const showMobileChrome = isMobile && !compact && !planOnly;
  const showPlanDiagram = !showMobileChrome || planExpanded;

  return (
    <div className="flex flex-col gap-5" aria-label={space.name}>
      {showMobileChrome && (
        <>
          <div className="section-tabs" role="tablist" aria-label={space.name}>
            {space.sections.map((section) => (
              <button
                key={section.id}
                type="button"
                role="tab"
                aria-selected={activeSectionId === section.id}
                onClick={() => selectSection(section.id)}
                className={[
                  "section-tab",
                  selectedSectionId === section.id ? "section-tab--active" : "",
                ].join(" ")}
              >
                {section.name}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="plan-toggle"
            onClick={() => setPlanExpanded((open) => !open)}
            aria-expanded={planExpanded}
          >
            <span>{planExpanded ? t.space.hidePlan : t.space.showPlan}</span>
            <svg
              className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform ${planExpanded ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </>
      )}

      {showPlanDiagram && (
      <div
        className={[
          "mx-auto flex w-full flex-col",
          compact ? "max-w-sm gap-1.5" : "max-w-sm gap-2",
          isDrawers ? "gap-1.5" : "gap-2",
        ].join(" ")}
      >
        {topSections.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {topSections.map((section) => (
                <PlanSectionButton
                  key={section.id}
                  section={section}
                  active={activeSectionId === section.id}
                  shape="top"
                  onClick={
                    interactive
                      ? () => selectSection(section.id)
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
            "relative flex flex-col gap-1.5",
            isDrawers && compact && !interactive
              ? "rounded-lg border border-zinc-200/80 bg-zinc-50/40 p-2 dark:border-zinc-800 dark:bg-zinc-900/50"
              : "",
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
                    active={activeSectionId === section.id}
                    shape={
                      isDrawers
                        ? "drawer"
                        : isFloorSection(section)
                          ? "floor"
                          : "shelf"
                    }
                    onClick={
                      interactive
                        ? () => selectSection(section.id)
                        : undefined
                    }
                    refProp={hasHighlight ? activeRef : undefined}
                    itemsLabel={t.home.items(section.items.length)}
                  />
                );
            })}
        </div>

        {!isDrawers && (
          <div
            className={[
              "mx-auto grid w-[86%] grid-cols-2 px-5",
              compact ? "gap-16" : "gap-24",
            ].join(" ")}
            aria-hidden="true"
          >
            <div
              className={[
                "rounded-b bg-zinc-300/80 dark:bg-zinc-600/50",
                compact ? "h-2" : "h-3",
              ].join(" ")}
            />
            <div
              className={[
                "rounded-b bg-zinc-300/80 dark:bg-zinc-600/50",
                compact ? "h-2" : "h-3",
              ].join(" ")}
            />
          </div>
        )}
      </div>
      )}

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
                  "flex items-center gap-3 px-3.5 py-3",
                  isHighlighted ? "card-highlighted" : "card-base",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg",
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
  active,
  shape,
  onClick,
  refProp,
  itemsLabel,
}: {
  section: Section;
  active: boolean;
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
          ? "rounded-xl border px-3 py-3 shadow-sm shadow-zinc-950/[0.03]"
          : "rounded-xl border px-3 py-2.5 shadow-sm shadow-zinc-950/[0.03]",
        active
          ? "border-amber-200/60 bg-amber-50/45 text-amber-900 shadow-amber-950/[0.04] dark:border-amber-900/45 dark:bg-amber-950/25 dark:text-amber-200"
          : isStatic
            ? "border-zinc-200/70 bg-zinc-100 text-zinc-600 dark:border-zinc-800/80 dark:bg-zinc-800/80 dark:text-zinc-300"
            : "border-zinc-200/70 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/80",
      ].join(" ")}
      aria-pressed={onClick ? active : undefined}
    >
      <span
        className={[
          "flex flex-shrink-0 items-center justify-center rounded text-[11px] font-bold tabular-nums",
          isDrawer ? "h-6 w-8" : "h-6 w-6",
          active
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
            active
              ? "bg-amber-300 dark:bg-amber-700"
              : isStatic
                ? "bg-zinc-200 dark:bg-zinc-700"
                : "bg-zinc-200 group-hover:bg-zinc-300 dark:bg-zinc-700 dark:group-hover:bg-zinc-600",
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
