"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FieldDef, ResourceSchema } from "@/lib/cms/schemas";
import { get } from "@/lib/cms/shape";
import { AIGenerateButton } from "./AIGenerateButton";
import { DocumentTemplateLoader } from "./DocumentTemplateLoader";

// Per-resource map: which field gets which AI purpose, and what source field
// supplies the input. Expand as needed when new resources or fields appear.
const AI_FIELDS: Record<string, Record<string, { purpose: Parameters<typeof AIGenerateButton>[0]["purpose"]; source: string; label?: string }>> = {
  courses: {
    headline: { purpose: "course-headline", source: "title", label: "Generate headline" },
    learningOutcomes: { purpose: "course-learning-outcomes", source: "title", label: "Generate learning outcomes" },
    assessment: { purpose: "course-assessment", source: "title", label: "Generate assessment text" },
    certification: { purpose: "course-certification", source: "title", label: "Generate certification text" },
    moduleOutline: { purpose: "course-module-outline", source: "title", label: "Generate module outline" },
  },
  blog: {
    excerpt: { purpose: "blog-excerpt", source: "title", label: "Generate excerpt" },
  },
  testimonials: {
    quote: { purpose: "testimonial-rewrite", source: "quote", label: "Polish this quote" },
  },
  trainers: {
    bio: { purpose: "trainer-bio", source: "name", label: "Generate bio" },
  },
};

interface Props {
  schema: ResourceSchema;
  initial: Record<string, any> | null;
  mode: "create" | "edit";
  id?: string;
}

