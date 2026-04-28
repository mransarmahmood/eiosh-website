import * as Icons from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { StatsBand } from "@/components/sections/StatsBand";
import { AwardingBodies } from "@/components/sections/AwardingBodies";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { pageMeta } from "@/lib/seo";
import { loadPageContent, type BasicHero, type BasicCta, type IconCard } from "@/lib/page-content";

interface AboutContent {
  hero: BasicHero;
  intro: string;
  pillars: IconCard[];
  missionHeading: string;
  mission: string;
  cta: BasicCta;
}

export async function generateMetadata() {
  try {
    const p = await loadPageContent<AboutContent>("about");
    return pageMeta({ title: p.hero.title, description: p.hero.description, path: "/about" });
  } catch {
    return pageMeta({ title: "About EIOSH", path: "/about" });
  }
}

export default async function AboutPage() {
  const p = await loadPageContent<AboutContent>("about");

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        description={p.hero.description}
        breadcrumbs={[{ label: "About" }]}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Our mandate" title={p.missionHeading} />
            </div>
            <div className="lg:col-span-7 prose-eiosh">
              <p>{p.intro}</p>
              <p>{p.mission}</p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <SectionHeading
            eyebrow="What we stand for"
            title="What we stand for."
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
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
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

      <StatsBand />
      <AwardingBodies />
      <TestimonialsSlider />

      <Section tone="gradient">
        <Container className="text-center">
          <h2 className="text-display-sm sm:text-display-md font-heading font-semibold text-white text-balance">
            {p.cta.heading}
          </h2>
          {p.cta.description && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">{p.cta.description}</p>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {p.cta.primaryLabel && p.cta.primaryHref && (
              <Button href={p.cta.primaryHref} variant="gold" size="lg">
                {p.cta.primaryLabel}
              </Button>
            )}
            {p.cta.secondaryLabel && p.cta.secondaryHref && (
              <Button
                href={p.cta.secondaryHref}
                variant="outline"
                size="lg"
                className="bg-white/5 text-white ring-white/20 hover:bg-white/10 hover:ring-white/40"
              >
                {p.cta.secondaryLabel}
              </Button>
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
