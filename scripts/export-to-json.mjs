// Export content/*.ts → content/data/*.json. One-shot migration helper.
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const dataDir = resolve(root, "content/data");
mkdirSync(dataDir, { recursive: true });

const targets = [
  ["content/site.ts", "site"],
  ["content/accreditations.ts", "accreditations"],
  ["content/categories.ts", "categories"],
  ["content/courses.ts", "courses"],
  ["content/trainers.ts", "trainers"],
  ["content/testimonials.ts", "testimonials"],
  ["content/blog.ts", "blog"],
  ["content/events.ts", "events"],
  ["content/faqs.ts", "faqs"],
  ["content/freeCourses.ts", "freeCourses"],
  ["content/resources.ts", "resources"],
];

import { pathToFileURL } from "node:url";
for (const [rel, name] of targets) {
  const mod = await import(pathToFileURL(resolve(root, rel)).href);
  const value = mod[name];
  const outName = name === "freeCourses" ? "free-courses.json" : `${name}.json`;
  const outPath = resolve(dataDir, outName);
  writeFileSync(outPath, JSON.stringify(value, null, 2));
  console.log("wrote", outName, Array.isArray(value) ? `(${value.length} records)` : "(singleton)");
}