// Single form that renders every schema-defined field type and POSTs JSON to
// /api/admin/[resource]. Server coerces strings back into their real types.
export function ResourceForm({ schema, initial, mode, id }: Props) {
  const [state, setState] = useState<Record<string, any>>(initial ?? {});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const setPath = (path: string, value: any) => {
    setState((prev) => {
      const keys = path.split(".");
      const next = structuredClone(prev);
      let c: any = next;
      for (let i = 0; i < keys.length - 1; i++) {
        c[keys[i]] = c[keys[i]] == null ? {} : c[keys[i]];
        c = c[keys[i]];
      }
      c[keys[keys.length - 1]] = value;
      return next;
    });
    setSaved(false);
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const payload: Record<string, any> = {};
    for (const f of schema.fields) {
      const path = f.path ?? f.name;
      payload[path] = get(state, path);
    }
    const res = await fetch(
      mode === "edit" ? `/api/admin/${schema.key}/${id}` : `/api/admin/${schema.key}`,
      {
        method: mode === "edit" ? "PUT" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const body = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setError(body.error ?? "Save failed.");
      return;
    }
    setSaved(true);
    if (mode === "create") {
      const newId = body.record?.[schema.idField ?? "id"];
      if (newId) {
        router.push(`/admin/${schema.key}/${newId}`);
      } else {
        router.push(`/admin/${schema.key}`);
      }
      router.refresh();
    } else {
      router.refresh();
    }
  }

  async function onDelete() {
    if (mode !== "edit" || !id) return;
    if (!confirm("Delete this record? This cannot be undone.")) return;
    setBusy(true);
    const res = await fetch(`/api/admin/${schema.key}/${id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      router.push(`/admin/${schema.key}`);
      router.refresh();
    } else {
      setError("Delete failed.");
    }
  }

  const showTemplateLoader =
    schema.key === "proposals" || schema.key === "quotations" || schema.key === "invoices";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {showTemplateLoader ? (
        <DocumentTemplateLoader
          resourceKey={schema.key as "proposals" | "quotations" | "invoices"}
          currentState={state}
          setPath={setPath}
        />
      ) : null}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {schema.fields.map((f) => {
          const aiMapping = AI_FIELDS[schema.key]?.[f.name];
          return (
            <div key={f.name} className={cn(f.wide && "md:col-span-2")}>
              <Field
                field={f}
                value={get(state, f.path ?? f.name)}
                onChange={(v) => setPath(f.path ?? f.name, v)}
              />
              {aiMapping ? (
                <AIGenerateButton
                  purpose={aiMapping.purpose}
                  inputLabel={aiMapping.source}
                  getInput={() => String(get(state, aiMapping.source) ?? "")}
                  getContext={() =>
                    [get(state, "headline"), get(state, "awardingBody"), get(state, "level")]
                      .filter(Boolean)
                      .join(" · ")
                  }
                  onInsert={(text) => {
                    if (f.type === "stringList") {
                      const lines = text.split(/\n+/).map((s) => s.trim()).filter(Boolean);
                      setPath(f.path ?? f.name, lines);
                    } else if (f.type === "moduleList") {
                      const modules = text
                        .split(/\n+/)
                        .map((line) => {
                          const [title, ...rest] = line.split(/\s*[–—-]\s*/);
                          return {
                            title: (title ?? "").trim(),
                            description: rest.join(" — ").trim(),
                          };
                        })
                        .filter((m) => m.title);
                      setPath(f.path ?? f.name, modules);
                    } else {
                      setPath(f.path ?? f.name, text);
                    }
                  }}
                  label={aiMapping.label}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      {error ? <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">{error}</p> : null}
      {saved ? <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200">Saved.</p> : null}

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60 cursor-pointer"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {mode === "create" ? "Create" : "Save changes"}
        </button>
        {mode === "edit" && schema.shape === "collection" ? (
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 ring-1 ring-inset ring-red-200 transition hover:bg-red-100 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        ) : null}
      </div>
    </form>
  );
}

function Field({ field, value, onChange }: { field: FieldDef; value: any; onChange: (v: any) => void }) {
  const label = (
    <label className="mb-1.5 block text-sm font-medium text-navy-900">
      {field.label}
      {field.required ? <span className="ml-1 text-red-500">*</span> : null}
    </label>
  );

  const common =
    "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60";

  switch (field.type) {
    case "textarea":
    case "richtext":
      return (
        <div>
          {label}
          <textarea
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            rows={field.type === "richtext" ? 10 : 4}
            className={common}
            placeholder={field.placeholder}
          />
          {field.help ? <p className="mt-1 text-xs text-ink-soft">{field.help}</p> : null}
        </div>
      );
    case "enum":
      return (
        <div>
          {label}
          <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={cn(common, "cursor-pointer")}>
            <option value="">— Select —</option>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    case "number":
      return (
        <div>
          {label}
          <input
            type="number"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
            className={common}
            placeholder={field.placeholder}
          />
          {field.help ? <p className="mt-1 text-xs text-ink-soft">{field.help}</p> : null}
        </div>
      );
    case "boolean":
      return (
        <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-border text-cyan-600 focus:ring-cyan-500"
          />
          <span className="font-medium text-navy-900">{field.label}</span>
        </label>
      );
    case "date":
      return (
        <div>
          {label}
          <input type="date" value={(value ?? "").slice(0, 10)} onChange={(e) => onChange(e.target.value)} className={common} />
        </div>
      );
    case "datetime":
      return (
        <div>
          {label}
          <input
            type="datetime-local"
            value={value ? new Date(value).toISOString().slice(0, 16) : ""}
            onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : "")}
            className={common}
          />
        </div>
      );
    case "color":
      return (
        <div>
          {label}
          <input type="color" value={value ?? "#0A1F44"} onChange={(e) => onChange(e.target.value)} className="h-10 w-24 rounded-md border border-border bg-white" />
        </div>
      );
    case "tags":
      return (
        <div>
          {label}
          <input
            type="text"
            value={Array.isArray(value) ? value.join(", ") : value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={common}
            placeholder="Comma separated, e.g. IOSH, Safety, 2026"
          />
          {field.help ? <p className="mt-1 text-xs text-ink-soft">{field.help}</p> : null}
        </div>
      );
    case "stringList": {
      const arr: string[] = Array.isArray(value) ? value : [];
      return (
        <div>
          {label}
          <ul className="space-y-2">
            {arr.map((item, idx) => (
              <li key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const next = [...arr];
                    next[idx] = e.target.value;
                    onChange(next);
                  }}
                  className={common}
                />
                <button
                  type="button"
                  onClick={() => onChange(arr.filter((_, i) => i !== idx))}
                  className="rounded-lg bg-red-50 px-2.5 text-red-700 hover:bg-red-100 cursor-pointer"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onChange([...arr, ""])}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-800 ring-1 ring-inset ring-cyan-200 hover:bg-cyan-100 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add item
          </button>
        </div>
      );
    }
    case "moduleList": {
      const arr: { title: string; description: string }[] = Array.isArray(value) ? value : [];
      return (
        <div>
          {label}
          <ul className="space-y-3">
            {arr.map((m, idx) => (
              <li key={idx} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-ink-soft">Module {idx + 1}</p>
                  <button
                    type="button"
                    onClick={() => onChange(arr.filter((_, i) => i !== idx))}
                    className="text-red-700 hover:text-red-900"
                    aria-label="Remove module"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={m.title ?? ""}
                  onChange={(e) => {
                    const next = [...arr];
                    next[idx] = { ...next[idx], title: e.target.value };
                    onChange(next);
                  }}
                  className={cn(common, "mt-2")}
                  placeholder="Module title"
                />
                <textarea
                  value={m.description ?? ""}
                  onChange={(e) => {
                    const next = [...arr];
                    next[idx] = { ...next[idx], description: e.target.value };
                    onChange(next);
                  }}
                  rows={2}
                  className={cn(common, "mt-2")}
                  placeholder="Module description"
                />
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onChange([...arr, { title: "", description: "" }])}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-800 ring-1 ring-inset ring-cyan-200 hover:bg-cyan-100 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add module
          </button>
        </div>
      );
    }
    case "statList": {
      const arr: { label: string; value: string }[] = Array.isArray(value) ? value : [];
      return (
        <div>
          {label}
          <ul className="space-y-2">
            {arr.map((s, idx) => (
              <li key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                <input
                  type="text"
                  value={s.label ?? ""}
                  onChange={(e) => {
                    const next = [...arr];
                    next[idx] = { ...next[idx], label: e.target.value };
                    onChange(next);
                  }}
                  className={common}
                  placeholder="Label (e.g. Students enrolled)"
                />
                <input
                  type="text"
                  value={s.value ?? ""}
                  onChange={(e) => {
                    const next = [...arr];
                    next[idx] = { ...next[idx], value: e.target.value };
                    onChange(next);
                  }}
                  className={common}
                  placeholder="Value (e.g. 1,500+)"
                />
                <button
                  type="button"
                  onClick={() => onChange(arr.filter((_, i) => i !== idx))}
                  className="rounded-lg bg-red-50 px-2.5 text-red-700 hover:bg-red-100 cursor-pointer"
                  aria-label="Remove"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => onChange([...arr, { label: "", value: "" }])}
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-800 ring-1 ring-inset ring-cyan-200 hover:bg-cyan-100 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add stat
          </button>
        </div>
      );
    }
    case "lineItems": {
      const arr: { description: string; qty: number; unitPrice: number }[] = Array.isArray(value) ? value : [];
      const running = arr.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.unitPrice) || 0), 0);
      return (
        <div>
          {label}
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-[1fr_80px_120px_120px_40px] gap-2 bg-surface-subtle px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-wider text-ink-soft">
              <span>Description</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Unit price</span>
              <span className="text-right">Line total</span>
              <span />
            </div>
            <ul className="divide-y divide-border bg-white">
              {arr.map((item, idx) => {
                const lineTotal = (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
                return (
                  <li key={idx} className="grid grid-cols-[1fr_80px_120px_120px_40px] gap-2 p-2">
                    <input
                      type="text"
                      value={item.description ?? ""}
                      onChange={(e) => {
                        const next = [...arr];
                        next[idx] = { ...next[idx], description: e.target.value };
                        onChange(next);
                      }}
                      className={common}
                      placeholder="e.g. IOSH Managing Safely — 20 seats"
                    />
                    <input
                      type="number"
                      min={0}
                      value={item.qty ?? 1}
                      onChange={(e) => {
                        const next = [...arr];
                        next[idx] = { ...next[idx], qty: Number(e.target.value) };
                        onChange(next);
                      }}
                      className={cn(common, "text-right tabular-nums")}
                    />
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.unitPrice ?? 0}
                      onChange={(e) => {
                        const next = [...arr];
                        next[idx] = { ...next[idx], unitPrice: Number(e.target.value) };
                        onChange(next);
                      }}
                      className={cn(common, "text-right tabular-nums")}
                    />
                    <span className="inline-flex items-center justify-end text-sm font-semibold text-navy-900 tabular-nums">
                      {lineTotal.toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onChange(arr.filter((_, i) => i !== idx))}
                      className="rounded-lg bg-red-50 px-2 text-red-700 hover:bg-red-100 cursor-pointer"
                      aria-label="Remove line"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
            {arr.length > 0 ? (
              <div className="flex items-center justify-end gap-4 border-t border-border bg-surface-subtle px-3 py-2 text-sm">
                <span className="text-ink-muted">Subtotal</span>
                <span className="font-heading font-semibold text-navy-900 tabular-nums">
                  {running.toFixed(2)}
                </span>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() =>
              onChange([...arr, { description: "", qty: 1, unitPrice: 0 }])
            }
            className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-800 ring-1 ring-inset ring-cyan-200 hover:bg-cyan-100 cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" /> Add line
          </button>
        </div>
      );
    }
    case "socialObj": {
      const obj: Record<string, string> = value && typeof value === "object" ? value : {};
      const keys = ["linkedin", "facebook", "instagram", "youtube", "x"];
      return (
        <div>
          {label}
          <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {keys.map((k) => (
              <li key={k}>
                <label className="mb-1 block text-xs font-medium capitalize text-ink-muted">{k}</label>
                <input
                  type="text"
                  value={obj[k] ?? ""}
                  onChange={(e) => onChange({ ...obj, [k]: e.target.value })}
                  className={common}
                  placeholder={`https://${k}.com/eiosh`}
                />
              </li>
            ))}
          </ul>
        </div>
      );
    }
    default:
      return (
        <div>
          {label}
          <input
            type="text"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            className={common}
            placeholder={field.placeholder}
          />
          {field.help ? <p className="mt-1 text-xs text-ink-soft">{field.help}</p> : null}
        </div>
      );
  }
}
