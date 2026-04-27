import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Policies",
  description:
    "EIOSH privacy, terms of service, refund, quality, equal opportunities, malpractice, appeals and data-protection policies. Updated regularly.",
  path: "/policies",
});

const policies: { id: string; title: string; body: string[] }[] = [
  {
    id: "privacy",
    title: "Privacy policy",
    body: [
      "EIOSH processes personal data only for the purposes of admissions, learner record management, awarding-body registration, certification, and direct communication with learners and corporate clients.",
      "We do not sell personal data to third parties. Where we share data with awarding bodies (e.g. IOSH, OTHM, HABC), it is strictly for registration and certification purposes under their published processing agreements.",
      "Learners can request access to, correction of, or deletion of their personal data by writing to privacy@eiosh.com.",
    ],
  },
  {
    id: "terms",
    title: "Terms of service",
    body: [
      "By enrolling on an EIOSH programme, the learner agrees to the assessment regulations of the relevant awarding body and to the EIOSH code of learner conduct.",
      "Fees paid to EIOSH cover tuition, assessment and certification administration. Learners are responsible for any re-sit fees charged directly by awarding bodies.",
    ],
  },
  {
    id: "refund",
    title: "Refund & cancellation policy",
    body: [
      "Full refunds are available up to 14 days before cohort start, minus any awarding-body registration fees already incurred.",
      "Transfers to a later cohort within the same qualification are free of charge up to 48 hours before the scheduled start.",
    ],
  },
  {
    id: "quality",
    title: "Quality assurance policy",
    body: [
      "EIOSH maintains a documented quality management system aligned to the expectations of each awarding body we are approved with. Every cohort is internally verified before results are submitted.",
      "External quality assurance visits and annual centre approvals are recorded and available on request from procurement teams and regulators.",
    ],
  },
  {
    id: "appeals",
    title: "Appeals & complaints",
    body: [
      "Learners have the right to appeal any assessment decision. The EIOSH appeals procedure is published in the learner handbook and must be initiated within 20 working days of the decision being communicated.",
      "Complaints about centre operations, tutor conduct or service quality are managed by the Head of Quality. The EIOSH complaints policy is available on request.",
    ],
  },
  {
    id: "equal-opportunities",
    title: "Equal opportunities policy",
    body: [
      "EIOSH is committed to admitting and supporting learners on the basis of merit, ability and potential — without discrimination on any protected characteristic.",
      "Our reasonable adjustments process (see Student Services) is how we operationalise this commitment in assessment.",
    ],
  },
  {
    id: "malpractice",
    title: "Malpractice & maladministration",
    body: [
      "EIOSH has a zero-tolerance position on assessment malpractice. All suspected incidents are investigated under the procedure required by the relevant awarding body.",
      "Whistle-blowing disclosures from learners, tutors and staff are received by the Head of Quality and handled confidentially.",
    ],
  },
];

export default function PoliciesPage() {
  return (
    <>
      <PageHero
        eyebrow="Policies"
        title="The policies behind how we operate."
        description="Transparent, plain-language policies for learners, corporate clients and regulators. Full, signed versions are available on request."
        breadcrumbs={[{ label: "Policies" }]}
      />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <aside className="lg:col-span-3">
              <nav className="sticky top-28" aria-label="Policies">
                <p className="eyebrow">On this page</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {policies.map((p) => (
                    <li key={p.id}>
                      <a href={`#${p.id}`} className="text-ink-muted hover:text-navy-900">
                        {p.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            <div className="lg:col-span-9 space-y-12">
              {policies.map((p) => (
                <article key={p.id} id={p.id} className="scroll-mt-28">
                  <h2 className="text-2xl font-heading font-semibold text-navy-900">{p.title}</h2>
                  <div className="mt-4 prose-eiosh">
                    {p.body.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
