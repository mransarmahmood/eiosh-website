"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function NewsletterForm({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    // Client-side only for now. Wire to /api/inquiry or your provider later.
    await new Promise((r) => setTimeout(r, 600));
    setState("done");
  }

  const dark = tone === "dark";

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-lg flex-col gap-2 sm:flex-row">
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        autoComplete="email"
        placeholder="your@work-email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={state === "loading" || state === "done"}
        className={cn(
          "h-12 flex-1 rounded-lg px-4 text-sm transition",
          dark
            ? "bg-white/10 text-white placeholder:text-white/50 ring-1 ring-inset ring-white/20 focus-visible:ring-cyan-300 focus-visible:bg-white/15"
            : "bg-white text-ink placeholder:text-ink-soft ring-1 ring-inset ring-border focus-visible:ring-cyan-500"
        )}
      />
      <button
        type="submit"
        disabled={state === "loading" || state === "done"}
        className={cn(
          "inline-flex h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-semibold transition",
          dark ? "bg-cyan-400 text-navy-950 hover:bg-cyan-300" : "bg-navy-900 text-white hover:bg-navy-800",
          "disabled:opacity-70 cursor-pointer"
        )}
      >
        {state === "done" ? (
          <>
            <Check className="h-4 w-4" /> Subscribed
          </>
        ) : state === "loading" ? (
          "Subscribing…"
        ) : (
          <>
            Subscribe <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}
