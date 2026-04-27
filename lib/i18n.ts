// Minimal locale registry. App Router is kept single-locale today; to enable
// /ar routes later, move app/* into app/[locale]/* and read `locale` in layout.

import en from "@/locales/en.json";
import ar from "@/locales/ar.json";

export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

const dictionaries: Record<Locale, Record<string, string>> = { en, ar };

export function t(key: string, locale: Locale = defaultLocale): string {
  return dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
}

export function direction(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
