import { ca } from "./translations/ca";

export type Locale = "ca" | "es" | "en";
export type Translations = typeof ca;

export async function loadLocale(locale: Locale): Promise<Translations> {
  switch (locale) {
    case "ca":
      return ca;
    case "es":
      return (await import("./translations/es")).es;
    case "en":
      return (await import("./translations/en")).en;
  }
}
