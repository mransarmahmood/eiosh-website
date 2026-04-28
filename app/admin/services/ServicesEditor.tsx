"use client";

import { useState } from "react";
import { Plus, Trash2, Save, Loader2, Check } from "lucide-react";
import type { Service } from "@/lib/services";

const EMPTY: Service = {
  id: "",
  slug: "",
  title: "",
  category: "",
  summary: "",
  deliverables: [],
  defaultPrice: 0,
  currency: "USD",
  unit: "",
};

export function ServicesEditor({ initial }: { initial: Service[] }) {
  const [services, setServices] = useState<Service[]>(initial);
  const [draft, setDraft] = useState<Service>(EMPTY);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  function updateDraft<K extends keyof Service>(k: K, v: Service[K]) {
    setDraft((d) => ({ ...d, [k]: v }));
  }

  function updateExisting(id: string, patch: Partial<Service>) {
    setServices((arr) => arr.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function save(s: Service) {
    if (!s.id || !s.title) return;
    setSavingId(s.id);
    const res = await fetch("/api/admin/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    setSavingId(null);
    if (!res.ok) return;
    setSavedId(s.id);
    setTimeout(() => setSavedId(null), 1800);
  }

  async function addNew() {
    const id = draft.id || draft.slug || `svc-${Date.now().toString(36)}`;
    const slug = draft.slug || id;
    const next = { ...draft, id, slug };
    if (!next.title) return;
    await save(next);
    setServices((arr) => [...arr.filter((x) => x.id !== id), next]);
    setDraft(EMPTY);
  }

  async function remove(id: string) {
    if (!confirm("Delete this service? Existing proposals already sent are unaffected.")) return;
    const res = await fetch(`/api/admin/services?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (!res.ok) return;
    setServices((arr) => arr.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* New service card */}
      <details
        className="group rounded-2xl border border-cyan-200 bg-cyan-50/50 p-4"
        open={services.length === 0}
      >
        <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold text-navy-900">
          <Plus className="h-4 w-4 text-cyan-700" /> Add a new service
        </summary>
        <div className="mt-4 space-y-3">
          <ServiceFields value={draft} onChange={updateDraft} />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={addNew}
              disabled={!draft.title}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-navy-900 px-4 text-sm font-semibold text-white hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" /> Add service
            </button>
          </div>
        </div>
      </details>

      {/* Existing services list */}
      <ul className="space-y-3">
        {services.map((s) => (
          <li
            key={s.id}
            className="group rounded-2xl border border-border bg-white p-4 shadow-sm"
          >
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold text-navy-900">{s.title}</span>
                  <span className="block text-xs text-ink-soft">
                    {s.category ?? "Uncategorised"} · {s.currency} {s.defaultPrice.toLocaleString()}
                    {s.unit ? ` · ${s.unit}` : ""}
                  </span>
                </span>
                <span className="text-xs uppercase text-ink-soft group-open:text-cyan-700">edit</span>
              </summary>
              <div className="mt-4 space-y-3">
                <ServiceFields
                  value={s}
                  onChange={(k, v) => updateExisting(s.id, { [k]: v } as Partial<Service>)}
                />
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => save(s)}
                    disabled={savingId === s.id}
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-navy-900 px-3 text-sm font-semibold text-white hover:bg-navy-800 disabled:cursor-wait"
                  >
                    {savingId === s.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : savedId === s.id ? (
                      <Check className="h-4 w-4 text-green-300" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {savedId === s.id ? "Saved" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(s.id)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 px-3 text-sm text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            </details>
          </li>
        ))}
        {services.length === 0 && (
          <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-ink-soft">
            No services yet. Add your first above.
          </li>
        )}
      </ul>
    </div>
  );
}

function ServiceFields({
  value,
  onChange,
}: {
  value: Service;
  onChange: <K extends keyof Service>(k: K, v: Service[K]) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <Field label="Title" wide>
        <input
          type="text"
          value={value.title}
          onChange={(e) => onChange("title", e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
        />
      </Field>
      <Field label="Category">
        <input
          type="text"
          value={value.category ?? ""}
          onChange={(e) => onChange("category", e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
        />
      </Field>
      <Field label="Slug">
        <input
          type="text"
          value={value.slug}
          onChange={(e) => onChange("slug", e.target.value.replace(/\s+/g, "-").toLowerCase())}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
        />
      </Field>
      <Field label="Default price">
        <input
          type="number"
          min={0}
          step="0.01"
          value={value.defaultPrice}
          onChange={(e) => onChange("defaultPrice", Number(e.target.value))}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
        />
      </Field>
      <Field label="Currency">
        <input
          type="text"
          value={value.currency}
          onChange={(e) => onChange("currency", e.target.value.toUpperCase())}
          maxLength={6}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
        />
      </Field>
      <Field label="Unit (e.g. 'per learner')">
        <input
          type="text"
          value={value.unit ?? ""}
          onChange={(e) => onChange("unit", e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
        />
      </Field>
      <Field label="Summary" wide>
        <textarea
          rows={2}
          value={value.summary ?? ""}
          onChange={(e) => onChange("summary", e.target.value)}
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
        />
      </Field>
      <Field label="Deliverables (one per line)" wide>
        <textarea
          rows={4}
          value={value.deliverables.join("\n")}
          onChange={(e) =>
            onChange("deliverables", e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))
          }
          className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
        />
      </Field>
    </div>
  );
}

function Field({
  label,
  wide,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${wide ? "md:col-span-2" : ""}`}>
      <span className="text-xs font-medium uppercase tracking-wider text-ink-soft">{label}</span>
      <span className="mt-1 block">{children}</span>
    </label>
  );
}
