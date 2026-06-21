"use client";

import { useCallback, useRef } from "react";
import Link from "next/link";
import SpaceFloorPlan from "@/components/SpaceFloorPlan";
import SpaceIcon, { TYPE_COLOR } from "@/components/SpaceIcon";
import UiIcon from "@/components/icons/UiIcon";
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
    <div ref={containerRef} className="sheet-overlay">
      <button
        type="button"
        className="sheet-backdrop"
        onClick={handleClose}
        aria-label={t.common.close}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="locate-sheet-title"
        aria-describedby="locate-sheet-location"
        className="sheet-panel sheet-panel--tall"
      >
        <div className="sheet-handle">
          <div className="sheet-handle-bar" aria-hidden="true" />
        </div>

        <div className="flex items-start gap-3 border-b border-zinc-100 px-4 pb-4 pt-3 dark:border-zinc-800 sm:pt-4">
          <div
            className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${TYPE_COLOR[space.type] ?? "bg-zinc-100 text-zinc-500"}`}
            aria-hidden="true"
          >
            <SpaceIcon type={space.type} className="h-5 w-5" />
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
              <span className="mx-1.5 text-zinc-400 dark:text-zinc-500">›</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {section.name}
              </span>
            </p>
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={handleClose}
            className="btn-sheet-close"
            aria-label={t.common.close}
          >
            <UiIcon name="close" className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <SpaceFloorPlan
            space={space}
            highlightItemName={item.name}
            highlightSectionId={section.id}
            planOnly
            compact
            interactive={false}
          />
        </div>

        <div className="sheet-footer">
          <Link href={listUrl} className="btn-primary flex-col gap-0.5">
            <span>{t.space.goToSpace}</span>
            <span className="max-w-full truncate text-sm font-medium text-zinc-950/75">
              {space.name}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
