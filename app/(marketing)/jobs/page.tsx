import Link from "next/link";
import { Briefcase, MapPin, Star, ExternalLink } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { listJobs } from "@/lib/jobs";
import { formatDate } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "HSE jobs board",
  description: "Open HSE roles posted by employers hiring EIOSH-certified professionals. Free to browse, free to apply.",
  path: "/jobs",
});

export const dynamic = "force-dynamic";

export default async function JobsBoardPage() {
  const jobs = await listJobs();

  return (
    <>
      <PageHero
        eyebrow="Career portal"
        title="HSE jobs for EIOSH professionals."
        description="Roles posted by employers actively seeking IOSH / NEBOSH / OSHA-certified candidates. Browse free; apply directly to the employer."
        breadcrumbs={[{ label: "Jobs" }]}
      >
        <p className="text-sm text-white/75">
          Hiring? <Link href="/contact" className="underline">Post a role</Link> — free for the first listing.
        </p>
      </PageHero>

      <Section tone="subtle">
        <Container>
          {jobs.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-ink-soft">
              No openings live right now. Check back soon, or follow EIOSH on LinkedIn for alerts.
            </p>
          ) : (
            <ul className="space-y-4">
              {jobs.map((j) => (
                <li
                  key={j.id}
                  className="rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {j.featured && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-0.5 text-[0.7rem] text-yellow-800">
                            <Star className="h-3 w-3" /> Featured
                          </span>
                        )}
                        <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[0.7rem] text-cyan-800 capitalize">
                          {j.employmentType.replace("-", " ")}
                        </span>
                      </div>
                      <Link href={`/jobs/${j.slug}`} className="block">
                        <h3 className="mt-2 font-heading text-lg font-semibold text-navy-900 hover:text-cyan-700">
                          {j.title}
                        </h3>
                      </Link>
                      <p className="mt-1 text-sm font-medium text-ink">{j.company}</p>
                      <p className="mt-1 flex items-center gap-1 text-xs text-ink-soft">
                        <MapPin className="h-3 w-3" /> {j.location}
                        {j.remote && " · Remote-friendly"}
                        {j.salaryFrom && j.salaryTo && (
                          <span className="ml-2 rounded bg-ink/5 px-1.5">
                            {j.currency} {j.salaryFrom.toLocaleString()}–{j.salaryTo.toLocaleString()}/mo
                          </span>
                        )}
                      </p>
                      <p className="mt-3 text-sm text-ink-soft line-clamp-2">{j.summary}</p>
                    </div>
                    <Link
                      href={`/jobs/${j.slug}`}
                      className="hidden flex-shrink-0 items-center gap-1 self-start rounded-lg border border-border px-3 py-2 text-xs font-semibold text-navy-900 hover:bg-navy-50 sm:inline-flex"
                    >
                      View role <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <p className="mt-3 text-[0.7rem] text-ink-soft">
                    Posted {formatDate(j.postedAt)}
                    {j.expiresAt && ` · closes ${formatDate(j.expiresAt)}`}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}
