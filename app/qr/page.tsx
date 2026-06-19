"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import QRCode from "@/components/QRCode";
import { getAllSpaces, type Space } from "@/lib/inventory";
import { useI18n } from "@/lib/i18n";
import { useDialogA11y } from "@/lib/useDialogA11y";
import SpaceIcon, { TYPE_COLOR } from "@/components/SpaceIcon";

const spaces = getAllSpaces();
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function QRPage() {
  const [origin, setOrigin] = useState("");
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { t } = useI18n();

  const closeModal = useCallback(() => setSelectedSpace(null), []);

  useDialogA11y(!!selectedSpace, modalRef, closeModal, {
    returnFocusRef: triggerRef,
    initialFocusRef: closeRef,
  });

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const baseUrl = origin ? `${origin}${BASE_PATH}` : "";
  const getSpaceUrl = (spaceId: string) =>
    baseUrl ? `${baseUrl}/space/${spaceId}` : "";
  const selectedUrl = selectedSpace ? getSpaceUrl(selectedSpace.id) : "";

  return (
    <div className="mx-auto max-w-3xl px-4 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-6 lg:px-8">
      {/* Header */}
      <header className="pb-4 pt-[max(1.5rem,env(safe-area-inset-top))] sm:pt-8 lg:pt-12">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 print:hidden dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          aria-label={t.qr.back}
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
        <h1 className="mt-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {t.qr.title}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {t.qr.subtitle}
        </p>
      </header>

      <main id="main-content">
      {/* QR cards */}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 print:grid-cols-2">
        {spaces.map((space) => (
          <button
            key={space.id}
            type="button"
            onClick={(event) => {
              triggerRef.current = event.currentTarget;
              setSelectedSpace(space);
            }}
            disabled={!baseUrl}
            className="rounded-lg border border-zinc-200/80 bg-white p-4 text-left transition-colors hover:border-zinc-300 hover:bg-zinc-50/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-wait print:break-inside-avoid dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/40 sm:p-5"
            aria-label={t.qr.expandCode(space.name)}
          >
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0">
                {baseUrl ? (
                  <QRCode
                    value={getSpaceUrl(space.id)}
                    size={100}
                    level="M"
                    includeMargin={false}
                  />
                ) : (
                  /* Placeholder during SSR / before hydration */
                  <div className="h-[100px] w-[100px] animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md ${TYPE_COLOR[space.type] ?? "bg-zinc-100 text-zinc-500"}`}
                  >
                    <SpaceIcon type={space.type} className="h-3.5 w-3.5" />
                  </div>
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {space.name}
                  </p>
                </div>
                <p className="mt-0.5 text-sm capitalize text-zinc-600 dark:text-zinc-400">
                  {t.space.types[space.type] ?? space.type}
                </p>
                {baseUrl && (
                  <p className="mt-2 break-all text-xs text-zinc-500 dark:text-zinc-400">
                    {getSpaceUrl(space.id)}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedSpace && selectedUrl && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 print:hidden"
        >
          <button
            type="button"
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm motion-reduce:backdrop-blur-none"
            onClick={closeModal}
            aria-label={t.common.close}
          />
          <div
            className="relative w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-dialog-title"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  id="qr-dialog-title"
                  className="font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  {selectedSpace.name}
                </p>
                <p className="text-sm capitalize text-zinc-600 dark:text-zinc-400">
                  {t.space.types[selectedSpace.type] ?? selectedSpace.type}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={closeModal}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                aria-label={t.qr.closeExpanded}
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

            <div className="flex justify-center rounded-lg bg-white p-4">
              <QRCode
                value={selectedUrl}
                size={320}
                level="M"
                includeMargin
                className="h-auto w-full max-w-[320px]"
              />
            </div>
            <p className="mt-3 break-all text-center text-xs text-zinc-600 dark:text-zinc-400">
              {selectedUrl}
            </p>
          </div>
        </div>
      )}

      {/* Print button */}
      <button
        type="button"
        onClick={() => window.print()}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-3.5 text-base font-semibold text-zinc-950 transition-colors hover:bg-amber-400 active:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 print:hidden dark:focus-visible:ring-offset-zinc-950 sm:max-w-xs"
      >
        <svg
          className="h-5 w-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 9V4h12v5M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6v-7z"
          />
        </svg>
        {t.qr.printButton}
      </button>
      </main>
    </div>
  );
}
