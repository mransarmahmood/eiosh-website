import { CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SubmissionForm } from "@/components/forms/SubmissionForm";
import { pageMeta } from "@/lib/seo";
import { loadPageContent, type BasicHero, type BasicCta } from "@/lib/page-content";

interface ProposeContent {
  hero: BasicHero;
  intro: string;
  criteria: string[];
  cta: BasicCta;
}

export async function generateMetadata() {
  try {
    const p = await loadPageContent<ProposeContent>("propose-course");
    return pageMeta({
      title: p.hero.title,
      description: p.hero.description,
      path: "/propose-course",
    });
  } catch {
    return pageMeta({ title: "Propose a Course", path: "/propose-course" });
  }
}

export default async function ProposeCoursePage() {
  const p = await loadPageContent<ProposeContent>("propose-course");

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        description={p.hero.description}
        breadcrumbs={[{ label: "Propose a course" }]}
      />

      <Section>
        <Container>
          <p className="prose-eiosh">{p.intro}</p>
          <ul className="mt-8 space-y-3">
            {p.criteria.map((line) => (
              <li key={line} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-600" />
                <span className="text-ink">{line}</span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="eyebrow">{p.cta.heading}</p>
              <h2 className="mt-3 font-heading text-display-sm font-semibold text-navy-900 text-balance">
                Tell us what you'd like EIOSH to design or deliver.
              </h2>
              {p.cta.description && (
                <p className="mt-4 text-ink-muted">{p.cta.description}</p>
              )}
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
