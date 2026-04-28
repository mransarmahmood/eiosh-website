import * as Icons from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { pageMeta } from "@/lib/seo";
import { loadPageContent, type BasicHero, type BasicCta, type IconCard } from "@/lib/page-content";

interface PartnershipContent {
  hero: BasicHero;
  intro: string;
  partnerTypes: IconCard[];
  cta: BasicCta;
}

export async function generateMetadata() {
  try {
    const p = await loadPageContent<PartnershipContent>("partnership");
    return pageMeta({
      title: p.hero.title,
      description: p.hero.description,
      path: "/partnership",
    });
  } catch {
    return pageMeta({ title: "Partnership", path: "/partnership" });
  }
}

export default async function PartnershipPage() {
  const p = await loadPageContent<PartnershipContent>("partnership");

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        description={p.hero.description}
        breadcrumbs={[{ label: "Partnerships" }]}
      />

      <Section>
        <Container>
          <SectionHeading eyebrow="Partnership tracks" title="Ways we partner." />
          <p className="mt-4 max-w-3xl text-ink-muted">{p.intro}</p>
          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {p.partnerTypes.map((card) => {
              const Icon =
                (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
                  card.icon ?? "Handshake"
                ] ?? Icons.Handshake;
              return (
                <li
                  key={card.title}
                  className="rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50 text-navy-800 ring-1 ring-inset ring-navy-200">
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

      <Section tone="subtle">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="eyebrow">{p.cta.heading}</p>
              <h2 className="mt-3 text-display-sm font-heading font-semibold text-navy-900">
                Tell us about your organisation and what you'd like to build with us.
              </h2>
              {p.cta.description && (
                <p className="mt-4 text-ink-muted">{p.cta.description}</p>
              )}
            </div>
            <InquiryForm variant="partnership" />
          </div>
        </Container>
      </Section>
    </>
  );
}
