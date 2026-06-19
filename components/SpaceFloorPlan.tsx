"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { Section, Space } from "@/lib/search";
import { useI18n } from "@/lib/i18n";

interface Props {
  space: Space;
  highlightItemName?: string;
}

export default function SpaceFloorPlan({ space, highlightItemName }: Props) {
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
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [autoSection]);

  return (
    <div
      className="grid gap-4 lg:grid-cols-[minmax(280px,420px)_minmax(0,1fr)] lg:items-start"
      aria-label={space.name}
    >
      <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div
          className={[
            "mx-auto flex w-full max-w-sm flex-col",
            isDrawers ? "gap-1.5" : "gap-2",
          ].join(" ")}
        >
          {topSections.length > 0 && (
            <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50 p-2 dark:border-zinc-700 dark:bg-zinc-950/40">
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
                  onClick={() => setSelectedSectionId(section.id)}
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
              "relative overflow-hidden border bg-zinc-50 shadow-inner dark:bg-zinc-950/40",
              isDrawers
                ? "rounded-lg border-zinc-200 p-2 dark:border-zinc-700"
                : "rounded-t-lg rounded-b-md border-zinc-300 p-2 dark:border-zinc-700",
            ].join(" ")}
          >
            {!isDrawers && (
              <div
                className="pointer-events-none absolute inset-y-2 left-1/2 w-px bg-zinc-200 dark:bg-zinc-800"
                aria-hidden="true"
              />
            )}

            <div
              className={[
                "relative z-10 flex flex-col gap-1.5",
                isDrawers ? "min-h-[300px]" : "min-h-[360px]",
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
                    onClick={() => setSelectedSectionId(section.id)}
                    refProp={hasHighlight ? activeRef : undefined}
                    itemsLabel={t.home.items(section.items.length)}
                  />
                );
              })}
            </div>
          </div>

          {!isDrawers && (
            <div
              className="mx-auto grid w-[86%] grid-cols-2 gap-24 px-5"
              aria-hidden="true"
            >
              <div className="h-3 rounded-b bg-zinc-300 dark:bg-zinc-700" />
              <div className="h-3 rounded-b bg-zinc-300 dark:bg-zinc-700" />
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {selectedSection ? (
          <>
            <div
              className={`border-b border-zinc-100 px-4 py-3 dark:border-zinc-800 ${
                sectionHasHighlight(selectedSection, normalizedHighlight)
                  ? "bg-amber-50 dark:bg-amber-950/20"
                  : ""
              }`}
            >
              <p
                className={`text-sm font-semibold ${
                  sectionHasHighlight(selectedSection, normalizedHighlight)
                    ? "text-amber-800 dark:text-amber-300"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {selectedSection.name}
              </p>
              <p className="mt-0.5 text-xs text-zinc-400">
                {t.home.items(selectedSection.items.length)}
              </p>
            </div>

            <div className="flex flex-col gap-1.5 p-3">
              {selectedSection.items.map((item, itemIndex) => {
                const isHighlighted =
                  item.name.toLowerCase() === normalizedHighlight;
                return (
                  <div
                    key={`${selectedSection.id}-${item.name}-${itemIndex}`}
                    className={`rounded-lg px-3 py-2.5 text-sm leading-snug ${
                      isHighlighted
                        ? "border border-amber-300 bg-amber-50 font-semibold text-amber-900 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-300"
                        : "border border-zinc-100 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300"
                    }`}
                  >
                    {item.name}
                  </div>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>
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
  onClick: () => void;
  refProp?: RefObject<HTMLButtonElement>;
  itemsLabel: string;
}) {
  const isDrawer = shape === "drawer";
  const isFloor = shape === "floor";

  return (
    <button
      ref={refProp}
      type="button"
      onClick={onClick}
      className={[
        "group flex w-full items-center gap-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
        isDrawer || isFloor ? "min-h-[64px]" : "min-h-[58px]",
        isDrawer
          ? "rounded-md border px-3 py-3 shadow-sm"
          : isFloor
            ? "rounded-md border px-3 py-2.5"
            : shape === "top"
              ? "rounded-md border px-3 py-2.5"
              : "rounded-sm border px-3 py-3",
        selected
          ? "border-amber-300 bg-amber-50 text-amber-900 shadow-sm dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200"
          : highlighted
            ? "border-amber-200 bg-amber-50/70 text-amber-900 dark:border-amber-800 dark:bg-amber-950/20 dark:text-amber-300"
            : "border-zinc-200 bg-white text-zinc-800 hover:border-amber-200 hover:bg-amber-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-amber-900 dark:hover:bg-amber-950/10",
      ].join(" ")}
      aria-pressed={selected}
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
        <span className="mt-0.5 block text-xs text-zinc-400">
          {itemsLabel}
        </span>
      </span>

      {isDrawer && (
        <span
          className={[
            "h-1.5 w-10 flex-shrink-0 rounded-full",
            selected || highlighted
              ? "bg-amber-300 dark:bg-amber-700"
              : "bg-zinc-200 group-hover:bg-amber-200 dark:bg-zinc-700 dark:group-hover:bg-amber-900",
          ].join(" ")}
          aria-hidden="true"
        />
      )}
    </button>
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
