import { promises as fs } from "node:fs";
import { join } from "node:path";

export interface Job {
  id: string;
  slug: string;
  title: string;
  company: string;
  companyLogo: string | null;
  location: string;
  remote: boolean;
  employmentType: "full-time" | "part-time" | "contract" | "internship";
  salaryFrom: number | null;
  salaryTo: number | null;
  currency: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  applyUrl: string | null;
  applyEmail: string | null;
  postedAt: string; // YYYY-MM-DD
  expiresAt: string | null;
  featured: boolean;
  active: boolean;
}

const FILE = join(process.cwd(), "content", "data", "jobs.json");

export async function listJobs(opts?: { onlyActive?: boolean }): Promise<Job[]> {
  try {
    const txt = await fs.readFile(FILE, "utf-8");
    const arr = JSON.parse(txt);
    if (!Array.isArray(arr)) return [];
    let jobs = arr as Job[];
    if (opts?.onlyActive ?? true) {
      const now = Date.now();
      jobs = jobs.filter(
        (j) => j.active && (!j.expiresAt || Date.parse(j.expiresAt) >= now),
      );
    }
    return jobs.sort(
      (a, b) =>
        (b.featured ? 1 : 0) - (a.featured ? 1 : 0) ||
        Date.parse(b.postedAt) - Date.parse(a.postedAt),
    );
  } catch {
    return [];
  }
}

export async function findJob(slug: string): Promise<Job | null> {
  const all = await listJobs({ onlyActive: false });
  return all.find((j) => j.slug === slug || j.id === slug) ?? null;
}

export async function saveJobs(rows: Job[]): Promise<void> {
  await fs.mkdir(join(process.cwd(), "content", "data"), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf-8");
}
