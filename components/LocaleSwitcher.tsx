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
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          }`}
          aria-label={`Switch to ${LOCALE_LABELS[code]}`}
        >
          {LOCALE_LABELS[code]}
        </button>
      ))}
    </div>
  );
}
