"use client";

import { useState } from "react";
import { Wand2, Check } from "lucide-react";
import {
  PROPOSAL_TEMPLATES,
  QUOTATION_TEMPLATES,
  INVOICE_TEMPLATES,
  daysFromNow,
} from "@/lib/document-templates";
import type { DocumentKind } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  resourceKey: "proposals" | "quotations" | "invoices";
  currentState: Record<string, any>;
  setPath: (path: string, value: any) => void;
}

// One-click "load the ready-to-submit template" panel. Covers proposals,
// quotations and invoices — each with professional EIOSH wording.
export function DocumentTemplateLoader({ resourceKey, currentState, setPath }: Props) {
  const [applied, setApplied] = useState<DocumentKind | null>(null);

  const currentKind = (currentState.kind as DocumentKind) || "training";
  const templates =
    resourceKey === "proposals"
      ? PROPOSAL_TEMPLATES
      : resourceKey === "quotations"
      ? QUOTATION_TEMPLATES
      : INVOICE_TEMPLATES;

  const options = Object.values(templates).map((t: any) => ({
    value: t.kind as DocumentKind,
    label: t.label as string,
    summary: (t.summary ?? t.serviceLabel ?? t.subject) as string,
  }));

  function apply(kind: DocumentKind) {
    setPath("kind", kind);
    if (resourceKey === "proposals") {
      const t = PROPOSAL_TEMPLATES[kind];
      setPath("overview", t.overview);
      setPath("scope", t.scope);
      setPath("deliverables", t.deliverables);
      setPath("timeline", t.timeline);
      setPath("investmentSummary", t.investmentSummary);
      setPath("terms", t.terms);
      if (!currentState.invoiceDate) setPath("invoiceDate", new Date().toISOString().slice(0, 10));
      if (!currentState.validUntil) setPath("validUntil", daysFromNow(t.validityDays).slice(0, 10));
      if (!currentState.title) setPath("title", `${t.label} for [Client Name]`);
    } else if (resourceKey === "quotations") {
      const t = QUOTATION_TEMPLATES[kind];
      setPath("overview", t.overview);
      setPath("lineItems", t.lineItems);
      setPath("terms", t.terms);
      setPath("serviceRequired", t.serviceLabel);
      if (!currentState.currency) setPath("currency", "USD");
      if (currentState.vatPercent == null) setPath("vatPercent", 0);
      if (!currentState.validUntil) setPath("validUntil", daysFromNow(t.validityDays).slice(0, 10));
      if (!currentState.title) setPath("title", `${t.label} for [Client Name]`);
    } else {
      const t = INVOICE_TEMPLATES[kind];
      setPath("lineItems", t.lineItems);
      setPath("terms", t.terms);
      setPath("currency", t.currency);
      setPath("vatPercent", t.vatPercent);
      if (!currentState.invoiceDate) setPath("invoiceDate", new Date().toISOString().slice(0, 10));
      if (!currentState.dueDate) setPath("dueDate", daysFromNow(t.paymentDueDays).slice(0, 10));
      if (!currentState.title) setPath("title", `${t.subject} — [Client Name]`);
    }
    setApplied(kind);
    window.setTimeout(() => setApplied(null), 2400);
  }

  const titleLabel =
    resourceKey === "proposals"
      ? "proposal"
      : resourceKey === "quotations"
      ? "quotation"
      : "invoice";

  return (
    <div className="rounded-2xl bg-gradient-to-br from-navy-50 via-white to-cyan-50 p-5 ring-1 ring-cyan-200">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-navy-900 to-cyan-600 text-white shadow-elevated">
          <Wand2 className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="font-heading text-base font-semibold text-navy-900">Load a ready-to-submit template</p>
          <p className="mt-0.5 text-sm text-ink-muted">
            Pick a {titleLabel} type to pre-fill this document with professional EIOSH wording, sample line items and
            standard terms. You can edit every field before sending.
          </p>
        </div>
      </div>

      <ul className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const active = currentKind === o.value && applied !== null;
          return (
            <li key={o.value}>
              <button
                type="button"
                onClick={() => apply(o.value)}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-xl bg-white p-3 text-left ring-1 transition cursor-pointer",
                  active
                    ? "ring-emerald-400 bg-emerald-50"
                    : currentKind === o.value
                    ? "ring-cyan-500"
                    : "ring-border hover:ring-cyan-400"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[0.7rem] font-semibold",
                    active
                      ? "bg-emerald-500 text-white"
                      : currentKind === o.value
                      ? "bg-cyan-500 text-white"
                      : "bg-surface-subtle text-ink-soft"
                  )}
                >
                  {active ? <Check className="h-3 w-3" /> : null}
                </span>
                <span className="min-w-0">
                  <p className="font-heading text-sm font-semibold text-navy-900">{o.label}</p>
                  <p className="mt-0.5 text-xs text-ink-muted line-clamp-2">{o.summary}</p>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
