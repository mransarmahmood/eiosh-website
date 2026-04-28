import { promises as fs } from "node:fs";
import { join } from "node:path";

export interface Service {
  id: string;
  slug: string;
  title: string;
  category?: string;
  summary?: string;
  deliverables: string[];
  defaultPrice: number;
  currency: string;
  /** Free-text unit description, e.g. "per learner" or "cohort up to 20". */
  unit?: string;
}

const FILE = join(process.cwd(), "content", "data", "services.json");

export async function listServices(): Promise<Service[]> {
  try {
    const txt = await fs.readFile(FILE, "utf-8");
    const arr = JSON.parse(txt);
    return Array.isArray(arr) ? (arr as Service[]) : [];
  } catch {
    return [];
  }
}

export async function saveServices(services: Service[]): Promise<void> {
  await fs.mkdir(join(process.cwd(), "content", "data"), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(services, null, 2), "utf-8");
}

export async function findService(idOrSlug: string): Promise<Service | null> {
  const all = await listServices();
  return all.find((s) => s.id === idOrSlug || s.slug === idOrSlug) ?? null;
}

export async function upsertService(input: Service): Promise<Service> {
  const all = await listServices();
  const i = all.findIndex((s) => s.id === input.id);
  if (i >= 0) {
    all[i] = input;
  } else {
    all.push(input);
  }
  await saveServices(all);
  return input;
}

export async function deleteService(id: string): Promise<void> {
  const all = await listServices();
  await saveServices(all.filter((s) => s.id !== id));
}
