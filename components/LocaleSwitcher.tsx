"use client";

import { useI18n, LOCALES, LOCALE_LABELS } from "@/lib/i18n";

export default function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="flex gap-0.5">
      {LOCALES.map((code) => (
        <button
          key={code}
          onClick={() => setLocale(code)}
          className={`rounded-md px-2 py-1 text-xs font-semibold transition-colors ${
            locale === code
              ? "bg-amber-400 text-zinc-900 dark:bg-amber-500 dark:text-zinc-950"
              : "text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
          }`}
          aria-label={`Switch to ${LOCALE_LABELS[code]}`}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
