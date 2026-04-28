"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, ShoppingCart, Gift } from "lucide-react";

interface Props {
  courseSlug: string;
  price?: number;
  currency?: string;
  className?: string;
  /** Variant for sticky mobile bar — full width, larger CTA. */
  fullWidth?: boolean;
}

export function EnrolNowButton({ courseSlug, price, currency = "USD", className = "", fullWidth }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();
  // Capture ?ref=ABCD1234 from the URL — dropped onto the checkout payload so
  // the eventual webhook records the referrer.
  const referrerCode = searchParams.get("ref")?.toUpperCase();

  async function onClick() {
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, referrerCode }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrorMsg(json.error ?? "Could not start checkout. Please try again.");
        setState("error");
        return;
      }
      // Redirect to Stripe (or the mock success page in dev).
      window.location.href = json.redirectUrl;
    } catch (err) {
      setErrorMsg("Network error. Please check your connection and retry.");
      setState("error");
    }
  }

  const label = price
    ? `Enrol now — ${currency} ${price.toFixed(0)}`
    : "Request a quote";

  if (!price) {
    // No public price → bounce to quotation form.
    return (
      <button
        type="button"
        onClick={() => router.push(`/quotation?course=${encodeURIComponent(courseSlug)}`)}
        className={`inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-cyan-400 ${fullWidth ? "w-full" : ""} ${className}`}
      >
        <ShoppingCart className="h-4 w-4" /> {label}
      </button>
    );
  }

  return (
    <div className={fullWidth ? "w-full" : ""}>
      <button
        type="button"
        onClick={onClick}
        disabled={state === "loading"}
        className={`inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-navy-950 transition hover:bg-cyan-400 disabled:cursor-wait disabled:opacity-70 ${fullWidth ? "w-full" : ""} ${className}`}
      >
        {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
        {state === "loading" ? "Starting checkout…" : label}
      </button>
      {referrerCode && (
        <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-800">
          <Gift className="h-3 w-3" /> Referred by {referrerCode}
        </p>
      )}
      {errorMsg && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {errorMsg}
        </p>
      )}
    </div>
  );
}
