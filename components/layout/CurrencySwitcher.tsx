"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Globe2, Check, ChevronDown } from "lucide-react";
import type { CurrencyDisplay } from "@/lib/currency";

interface Props {
  current: CurrencyDisplay;
  options: CurrencyDisplay[];
  /** "compact" = code-only (footer), "full" = code + flag + name (header). */
  variant?: "compact" | "full";
  className?: string;
}

export function CurrencySwitcher({ current, options, variant = "compact", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function pick(code: string) {
    if (code === current.code) {
      setOpen(false);
      return;
    }
    try {
      const res = await fetch("/api/currency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) return;
      // Re-render server components with the new cookie applied.
      startTransition(() => router.refresh());
    } finally {
      setOpen(false);
    }
  }

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-navy-900 transition hover:bg-navy-50"
      >
        {variant === "full" ? (
          <>
            <Globe2 className="h-3.5 w-3.5 text-cyan-700" />
            <span>{current.flag}</span>
            <span>{current.code}</span>
          </>
        ) : (
          <>
            <span>{current.flag}</span>
            <span>{current.code}</span>
          </>
        )}
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-44 rounded-lg border border-border bg-white py-1 shadow-floating"
        >
          {options.map((c) => {
            const active = c.code === current.code;
            return (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => pick(c.code)}
                  disabled={pending}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-navy-50 ${
                    active ? "font-semibold text-navy-900" : "text-ink"
                  }`}
                >
                  <span className="text-base">{c.flag}</span>
                  <span className="flex-1">{c.code}</span>
                  <span className="text-xs text-ink-soft">{c.symbol}</span>
                  {active && <Check className="h-3.5 w-3.5 text-cyan-700" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
