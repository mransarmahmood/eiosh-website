import { promises as fs } from "node:fs";
import { join } from "node:path";
import * as Icons from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FAQSection } from "@/components/sections/FAQSection";
import { CourseGrid } from "@/components/sections/CourseGrid";
import { courses } from "@/content/courses";
import { pageMeta } from "@/lib/seo";

interface PageContent {
  hero: { eyebrow: string; title: string; description: string };
  pillarsHeading: { eyebrow: string; title: string };
  pillars: { icon: string; title: string; description: string }[];
  focusHeading: { eyebrow: string; title: string; description: string };
  focusCourseSlugs: string[];
  cta: {
    heading: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel?: string;
    secondaryHref?: string;
  };
}

async function loadPage(): Promise<PageContent> {
  const path = join(process.cwd(), "content", "data", "page-certification-preparation.json");
  return JSON.parse(await fs.readFile(path, "utf-8")) as PageContent;
}

export async function generateMetadata() {
  try {
    const p = await loadPage();
    return pageMeta({
      title: p.hero.title,
      description: p.hero.description,
      path: "/certification-preparation",
    });
  } catch {
    return pageMeta({ title: "Certification Preparation", path: "/certification-preparation" });
  }
}

export default async function CertificationPreparationPage() {
  const p = await loadPage();
  // Resolve focus courses from the CMS slug list, preserving the editor's order.
  const focus = p.focusCourseSlugs
    .map((slug) => courses.find((c) => c.slug === slug))
    .filter((c): c is (typeof courses)[number] => !!c);

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        description={p.hero.description}
        breadcrumbs={[{ label: "Certification preparation" }]}
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow={p.pillarsHeading.eyebrow}
            title={p.pillarsHeading.title}
            align="center"
            className="mx-auto text-center"
          />
          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {p.pillars.map((pillar) => {
              const Icon =
                (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
                  pillar.icon
                ] ?? Icons.CheckCircle2;
              return (
                <li
                  key={pillar.title}
                  className="rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50 text-navy-800 ring-1 ring-inset ring-navy-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 font-heading text-lg font-semibold text-navy-900">
                    {pillar.title}
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">{pillar.description}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <CourseGrid
        courses={focus}
        eyebrow={p.focusHeading.eyebrow}
        title={p.focusHeading.title}
        description={p.focusHeading.description}
        tone="subtle"
        showViewAll
      />

      <Section tone="gradient">
        <Container className="text-center">
          <h2 className="text-display-sm sm:text-display-md font-heading font-semibold text-white text-balance">
            {p.cta.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">{p.cta.description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href={p.cta.primaryHref} variant="gold" size="lg">
              {p.cta.primaryLabel}
            </Button>
            {p.cta.secondaryLabel && p.cta.secondaryHref && (
              <Button href={p.cta.secondaryHref} variant="outline" size="lg">
                {p.cta.secondaryLabel}
              </Button>
            )}
          </div>
        </Container>
      </Section>

      <FAQSection limit={6} />
    </>
  );
}
