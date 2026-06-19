"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import SpaceFloorPlan from "@/components/SpaceFloorPlan";
import SpaceIcon, { TYPE_COLOR } from "@/components/SpaceIcon";
import type { SearchResult } from "@/lib/inventory";
import { useDialogA11y } from "@/lib/useDialogA11y";
import { useI18n } from "@/lib/i18n";

interface Props {
  result: SearchResult;
  onClose: () => void;
}

export default function LocateItemSheet({ result, onClose }: Props) {
  const { item, section, space } = result;
  const { t } = useI18n();
  const listUrl = `/space/${space.id}?highlight=${encodeURIComponent(item.name)}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const handleClose = useCallback(() => onClose(), [onClose]);

  useDialogA11y(true, containerRef, handleClose, {
    initialFocusRef: closeRef,
  });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
    >
      <button
        type="button"
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm motion-reduce:backdrop-blur-none"
        onClick={handleClose}
        aria-label={t.common.close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="locate-sheet-title"
        aria-describedby="locate-sheet-location"
        className="relative flex max-h-[min(92dvh,720px)] w-full flex-col overflow-hidden rounded-t-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:max-w-md sm:rounded-2xl"
      >
        <div className="flex justify-center pt-2.5 sm:hidden">
          <div
            className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600"
            aria-hidden="true"
          />
        </div>

        <div className="flex items-start gap-3 border-b border-zinc-100 px-4 pb-4 pt-3 dark:border-zinc-800 sm:pt-4">
          <div
            className={`mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${TYPE_COLOR[space.type] ?? "bg-zinc-100 text-zinc-500"}`}
            aria-hidden="true"
          >
            <SpaceIcon type={space.type} className="h-4 w-4" />
          </div>

          <div className="min-w-0 flex-1">
            <p
              id="locate-sheet-title"
              className="text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100"
            >
              {item.name}
            </p>
            <p
              id="locate-sheet-location"
              className="mt-1 text-sm text-zinc-600 dark:text-zinc-400"
            >
              {t.home.locateFoundIn}{" "}
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {space.name}
              </span>
              <span className="mx-1.5 text-zinc-400 dark:text-zinc-500">
                ›
              </span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {section.name}
              </span>
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            aria-label={t.common.close}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <SpaceFloorPlan
            space={space}
            highlightItemName={item.name}
            planOnly
            compact
            interactive={false}
          />
        </div>

        <div className="border-t border-zinc-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-zinc-800">
          <Link
            href={listUrl}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-3.5 text-base font-semibold text-zinc-950 transition-colors hover:bg-amber-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-900"
          >
            {t.space.goToSpaceList(space.name)}
            <svg
              className="h-4 w-4"
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
          </Link>
        </div>
      </div>
    </div>
  );
}
