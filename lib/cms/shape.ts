// Helpers for deep-path get/set using dotted field paths (e.g. "contact.email")
// and for coercing form values into their declared types.

import type { FieldDef } from "./schemas";

export function get(obj: Record<string, any> | undefined | null, path: string): unknown {
  if (!obj) return undefined;
  return path.split(".").reduce<any>((acc, k) => (acc == null ? acc : acc[k]), obj);
}

export function set(obj: Record<string, any>, path: string, value: unknown): Record<string, any> {
  const keys = path.split(".");
  const root = { ...obj };
  let cursor: any = root;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    cursor[k] = cursor[k] == null ? {} : { ...cursor[k] };
    cursor = cursor[k];
  }
  cursor[keys[keys.length - 1]] = value;
  return root;
}

// Map a raw form string (or structured value) to the correct JS type.
export function coerce(value: unknown, field: FieldDef): unknown {
  if (value === undefined) return undefined;
  if (value === "" || value === null) return undefined;
  switch (field.type) {
    case "number":
      return typeof value === "number" ? value : Number(value);
    case "boolean":
      return value === true || value === "true" || value === "on";
    case "tags":
    case "stringList":
      if (Array.isArray(value)) return value.map(String).filter(Boolean);
      if (typeof value === "string") {
        return value
          .split(field.type === "tags" ? "," : "\n")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    case "moduleList":
      if (Array.isArray(value)) {
        return value
          .map((v: any) => ({ title: String(v.title ?? ""), description: String(v.description ?? "") }))
          .filter((v) => v.title || v.description);
      }
      return [];
    case "statList":
      if (Array.isArray(value)) {
        return value
          .map((v: any) => ({ label: String(v.label ?? ""), value: String(v.value ?? "") }))
          .filter((v) => v.label || v.value);
      }
      return [];
    case "lineItems":
      if (Array.isArray(value)) {
        return value
          .map((v: any) => ({
            description: String(v.description ?? ""),
            qty: Number(v.qty ?? 1),
            unitPrice: Number(v.unitPrice ?? 0),
          }))
          .filter((v) => v.description);
      }
      return [];
    case "socialObj":
      if (value && typeof value === "object") {
        const out: Record<string, string> = {};
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          if (v) out[k] = String(v);
        }
        return out;
      }
      return {};
    case "enum":
      if (field.options?.some((o) => o.value === "5")) {
        // rating style
        const n = Number(value);
        return Number.isFinite(n) ? n : undefined;
      }
      return String(value);
    default:
      return typeof value === "string" ? value : String(value);
  }
}

// Produce a plain object from form-submitted data.
export function buildRecord(fields: FieldDef[], input: Record<string, unknown>): Record<string, any> {
  let out: Record<string, any> = {};
  for (const f of fields) {
    const path = f.path ?? f.name;
    if (!(f.name in input) && !(path in input)) continue;
    const raw = input[f.name] ?? input[path];
    const coerced = coerce(raw, f);
    if (coerced === undefined) continue;
    out = set(out, path, coerced);
  }
  return out;
}
