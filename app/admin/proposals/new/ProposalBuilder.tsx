"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, FileText, Send, ExternalLink, Check } from "lucide-react";
import type {
  ProposalTemplate,
  SavedProposal,
  ProposalLineItem,
  PriceDisplayMode,
} from "@/lib/proposals";
import type { Service } from "@/lib/services";
import { CurrencySelect } from "@/components/admin/CurrencySelect";

const blankItem = (currency = "USD"): ProposalLineItem => ({
  id: "li-" + Math.random().toString(36).slice(2, 8),
  title: "",
  quantity: 1,
  unitPrice: 0,
  currency,
});

export function ProposalBuilder({
  templates,
  services,
}: {
  templates: ProposalTemplate[];
  services: Service[];
}) {
  const router = useRouter();
  const [step, setStep] = useState<"template" | "edit">("template");
  const [draft, setDraft] = useState<Partial<SavedProposal>>({
    title: "",
    client: { company: "", contactName: "", contactEmail: "", addressLines: [], country: "" },
    intro: "",
    approach: "",
    lineItems: [],
    terms: "",
    notes: "",
    currency: "USD",
    priceDisplayMode: "all",
    lumpSumLabel: "",
    totals: {
      subtotal: 0,
      discountPercent: 0,
      discountAmount: 0,
      taxPercent: 0,
      taxAmount: 0,
      total: 0,
    },
  });
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [savedRef, setSavedRef] = useState<{ id: string; reference: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  function pickTemplate(t: ProposalTemplate) {
    const items = t.serviceIds
      .map((sid) => services.find((s) => s.id === sid))
      .filter((s): s is Service => !!s)
      .map((s) => ({
        id: "li-" + Math.random().toString(36).slice(2, 8),
        serviceId: s.id,
        title: s.title,
        description: s.summary,
        quantity: 1,
        unitPrice: s.defaultPrice,
        currency: s.currency,
        unit: s.unit,
      }));
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + t.validityDays);
    setDraft({
      ...draft,
      templateId: t.id,
      title: t.title,
      intro: t.intro,
      approach: t.approach,
      terms: t.terms,
      lineItems: items,
      currency: items[0]?.currency ?? "USD",
      validUntil: validUntil.toISOString().slice(0, 10),
      totals: { ...draft.totals!, discountPercent: 0, taxPercent: 0 },
    });
    setStep("edit");
  }

  function startBlank() {
    setDraft({ ...draft, templateId: undefined, lineItems: [blankItem()] });
    setStep("edit");
  }

  // ── line items helpers ───────────────────────────────────────────────────
  function addLineItemFromService(s: Service) {
    setDraft((d) => ({
      ...d,
      lineItems: [
        ...(d.lineItems ?? []),
        {
          id: "li-" + Math.random().toString(36).slice(2, 8),
          serviceId: s.id,
          title: s.title,
          description: s.summary,
          quantity: 1,
          unitPrice: s.defaultPrice,
          currency: s.currency,
          unit: s.unit,
        },
      ],
    }));
  }

  function updateLineItem(id: string, patch: Partial<ProposalLineItem>) {
    setDraft((d) => ({
      ...d,
      lineItems: (d.lineItems ?? []).map((li) => (li.id === id ? { ...li, ...patch } : li)),
    }));
  }

  function removeLineItem(id: string) {
    setDraft((d) => ({
      ...d,
      lineItems: (d.lineItems ?? []).filter((li) => li.id !== id),
    }));
  }

  // ── totals ───────────────────────────────────────────────────────────────
  const totals = useMemo(() => {
    const sub = (draft.lineItems ?? []).reduce((s, li) => s + li.quantity * li.unitPrice, 0);
    const disc = (sub * (draft.totals?.discountPercent ?? 0)) / 100;
    const taxable = sub - disc;
    const tax = (taxable * (draft.totals?.taxPercent ?? 0)) / 100;
    return {
      subtotal: sub,
      discountAmount: disc,
      taxAmount: tax,
      total: taxable + tax,
    };
  }, [draft]);

  async function save(status: SavedProposal["status"]) {
    setSaveState("saving");
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, status }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrorMsg(json.error ?? "Save failed.");
        setSaveState("error");
        return;
      }
      setSavedRef({ id: json.proposal.id, reference: json.proposal.reference });
      setSaveState("saved");
    } catch {
      setErrorMsg("Network error.");
      setSaveState("error");
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────
  if (step === "template") {
    return (
      <div className="space-y-6">
        <p className="text-sm text-ink-soft">
          Pick a starting template — you can still edit everything afterward.
        </p>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {templates.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => pickTemplate(t)}
                className="group flex h-full w-full flex-col rounded-2xl border border-border bg-white p-5 text-left transition hover:border-cyan-400 hover:shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-700" />
                  <h3 className="font-semibold text-navy-900">{t.title}</h3>
                </div>
                <p className="mt-2 text-sm text-ink-soft">{t.description}</p>
                <p className="mt-4 text-xs uppercase tracking-wider text-ink-soft">
                  {t.serviceIds.length} pre-loaded service{t.serviceIds.length === 1 ? "" : "s"} ·
                  valid {t.validityDays} days
                </p>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={startBlank}
              className="flex h-full w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white p-8 text-center transition hover:border-cyan-400"
            >
              <Plus className="h-6 w-6 text-cyan-700" />
              <span className="mt-2 font-semibold text-navy-900">Start blank</span>
              <span className="mt-1 text-xs text-ink-soft">No template — build from scratch.</span>
            </button>
          </li>
        </ul>
      </div>
    );
  }

  // step === "edit"
  if (savedRef) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <Check className="mx-auto h-10 w-10 text-green-600" />
        <p className="mt-2 font-semibold text-green-900">
          Proposal saved as {savedRef.reference}
        </p>
        <p className="mt-1 text-sm text-green-800">
          Send the public link to your client, or open it to print/PDF.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <a
            href={`/proposal/${savedRef.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
          >
            <ExternalLink className="h-4 w-4" /> Open public proposal
          </a>
          <button
            type="button"
            onClick={() => {
              setSavedRef(null);
              setSaveState("idle");
              setStep("template");
              setDraft({
                title: "",
                client: { company: "", contactName: "", contactEmail: "", addressLines: [], country: "" },
                intro: "",
                approach: "",
                lineItems: [],
                terms: "",
                currency: "USD",
                priceDisplayMode: "all",
                lumpSumLabel: "",
                totals: {
                  subtotal: 0,
                  discountPercent: 0,
                  discountAmount: 0,
                  taxPercent: 0,
                  taxAmount: 0,
                  total: 0,
                },
              });
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-navy-50"
          >
            Build another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button
        type="button"
        onClick={() => setStep("template")}
        className="text-sm text-cyan-700 hover:underline"
      >
        ← Pick a different template
      </button>

      {/* Client block */}
      <Section title="Client">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Company name" required>
            <Input
              value={draft.client?.company ?? ""}
              onChange={(v) =>
                setDraft((d) => ({ ...d, client: { ...d.client!, company: v } }))
              }
            />
          </Field>
          <Field label="Contact name">
            <Input
              value={draft.client?.contactName ?? ""}
              onChange={(v) =>
                setDraft((d) => ({ ...d, client: { ...d.client!, contactName: v } }))
              }
            />
          </Field>
          <Field label="Contact email" required>
            <Input
              type="email"
              value={draft.client?.contactEmail ?? ""}
              onChange={(v) =>
                setDraft((d) => ({ ...d, client: { ...d.client!, contactEmail: v } }))
              }
            />
          </Field>
          <Field label="Contact phone">
            <Input
              value={draft.client?.contactPhone ?? ""}
              onChange={(v) =>
                setDraft((d) => ({ ...d, client: { ...d.client!, contactPhone: v } }))
              }
            />
          </Field>
          <Field label="Country">
            <Input
              value={draft.client?.country ?? ""}
              onChange={(v) =>
                setDraft((d) => ({ ...d, client: { ...d.client!, country: v } }))
              }
            />
          </Field>
          <Field label="Address (one line per row)" wide>
            <Textarea
              rows={2}
              value={(draft.client?.addressLines ?? []).join("\n")}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  client: {
                    ...d.client!,
                    addressLines: v.split("\n").map((s) => s.trim()).filter(Boolean),
                  },
                }))
              }
            />
          </Field>
        </div>
      </Section>

      {/* Title + intro + approach */}
      <Section title="Proposal narrative">
        <div className="space-y-3">
          <Field label="Title" required>
            <Input
              value={draft.title ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, title: v }))}
            />
          </Field>
          <Field label="Intro">
            <Textarea
              rows={3}
              value={draft.intro ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, intro: v }))}
            />
          </Field>
          <Field label="Approach (split into stages — see hint)">
            <Textarea
              rows={6}
              placeholder={`Tip: structure as numbered stages — they render as cards on the public page.

Stage 1 — Discovery
We start by reviewing your current SOPs, audit findings and learner profiles…

Stage 2 — Design
We tailor the syllabus, materials and assessment plan to your context…

Stage 3 — Delivery
Live cohorts, workplace project and exam coordination…`}
              value={draft.approach ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, approach: v }))}
            />
            <span className="mt-1 block text-[0.65rem] text-ink-soft">
              Use lines like <code className="rounded bg-ink/5 px-1">Stage 1 — Title</code> or{" "}
              <code className="rounded bg-ink/5 px-1">1. Title</code> to render as numbered stage
              cards. Plain paragraphs work too.
            </span>
          </Field>
        </div>
      </Section>

      {/* Line items */}
      <Section
        title="Services included"
        actions={
          <details className="relative">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-navy-900 hover:bg-navy-50">
              <Plus className="h-3.5 w-3.5" /> Add from catalog
            </summary>
            <div className="absolute right-0 z-10 mt-2 w-80 max-h-80 overflow-auto rounded-lg border border-border bg-white p-2 shadow-floating">
              {services.length === 0 ? (
                <p className="p-3 text-xs text-ink-soft">
                  No services in the catalog yet. Add one in Service catalog.
                </p>
              ) : (
                services.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => addLineItemFromService(s)}
                    className="block w-full rounded p-2 text-left text-sm hover:bg-cyan-50"
                  >
                    <span className="block font-medium text-navy-900">{s.title}</span>
                    <span className="block text-xs text-ink-soft">
                      {s.currency} {s.defaultPrice.toLocaleString()} · {s.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          </details>
        }
      >
        <ul className="space-y-3">
          {(draft.lineItems ?? []).map((li, i) => (
            <li key={li.id} className="rounded-lg border border-border bg-white p-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:items-start">
                <div className="md:col-span-6">
                  <Input
                    placeholder="Service title"
                    value={li.title}
                    onChange={(v) => updateLineItem(li.id, { title: v })}
                  />
                  <Textarea
                    rows={2}
                    placeholder="Optional description"
                    value={li.description ?? ""}
                    onChange={(v) => updateLineItem(li.id, { description: v })}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    type="number"
                    min={1}
                    value={li.quantity}
                    onChange={(v) => updateLineItem(li.id, { quantity: Number(v) || 1 })}
                  />
                  <p className="mt-1 text-[0.65rem] uppercase text-ink-soft">qty</p>
                </div>
                <div className="md:col-span-2">
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={li.unitPrice}
                    onChange={(v) => updateLineItem(li.id, { unitPrice: Number(v) || 0 })}
                  />
                  <CurrencySelect
                    value={li.currency || "USD"}
                    onChange={(code) => updateLineItem(li.id, { currency: code })}
                    className="mt-1 block w-full rounded-md border border-border bg-white px-2 py-1 text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div className="md:col-span-2 flex items-start gap-2">
                  <span className="rounded bg-navy-50 px-2 py-1 text-sm font-mono text-navy-900">
                    {li.currency} {(li.quantity * li.unitPrice).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLineItem(li.id)}
                    className="ml-auto rounded p-1.5 text-red-600 hover:bg-red-50"
                    aria-label="Remove line item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {i === 0 && draft.lineItems!.some((x) => x.currency !== li.currency) && (
                <p className="mt-2 text-xs text-amber-700">
                  ⚠️ Mixed currencies in line items — totals will use {li.currency}. Consider
                  aligning everything to one currency.
                </p>
              )}
            </li>
          ))}
          {(draft.lineItems?.length ?? 0) === 0 && (
            <li className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-ink-soft">
              No services added — pick from the catalog above.
            </li>
          )}
          <li>
            <button
              type="button"
              onClick={() =>
                setDraft((d) => ({
                  ...d,
                  lineItems: [...(d.lineItems ?? []), blankItem(d.currency ?? "USD")],
                }))
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-border px-3 py-1.5 text-xs text-ink-soft hover:border-cyan-400 hover:text-navy-900"
            >
              <Plus className="h-3.5 w-3.5" /> Add a custom line item
            </button>
          </li>
        </ul>

        {/* Totals */}
        <div className="mt-6 grid grid-cols-1 gap-4 rounded-xl bg-navy-50/40 p-4 md:grid-cols-3">
          <Field label="Discount %">
            <Input
              type="number"
              min={0}
              max={100}
              step="0.5"
              value={draft.totals?.discountPercent ?? 0}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  totals: { ...d.totals!, discountPercent: Number(v) || 0 },
                }))
              }
            />
          </Field>
          <Field label="Tax / VAT %">
            <Input
              type="number"
              min={0}
              max={50}
              step="0.5"
              value={draft.totals?.taxPercent ?? 0}
              onChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  totals: { ...d.totals!, taxPercent: Number(v) || 0 },
                }))
              }
            />
          </Field>
          <div className="flex flex-col justify-end space-y-0.5 text-sm">
            <p className="flex justify-between">
              <span className="text-ink-soft">Subtotal</span>
              <span className="font-mono">{totals.subtotal.toFixed(2)}</span>
            </p>
            {totals.discountAmount > 0 && (
              <p className="flex justify-between text-amber-800">
                <span>Discount</span>
                <span className="font-mono">−{totals.discountAmount.toFixed(2)}</span>
              </p>
            )}
            {totals.taxAmount > 0 && (
              <p className="flex justify-between">
                <span className="text-ink-soft">Tax</span>
                <span className="font-mono">+{totals.taxAmount.toFixed(2)}</span>
              </p>
            )}
            <p className="flex justify-between border-t border-border pt-1 font-semibold text-navy-900">
              <span>Total</span>
              <span className="font-mono">
                {(draft.lineItems?.[0]?.currency ?? "USD")} {totals.total.toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </Section>

      {/* Pricing display */}
      <Section title="How prices appear on the public page">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Price display mode">
            <select
              value={draft.priceDisplayMode ?? "all"}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  priceDisplayMode: e.target.value as PriceDisplayMode,
                }))
              }
              className="block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">Detailed — line items, unit prices and grand total</option>
              <option value="lumpsum-only">Lump sum only — services list, single total at the end</option>
              <option value="no-price">Scope only — no prices shown anywhere</option>
            </select>
            <span className="mt-1 block text-[0.65rem] text-ink-soft">
              Some clients want only a final figure, others want zero-price scope memos. Pick what
              they expect.
            </span>
          </Field>
          {(draft.priceDisplayMode ?? "all") === "lumpsum-only" && (
            <Field label="Lump-sum label (optional)">
              <Input
                placeholder="Project fee · Annual retainer · Engagement total…"
                value={draft.lumpSumLabel ?? ""}
                onChange={(v) => setDraft((d) => ({ ...d, lumpSumLabel: v }))}
              />
              <span className="mt-1 block text-[0.65rem] text-ink-soft">
                Defaults to "Total" if left blank.
              </span>
            </Field>
          )}
        </div>
      </Section>

      {/* Terms + notes + validity */}
      <Section title="Terms &amp; validity">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <Field label="Valid until">
            <Input
              type="date"
              value={draft.validUntil ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, validUntil: v }))}
            />
          </Field>
          <Field label="Internal notes (private — never shown to client)">
            <Input
              value={draft.notes ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, notes: v }))}
            />
          </Field>
          <Field label="Terms" wide>
            <Textarea
              rows={4}
              value={draft.terms ?? ""}
              onChange={(v) => setDraft((d) => ({ ...d, terms: v }))}
            />
          </Field>
        </div>
      </Section>

      {/* Actions */}
      <div className="sticky bottom-0 -mx-6 flex flex-wrap items-center gap-3 border-t border-border bg-white/90 px-6 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl">
        <button
          type="button"
          onClick={() => save("draft")}
          disabled={saveState === "saving"}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-semibold text-navy-900 hover:bg-navy-50 disabled:cursor-wait"
        >
          Save as draft
        </button>
        <button
          type="button"
          onClick={() => save("sent")}
          disabled={saveState === "saving" || !draft.client?.company || !draft.client?.contactEmail}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-navy-900 px-5 text-sm font-semibold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saveState === "saving" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Save &amp; mark as sent
        </button>
        {saveState === "error" && (
          <span className="text-sm text-red-700">{errorMsg}</span>
        )}
        <span className="ml-auto text-xs text-ink-soft">
          The public link will be{" "}
          <code className="rounded bg-ink/5 px-1">/proposal/&lt;id&gt;</code> after save.
        </span>
      </div>
    </div>
  );
}

// ── small UI helpers ──────────────────────────────────────────────────────
function Section({
  title,
  actions,
  children,
}: {
  title: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      <legend className="flex items-center justify-between gap-3 px-2 text-base font-semibold text-navy-900">
        <span>{title}</span>
      </legend>
      {actions && (
        <div className="mb-4 flex items-center justify-end">{actions}</div>
      )}
      {children}
    </fieldset>
  );
}

function Field({
  label,
  required,
  wide,
  children,
}: {
  label: string;
  required?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${wide ? "md:col-span-2" : ""}`}>
      <span className="text-xs font-medium uppercase tracking-wider text-ink-soft">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </span>
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

function Input({
  value,
  onChange,
  type = "text",
  placeholder,
  min,
  max,
  step,
}: {
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
    />
  );
}

function Textarea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="block w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
    />
  );
}
