import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { StatsBand } from "@/components/sections/StatsBand";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { Building2, FileSpreadsheet, BadgeCheck, Users, Globe2, ClipboardCheck } from "lucide-react";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Corporate Training & Workforce Development",
  description:
    "Tailored, audit-ready training programmes for enterprise clients — delivered on-site, virtually, or blended, in English and Arabic. One partner. One standard.",
  path: "/corporate-training",
});

const sectors = [
  "Energy, oil & gas",
  "Construction & infrastructure",
  "Transport & logistics",
  "Hospitality & catering",
  "Banking & professional services",
  "Healthcare & care",
  "Manufacturing",
  "Government & public sector",
];

const capabilities = [
  { icon: Building2, t: "On-site delivery", d: "Anywhere in the GCC, South Asia, Africa and the wider international region." },
  { icon: Globe2, t: "Bilingual delivery", d: "Programmes certified bilingually in English and Arabic where the awarding body permits." },
  { icon: Users, t: "Scalable cohorts", d: "From executive cohorts of six to enterprise-wide rollouts across 500+ learners." },
  { icon: ClipboardCheck, t: "Audit-ready records", d: "Attendance, assessment and certification dashboards for HR, HSE and regulator audits." },
  { icon: BadgeCheck, t: "Awarding-body approved", d: "All programmes issued under our IOSH, OSHAcademy, OSHAwards, HABC and OTHM approvals." },
  { icon: FileSpreadsheet, t: "KPI reporting", d: "Pre- and post-programme capability reporting linked to your L&D KPIs." },
];

export default function CorporateTrainingPage() {
  return (
    <>
      <PageHero
        eyebrow="Corporate training"
        title="A credentialed workforce — without disrupting the work."
        description="Our corporate faculty designs and delivers regulated training programmes for enterprise clients. One contract, one project manager, one quality standard — for cohorts of six or six hundred."
        breadcrumbs={[{ label: "Corporate Training" }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="#enquire" variant="gold" size="lg">Start a scoping call</Button>
          <Button href="/contact#brochure" variant="outline" size="lg" className="bg-white/5 text-white ring-white/20 hover:bg-white/10 hover:ring-white/40">
            Download capability deck
          </Button>
        </div>
      </PageHero>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="How we work"
            title="Six capabilities that come with every engagement."
            align="center"
            className="mx-auto text-center"
          />
          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => {
              const Icon = c.icon;
              return (
                <li key={c.t} className="rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 font-heading text-lg font-semibold text-navy-900">{c.t}</p>
                  <p className="mt-2 text-sm text-ink-muted">{c.d}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <SectionHeading
            eyebrow="Industries we serve"
            title="Programmes built for the context of your operation."
            description="Every corporate programme is scoped with your L&D, HSE and compliance teams. No two client engagements look identical."
          />
          <ul className="mt-12 flex flex-wrap gap-2.5">
            {sectors.map((s) => (
              <li key={s} className="rounded-full bg-white px-4 py-2 text-sm text-navy-900 ring-1 ring-border">
                {s}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <StatsBand />
      <TestimonialsSlider />

      <Section id="enquire">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="eyebrow">Scope your programme</p>
              <h2 className="mt-3 text-display-sm font-heading font-semibold text-navy-900">
                Let's design the right programme for your team.
              </h2>
              <p className="mt-4 text-ink-muted">
                Share the qualification focus, headcount and region. A corporate lead will prepare a short proposal with outcomes, delivery modes and investment — usually within two business days.
              </p>
            </div>
            <InquiryForm variant="corporate" />
          </div>
        </Container>
      </Section>
    </>
  );
}
