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

export const STORAGE_KEY = "stashly-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  ca: "CA",
  es: "ES",
  en: "EN",
};

export const LOCALES = Object.keys(LOCALE_LABELS) as Locale[];

function isLocale(value: string | null): value is Locale {
  return value === "ca" || value === "es" || value === "en";
}

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "ca";
  const stored = localStorage.getItem(STORAGE_KEY);
  return isLocale(stored) ? stored : "ca";
}

function clearLocalePending() {
  document.documentElement.classList.remove("i18n-pending");
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
  ready: false,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ca");
  const [t, setT] = useState<Translations>(ca);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const initial = getStoredLocale();

    loadLocale(initial).then((dict) => {
      if (cancelled) return;
      setLocaleState(initial);
      setT(dict);
      document.documentElement.lang = initial;
      clearLocalePending();
      setReady(true);
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
      clearLocalePending();
      setReady(true);
    });
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, t, ready }),
    [locale, setLocale, t, ready],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
