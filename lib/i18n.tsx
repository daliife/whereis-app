"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ca } from "./translations/ca";
import { loadLocale, type Locale, type Translations } from "./load-locale";

export type { Locale, Translations };

const STORAGE_KEY = "stashly-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  ca: "CA",
  es: "ES",
  en: "EN",
};

export const LOCALES = Object.keys(LOCALE_LABELS) as Locale[];

function isLocale(value: string | null): value is Locale {
  return value === "ca" || value === "es" || value === "en";
}

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
  ready: boolean;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "ca",
  setLocale: () => {},
  t: ca,
  ready: true,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ca");
  const [t, setT] = useState<Translations>(ca);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const stored = localStorage.getItem(STORAGE_KEY);
    const initial = isLocale(stored) ? stored : "ca";

    loadLocale(initial).then((dict) => {
      if (cancelled) return;
      setLocaleState(initial);
      setT(dict);
      setReady(true);
      document.documentElement.lang = initial;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;

    loadLocale(next).then((dict) => {
      setT(dict);
    });
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, t, ready }),
    [locale, setLocale, t, ready],
  );

  return (
    <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
