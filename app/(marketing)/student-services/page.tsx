import * as Icons from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { pageMeta } from "@/lib/seo";
import { loadPageContent, type BasicHero, type BasicCta, type IconCard } from "@/lib/page-content";

interface StudentServicesContent {
  hero: BasicHero;
  intro: string;
  services: IconCard[];
  cta: BasicCta;
}

export async function generateMetadata() {
  try {
    const p = await loadPageContent<StudentServicesContent>("student-services");
    return pageMeta({
      title: p.hero.title,
      description: p.hero.description,
      path: "/student-services",
    });
  } catch {
    return pageMeta({ title: "Student Services", path: "/student-services" });
  }
}

export default async function StudentServicesPage() {
  const p = await loadPageContent<StudentServicesContent>("student-services");

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        description={p.hero.description}
        breadcrumbs={[{ label: "Student services" }]}
      />

      <Section>
        <Container>
          <p className="prose-eiosh">{p.intro}</p>
          <SectionHeading
            eyebrow="Support included"
            title="Everything in your enrolment package."
            className="mt-12"
          />
          <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {p.services.map((card) => {
              const Icon =
                (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
                  card.icon ?? "LifeBuoy"
                ] ?? Icons.LifeBuoy;
              return (
                <li
                  key={card.title}
                  className="rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 font-heading text-lg font-semibold text-navy-900">
                    {card.title}
                  </p>
                  <p className="mt-2 text-sm text-ink-muted">{card.description}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

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
