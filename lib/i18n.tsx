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
import { es } from "./translations/es";
import { en } from "./translations/en";

export type Locale = "ca" | "es" | "en";
export type Translations = typeof ca;

const dict: Record<Locale, Translations> = { ca, es, en };

const STORAGE_KEY = "stashly-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  ca: "CA",
  es: "ES",
  en: "EN",
};

export const LOCALES = Object.keys(LOCALE_LABELS) as Locale[];

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue>({
  locale: "ca",
  setLocale: () => {},
  t: ca,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ca");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && stored in dict) {
      setLocaleState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.lang = l;
  }, []);

  const value = useMemo(
    () => ({ locale, setLocale, t: dict[locale] }),
    [locale, setLocale],
  );

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
