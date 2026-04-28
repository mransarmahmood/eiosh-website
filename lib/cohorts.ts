import { promises as fs } from "node:fs";
import { join } from "node:path";

export interface Cohort {
  id: string;
  reference: string; // "CHRT-2026-0042"
  courseSlug: string;
  /** Trainer slug from content/data/trainers.json (optional). */
  trainerSlug?: string;
  startDate: string;     // ISO date
  endDate?: string;
  schedule?: string;     // "Tue 18:00–21:00" etc.
  mode: "in-person" | "online" | "hybrid" | "blended";
  location?: string;     // venue or "Online"
  capacity: number;
  bookedCount: number;
  status: "open" | "confirmed" | "running" | "closed" | "cancelled";
  notes?: string;
  /** Email addresses on the waitlist (overflow). */
  waitlist: string[];
}

const FILE = join(process.cwd(), "content", "data", "cohorts.json");

export async function listCohorts(filter?: {
  courseSlug?: string;
  status?: Cohort["status"];
}): Promise<Cohort[]> {
  try {
    const txt = await fs.readFile(FILE, "utf-8");
    const all = (Array.isArray(JSON.parse(txt)) ? JSON.parse(txt) : []) as Cohort[];
    return all.filter((c) => {
      if (filter?.courseSlug && c.courseSlug !== filter.courseSlug) return false;
      if (filter?.status && c.status !== filter.status) return false;
      return true;
    });
  } catch {
    return [];
  }
}

export async function saveCohorts(rows: Cohort[]): Promise<void> {
  await fs.mkdir(join(process.cwd(), "content", "data"), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf-8");
}

export async function findCohort(id: string): Promise<Cohort | null> {
  return (await listCohorts()).find((c) => c.id === id || c.reference === id) ?? null;
}

export async function upsertCohort(c: Cohort): Promise<Cohort> {
  const all = await listCohorts();
  const i = all.findIndex((x) => x.id === c.id);
  if (i >= 0) all[i] = c;
  else all.push(c);
  await saveCohorts(all);
  return c;
}

export async function deleteCohort(id: string): Promise<void> {
  const all = await listCohorts();
  await saveCohorts(all.filter((c) => c.id !== id));
}

export function nextReference(existing: Cohort[]): string {
  const year = new Date().getFullYear();
  const seq =
    existing
      .map((c) => c.reference)
      .map((r) => {
        const m = r?.match(/^CHRT-(\d{4})-(\d{4,})$/);
        return m && Number(m[1]) === year ? Number(m[2]) : 0;
      })
      .reduce((max, n) => (n > max ? n : max), 0) + 1;
  return `CHRT-${year}-${String(seq).padStart(4, "0")}`;
}

export function isFull(c: Cohort): boolean {
  return c.bookedCount >= c.capacity;
}

export async function addToWaitlist(cohortId: string, email: string): Promise<boolean> {
  const all = await listCohorts();
  const i = all.findIndex((c) => c.id === cohortId);
  if (i < 0) return false;
  const norm = email.trim().toLowerCase();
  if (!all[i].waitlist.includes(norm)) {
    all[i].waitlist.push(norm);
    await saveCohorts(all);
  }
  return true;
}
