import { PageHero } from "@/components/sections/PageHero";
import { StatsBand } from "@/components/sections/StatsBand";
import { AwardingBodies } from "@/components/sections/AwardingBodies";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Target, Compass, ShieldCheck, HeartHandshake } from "lucide-react";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About EIOSH",
  description:
    "EIOSH is an approved international training centre, built to deliver regulated qualifications with faculty calibre, operational discipline and learner outcomes at the centre of everything.",
  path: "/about",
});

const values = [
  { icon: Target, t: "Outcomes, not attendance", d: "We measure ourselves on learner pass rates and workplace impact — not seat time." },
  { icon: Compass, t: "Faculty-led", d: "Our programmes are designed by practitioners who still work in industry, not by marketers." },
  { icon: ShieldCheck, t: "Audit-grade", d: "Every cohort is delivered with the documentation an ISO 45001 or awarding-body audit would expect." },
  { icon: HeartHandshake, t: "Partner in progress", d: "We are judged by how far our learners go, not how many programmes they buy." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About EIOSH"
        title="An international training centre built on the standards our awarding bodies expect."
        description="EIOSH Global was established to close the gap between a qualification certificate and the ability to operate to the standard the credential implies. We do that by delivering regulated programmes, staffed by working practitioners, held to awarding-body discipline."
        breadcrumbs={[{ label: "About" }]}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionHeading eyebrow="Our mandate" title="Credentials that hold up at work, in audit, and at the next role." />
            </div>
            <div className="lg:col-span-7 prose-eiosh">
              <p>
                EIOSH operates as an approved centre and learning partner for IOSH, OSHAcademy, OSHAwards, HABC, OTHM and IEMA. Everything we do is built around what those bodies require — not just to pass an exam, but to implement a management system, lead a team, or stand up in front of a regulator.
              </p>
              <p>
                We deliver in-person across the GCC, online worldwide, and in blended cohorts for enterprise clients. Our faculty is drawn from industry — HSE directors, principal engineers, environmental auditors, registered fire officers — not from a career spent in classrooms.
              </p>
              <p>
                Since 2015, more than 42,000 professionals in 64 countries have completed an EIOSH programme. Every one of those certificates is verifiable, every one of those learners has our alumni support, and every one of our corporate clients has a single partner held accountable for outcomes.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <SectionHeading
            eyebrow="What we stand for"
            title="Four non-negotiables."
            align="center"
            className="mx-auto text-center"
          />
          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <li key={v.t} className="rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 font-heading text-lg font-semibold text-navy-900">{v.t}</p>
                  <p className="mt-2 text-sm text-ink-muted">{v.d}</p>
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
            Build a programme — or build a workforce.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Talk to an advisor about the right qualification for you, or book a scoping call for corporate delivery.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact" variant="gold" size="lg">Book an advisory call</Button>
            <Button href="/corporate-training" variant="outline" size="lg" className="bg-white/5 text-white ring-white/20 hover:bg-white/10 hover:ring-white/40">
              Corporate training
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
