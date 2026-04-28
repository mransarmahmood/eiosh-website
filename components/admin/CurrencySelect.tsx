"use client";

const SUPPORTED = [
  { code: "USD", flag: "🇺🇸", name: "US Dollar" },
  { code: "GBP", flag: "🇬🇧", name: "British Pound" },
  { code: "EUR", flag: "🇪🇺", name: "Euro" },
  { code: "AED", flag: "🇦🇪", name: "UAE Dirham" },
  { code: "SAR", flag: "🇸🇦", name: "Saudi Riyal" },
  { code: "PKR", flag: "🇵🇰", name: "Pakistani Rupee" },
  { code: "INR", flag: "🇮🇳", name: "Indian Rupee" },
  { code: "AUD", flag: "🇦🇺", name: "Australian Dollar" },
  { code: "CAD", flag: "🇨🇦", name: "Canadian Dollar" },
];

interface Props {
  value: string;
  onChange: (code: string) => void;
  className?: string;
}

/** Reusable currency picker — used in service catalog + proposal builder. */
export function CurrencySelect({ value, onChange, className }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={
        className ??
        "block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
      }
    >
      {SUPPORTED.map((c) => (
        <option key={c.code} value={c.code}>
          {c.flag} {c.code} — {c.name}
        </option>
      ))}
    </select>
  );
}

export const SUPPORTED_CURRENCIES = SUPPORTED;
