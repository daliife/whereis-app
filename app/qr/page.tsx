"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { getAllSpaces, type Space } from "@/lib/search";
import { useI18n } from "@/lib/i18n";
import SpaceIcon, { TYPE_COLOR } from "@/components/SpaceIcon";

const spaces = getAllSpaces();
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function QRPage() {
  const [origin, setOrigin] = useState("");
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedSpace(null);
      }
    }

    if (selectedSpace) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedSpace]);

  const baseUrl = origin ? `${origin}${BASE_PATH}` : "";
  const getSpaceUrl = (spaceId: string) =>
    baseUrl ? `${baseUrl}/space/${spaceId}` : "";
  const selectedUrl = selectedSpace ? getSpaceUrl(selectedSpace.id) : "";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="pt-8 pb-4 lg:pt-12">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 print:hidden dark:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
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
        <p className="text-sm text-zinc-400">{t.qr.subtitle}</p>
      </header>

      {/* QR cards */}
      <div className="grid gap-4 md:grid-cols-2 print:grid-cols-2">
        {spaces.map((space) => (
          <button
            key={space.id}
            type="button"
            onClick={() => setSelectedSpace(space)}
            disabled={!baseUrl}
            className="rounded-lg border border-zinc-100 bg-white p-5 text-left shadow-sm transition-colors hover:border-amber-200 hover:bg-amber-50/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 disabled:cursor-wait print:break-inside-avoid dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-900 dark:hover:bg-amber-950/10 lg:p-6"
            aria-label={t.qr.expandCode(space.name)}
          >
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0">
                {baseUrl ? (
                  <QRCodeSVG
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
                <p className="mt-0.5 text-sm capitalize text-zinc-400">
                  {t.space.types[space.type] ?? space.type}
                </p>
                {baseUrl && (
                  <p className="mt-2 break-all text-xs text-zinc-300 dark:text-zinc-700">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 px-4 py-6 backdrop-blur-sm print:hidden"
          onClick={() => setSelectedSpace(null)}
        >
          <div
            className="w-full max-w-sm rounded-lg border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="qr-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p
                  id="qr-dialog-title"
                  className="font-semibold text-zinc-900 dark:text-zinc-100"
                >
                  {selectedSpace.name}
                </p>
                <p className="text-sm capitalize text-zinc-400">
                  {t.space.types[selectedSpace.type] ?? selectedSpace.type}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSpace(null)}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
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
              <QRCodeSVG
                value={selectedUrl}
                size={320}
                level="M"
                includeMargin
                className="h-auto w-full max-w-[320px]"
              />
            </div>
            <p className="mt-3 break-all text-center text-xs text-zinc-400 dark:text-zinc-500">
              {selectedUrl}
            </p>
          </div>
        </div>
      )}

      {/* Print button */}
      <button
        onClick={() => window.print()}
        className="mt-6 w-full rounded-lg bg-amber-500 py-4 text-base font-semibold text-zinc-950 transition-colors hover:bg-amber-400 active:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 print:hidden dark:focus-visible:ring-offset-zinc-950 sm:max-w-sm"
      >
        {t.qr.printButton}
      </button>
    </div>
  );
}
