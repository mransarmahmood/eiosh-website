import * as Icons from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { StatsBand } from "@/components/sections/StatsBand";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { pageMeta } from "@/lib/seo";
import { loadPageContent, type BasicHero, type BasicCta, type IconCard } from "@/lib/page-content";

interface CorporateContent {
  hero: BasicHero;
  intro: string;
  pillars: IconCard[];
  popularProgrammes: string[];
  cta: BasicCta;
}

export async function generateMetadata() {
  try {
    const p = await loadPageContent<CorporateContent>("corporate-training");
    return pageMeta({
      title: p.hero.title,
      description: p.hero.description,
      path: "/corporate-training",
    });
  } catch {
    return pageMeta({ title: "Corporate Training", path: "/corporate-training" });
  }
}

export default async function CorporateTrainingPage() {
  const p = await loadPageContent<CorporateContent>("corporate-training");

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        description={p.hero.description}
        breadcrumbs={[{ label: "Corporate training" }]}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="The proposition"
                title="One partner for every programme."
              />
            </div>
            <div className="lg:col-span-7 prose-eiosh">
              <p>{p.intro}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <SectionHeading
            eyebrow="What's included"
            title="Capability across delivery, assessment and reporting."
            align="center"
            className="mx-auto text-center"
          />
          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {p.pillars.map((pillar) => {
              const Icon =
                (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
                  pillar.icon ?? "CheckCircle2"
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

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Most-requested programmes"
            title="What corporate clients usually start with."
            align="center"
            className="mx-auto text-center"
          />
          <ul className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
            {p.popularProgrammes.map((prog) => (
              <li
                key={prog}
                className="rounded-lg bg-white px-4 py-3 text-sm font-medium text-navy-900 ring-1 ring-border"
              >
                {prog}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <StatsBand />
      <TestimonialsSlider />

      <Section tone="subtle" id="enquire">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading eyebrow="Plan your cohort" title={p.cta.heading} />
              <p className="mt-4 text-ink-muted">{p.cta.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {p.cta.primaryLabel && p.cta.primaryHref && (
                  <Button href={p.cta.primaryHref} variant="gold" size="lg">
                    {p.cta.primaryLabel}
                  </Button>
                )}
                {p.cta.secondaryLabel && p.cta.secondaryHref && (
                  <Button href={p.cta.secondaryHref} variant="outline" size="lg">
                    {p.cta.secondaryLabel}
                  </Button>
                )}
              </div>
            </div>
            <InquiryForm variant="corporate" />
          </div>
        </Container>
      </Section>
    </>
  );
}
