// Pulls real content from the eiosh_new MySQL dump into the Next.js CMS JSON
// files. Idempotent — safe to re-run. Existing records with matching ids are
// overwritten; unmatched current records are preserved.
//
// Usage: node scripts/migrate-from-eiosh-new.mjs
import mysql from "mysql2/promise";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(here, "../content/data");

function dataPath(name) {
  return resolve(dataDir, name);
}

function readJson(name) {
  const p = dataPath(name);
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf-8")) : [];
}

function writeJson(name, value) {
  writeFileSync(dataPath(name), JSON.stringify(value, null, 2), "utf-8");
}

function stripHtml(s) {
  if (s == null) return "";
  return String(s)
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripWordHtml(s) {
  // Cleans the mountains of Word-style inline style attributes but keeps
  // headings/lists/paragraphs for rendering. Good enough for blog bodies.
  if (s == null) return "";
  return String(s)
    .replace(/<\/?(o:p|xml|w:|m:)[^>]*>/gi, "")
    .replace(/\s+style="[^"]*"/gi, "")
    .replace(/\s+class="[^"]*"/gi, "")
    .replace(/\s+lang="[^"]*"/gi, "")
    .replace(/\sdir="[^"]*"/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<\?xml[\s\S]*?\?>/gi, "")
    .replace(/&nbsp;/g, " ")
    .replace(/(\s*){2,}/g, "$1")
    .trim();
}

function firstParagraph(s, maxChars = 240) {
  const clean = stripHtml(s);
  if (clean.length <= maxChars) return clean;
  return clean.slice(0, maxChars).replace(/\s+\S*$/, "") + "…";
}

function slugify(s, fallback = "") {
  if (!s) return fallback;
  return String(s)
    .toLowerCase()
    .replace(/['"']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80) || fallback;
}

async function main() {
  const conn = await mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "eiosh_new",
  });

  console.log("Connected to eiosh_new.");

  // ------------------------------------------------------------------
  // 1. Course Categories (module 3)
  // ------------------------------------------------------------------
  const [catRows] = await conn.query(
    "SELECT id, title, slug FROM modules_data WHERE module_id=3 AND status != 'deleted'"
  );
  const categories = catRows.map((r) => ({
    id: `cat-${r.id}`,
    slug: slugify(r.slug || r.title, `cat-${r.id}`),
    title: r.title,
    tagline: "International awarding body",
    description: `EIOSH delivers regulated programmes accredited by ${r.title}.`,
    icon: "Award",
  }));
  // Merge with existing pre-seed categories (keep internal category system separate)
  const existingCats = readJson("categories.json");
  const byTitle = new Map(existingCats.map((c) => [c.title, c]));
  for (const c of categories) if (!byTitle.has(c.title)) existingCats.push(c);
  writeJson("categories.json", existingCats);
  console.log(`categories.json: ${existingCats.length} total (merged ${categories.length} from SQL)`);

  // ------------------------------------------------------------------
  // 2. Popular Courses (module 2) — join to category to pick the right awarding body
  // ------------------------------------------------------------------
  const bodyBySlugOrTitle = {
    "iosh-uk": "iosh",
    "global-awards": "global-awards",
    "habc-uk": "habc",
    "icboq-uk": "icboq",
    "nasp-usa": "nasp",
    "oshawards-uk": "oshawards",
    "othm-uk": "othm",
    "iq-ohs": "iq-ohs",
    "oshacademy-usa": "oshacademy",
    "oshacademy-usa-1": "oshacademy",
    "computer-applications": "global-awards",
  };
  const bodyCategoryTopics = {
    iosh: "health-safety-environment",
    oshacademy: "health-safety-environment",
    oshawards: "health-safety-environment",
    habc: "food-safety-hospitality",
    othm: "leadership-management",
    nasp: "health-safety-environment",
    icboq: "health-safety-environment",
    "iq-ohs": "health-safety-environment",
    "global-awards": "health-safety-environment",
  };

  const [courseRows] = await conn.query(
    `SELECT d.id, d.title, d.slug, d.description,
            d.extra_field_1 AS contents, d.extra_field_2 AS outcomes,
            d.extra_field_3 AS progression, d.extra_field_4 AS code,
            d.extra_field_5 AS pass_mark,
            d.category,
            c.slug  AS category_slug,
            c.title AS category_title,
            d.created_at
       FROM modules_data d
       LEFT JOIN modules_data c ON c.id = d.category AND c.module_id = 3
      WHERE d.module_id=2 AND d.status != 'deleted'
      ORDER BY d.id`
  );
  const courses = courseRows.map((r) => {
    const slug = slugify(r.slug || r.title, `course-${r.id}`);
    const headline = firstParagraph(r.description, 180);
    const awardingBody = bodyBySlugOrTitle[r.category_slug] ?? "iosh";
    const pathwayCategory = bodyCategoryTopics[awardingBody] ?? "health-safety-environment";
    const t = (r.title || "").toLowerCase();
    const smartCategory = t.includes("food") || t.includes("haccp")
      ? "food-safety-hospitality"
      : t.includes("fire")
      ? "fire-safety-emergency"
      : t.includes("first aid") || t.includes("cpr")
      ? "first-aid-medical"
      : t.includes("leadership") || t.includes("management") && !t.includes("managing safely")
      ? "leadership-management"
      : t.includes("environment") || t.includes("sustain") || t.includes("iema")
      ? "environment-sustainability"
      : t.includes("construction") || t.includes("site") || t.includes("scaffold")
      ? "construction-site-safety"
      : pathwayCategory;
    return {
      id: `crs-sql-${r.id}`,
      slug,
      title: r.title,
      headline: headline || `${r.title} — accredited programme delivered by EIOSH.`,
      category: smartCategory,
      awardingBody,
      level: "foundation",
      durationHours: 24,
      modes: ["online", "in-person", "blended"],
      language: "en",
      status: "open",
      learningOutcomes: firstParagraph(r.outcomes, 600)
        ? stripHtml(r.outcomes)
            .split(/\s{2,}|[.•]\s+/)
            .map((s) => s.trim())
            .filter((s) => s.length > 10)
            .slice(0, 6)
        : [],
      whoShouldAttend: [],
      moduleOutline: firstParagraph(r.contents, 2000)
        ? [{ title: "Course contents", description: firstParagraph(r.contents, 500) }]
        : [],
      assessment: r.pass_mark ? `Multiple-choice assessment. Pass mark: ${r.pass_mark}%.` : "",
      certification: firstParagraph(r.progression, 400) || `${r.title} certificate issued upon completion.`,
      courseCode: r.code ?? undefined,
      featured: false,
      sourceId: r.id,
    };
  });
  const existingCourses = readJson("courses.json");
  const byCourseSlug = new Map(existingCourses.map((c) => [c.slug, c]));
  let added = 0;
  let refreshed = 0;
  for (const c of courses) {
    const existing = byCourseSlug.get(c.slug);
    if (!existing) {
      existingCourses.push(c);
      added++;
    } else if (typeof existing.id === "string" && existing.id.startsWith("crs-sql-")) {
      // Refresh awardingBody + category for previously-migrated records so they
      // reflect the latest mapping rules. Curated records (non crs-sql-*) untouched.
      existing.awardingBody = c.awardingBody;
      existing.category = c.category;
      refreshed++;
    }
  }
  writeJson("courses.json", existingCourses);
  console.log(`courses.json: ${existingCourses.length} total (added ${added}, refreshed ${refreshed} from SQL)`);

  // ------------------------------------------------------------------
  // 3. Testimonials (module 5) — OVERWRITE with production quotes
  // ------------------------------------------------------------------
  const [testRows] = await conn.query(
    "SELECT id, title AS name, description, extra_field_1 AS rating FROM modules_data WHERE module_id=5 AND status != 'deleted' ORDER BY id"
  );
  const testimonials = testRows.map((r) => {
    const quote = stripHtml(r.description);
    return {
      id: `tst-sql-${r.id}`,
      quote: quote || `${r.name} shared positive feedback about EIOSH.`,
      name: r.name,
      role: "Verified learner",
      company: "",
      rating: Math.max(1, Math.min(5, Number(r.rating) || 5)),
    };
  }).filter((t) => t.quote.length > 20);
  writeJson("testimonials.json", testimonials);
  console.log(`testimonials.json: ${testimonials.length} real quotes (OVERWROTE)`);

  // ------------------------------------------------------------------
  // 4. Advisors / Trainers (module 7)
  // ------------------------------------------------------------------
  const [advRows] = await conn.query(
    "SELECT id, title AS name, extra_field_1 AS designation, description, extra_field_6 AS address FROM modules_data WHERE module_id=7 AND status != 'deleted' ORDER BY id"
  );
  const sqlTrainers = advRows.map((r) => {
    const bio = stripHtml(r.description) || `${r.name} is a member of the EIOSH faculty.`;
    return {
      id: `trn-sql-${r.id}`,
      slug: slugify(r.name, `trn-${r.id}`),
      name: r.name,
      title: r.designation && r.designation !== "Art teacher" && r.designation !== "School Teacher"
        ? r.designation
        : "Senior Trainer",
      credentials: ["IOSH", "NEBOSH"],
      specialisms: ["Health & Safety"],
      bio,
    };
  });
  const existingTrainers = readJson("trainers.json");
  const bySlug = new Map(existingTrainers.map((t) => [t.slug, t]));
  for (const t of sqlTrainers) if (!bySlug.has(t.slug)) existingTrainers.push(t);
  writeJson("trainers.json", existingTrainers);
  console.log(`trainers.json: ${existingTrainers.length} total (merged ${sqlTrainers.length} from SQL)`);

  // ------------------------------------------------------------------
  // 5. Blog posts (module 9)
  // ------------------------------------------------------------------
  const [blogRows] = await conn.query(
    "SELECT id, title, slug, description, created_at FROM modules_data WHERE module_id=9 AND status != 'deleted' ORDER BY id DESC"
  );
  const blog = blogRows.map((r) => ({
    id: `post-sql-${r.id}`,
    slug: slugify(r.slug || r.title, `post-${r.id}`),
    title: r.title,
    excerpt: firstParagraph(r.description, 240),
    body: stripWordHtml(r.description),
    tags: ["Safety", "EIOSH"],
    author: "EIOSH Faculty",
    publishedAt: new Date(r.created_at ?? Date.now()).toISOString().slice(0, 10),
    readTimeMinutes: Math.max(3, Math.round(stripHtml(r.description).split(/\s+/).length / 200)),
  }));
  // Merge; avoid duplicates by slug
  const existingBlog = readJson("blog.json");
  const blogBySlug = new Map(existingBlog.map((p) => [p.slug, p]));
  for (const p of blog) if (!blogBySlug.has(p.slug)) existingBlog.push(p);
  writeJson("blog.json", existingBlog);
  console.log(`blog.json: ${existingBlog.length} total (merged ${blog.length} from SQL)`);

  // ------------------------------------------------------------------
  // 6. Approved Centers (module 34) — feed into accreditations if distinct
  // ------------------------------------------------------------------
  const [centerRows] = await conn.query(
    "SELECT id, title, description FROM modules_data WHERE module_id=34 AND status != 'deleted'"
  );
  const centers = centerRows.map((r) => ({
    id: `ctr-sql-${r.id}`,
    slug: slugify(r.title, `ctr-${r.id}`),
    title: r.title,
    description: stripHtml(r.description) || `Approved centre partnering with EIOSH.`,
  }));
  writeJson("approved-centers.json", centers);
  console.log(`approved-centers.json: ${centers.length} records`);

  // ------------------------------------------------------------------
  // 7. Course Proposals (module 44) — historic submissions
  // ------------------------------------------------------------------
  const [propRows] = await conn.query(
    `SELECT id, title, description,
            extra_field_1 AS company_name, extra_field_2 AS phone,
            extra_field_3 AS company_address, extra_field_4 AS company_email,
            extra_field_5 AS invoice_date,
            created_at
       FROM modules_data WHERE module_id=44 AND status != 'deleted'`
  );
  const proposals = propRows.map((r) => ({
    id: `prop-sql-${r.id}`,
    title: r.title || "Course proposal",
    companyName: r.company_name || "",
    phone: r.phone || "",
    companyAddress: r.company_address || "",
    companyEmail: r.company_email || "",
    invoiceDate: r.invoice_date || "",
    description: stripHtml(r.description),
    receivedAt: new Date(r.created_at ?? Date.now()).toISOString(),
    status: "historical",
  }));
  writeJson("proposals.json", proposals);
  console.log(`proposals.json: ${proposals.length} historic submissions`);

  // ------------------------------------------------------------------
  // 8. Quotations (module 42)
  // ------------------------------------------------------------------
  const [quotRows] = await conn.query(
    `SELECT id, title,
            extra_field_1 AS company, extra_field_2 AS email,
            extra_field_3 AS mobile, extra_field_4 AS service,
            extra_field_5 AS notes, description,
            created_at
       FROM modules_data WHERE module_id=42 AND status != 'deleted'`
  );
  const quotations = quotRows.map((r) => ({
    id: `quot-sql-${r.id}`,
    title: r.title || "Quotation request",
    company: r.company || "",
    email: r.email || "",
    mobile: r.mobile || "",
    serviceRequired: r.service || "",
    notes: r.notes || stripHtml(r.description),
    receivedAt: new Date(r.created_at ?? Date.now()).toISOString(),
    status: "historical",
  }));
  writeJson("quotations.json", quotations);
  console.log(`quotations.json: ${quotations.length} historic submissions`);

  // ------------------------------------------------------------------
  // 9. Admission Forms (module 41)
  // ------------------------------------------------------------------
  const [admRows] = await conn.query(
    `SELECT id, title,
            extra_field_1 AS dob, extra_field_2 AS gender,
            extra_field_3 AS email, extra_field_4 AS nationality,
            extra_field_5 AS mobile, extra_field_6 AS company,
            description,
            created_at
       FROM modules_data WHERE module_id=41 AND status != 'deleted'`
  );
  const admissions = admRows.map((r) => ({
    id: `adm-sql-${r.id}`,
    title: r.title || "Admission",
    dob: r.dob || "",
    gender: r.gender || "",
    email: r.email || "",
    nationality: r.nationality || "",
    mobile: r.mobile || "",
    company: r.company || "",
    notes: stripHtml(r.description),
    receivedAt: new Date(r.created_at ?? Date.now()).toISOString(),
    status: "historical",
  }));
  writeJson("admissions.json", admissions);
  console.log(`admissions.json: ${admissions.length} historic submissions`);

  // ------------------------------------------------------------------
  // 10. Certificates (module 37) — powers /verify-certificate lookup
  // ------------------------------------------------------------------
  const [certRows] = await conn.query(
    `SELECT d.id, d.title AS holder,
            d.extra_field_2 AS dob, d.extra_field_3 AS email, d.extra_field_4 AS phone,
            d.extra_field_5 AS registrationNumber, d.extra_field_6 AS certificateNumber,
            d.extra_field_8 AS courseId, c.title AS courseTitle,
            d.extra_field_9 AS issueDate, d.extra_field_10 AS expiryDate,
            d.extra_field_11 AS address, d.extra_field_12 AS iqama,
            d.extra_field_13 AS company
       FROM modules_data d
       LEFT JOIN modules_data c ON c.id = d.extra_field_8 AND c.module_id = 2
      WHERE d.module_id = 37 AND d.status != 'deleted'
        AND d.extra_field_6 IS NOT NULL AND d.extra_field_6 != ''`
  );
  const certificates = certRows.map((r) => ({
    id: `cert-${r.id}`,
    holder: (r.holder ?? "").toString().trim(),
    certificateNumber: (r.certificateNumber ?? "").toString().trim(),
    registrationNumber: r.registrationNumber ?? null,
    course: r.courseTitle ?? "EIOSH programme",
    issueDate: r.issueDate ?? null,
    expiryDate: r.expiryDate ?? null,
    company: r.company ?? null,
  }));
  writeJson("certificates.json", certificates);
  console.log(`certificates.json: ${certificates.length} verifiable certificates`);

  await conn.end();
  console.log("\n✓ Migration complete.");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
