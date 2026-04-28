import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, ExternalLink, Mail, Briefcase } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { findJob, listJobs } from "@/lib/jobs";
import { formatDate } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  const all = await listJobs({ onlyActive: false });
  return all.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }: Props) {
  const j = await findJob(params.slug);
  if (!j) return pageMeta({ title: "Role not found", noIndex: true });
  return pageMeta({
    title: `${j.title} — ${j.company}`,
    description: j.summary,
    path: `/jobs/${j.slug}`,
  });
}

export default async function JobDetailPage({ params }: Props) {
  const j = await findJob(params.slug);
  if (!j) notFound();

  const jobPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: j.title,
    description: j.summary,
    datePosted: j.postedAt,
    validThrough: j.expiresAt,
    employmentType: j.employmentType.toUpperCase(),
    hiringOrganization: { "@type": "Organization", name: j.company },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: j.location },
    },
    ...(j.salaryFrom && j.salaryTo
      ? {
          baseSalary: {
            "@type": "MonetaryAmount",
            currency: j.currency,
            value: {
              "@type": "QuantitativeValue",
              minValue: j.salaryFrom,
              maxValue: j.salaryTo,
              unitText: "MONTH",
            },
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />

      <PageHero
        eyebrow={j.company}
        title={j.title}
        description={j.summary}
        breadcrumbs={[{ label: "Jobs", href: "/jobs" }, { label: j.title }]}
      />

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
            <article className="space-y-6">
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                  Responsibilities
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-ink">
                  {j.responsibilities.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-cyan-700">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </section>
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">
                  Requirements
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-ink">
                  {j.requirements.map((r, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-cyan-700">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </article>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                <p className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-cyan-700" /> {j.location}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm capitalize">
                  <Briefcase className="h-4 w-4 text-cyan-700" />{" "}
                  {j.employmentType.replace("-", " ")}
                </p>
                {j.salaryFrom && j.salaryTo && (
                  <p className="mt-2 text-sm text-ink-soft">
                    {j.currency} {j.salaryFrom.toLocaleString()}–{j.salaryTo.toLocaleString()} /
                    month
                  </p>
                )}
                <p className="mt-2 text-xs text-ink-soft">
                  Posted {formatDate(j.postedAt)}
                  {j.expiresAt && ` · closes ${formatDate(j.expiresAt)}`}
                </p>

                <div className="mt-5 space-y-2">
                  {j.applyUrl && (
                    <a
                      href={j.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-navy-900 text-sm font-semibold text-white hover:bg-navy-800"
                    >
                      Apply now <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {j.applyEmail && (
                    <a
                      href={`mailto:${j.applyEmail}?subject=${encodeURIComponent(`Application: ${j.title}`)}`}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-border text-sm font-semibold text-navy-900 hover:bg-navy-50"
                    >
                      <Mail className="h-4 w-4" /> Email application
                    </a>
                  )}
                </div>
                <p className="mt-3 text-[0.7rem] text-ink-soft">
                  EIOSH does not screen applicants — apply directly to the employer above.
                </p>
              </div>

              <Link
                href="/jobs"
                className="mt-4 inline-flex items-center gap-1.5 text-sm text-cyan-700 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> All jobs
              </Link>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
