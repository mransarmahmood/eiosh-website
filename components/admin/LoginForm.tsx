"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export function LoginForm() {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setBusy(false);
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setErr("Incorrect password.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 grid gap-3">
      <label className="block text-sm font-medium text-navy-900" htmlFor="pw">
        Admin password
      </label>
      <input
        id="pw"
        type="password"
        required
        autoFocus
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        className="h-11 w-full rounded-lg border border-border bg-white px-4 text-sm placeholder:text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60"
        placeholder="Enter admin password"
      />
      {err ? <p className="text-sm text-red-600">{err}</p> : null}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-navy-900 px-5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60 cursor-pointer"
      >
        {busy ? "Signing in…" : "Sign in"} <LogIn className="h-4 w-4" />
      </button>
    </form>
  );
}
