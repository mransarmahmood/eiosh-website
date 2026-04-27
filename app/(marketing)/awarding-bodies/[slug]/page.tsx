import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CourseGrid } from "@/components/sections/CourseGrid";
import { accreditations } from "@/content/accreditations";
import { courses } from "@/content/courses";
import { pageMeta } from "@/lib/seo";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return accreditations.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: Params) {
  const a = accreditations.find((x) => x.slug === params.slug);
  if (!a) return pageMeta({ title: "Awarding body not found", noIndex: true });
  return pageMeta({
    title: `${a.shortName} — ${a.name}`,
    description: a.summary,
    path: `/awarding-bodies/${a.slug}`,
  });
}

export default function AwardingBodyDetailPage({ params }: Params) {
  const body = accreditations.find((a) => a.slug === params.slug);
  if (!body) return notFound();

  const bodyCourses = courses.filter((c) => c.awardingBody === body.slug);

  return (
    <>
      <PageHero
        eyebrow={body.kind === "partner" ? "Learning partner" : "Approved centre"}
        title={body.shortName}
        description={body.summary}
        breadcrumbs={[
          { label: "Awarding Bodies", href: "/awarding-bodies" },
          { label: body.shortName },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="cyan" className="bg-cyan-500/15 text-cyan-200 ring-cyan-400/30">
            {body.name}
          </Badge>
          {body.country ? (
            <Badge tone="navy" className="bg-white/10 text-white ring-white/20">
              {body.country}
            </Badge>
          ) : null}
          <Button
            href={`/courses?body=${body.slug}`}
            variant="gold"
            size="lg"
            className="ml-auto"
          >
            View all {body.shortName} courses <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-8">
              <p className="eyebrow">About this awarding body</p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-navy-900">
                What it means to be an {body.kind === "partner" ? "authorised partner" : "approved centre"} of{" "}
                {body.shortName}
              </h2>
              <div className="mt-5 prose-eiosh">
                <p>{body.summary}</p>
                <p>
                  Every certificate EIOSH issues under {body.shortName} is audited against their published standards,
                  uniquely referenced, and verifiable by employers, regulators or progression institutions without
                  contacting our office.
                </p>
              </div>

              {body.highlights?.length ? (
                <>
                  <p className="eyebrow mt-10">Highlights</p>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {body.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 rounded-lg bg-surface-subtle p-4">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                        <span className="text-sm text-ink">{h}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              {body.website ? (
                <a
                  href={body.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline"
                >
                  Visit {body.shortName} official site <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-28 space-y-4">
                {/* OSHAcademy Authorized Training Provider badge — click to verify on OSHAcademy's site */}
                {body.slug === "oshacademy" ? (
                  <a
                    href="https://app.oshacademy-atp.com/verify/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Click to validate our OSHAcademy Authorized Training Provider status"
                    className="group block rounded-2xl bg-white p-5 ring-1 ring-border shadow-elevated transition hover:shadow-floating hover:ring-cyan-400"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/brand/OSHAcademy-Verification-1.png"
                      alt="OSHAcademy Authorized Training Provider — Click to validate"
                      className="mx-auto w-full max-w-[220px] h-auto"
                    />
                    <p className="mt-4 text-center text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cyan-700 group-hover:text-navy-900">
                      Click to validate on oshacademy-atp.com →
                    </p>
                  </a>
                ) : null}

                <div className="rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated">
                  <p className="text-xs uppercase tracking-wider text-ink-soft">Courses under this body</p>
                  <p className="mt-1 font-heading text-4xl font-semibold text-navy-900">{bodyCourses.length}</p>
                  <p className="mt-2 text-sm text-ink-muted">
                    {bodyCourses.length > 0
                      ? `${bodyCourses.length} accredited programmes currently in our catalogue under ${body.shortName}.`
                      : "No courses listed yet — contact our team for the current offering."}
                  </p>
                  <Link
                    href={`/courses?body=${body.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline"
                  >
                    Open the filtered catalogue <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="rounded-2xl bg-brand-gradient p-6 text-white shadow-floating">
                  <p className="text-xs uppercase tracking-wider text-cyan-200">Request</p>
                  <p className="mt-2 font-heading text-xl font-semibold">Need a proposal or quotation?</p>
                  <p className="mt-2 text-sm text-white/80">
                    Our corporate team can scope {body.shortName} delivery for your organisation within one business day.
                  </p>
                  <Button href="/quotation" variant="gold" size="sm" className="mt-5">
                    Request a quotation
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      {bodyCourses.length > 0 ? (
        <CourseGrid
          courses={bodyCourses}
          eyebrow={`${body.shortName} catalogue`}
          title={`Courses accredited by ${body.shortName}`}
          description={`Every EIOSH programme currently on offer under our ${body.name} approval.`}
          tone="subtle"
          showViewAll={false}
        />
      ) : null}

      <Section tone="gradient">
        <Container className="text-center">
          <h2 className="font-heading text-display-sm font-semibold text-white text-balance">
            Need written confirmation of our {body.shortName} approval?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Procurement teams and auditors can request signed approval letters for any awarding body we work with.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact" variant="gold" size="lg">
              Request approval letter
            </Button>
            <Button
              href="/awarding-bodies"
              variant="outline"
              size="lg"
              className="bg-white/5 text-white ring-white/20 hover:bg-white/10 hover:ring-white/40"
            >
              See all awarding bodies
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
