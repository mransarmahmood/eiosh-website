import "server-only";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { getSchema, type ResourceSchema } from "./schemas";

// File-based persistence for the CMS. All content lives in content/data/*.json.
// Writes go through a temp file + rename to avoid half-written JSON on crash.

const DATA_DIR = join(process.cwd(), "content", "data");

async function readFile(file: string) {
  const path = join(DATA_DIR, file);
  const raw = await fs.readFile(path, "utf-8");
  return JSON.parse(raw);
}

async function atomicWrite(file: string, value: unknown) {
  const path = join(DATA_DIR, file);
  const tmp = `${path}.tmp-${Date.now()}`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), "utf-8");
  await fs.rename(tmp, path);
}

export async function listAll(key: string): Promise<{ schema: ResourceSchema; records: unknown[] | unknown }> {
  const schema = getSchema(key);
  if (!schema) throw new Error(`Unknown resource: ${key}`);
  const data = await readFile(schema.file);
  return { schema, records: data };
}

export async function readOne(key: string, id: string): Promise<unknown | null> {
  const schema = getSchema(key);
  if (!schema) throw new Error(`Unknown resource: ${key}`);
  const data = await readFile(schema.file);
  if (schema.shape === "singleton") return data;
  const idField = schema.idField ?? "id";
  if (!Array.isArray(data)) return null;
  return data.find((r: Record<string, unknown>) => r[idField] === id) ?? null;
}

export async function createOne(key: string, record: Record<string, unknown>) {
  const schema = getSchema(key);
  if (!schema) throw new Error(`Unknown resource: ${key}`);
  if (schema.shape !== "collection") throw new Error(`Cannot create on singleton: ${key}`);
  const data = (await readFile(schema.file)) as Record<string, unknown>[];
  const idField = schema.idField ?? "id";
  if (!record[idField]) {
    record[idField] = `${schema.key}-${Date.now().toString(36)}`;
  }
  if (data.some((r) => r[idField] === record[idField])) {
    throw new Error(`Duplicate id: ${record[idField]}`);
  }
  data.push(record);
  await atomicWrite(schema.file, data);
  return record;
}

export async function updateOne(key: string, id: string, patch: Record<string, unknown>) {
  const schema = getSchema(key);
  if (!schema) throw new Error(`Unknown resource: ${key}`);
  if (schema.shape === "singleton") {
    await atomicWrite(schema.file, patch);
    return patch;
  }
  const data = (await readFile(schema.file)) as Record<string, unknown>[];
  const idField = schema.idField ?? "id";
  const idx = data.findIndex((r) => r[idField] === id);
  if (idx === -1) throw new Error(`Record not found: ${id}`);
  data[idx] = { ...data[idx], ...patch, [idField]: id };
  await atomicWrite(schema.file, data);
  return data[idx];
}

export async function deleteOne(key: string, id: string) {
  const schema = getSchema(key);
  if (!schema) throw new Error(`Unknown resource: ${key}`);
  if (schema.shape !== "collection") throw new Error(`Cannot delete from singleton: ${key}`);
  const data = (await readFile(schema.file)) as Record<string, unknown>[];
  const idField = schema.idField ?? "id";
  const next = data.filter((r) => r[idField] !== id);
  if (next.length === data.length) throw new Error(`Record not found: ${id}`);
  await atomicWrite(schema.file, next);
}

export async function counts(): Promise<Record<string, number>> {
  const { schemas } = await import("./schemas");
  const entries = await Promise.all(
    schemas.map(async (s) => {
      try {
        const data = await readFile(s.file);
        const n = Array.isArray(data) ? data.length : 1;
        return [s.key, n] as const;
      } catch {
        return [s.key, 0] as const;
      }
    })
  );
  return Object.fromEntries(entries);
}
