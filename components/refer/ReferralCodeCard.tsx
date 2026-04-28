"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  code: string;
  email: string;
}

export function ReferralCodeCard({ code, email }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      window.prompt("Copy your code:", code);
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
      <p className="text-xs uppercase tracking-wider text-ink-soft">Your referral code</p>
      <p className="mt-2 font-mono text-4xl font-bold tracking-[0.3em] text-navy-900">{code}</p>
      <p className="mt-2 text-xs text-ink-soft">For {email}</p>
      <button
        type="button"
        onClick={copy}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-green-300" /> Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" /> Copy code
          </>
        )}
      </button>
      <p className="mt-4 text-xs text-ink-soft">
        Anyone who enrols with this code earns you account credit. Pin it to your bio, your email
        signature, your LinkedIn — wherever your network lives.
      </p>
    </div>
  );
}
