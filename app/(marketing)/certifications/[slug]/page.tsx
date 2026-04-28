import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  ClipboardCheck,
  GraduationCap,
  Globe2,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { activeCertifications, findCertification } from "@/content/certifications";
import { courses } from "@/content/courses";
import { pageMeta } from "@/lib/seo";

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return activeCertifications().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Props) {
  const c = findCertification(params.slug);
  if (!c) return pageMeta({ title: "Certification not found", noIndex: true });
  return pageMeta({
    title: c.title,
    description: c.summary,
    path: `/certifications/${c.slug}`,
  });
}

export default function CertificationDetailPage({ params }: Props) {
  const cert = findCertification(params.slug);
  if (!cert || !cert.active) notFound();

  const linkedCourse = cert.courseSlug
    ? courses.find((c) => c.slug === cert.courseSlug)
    : null;
  const applyHref =
    cert.applyHref ?? (linkedCourse ? `/courses/${linkedCourse.slug}` : "/admission");

  return (
    <>
      <PageHero
        eyebrow={cert.awardingBody}
        title={cert.title}
        description={cert.summary}
        breadcrumbs={[
          { label: "Certifications", href: "/certifications" },
          { label: cert.title },
        ]}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="cyan" className="bg-cyan-500/15 text-cyan-200 ring-cyan-400/30">
            <Award className="h-3.5 w-3.5" /> {cert.level}
          </Badge>
          {cert.deliveryModes.map((m) => (
            <Badge key={m} tone="navy" className="bg-white/10 text-white ring-white/20 capitalize">
              {m}
            </Badge>
          ))}
        </div>
      </PageHero>

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_320px]">
            <article className="space-y-12">
              {/* Outcomes */}
              <section>
                <h2 className="font-heading text-xl font-semibold text-navy-900">
                  What you'll be able to do
                </h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {cert.outcomes.map((o) => (
                    <li
                      key={o}
                      className="flex gap-2 rounded-lg bg-white p-3 ring-1 ring-border"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-700" />
                      <span className="text-sm text-ink">{o}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Modules */}
              <section>
                <h2 className="font-heading text-xl font-semibold text-navy-900">
                  What's covered (modules)
                </h2>
                <ol className="mt-4 space-y-2">
                  {cert.modules.map((m, i) => (
                    <li
                      key={m}
                      className="flex gap-3 rounded-lg bg-white p-3 ring-1 ring-border"
                    >
                      <span className="font-mono text-xs font-semibold text-cyan-700">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-sm text-ink">{m}</span>
                    </li>
                  ))}
                </ol>
              </section>

              {/* Duration + Assessment */}
              <section className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-5 ring-1 ring-border">
                  <Clock className="h-5 w-5 text-cyan-700" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Duration
                  </p>
                  <p className="mt-1 text-sm text-ink">{cert.duration}</p>
                </div>
                <div className="rounded-2xl bg-white p-5 ring-1 ring-border">
                  <ClipboardCheck className="h-5 w-5 text-cyan-700" />
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
                    Assessment
                  </p>
                  <p className="mt-1 text-sm text-ink">{cert.assessment}</p>
                </div>
              </section>
            </article>

            {/* Sticky apply card */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
                <p className="text-xs uppercase tracking-wider text-ink-soft">Awarding body</p>
                <p className="mt-1 font-heading text-lg font-semibold text-navy-900">
                  {cert.awardingBody}
                </p>
                <ul className="mt-5 space-y-3 text-sm">
                  <li className="flex items-center gap-2.5 text-ink">
                    <GraduationCap className="h-4 w-4 text-cyan-600" /> {cert.level}
                  </li>
                  <li className="flex items-center gap-2.5 text-ink">
                    <Clock className="h-4 w-4 text-cyan-600" /> {cert.duration}
                  </li>
                  <li className="flex items-center gap-2.5 text-ink capitalize">
                    <Globe2 className="h-4 w-4 text-cyan-600" /> {cert.deliveryModes.join(" · ")}
                  </li>
                </ul>
                <div className="mt-6 flex flex-col gap-2.5">
                  <Button href={applyHref} variant="gold" size="lg">
                    Apply now <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                  {linkedCourse && (
                    <Button href={`/courses/${linkedCourse.slug}`} variant="outline" size="lg">
                      View live course
                    </Button>
                  )}
                  <Button href="/quotation" variant="ghost" size="sm">
                    Request a corporate quote
                  </Button>
                </div>
              </div>
              <Link
                href="/certifications"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-cyan-700 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> All certifications
              </Link>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
