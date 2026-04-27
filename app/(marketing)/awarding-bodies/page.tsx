import Link from "next/link";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { accreditations } from "@/content/accreditations";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Awarding Bodies & Approvals",
  description:
    "EIOSH is an approved centre and learning partner for IOSH, OSHAcademy, OSHAwards, HABC, OTHM, NEBOSH and IEMA. Understand what each approval means.",
  path: "/awarding-bodies",
});

export default function AwardingBodiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Approvals"
        title="The awarding bodies behind every EIOSH certificate."
        description="Our qualifications are issued under approvals granted by internationally recognised awarding bodies. Each approval is audited, time-bound, and publicly verifiable."
        breadcrumbs={[{ label: "Awarding Bodies" }]}
      />

      <Section>
        <Container>
          <div className="grid gap-10">
            {accreditations.map((a) => (
              <article
                key={a.id}
                id={a.slug}
                className="grid gap-8 rounded-2xl bg-white p-8 ring-1 ring-border shadow-elevated lg:grid-cols-12"
              >
                <div className="lg:col-span-4">
                  <Badge tone={a.kind === "partner" ? "neutral" : "navy"}>
                    {a.kind === "partner" ? "Learning partner" : "Approved centre"}
                  </Badge>
                  <h2 className="mt-4 text-2xl font-heading font-semibold text-navy-900">{a.shortName}</h2>
                  <p className="mt-1 text-sm text-ink-muted">{a.name}</p>
                  {a.country ? <p className="mt-3 text-xs uppercase tracking-wider text-cyan-700">{a.country}</p> : null}
                  {a.website ? (
                    <a
                      href={a.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline"
                    >
                      Visit official site <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
                <div className="lg:col-span-8">
                  <p className="text-ink-muted leading-relaxed">{a.summary}</p>
                  {a.highlights?.length ? (
                    <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                      {a.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2.5 text-sm text-ink">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button href={`/awarding-bodies/${a.slug}`} variant="primary" size="sm">
                      View {a.shortName} details
                    </Button>
                    <Button href={`/courses?body=${a.slug}`} variant="outline" size="sm">
                      Browse {a.shortName} courses
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="gradient">
        <Container className="text-center">
          <h2 className="text-display-sm font-heading font-semibold text-white text-balance">
            Need written confirmation of our approval status?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Procurement teams and auditors can request our current approval letters directly — we'll send a signed response within one business day.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button href="/contact" variant="gold" size="lg">Request approval documents</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
