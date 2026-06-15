"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { getAllSpaces } from "@/lib/search";
import { useI18n } from "@/lib/i18n";

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
          className="text-sm text-slate-400 hover:text-slate-600 print:hidden dark:text-slate-500 dark:hover:text-slate-300"
        >
          {t.qr.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {t.qr.title}
        </h1>
        <p className="text-sm text-slate-400">{t.qr.subtitle}</p>
      </header>

      {/* QR cards */}
      <div className="flex flex-col gap-6">
        {spaces.map((space) => (
          <div
            key={space.id}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm print:break-inside-avoid dark:border-slate-700 dark:bg-slate-800"
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
                  <div className="h-[100px] w-[100px] animate-pulse rounded-lg bg-slate-100 dark:bg-slate-700" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {space.name}
                </p>
                <p className="mt-0.5 text-sm capitalize text-slate-400">
                  {space.type}
                </p>
                {baseUrl && (
                  <p className="mt-2 break-all text-xs text-slate-300 dark:text-slate-600">
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
        className="mt-6 w-full rounded-xl bg-slate-900 py-3.5 text-base font-medium text-white transition-colors active:bg-slate-700 print:hidden"
      >
        {t.qr.printButton}
      </button>
    </div>
  );
}
