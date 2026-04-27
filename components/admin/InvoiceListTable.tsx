"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Copy, Eye, Edit, Trash2, Check, ClipboardCopy, Loader2 } from "lucide-react";
import { formatDate, cn } from "@/lib/utils";

interface Invoice {
  id: string;
  title?: string;
  company?: string;
  invoiceDate?: string;
  dueDate?: string;
  currency?: string;
  vatPercent?: number;
  status?: string;
  kind?: string;
  lineItems?: Array<{ description: string; qty: number; unitPrice: number }>;
}

const STATUS_STYLES: Record<string, string> = {
  new: "bg-navy-50 text-navy-800 ring-navy-200",
  "in-review": "bg-gold-50 text-gold-800 ring-gold-200",
  responded: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  closed: "bg-red-50 text-red-700 ring-red-200",
  historical: "bg-surface-sunken text-ink-muted ring-border",
};
const STATUS_LABELS: Record<string, string> = {
  new: "Draft",
  "in-review": "Sent",
  responded: "Paid",
  closed: "Void",
  historical: "Archived",
};

function invoiceTotal(inv: Invoice) {
  const subtotal = (inv.lineItems ?? []).reduce(
    (s, l) => s + (Number(l.qty) || 0) * (Number(l.unitPrice) || 0),
    0
  );
  const vat = inv.vatPercent ? (subtotal * inv.vatPercent) / 100 : 0;
  return { subtotal, vat, total: subtotal + vat };
}

