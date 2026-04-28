/**
 * Multi-currency display.
 *
 * - Detects the visitor's country from Cloudflare / Vercel / generic headers,
 *   falls back to Accept-Language.
 * - Maps country → preferred display currency.
 * - Static FX rates against USD (refresh quarterly via the admin "Refresh FX"
 *   button — out of scope for this MVP; rates live in `lib/currency.ts`).
 */

import { headers } from "next/headers";

export interface CurrencyDisplay {
  code: string; // "GBP"
  symbol: string; // "£"
  rateFromUSD: number; // 1 USD = 0.78 GBP
  flag: string; // "🇬🇧"
}

const RATES_FROM_USD: Record<string, CurrencyDisplay> = {
  USD: { code: "USD", symbol: "$",   rateFromUSD: 1.0,    flag: "🇺🇸" },
  GBP: { code: "GBP", symbol: "£",   rateFromUSD: 0.78,   flag: "🇬🇧" },
  EUR: { code: "EUR", symbol: "€",   rateFromUSD: 0.92,   flag: "🇪🇺" },
  AED: { code: "AED", symbol: "د.إ", rateFromUSD: 3.67,   flag: "🇦🇪" },
  SAR: { code: "SAR", symbol: "﷼",   rateFromUSD: 3.75,   flag: "🇸🇦" },
  PKR: { code: "PKR", symbol: "₨",   rateFromUSD: 278.5,  flag: "🇵🇰" },
  INR: { code: "INR", symbol: "₹",   rateFromUSD: 83.0,   flag: "🇮🇳" },
  AUD: { code: "AUD", symbol: "A$",  rateFromUSD: 1.52,   flag: "🇦🇺" },
  CAD: { code: "CAD", symbol: "C$",  rateFromUSD: 1.36,   flag: "🇨🇦" },
};

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: "USD",
  GB: "GBP", IE: "GBP",
  DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", BE: "EUR", AT: "EUR", PT: "EUR", FI: "EUR",
  AE: "AED", SA: "SAR", QA: "SAR", BH: "SAR", OM: "SAR", KW: "SAR",
  PK: "PKR", IN: "INR", AU: "AUD", CA: "CAD",
};

export function listSupportedCurrencies(): CurrencyDisplay[] {
  return Object.values(RATES_FROM_USD);
}

const PREFERENCE_COOKIE = "eiosh_ccy";

/** Best guess at the visitor's country from common edge headers. */
export function detectCountry(): string {
  try {
    const h = headers();
    const candidates = [
      h.get("cf-ipcountry"), // Cloudflare
      h.get("x-vercel-ip-country"), // Vercel
      h.get("x-country"), // Custom edge
      h.get("x-real-country"),
    ];
    for (const c of candidates) if (c && c.length === 2) return c.toUpperCase();
    // Fallback: first language code
    const lang = h.get("accept-language") ?? "";
    const m = lang.match(/[a-z]{2}-([A-Z]{2})/);
    if (m) return m[1];
  } catch {
    // headers() may not be available outside a request scope
  }
  return "US";
}

/**
 * Currency the visitor wants to see prices in. Order of precedence:
 *   1. `eiosh_ccy` cookie (manual choice from the switcher)
 *   2. Country → currency map from edge IP headers
 *   3. USD
 */
export function detectCurrency(): CurrencyDisplay {
  // Cookie wins (user explicitly switched).
  try {
    // Lazy-import the cookies API so this module still works in build-time
    // contexts where the request scope isn't available.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { cookies } = require("next/headers") as typeof import("next/headers");
    const code = cookies().get(PREFERENCE_COOKIE)?.value;
    if (code && RATES_FROM_USD[code.toUpperCase()]) {
      return RATES_FROM_USD[code.toUpperCase()];
    }
  } catch {
    // Outside a request — fall through to geo detection.
  }
  const country = detectCountry();
  const code = COUNTRY_TO_CURRENCY[country] ?? "USD";
  return RATES_FROM_USD[code] ?? RATES_FROM_USD.USD;
}

/** Format a USD price as the detected (or chosen) currency. Always shows USD as the source. */
export function formatPrice(usd: number, target: CurrencyDisplay): string {
  const converted = usd * target.rateFromUSD;
  // 0-decimal currencies (PKR, INR) round to whole numbers.
  const decimals = converted >= 1000 ? 0 : 2;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(converted);
  return `${target.symbol}${formatted}`;
}

export function findCurrency(code: string): CurrencyDisplay {
  return RATES_FROM_USD[code.toUpperCase()] ?? RATES_FROM_USD.USD;
}
