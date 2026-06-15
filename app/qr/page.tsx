"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { getAllSpaces } from "@/lib/search";
import { useI18n } from "@/lib/i18n";
import SpaceIcon, { TYPE_COLOR } from "@/components/SpaceIcon";

const spaces = getAllSpaces();
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function QRPage() {
  const [origin, setOrigin] = useState("");
  const { t } = useI18n();

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const baseUrl = origin ? `${origin}${BASE_PATH}` : "";

  return (
    <div className="mx-auto max-w-lg px-4 pb-12">
      {/* Header */}
      <header className="pt-8 pb-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 print:hidden dark:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
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
      <div className="flex flex-col gap-6">
        {spaces.map((space) => (
          <div
            key={space.id}
            className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm print:break-inside-avoid dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0">
                {baseUrl ? (
                  <QRCodeSVG
                    value={`${baseUrl}/space/${space.id}`}
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
                  {space.type}
                </p>
                {baseUrl && (
                  <p className="mt-2 break-all text-xs text-zinc-300 dark:text-zinc-700">
                    {baseUrl}/space/{space.id}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Print button */}
      <button
        onClick={() => window.print()}
        className="mt-6 w-full rounded-xl bg-zinc-900 py-4 text-base font-semibold text-white transition-colors active:bg-zinc-700 print:hidden dark:bg-amber-500 dark:text-zinc-950 dark:active:bg-amber-400"
      >
        {t.qr.printButton}
      </button>
    </div>
  );
}