export function InvoiceListTable({ records }: { records: Invoice[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const summary = useMemo(() => {
    const unpaid = records.filter((r) => r.status === "new" || r.status === "in-review");
    const paid = records.filter((r) => r.status === "responded");
    const unpaidTotal = unpaid.reduce((s, r) => s + invoiceTotal(r).total, 0);
    const paidTotal = paid.reduce((s, r) => s + invoiceTotal(r).total, 0);
    return { count: records.length, unpaid: unpaid.length, paid: paid.length, unpaidTotal, paidTotal };
  }, [records]);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!`${r.title ?? ""} ${r.company ?? ""} ${r.id}`.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [records, filter, query]);

  async function markPaid(id: string) {
    setBusyId(id);
    try {
      await fetch(`/api/admin/invoices/${id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "responded" }),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function duplicate(rec: Invoice) {
    setBusyId(rec.id);
    try {
      const clone = { ...rec };
      delete (clone as any).id;
      clone.status = "new";
      clone.title = `Copy of ${rec.title ?? "Invoice"}`;
      clone.invoiceDate = new Date().toISOString().slice(0, 10);
      await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(clone),
      });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  async function copyViewLink(id: string) {
    const url = `${window.location.origin}/admin/invoices/${id}/view`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {}
  }

  async function remove(id: string) {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    setBusyId(id);
    try {
      await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <>
      {/* Summary stats */}
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-6">
        <Stat label="Total invoices" value={summary.count} tone="navy" />
        <Stat label="Unpaid / draft" value={summary.unpaid} tone="gold" />
        <Stat label="Paid" value={summary.paid} tone="emerald" />
        <Stat label="Outstanding" value={summary.unpaidTotal.toLocaleString(undefined, { style: "currency", currency: "USD" })} tone="navy" />
      </dl>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <ul role="tablist" className="flex flex-wrap gap-2">
          {[
            { v: "all", l: "All" },
            { v: "new", l: "Draft" },
            { v: "in-review", l: "Sent" },
            { v: "responded", l: "Paid" },
            { v: "closed", l: "Void" },
          ].map((f) => {
            const active = filter === f.v;
            return (
              <li key={f.v}>
                <button
                  type="button"
                  onClick={() => setFilter(f.v)}
                  className={cn(
                    "rounded-full px-3.5 py-1.5 text-xs font-medium transition cursor-pointer",
                    active
                      ? "bg-navy-900 text-white shadow-elevated"
                      : "bg-white text-navy-900 ring-1 ring-inset ring-border hover:ring-cyan-400"
                  )}
                >
                  {f.l}
                </button>
              </li>
            );
          })}
        </ul>
        <input
          type="search"
          placeholder="Search by company, title, id…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 rounded-lg border border-border bg-white px-3 text-sm placeholder:text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 w-full sm:w-72"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-border shadow-elevated">
          <p className="font-heading text-lg font-semibold text-navy-900">No invoices match.</p>
          <p className="mt-1 text-sm text-ink-muted">Try a different filter or reset your search.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-border shadow-elevated">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-subtle text-[0.7rem] font-semibold uppercase tracking-wider text-ink-soft">
                <th className="px-4 py-3 text-left">Invoice</th>
                <th className="px-4 py-3 text-left">Client</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((inv) => {
                const { total } = invoiceTotal(inv);
                const currency = inv.currency ?? "USD";
                const statusKey = inv.status ?? "new";
                return (
                  <tr key={inv.id} className="hover:bg-surface-subtle">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/invoices/${inv.id}/view`}
                        className="font-heading font-semibold text-navy-900 hover:text-cyan-700"
                      >
                        {inv.title ?? "(untitled)"}
                      </Link>
                      <p className="mt-0.5 text-xs text-ink-soft">id: {inv.id}</p>
                    </td>
                    <td className="px-4 py-3 text-ink">{inv.company ?? "—"}</td>
                    <td className="px-4 py-3 text-ink-muted">
                      {inv.invoiceDate ? formatDate(inv.invoiceDate) : "—"}
                      {inv.dueDate ? (
                        <span className="ml-2 text-[0.7rem] text-ink-soft">due {formatDate(inv.dueDate)}</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-right font-heading font-semibold text-navy-900 tabular-nums">
                      {currency} {total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider ring-1 ring-inset",
                          STATUS_STYLES[statusKey] ?? STATUS_STYLES.new
                        )}
                      >
                        {STATUS_LABELS[statusKey] ?? statusKey}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <IconBtn title="View" href={`/admin/invoices/${inv.id}/view`}>
                          <Eye className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn title="Edit" href={`/admin/invoices/${inv.id}`}>
                          <Edit className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn title="Duplicate" onClick={() => duplicate(inv)} disabled={busyId === inv.id}>
                          {busyId === inv.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </IconBtn>
                        <IconBtn title="Copy view link" onClick={() => copyViewLink(inv.id)}>
                          {copied === inv.id ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
                        </IconBtn>
                        {statusKey !== "responded" ? (
                          <button
                            type="button"
                            onClick={() => markPaid(inv.id)}
                            disabled={busyId === inv.id}
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[0.7rem] font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-200 transition hover:bg-emerald-100 cursor-pointer"
                            title="Mark as paid"
                          >
                            <Check className="h-3 w-3" /> Paid
                          </button>
                        ) : null}
                        <IconBtn title="Delete" onClick={() => remove(inv.id)} tone="red" disabled={busyId === inv.id}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconBtn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone: "navy" | "gold" | "emerald" }) {
  const accent =
    tone === "gold" ? "from-gold-500 to-gold-400" : tone === "emerald" ? "from-emerald-700 to-emerald-400" : "from-navy-900 to-cyan-600";
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-border shadow-elevated">
      <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-soft">{label}</p>
      <p className="mt-2 font-heading text-2xl font-bold text-navy-900 tabular-nums">{value}</p>
    </div>
  );
}

function IconBtn({
  children,
  title,
  href,
  onClick,
  tone,
  disabled,
}: {
  children: React.ReactNode;
  title: string;
  href?: string;
  onClick?: () => void;
  tone?: "red";
  disabled?: boolean;
}) {
  const cls = cn(
    "inline-flex h-7 w-7 items-center justify-center rounded-md ring-1 ring-inset transition cursor-pointer",
    tone === "red"
      ? "bg-white ring-border text-red-600 hover:bg-red-50 hover:ring-red-200"
      : "bg-white ring-border text-navy-900 hover:ring-cyan-400 hover:text-cyan-700",
    disabled && "opacity-50 pointer-events-none"
  );
  if (href) {
    return (
      <Link href={href} className={cls} title={title} aria-label={title}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls} title={title} aria-label={title} disabled={disabled}>
      {children}
    </button>
  );
}
