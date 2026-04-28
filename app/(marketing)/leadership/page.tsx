import * as Icons from "lucide-react";
import {
  Crown,
  ArrowRight,
  CheckCircle2,
  Target,
  Users,
} from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { pageMeta } from "@/lib/seo";
import { loadPageContent, type BasicHero, type BasicCta } from "@/lib/page-content";

interface LeadershipCourse {
  icon: string;
  title: string;
  level: string;
  summary: string;
  priceFromUSD: number;
  deliveryModes: string[];
  applyHref: string;
  outcomes: string[];
}

interface LeadershipContent {
  hero: BasicHero;
  intro: string;
  courses: LeadershipCourse[];
  outcomes: string[];
  audience: string[];
  cta: BasicCta;
}

export async function generateMetadata() {
  try {
    const p = await loadPageContent<LeadershipContent>("leadership");
    return pageMeta({
      title: p.hero.title,
      description: p.hero.description,
      path: "/leadership",
    });
  } catch {
    return pageMeta({
      title: "Leadership programmes",
      description: "Director-level programmes for senior HSE professionals.",
      path: "/leadership",
    });
  }
}

function lucide(name?: string): React.ComponentType<{ className?: string }> {
  if (!name) return Icons.Crown;
  return (
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name] ??
    Icons.Crown
  );
}

export default async function LeadershipPage() {
  const p = await loadPageContent<LeadershipContent>("leadership");

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        description={p.hero.description}
        breadcrumbs={[{ label: "Leadership" }]}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan-700 ring-1 ring-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-200 dark:ring-cyan-400/30">
          <Crown className="h-3.5 w-3.5" /> Director-level cohort
        </span>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Why a leadership track?"
                title="Most HSE qualifications stop at competent practice."
              />
            </div>
            <div className="lg:col-span-7 prose-eiosh">
              <p>{p.intro}</p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Outcomes + audience */}
      <Section tone="subtle">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <h2 className="font-heading text-xl font-semibold text-navy-900">
                <Target className="mr-2 inline h-5 w-5 text-cyan-700" />
                What graduates can do
              </h2>
              <ul className="mt-4 space-y-2">
                {p.outcomes.map((o) => (
                  <li
                    key={o}
                    className="flex gap-2 rounded-lg bg-white p-3 ring-1 ring-border"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-700" />
                    <span className="text-sm text-ink">{o}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-heading text-xl font-semibold text-navy-900">
                <Users className="mr-2 inline h-5 w-5 text-cyan-700" />
                Who it's for
              </h2>
              <ul className="mt-4 space-y-2">
                {p.audience.map((a) => (
                  <li
                    key={a}
                    className="flex gap-2 rounded-lg bg-white p-3 ring-1 ring-border"
                  >
                    <Users className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-700" />
                    <span className="text-sm text-ink">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      {/* Course cards */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="The leadership catalogue"
            title="Four programmes, all corporate-deliverable."
            align="center"
            className="mx-auto text-center"
          />
          <ul className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {p.courses.map((c) => {
              const Icon = lucide(c.icon);
              return (
                <li
                  key={c.title}
                  className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-navy-900">
                        {c.title}
                      </h3>
                      <p className="text-xs uppercase tracking-wider text-ink-soft">
                        {c.level}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-ink-muted">{c.summary}</p>

                  <ul className="mt-4 space-y-1.5">
                    {c.outcomes.slice(0, 4).map((o) => (
                      <li key={o} className="flex gap-2 text-xs text-ink">
                        <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-cyan-700" />
                        <span>{o}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-5 flex items-center justify-between border-t border-border">
                    <p className="font-mono text-lg font-semibold text-navy-900">
                      US${c.priceFromUSD.toLocaleString()}{" "}
                      <span className="text-xs font-normal text-ink-soft">/ learner</span>
                    </p>
                    <Button href={c.applyHref} variant="gold" size="sm">
                      Request quote <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                  <p className="mt-2 text-[0.7rem] text-ink-soft capitalize">
                    Delivery: {c.deliveryModes.join(" · ")}
                  </p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

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
