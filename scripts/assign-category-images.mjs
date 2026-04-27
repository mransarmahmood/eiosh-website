import { readFileSync, writeFileSync } from "node:fs";

const mapping = {
  "health-safety-environment": "/brand/courses/iosh-managing-safely.jpg",
  "food-safety-hospitality": "/brand/courses/course-3.jpg",
  "fire-safety-emergency": "/brand/courses/fire-warden.jpg",
  "leadership-management": "/brand/courses/course-2.jpg",
  "human-resources": "/brand/courses/course-4.jpg",
  "environment-sustainability": "/brand/courses/course-5.jpg",
  "construction-site-safety": "/brand/courses/course-6.jpg",
  "first-aid-medical": "/brand/courses/course-1.jpg",
};

const catPath = new URL("../content/data/categories.json", import.meta.url);
const cats = JSON.parse(readFileSync(catPath, "utf-8"));
for (const c of cats) if (mapping[c.slug]) c.image = mapping[c.slug];
writeFileSync(catPath, JSON.stringify(cats, null, 2));
console.log(`categories: ${cats.filter((c) => c.image).length}/${cats.length} with image`);

// Accreditation badges — create initials tile paths (will be rendered as SVG, not real images — but set logo field to trigger a slot).
const accPath = new URL("../content/data/accreditations.json", import.meta.url);
const accs = JSON.parse(readFileSync(accPath, "utf-8"));
// Mark logo flag so card renders logo placeholder block
for (const a of accs) {
  if (!a.logo) a.logo = `inline:${a.shortName}`;
}
writeFileSync(accPath, JSON.stringify(accs, null, 2));
console.log(`accreditations: ${accs.length} tagged with logo marker`);
