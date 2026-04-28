"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

const STORAGE_KEY = "eiosh_cookie_consent";

type Choice = "all" | "essential" | null;

/**
 * Lightweight, GDPR-aware cookie banner.
 *  - Shows once per visitor (until choice is cleared or 12 months pass).
 *  - "Accept all" lets analytics scripts run; "Essential only" keeps third-party
 *    scripts off — components that read consent from `window` should respect it.
 */
export function CookieConsent() {
  const [choice, setChoice] = useState<Choice>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored = JSON.parse(raw) as { choice: Choice; at: string };
      const ageMs = Date.now() - new Date(stored.at).getTime();
      const TWELVE_MONTHS = 1000 * 60 * 60 * 24 * 365;
      if (ageMs > TWELVE_MONTHS) return; // expired — re-ask
      setChoice(stored.choice);
    } catch {
      // ignore corrupt storage
    }
  }, []);

  function decide(c: Exclude<Choice, null>) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice: c, at: new Date().toISOString() }),
      );
      // Surface the choice on `window` so analytics modules can pick it up.
      (window as unknown as { __eioshConsent?: Choice }).__eioshConsent = c;
    } catch {
      // best-effort
    }
    setChoice(c);
  }

  if (!hydrated || choice) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-2xl rounded-2xl border border-border bg-white shadow-floating sm:inset-x-auto sm:right-3 sm:left-auto sm:bottom-3"
    >
      <div className="flex items-start gap-3 p-4 sm:p-5">
        <span className="hidden flex-shrink-0 sm:inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-cyan-700">
          <Cookie className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-semibold text-navy-900">
            We use cookies to improve your experience.
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            Essential cookies keep the site working. Optional analytics help us understand which
            content learners find most useful. Read our{" "}
            <Link href="/policies" className="text-cyan-700 underline">
              policies
            </Link>{" "}
            for details.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => decide("all")}
              className="inline-flex h-9 items-center rounded-lg bg-navy-900 px-4 text-xs font-semibold text-white hover:bg-navy-800"
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => decide("essential")}
              className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-xs font-semibold text-navy-900 hover:bg-navy-50"
            >
              Essential only
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => decide("essential")}
          aria-label="Dismiss (essential only)"
          className="rounded p-1 text-ink-soft hover:bg-navy-50 hover:text-navy-900"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
