"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    // Both fields go to /api/admin/auth. If email is blank the server falls
    // back to the legacy master-password gate (env / runtime config).
    const body: { email?: string; password: string } = { password: pw };
    if (email.trim()) body.email = email.trim();
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok && json.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setErr(json.error ?? "Sign-in failed.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3">
      <label className="block text-sm font-medium text-navy-900" htmlFor="email">
        Email <span className="font-normal text-ink-soft">(leave blank for master password)</span>
      </label>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 focus-within:ring-2 focus-within:ring-cyan-500/60">
        <Mail className="h-4 w-4 text-ink-soft" />
        <input
          id="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 flex-1 bg-transparent text-sm placeholder:text-ink-soft focus:outline-none"
          placeholder="you@eiosh.com"
        />
      </div>

      <label className="mt-2 block text-sm font-medium text-navy-900" htmlFor="pw">
        Password
      </label>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 focus-within:ring-2 focus-within:ring-cyan-500/60">
        <Lock className="h-4 w-4 text-ink-soft" />
        <input
          id="pw"
          type="password"
          required
          autoFocus
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="h-11 flex-1 bg-transparent text-sm placeholder:text-ink-soft focus:outline-none"
          placeholder="Your password"
        />
      </div>

      {err ? <p className="text-sm text-red-600">{err}</p> : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-1 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-navy-900 px-5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60 cursor-pointer"
      >
        {busy ? "Signing in…" : "Sign in"} <LogIn className="h-4 w-4" />
      </button>

      <p className="mt-3 text-[0.7rem] text-ink-soft">
        First time? Sign in with the master password, then open{" "}
        <strong>Users &amp; roles</strong> to create per-staff accounts with limited module
        access.
      </p>
    </form>
  );
}
