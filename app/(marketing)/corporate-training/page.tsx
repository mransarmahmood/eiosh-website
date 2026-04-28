import * as Icons from "lucide-react";
import { Mail, Phone, MessageCircle, Sparkles } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { pageMeta } from "@/lib/seo";
import { loadPageContent, type BasicHero, type BasicCta, type IconCard } from "@/lib/page-content";

interface ServiceCard extends IconCard {
  fromUSD?: number;
  unit?: string;
}

interface OfferCard {
  tag: string;
  title: string;
  description: string;
}

interface StatItem {
  value: string;
  label: string;
}

interface CorporateContent {
  hero: BasicHero;
  intro: string;
  pillars: IconCard[];
  services?: ServiceCard[];
  offers?: OfferCard[];
  popularProgrammes: string[];
  stats?: StatItem[];
  contactName?: string;
  contactRole?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsapp?: string;
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

function lucide(name?: string, fallback: keyof typeof Icons = "CheckCircle2") {
  return (
    (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
      name ?? fallback
    ] ?? Icons[fallback]
  );
}

export default async function CorporateTrainingPage() {
  const p = await loadPageContent<CorporateContent>("corporate-training");
  const whatsappLink = p.contactWhatsapp
    ? `https://wa.me/${p.contactWhatsapp.replace(/[^0-9]/g, "")}`
    : null;

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        description={p.hero.description}
        breadcrumbs={[{ label: "Corporate training" }]}
      />

      {/* Intro split */}
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

      {/* Pillars */}
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
              const Icon = lucide(pillar.icon);
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

      {/* Services with optional pricing */}
      {p.services && p.services.length > 0 && (
        <Section>
          <Container>
            <SectionHeading
              eyebrow="Service catalogue"
              title="Pick the model that fits your team."
              align="center"
              className="mx-auto text-center"
            />
            <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {p.services.map((s) => {
                const Icon = lucide(s.icon, "Briefcase");
                return (
                  <li
                    key={s.title}
                    className="flex h-full flex-col rounded-2xl border border-border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="font-heading text-lg font-semibold text-navy-900">
                        {s.title}
                      </h3>
                    </div>
                    <p className="mt-3 flex-1 text-sm text-ink-muted">{s.description}</p>
                    <div className="mt-5 border-t border-border pt-4">
                      {s.fromUSD && s.fromUSD > 0 ? (
                        <p className="font-mono text-lg font-semibold text-navy-900">
                          US${s.fromUSD.toLocaleString()}{" "}
                          <span className="text-xs font-normal text-ink-soft">{s.unit}</span>
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-cyan-700">
                          {s.unit ?? "Request quote"}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </Container>
        </Section>
      )}

      {/* Leadership feature — flagship programme highlight */}
      <Section>
        <Container>
          <div className="grid gap-8 rounded-2xl bg-gradient-to-br from-navy-950 via-navy-800 to-cyan-700 p-8 text-white shadow-floating lg:grid-cols-[1fr_320px] lg:items-center lg:p-12">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan-200">
                <Icons.Crown className="h-3.5 w-3.5" /> Flagship leadership track
              </span>
              <h2 className="mt-4 font-heading text-2xl font-semibold sm:text-3xl">
                Leadership for HSE professionals
              </h2>
              <p className="mt-3 max-w-xl text-white/80">
                A 5-day intensive for senior HSE managers stepping into director-level roles.
                Strategy, board reporting, ESG leadership, behavioural-safety culture, and
                HSE-finance fluency — all in one cohort. Available as a corporate-wide track for
                your high-potential talent.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button href="/leadership" variant="gold" size="lg">
                  Explore the programme <Icons.ArrowRight className="ml-1 h-4 w-4" />
                </Button>
                <Button
                  href="/quotation?course=leadership-for-hse"
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-white/5 text-white hover:bg-white/10"
                >
                  Request a corporate quote
                </Button>
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              {[
                "5-day intensive (in-person + online options)",
                "Cohorts of up to 16 senior HSE professionals",
                "Modules on board reporting, ESG, culture",
                "Capstone: HSE strategy presentation to faculty panel",
              ].map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 rounded-lg bg-white/5 p-3 ring-1 ring-white/10"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-300" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* Offers banner */}
      {p.offers && p.offers.length > 0 && (
        <Section tone="subtle">
          <Container>
            <SectionHeading
              eyebrow="Live offers"
              title="Volume + early-bird pricing."
              align="center"
              className="mx-auto text-center"
            />
            <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
              {p.offers.map((o) => (
                <li
                  key={o.title}
                  className="rounded-2xl border-2 border-dashed border-cyan-300 bg-gradient-to-br from-cyan-50 to-white p-5"
                >
                  <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2.5 py-0.5 text-[0.7rem] font-semibold text-yellow-900">
                    <Sparkles className="h-3 w-3" /> {o.tag}
                  </span>
                  <p className="mt-3 font-heading text-lg font-semibold text-navy-900">
                    {o.title}
                  </p>
                  <p className="mt-1 text-sm text-ink-muted">{o.description}</p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      {/* Popular programmes */}
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

      {/* Stats band */}
      {p.stats && p.stats.length > 0 && (
        <Section tone="subtle">
          <Container>
            <ul className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {p.stats.map((s) => (
                <li key={s.label} className="text-center">
                  <p className="font-heading text-3xl font-semibold text-navy-900 sm:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-ink-soft">
                    {s.label}
                  </p>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <TestimonialsSlider />

      {/* Contact + form */}
      <Section tone="subtle" id="enquire">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <SectionHeading eyebrow="Plan your cohort" title={p.cta.heading} />
              <p className="mt-4 text-ink-muted">{p.cta.description}</p>

              {(p.contactName || p.contactEmail) && (
                <div className="mt-6 rounded-2xl border border-border bg-white p-5">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-soft">
                    Direct line
                  </p>
                  {p.contactName && (
                    <p className="mt-1 font-semibold text-navy-900">
                      {p.contactName}
                      {p.contactRole && (
                        <span className="ml-1 text-sm font-normal text-ink-soft">
                          — {p.contactRole}
                        </span>
                      )}
                    </p>
                  )}
                  <ul className="mt-3 space-y-2 text-sm">
                    {p.contactEmail && (
                      <li>
                        <a
                          href={`mailto:${p.contactEmail}`}
                          className="inline-flex items-center gap-2 text-navy-900 hover:text-cyan-700"
                        >
                          <Mail className="h-4 w-4 text-cyan-700" /> {p.contactEmail}
                        </a>
                      </li>
                    )}
                    {p.contactPhone && (
                      <li>
                        <a
                          href={`tel:${p.contactPhone.replace(/[^+0-9]/g, "")}`}
                          className="inline-flex items-center gap-2 text-navy-900 hover:text-cyan-700"
                        >
                          <Phone className="h-4 w-4 text-cyan-700" /> {p.contactPhone}
                        </a>
                      </li>
                    )}
                    {whatsappLink && (
                      <li>
                        <a
                          href={whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-navy-900 hover:text-cyan-700"
                        >
                          <MessageCircle className="h-4 w-4 text-cyan-700" /> WhatsApp{" "}
                          {p.contactWhatsapp}
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              )}

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
