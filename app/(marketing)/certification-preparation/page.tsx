import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FAQSection } from "@/components/sections/FAQSection";
import { CourseGrid } from "@/components/sections/CourseGrid";
import { CheckCircle2, Timer, BookOpen, Headphones } from "lucide-react";
import { courses } from "@/content/courses";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Certification Preparation",
  description:
    "End-to-end preparation for NEBOSH, IOSH, OTHM, HABC, IEMA and ISO 45001 — with mock assessments, tutor office hours and workplace-project mentoring.",
  path: "/certification-preparation",
});

const pillars = [
  { icon: BookOpen, t: "Structured syllabus mapping", d: "Every session linked to the awarding body's published learning outcomes, with nothing skipped." },
  { icon: Timer, t: "Timed mock assessments", d: "At least two full-length mock exams per course, marked against awarding-body standards." },
  { icon: Headphones, t: "Tutor office hours", d: "Weekly small-group sessions with the lead tutor — not a support inbox." },
  { icon: CheckCircle2, t: "Portfolio & project review", d: "Internal verification of every workplace project before it goes to the awarding body." },
];

export default function CertificationPreparationPage() {
  const focus = courses.filter((c) => ["iosh-managing-safely", "nebosh-international-general-certificate", "othm-level-6-diploma-ohs", "iema-foundation-sustainability", "habc-level-2-food-safety"].includes(c.slug));

  return (
    <>
      <PageHero
        eyebrow="Certification preparation"
        title="Pass the first time. Lead with the credential."
        description="Our preparation pathway takes you from syllabus to certification in a single, structured programme — designed by the tutors who mark the assessments."
        breadcrumbs={[{ label: "Certification preparation" }]}
      />

      <Section>
        <Container>
          <SectionHeading
            eyebrow="What makes EIOSH preparation different"
            title="Four things we refuse to compromise on."
            align="center"
            className="mx-auto text-center"
          />
          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.t} className="rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50 text-navy-800 ring-1 ring-inset ring-navy-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 font-heading text-lg font-semibold text-navy-900">{p.t}</p>
                  <p className="mt-2 text-sm text-ink-muted">{p.d}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <CourseGrid
        courses={focus}
        eyebrow="Focus certifications"
        title="The credentials we prepare people for every week."
        description="A selection of our most requested certification preparation pathways, across HSE, environment, food and management."
        tone="subtle"
        showViewAll
      />

      <Section tone="gradient">
        <Container className="text-center">
          <h2 className="text-display-sm sm:text-display-md font-heading font-semibold text-white text-balance">
            Tell us the certification you need.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            An advisor will match you to the right cohort and preparation plan — usually within one business day.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button href="/contact" variant="gold" size="lg">Book an advisory call</Button>
          </div>
        </Container>
      </Section>

      <FAQSection limit={6} />
    </>
  );
}
