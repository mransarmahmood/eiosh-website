import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { CourseFilters } from "@/components/filters/CourseFilters";
import { Badge } from "@/components/ui/Badge";
import { accreditations } from "@/content/accreditations";
import { categories } from "@/content/categories";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Qualifications & Courses Catalogue",
  description:
    "Browse EIOSH qualifications across health and safety, food safety, fire, leadership, environment, HR and first aid — filter by awarding body, level, delivery mode and keyword.",
  path: "/courses",
});

type Search = {
  category?: string;
  body?: string;
  mode?: string;
  level?: string;
  q?: string;
};

// Valid option guards — so a malformed URL doesn't apply a nonsense filter.
const validModes = new Set(["online", "in-person", "blended", "self-paced"]);
const validLevels = new Set(["introductory", "foundation", "intermediate", "advanced", "specialist"]);

export default function CoursesPage({ searchParams }: { searchParams: Search }) {
  const activeBody = searchParams.body && accreditations.some((a) => a.slug === searchParams.body) ? searchParams.body : undefined;
  const activeCategory = searchParams.category && categories.some((c) => c.slug === searchParams.category) ? searchParams.category : undefined;
  const body = activeBody ? accreditations.find((a) => a.slug === activeBody) : undefined;
  const category = activeCategory ? categories.find((c) => c.slug === activeCategory) : undefined;

  const heroTitle = body
    ? `${body.shortName} courses`
    : category
    ? `${category.title} courses`
    : "Every EIOSH programme, filterable in one place.";

  const heroDescription = body
    ? `Every qualification EIOSH delivers under our ${body.name} approval. Filter further by level, delivery mode or keyword.`
    : category
    ? `Every EIOSH qualification in the ${category.title} pathway. Filter further by awarding body, level or delivery mode.`
    : "Search by category, awarding body, delivery mode or level. Each course page includes outline, assessment, cohort dates and verifiable certification details.";

  return (
    <>
      <PageHero
        eyebrow={body ? "Awarding body filter" : category ? "Category filter" : "Qualifications catalogue"}
        title={heroTitle}
        description={heroDescription}
        breadcrumbs={[{ label: "Courses", href: "/courses" }, ...(body ? [{ label: body.shortName }] : category ? [{ label: category.title }] : [])]}
      >
        {body || category ? (
          <div className="flex flex-wrap items-center gap-2">
            {body ? (
              <Badge
                tone="cyan"
                className="bg-cyan-100 text-cyan-700 ring-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-200 dark:ring-cyan-400/30"
              >
                {body.shortName}
              </Badge>
            ) : null}
            {category ? (
              <Badge
                tone="cyan"
                className="bg-cyan-100 text-cyan-700 ring-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-200 dark:ring-cyan-400/30"
              >
                {category.title}
              </Badge>
            ) : null}
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-navy-900 ring-1 ring-inset ring-border transition hover:bg-navy-50 dark:bg-white/5 dark:text-white/80 dark:ring-white/20 dark:hover:bg-white/10"
            >
              Clear filter
            </Link>
          </div>
        ) : null}
      </PageHero>
      <Section tone="subtle">
        <Container>
          <CourseFilters
            initialCategory={activeCategory}
            initialBody={activeBody}
            initialMode={validModes.has(searchParams.mode ?? "") ? (searchParams.mode as any) : undefined}
            initialLevel={validLevels.has(searchParams.level ?? "") ? (searchParams.level as any) : undefined}
            initialQuery={searchParams.q}
          />
        </Container>
      </Section>
    </>
  );
}
