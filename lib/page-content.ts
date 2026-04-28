import { promises as fs } from "node:fs";
import { join } from "node:path";

/**
 * Load a page-content JSON file from `content/data/page-{slug}.json`.
 *
 * Used by the static-page templates (certification-preparation, about,
 * corporate-training, …) so admins can edit the page from /admin/page-{slug}
 * without touching code.
 */
export async function loadPageContent<T>(slug: string): Promise<T> {
  const path = join(process.cwd(), "content", "data", `page-${slug}.json`);
  const txt = await fs.readFile(path, "utf-8");
  return JSON.parse(txt) as T;
}

export interface BasicHero {
  eyebrow?: string;
  title: string;
  description?: string;
}

export interface BasicCta {
  heading: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export interface IconCard {
  icon?: string;
  title: string;
  description: string;
}
