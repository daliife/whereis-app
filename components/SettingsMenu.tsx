"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALE_LABELS, LOCALES, useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";

export default function SettingsMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const { locale, setLocale, t } = useI18n();

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
        aria-label={t.settings.open}
        aria-expanded={open}
        aria-controls="settings-panel"
        aria-haspopup="dialog"
      >
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
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span className="hidden sm:inline">{t.settings.open}</span>
      </button>

      {open && (
        <div
          id="settings-panel"
          className="absolute right-0 z-30 mt-2 w-64 rounded-lg border border-zinc-200 bg-white p-3 text-sm shadow-lg shadow-zinc-200/70 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/30"
          role="dialog"
          aria-label={t.settings.title}
        >
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t.settings.title}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {t.settings.appearance}
              </p>
              <div className="grid grid-cols-2 gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    theme === "light"
                      ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                  aria-pressed={theme === "light"}
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
                    />
                  </svg>
                  {t.settings.light}
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`inline-flex items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                    theme === "dark"
                      ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
                  }`}
                  aria-pressed={theme === "dark"}
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  {t.settings.dark}
                </button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                {t.settings.language}
              </p>
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
                {LOCALES.map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLocale(code)}
                    className={`rounded-md px-2 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                      locale === code
                        ? "bg-amber-400 text-zinc-950 shadow-sm dark:bg-amber-500"
                        : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
                    }`}
                    aria-label={t.common.switchToLocale(LOCALE_LABELS[code])}
                    aria-pressed={locale === code}
                  >
                    {LOCALE_LABELS[code]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
