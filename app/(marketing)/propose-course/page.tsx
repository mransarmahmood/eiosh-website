import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SubmissionForm } from "@/components/forms/SubmissionForm";
import { CheckCircle2, Target, Users2, ClipboardList } from "lucide-react";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Propose a Course",
  description:
    "Suggest a custom or bespoke course for your organisation. EIOSH course proposals are reviewed by our faculty and responded to within one business day.",
  path: "/propose-course",
});

const value = [
  { icon: Target, t: "Built around your outcomes", d: "Scoped to the competencies and KPIs that matter to your team." },
  { icon: Users2, t: "Any cohort size", d: "From 6 executives to 500-person enterprise rollouts." },
  { icon: ClipboardList, t: "Awarding-body aligned", d: "Where possible we certify through IOSH, HABC, OTHM or OSHAcademy." },
  { icon: CheckCircle2, t: "Response within 1 day", d: "A corporate lead will follow up with feasibility and pricing." },
];

export default function ProposeCoursePage() {
  return (
    <>
      <PageHero
        eyebrow="Course proposals"
        title="Propose a course for your organisation."
        description="Have a capability gap we can close? Submit a course proposal and our faculty will come back with an outline, cohort plan and investment estimate — usually within one business day."
        breadcrumbs={[{ label: "Propose a course" }]}
      />

      <Section>
        <Container>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {value.map((v) => {
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

      <Section tone="subtle">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="eyebrow">Submit a proposal</p>
              <h2 className="mt-3 font-heading text-display-sm font-semibold text-navy-900 text-balance">
                Tell us what you're trying to certify, accredit, or upskill.
              </h2>
              <p className="mt-4 text-ink-muted">
                Briefly describe the course you want EIOSH to design or deliver. Our corporate team routes every proposal to the right faculty area.
              </p>
              <ul className="mt-6 space-y-2 text-sm text-ink">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600" /> NDA available on request
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600" /> Proposals reviewed by senior faculty
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-cyan-600" /> Bilingual delivery (EN / AR) possible
                </li>
              </ul>
            </div>

            <SubmissionForm
              endpoint="/api/submit/proposal"
              submitLabel="Send proposal"
              successTitle="Proposal received."
              successMessage="A corporate lead will email you within one business day with next steps."
              fields={[
                { name: "title", label: "Proposal title", required: true, wide: true, placeholder: "e.g. Custom NEBOSH-style supervisor programme" },
                { name: "companyName", label: "Company name", required: true },
                { name: "companyEmail", label: "Company email", type: "email", required: true },
                { name: "phone", label: "Phone (with country code)", type: "tel", placeholder: "+971 50 000 0000" },
                { name: "invoiceDate", label: "Ideal start date", type: "date" },
                { name: "companyAddress", label: "Company address" },
                {
                  name: "description",
                  label: "Proposal details",
                  type: "textarea",
                  required: true,
                  wide: true,
                  placeholder: "Describe the audience, objectives, any existing content, and the certification outcome you need.",
                },
              ]}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
