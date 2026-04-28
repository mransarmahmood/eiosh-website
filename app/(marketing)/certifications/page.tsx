import Link from "next/link";
import { ArrowRight, Award, BookOpen, Clock, Sparkles } from "lucide-react";
import { CertificationsHero } from "@/components/sections/CertificationsHero";
import { Container, Section } from "@/components/ui/Container";
import { activeCertifications, popularCertifications } from "@/content/certifications";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Certifications",
  description:
    "Every certification EIOSH prepares you for — NEBOSH, IOSH, OTHM, HABC, IEMA, ISO 45001, ASP, CSP, PMP, CRSP and more. Pick a credential and see the syllabus, modules, duration and apply route.",
  path: "/certifications",
});

// The certifications index reads from the CMS-managed JSON via
// `activeCertifications()`. The hero highlights up to three popular cards;
// the full list renders below as a grid.
export default function CertificationsIndexPage() {
  const certs = activeCertifications();
  const popular = popularCertifications();
  // Prefer popular ones for the hero preview, fall back to first three active.
  const featured = (popular.length ? popular : certs).slice(0, 3);

  return (
    <>
      <CertificationsHero featured={featured} totalCount={certs.length} />

      <Section tone="surface" className="bg-gradient-to-b from-white to-surface-subtle">
        <Container>
          <div id="all-certifications" className="scroll-mt-28">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">All certifications</p>
                <h2 className="mt-2 font-heading text-2xl font-semibold text-navy-900 sm:text-3xl">
                  {certs.length} programmes — pick the one that fits your career
                </h2>
              </div>
              <p className="max-w-md text-sm text-ink-muted">
                From single-day supervisor certificates to chartered-level diplomas. Every
                programme below is taught by accredited faculty and ends in a verifiable
                certificate.
              </p>
            </div>

            <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {certs.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/certifications/${c.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-border shadow-sm transition hover:-translate-y-1 hover:shadow-floating hover:ring-cyan-300"
                  >
                    {/* Subtle hover glow in the top-right corner. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-cyan-200/0 blur-2xl transition group-hover:bg-cyan-200/50"
                    />

                    <div className="relative flex items-start justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md ring-1 ring-cyan-300/50">
                        <Award className="h-5 w-5" />
                      </span>
                      {c.popular ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-2.5 py-0.5 text-[0.65rem] font-bold text-amber-800 ring-1 ring-amber-200">
                          <Sparkles className="h-3 w-3" /> Popular
                        </span>
                      ) : null}
                    </div>

                    <p className="relative mt-5 font-heading text-lg font-semibold text-navy-900">
                      {c.title}
                    </p>
                    <p className="relative mt-1 text-xs font-medium text-cyan-700">
                      {c.subtitle}
                    </p>
                    <p className="relative mt-3 text-sm leading-relaxed text-ink-muted line-clamp-3">
                      {c.summary}
                    </p>

                    <div className="relative mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[0.7rem] uppercase tracking-wider text-ink-soft">
                      <span className="inline-flex items-center gap-1">
                        <BookOpen className="h-3.5 w-3.5" /> {c.modules.length} modules
                      </span>
                      <span className="text-ink-soft/40">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {c.duration.replace(/\s*\(.*?\)\s*$/, "")}
                      </span>
                    </div>

                    <p className="relative mt-3 text-[0.7rem] uppercase tracking-wider text-ink-soft">
                      {c.awardingBody} · {c.level}
                    </p>

                    <span className="relative mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-cyan-700 transition group-hover:gap-1.5">
                      Open certification
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>
    </>
  );
}
