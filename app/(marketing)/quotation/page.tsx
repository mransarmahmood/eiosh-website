import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SubmissionForm } from "@/components/forms/SubmissionForm";
import { Receipt, FileText, Timer, BadgeCheck } from "lucide-react";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Request a Quotation",
  description:
    "Get a written quotation for EIOSH training, inspection, equipment certification or consulting services. Responses within one business day.",
  path: "/quotation",
});

const promise = [
  { icon: Timer, t: "1-day turnaround", d: "Most quotations land in your inbox the same or next working day." },
  { icon: FileText, t: "Fixed-fee or flexible", d: "Per-head pricing or programme-fee — whichever fits procurement." },
  { icon: BadgeCheck, t: "Awarding-body approved", d: "Every quote references the exact accreditation and certificate." },
  { icon: Receipt, t: "Procurement-ready", d: "Trade licence, tax registration and banking details provided on request." },
];

export default function QuotationPage() {
  return (
    <>
      <PageHero
        eyebrow="Quotations"
        title="Request a written quotation."
        description="Whether you need 20 learners certified on IOSH Managing Safely or an equipment inspection programme scoped, our team turns quotations around within one business day."
        breadcrumbs={[{ label: "Quotation" }]}
      />

      <Section>
        <Container>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {promise.map((v) => {
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
              <p className="eyebrow">Tell us what you need</p>
              <h2 className="mt-3 font-heading text-display-sm font-semibold text-navy-900 text-balance">
                Training, inspection or consulting — one form, one quote.
              </h2>
              <p className="mt-4 text-ink-muted">
                Share the service you're scoping, rough numbers, and any deadlines. Our team will return a detailed written quotation with line-item breakdown, timelines and terms.
              </p>
            </div>

            <SubmissionForm
              endpoint="/api/submit/quotation"
              submitLabel="Request quotation"
              successTitle="Quotation request received."
              successMessage="Our team will email a written quotation within one business day."
              fields={[
                { name: "title", label: "Subject line", required: true, wide: true, placeholder: "e.g. IOSH MS for 30 supervisors" },
                { name: "company", label: "Company", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "mobile", label: "Mobile (with country code)", type: "tel", required: true, placeholder: "+971 50 000 0000" },
                {
                  name: "serviceRequired",
                  label: "Service required",
                  type: "select",
                  required: true,
                  options: [
                    { value: "Training programme", label: "Training programme" },
                    { value: "Equipment certification", label: "Equipment certification" },
                    { value: "Inspection service", label: "Inspection service" },
                    { value: "HSE consulting", label: "HSE consulting" },
                    { value: "Auditor / lead auditor", label: "Auditor / lead auditor" },
                    { value: "Other", label: "Other" },
                  ],
                },
                {
                  name: "notes",
                  label: "Additional information",
                  type: "textarea",
                  wide: true,
                  required: true,
                  placeholder: "Team size, location, preferred dates, procurement process, any scope constraints.",
                },
              ]}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
