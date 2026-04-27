import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { LifeBuoy, FileText, BadgeCheck, UserCog, HeartPulse, BookOpen } from "lucide-react";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Student Services",
  description:
    "Admissions, tutor support, reasonable adjustments, re-sits, transcripts and certificate reissue — all the support services EIOSH offers enrolled learners.",
  path: "/student-services",
});

const services = [
  {
    icon: LifeBuoy,
    t: "Tutor support",
    d: "Weekly office hours and email response within one business day throughout your programme.",
  },
  {
    icon: UserCog,
    t: "Reasonable adjustments",
    d: "Documented assessment adjustments for learners with disabilities or specific learning differences.",
  },
  {
    icon: BookOpen,
    t: "Re-sit policy",
    d: "Clear, fair re-sit procedures aligned to each awarding body's regulations.",
  },
  {
    icon: FileText,
    t: "Transcripts & replacement certificates",
    d: "Request an official transcript or a replacement certificate — issued within five business days.",
  },
  {
    icon: BadgeCheck,
    t: "Digital credentials",
    d: "Shareable, verifiable digital badges and certificates for LinkedIn and email signatures.",
  },
  {
    icon: HeartPulse,
    t: "Learner wellbeing",
    d: "Confidential support pathways for learners experiencing circumstances that affect their studies.",
  },
];

export default function StudentServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Student services"
        title="Enrolled with EIOSH — supported every step of the way."
        description="From admission through to alumni, every learner has access to a documented set of services. This page is the single source of truth for what to expect and how to request it."
        breadcrumbs={[{ label: "Student Services" }]}
      />

      <Section tone="subtle">
        <Container>
          <SectionHeading
            eyebrow="What we support"
            title="Six services that every enrolled learner can request."
          />
          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.t} className="rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 font-heading text-lg font-semibold text-navy-900">{s.t}</p>
                  <p className="mt-2 text-sm text-ink-muted">{s.d}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container className="text-center">
          <h2 className="text-display-sm font-heading font-semibold text-navy-900 text-balance">
            Need to raise a request, escalate a concern, or book tutor time?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-ink-muted">
            The Student Services team responds within one business day. For assessment-related escalations, review the appeals procedure in our policies.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button href="/contact" variant="primary" size="lg">Contact Student Services</Button>
            <Link href="/policies#appeals" className="text-sm font-medium text-cyan-700 hover:underline">
              Read the appeals policy
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
