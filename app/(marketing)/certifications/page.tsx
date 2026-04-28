import Link from "next/link";
import { ArrowRight, Award, Star } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { activeCertifications } from "@/content/certifications";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Certifications",
  description:
    "Every certification EIOSH prepares you for — NEBOSH, IOSH, OTHM, HABC, IEMA, ISO 45001 and more. Pick a credential and see the syllabus, modules, duration and apply route.",
  path: "/certifications",
});

export default function CertificationsIndexPage() {
  const certs = activeCertifications();

  return (
    <>
      <PageHero
        eyebrow="Certifications"
        title="Internationally recognised credentials."
        description="Every certification EIOSH prepares you for, with full syllabus, awarding body, and apply route. Click any card to see the modules, duration and assessment."
        breadcrumbs={[{ label: "Certifications" }]}
      />

      <Section tone="subtle">
        <Container>
          <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {certs.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/certifications/${c.slug}`}
                  className="group flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-border shadow-sm transition hover:-translate-y-0.5 hover:ring-cyan-400 hover:shadow-floating"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                      <Award className="h-5 w-5" />
                    </span>
                    {c.popular && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-[0.65rem] font-medium text-yellow-800">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" /> Popular
                      </span>
                    )}
                  </div>
                  <p className="mt-5 font-heading text-lg font-semibold text-navy-900">{c.title}</p>
                  <p className="mt-1 text-xs text-ink-soft">{c.subtitle}</p>
                  <p className="mt-3 text-sm text-ink-muted line-clamp-3">{c.summary}</p>
                  <p className="mt-4 text-xs uppercase tracking-wider text-ink-soft">
                    {c.awardingBody} · {c.level}
                  </p>
                  <span className="mt-auto pt-5 inline-flex items-center gap-1 text-sm font-medium text-cyan-700 transition group-hover:gap-1.5">
                    Open certification <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
