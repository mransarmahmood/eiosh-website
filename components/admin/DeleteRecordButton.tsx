"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  resource: string;
  id: string;
  label?: string;            // e.g. "Delete admission" — used in the confirm prompt
  size?: "sm" | "md";
  variant?: "icon" | "button";
  onDeleted?: () => void;    // optional callback after a successful delete
  className?: string;
}

/**
 * Single, reusable delete action for any CMS record.
 * - Confirms via native dialog (safer than a silent click)
 * - Calls DELETE /api/admin/{resource}/{id}
 * - On success, invalidates the Next.js router cache so the list refreshes
 * - Handles singletons (blocked by the API) gracefully
 */
export function DeleteRecordButton({
  resource,
  id,
  label,
  size = "sm",
  variant = "icon",
  onDeleted,
  className,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    const prompt = label
      ? `${label}? This cannot be undone.`
      : `Delete this record? This cannot be undone.`;
    if (!confirm(prompt)) return;

    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/${resource}/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({} as any));
        throw new Error(body?.error ?? `Delete failed (${res.status})`);
      }
      onDeleted?.();
      router.refresh();
    } catch (e: any) {
      setError(e?.message ?? "Delete failed");
      alert(e?.message ?? "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  const pad = size === "md" ? "px-3 py-2" : "px-2.5 py-1.5";
  const text = size === "md" ? "text-xs" : "text-[0.7rem]";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={run}
        disabled={busy}
        title={label ?? "Delete"}
        aria-label={label ?? "Delete"}
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-md ring-1 ring-inset transition cursor-pointer",
          "bg-white ring-border text-red-600 hover:bg-red-50 hover:ring-red-200",
          busy && "opacity-50 pointer-events-none",
          className,
        )}
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={run}
      disabled={busy}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg bg-white ring-1 ring-inset transition cursor-pointer",
        "ring-red-200 text-red-700 hover:bg-red-50 hover:ring-red-300",
        pad,
        text,
        "font-medium",
        busy && "opacity-60 pointer-events-none",
        className,
      )}
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
      {busy ? "Deleting…" : "Delete"}
    </button>
  );
}
