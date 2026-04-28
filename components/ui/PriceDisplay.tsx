import { detectCurrency, formatPrice } from "@/lib/currency";

interface Props {
  /** Source price in USD. */
  usd: number;
  /** Override the detected currency (e.g. for admin previews). */
  forceCode?: string;
  /** Append "(US$X)" alongside the localised price. */
  showSource?: boolean;
  className?: string;
}

/**
 * Server component that converts a USD price to the visitor's currency using
 * `detectCurrency()`. SSR-only — falls back to USD outside a request scope.
 */
export function PriceDisplay({ usd, showSource = true, className = "" }: Props) {
  const target = detectCurrency();
  const localised = formatPrice(usd, target);
  if (target.code === "USD" || !showSource) {
    return <span className={className}>{localised}</span>;
  }
  return (
    <span className={className}>
      {localised}
      <span className="ml-1 text-xs text-ink-soft">(US${usd.toLocaleString()})</span>
    </span>
  );
}
