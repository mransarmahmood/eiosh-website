import { notFound } from "next/navigation";
import Link from "next/link";
import { CalendarDays, Clock, GraduationCap, Globe2, Award, CheckCircle2, Users, BookOpen } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { EnrolNowButton } from "@/components/forms/EnrolNowButton";
import { CourseGrid } from "@/components/sections/CourseGrid";
import { ReviewsList } from "@/components/reviews/ReviewsList";
import { courses } from "@/content/courses";
import { accreditations } from "@/content/accreditations";
import { categories } from "@/content/categories";
import { formatDate, formatDuration } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";
import { ratingFor, listReviews, courseSchemaJsonLd } from "@/lib/reviews";
import { PriceDisplay } from "@/components/ui/PriceDisplay";

interface Params {
  params: { slug: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eiosh.com";

export function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: Params) {
  const c = courses.find((x) => x.slug === params.slug);
  if (!c) return pageMeta({ title: "Course not found", noIndex: true });
  return pageMeta({ title: c.title, description: c.headline, path: `/courses/${c.slug}` });
}

export default async function CourseDetailPage({ params }: Params) {
  const course = courses.find((c) => c.slug === params.slug);
  if (!course) return notFound();
  const body = accreditations.find((a) => a.slug === course.awardingBody);
  const category = categories.find((cat) => cat.slug === course.category);
  const related = courses.filter((c) => c.category === course.category && c.slug !== course.slug).slice(0, 3);
  const rating = await ratingFor(course.slug);
  const reviews = await listReviews({ courseSlug: course.slug, status: "verified" });
  const jsonLd = courseSchemaJsonLd({
    course: {
      slug: course.slug,
      title: course.title,
      headline: course.headline,
      priceFromUSD: course.priceFromUSD,
    },
    rating,
    reviews,
    siteUrl: SITE_URL,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHero
        eyebrow={category?.title ?? "Qualification"}
        title={course.title}
        description={course.headline}
        breadcrumbs={[{ label: "Courses", href: "/courses" }, { label: course.title }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Badge
            tone="cyan"
            className="bg-cyan-100 text-cyan-700 ring-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-200 dark:ring-cyan-400/30"
          >
            <Award className="h-3.5 w-3.5" /> {body?.shortName ?? "EIOSH"}
          </Badge>
          <Badge
            tone="navy"
            className="bg-white text-navy-900 ring-border capitalize dark:bg-white/10 dark:text-white dark:ring-white/20"
          >
            {course.level}
          </Badge>
          <Badge
            tone="navy"
            className="bg-white text-navy-900 ring-border dark:bg-white/10 dark:text-white dark:ring-white/20"
          >
            {formatDuration(course.durationHours)}
          </Badge>
          {course.cohortStart ? (
            <Badge
              tone="gold"
              className="bg-amber-100 text-amber-800 ring-amber-200 dark:bg-gold-400/20 dark:text-gold-100 dark:ring-gold-300/30"
            >
              <CalendarDays className="h-3.5 w-3.5" /> Next cohort: {formatDate(course.cohortStart)}
            </Badge>
          ) : null}
        </div>
      </PageHero>

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-12">
              <div>
                <h2 className="text-2xl font-heading font-semibold text-navy-900">What you'll learn</h2>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {course.learningOutcomes.map((l) => (
                    <li key={l} className="flex items-start gap-2.5 text-ink">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-600" />
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading font-semibold text-navy-900">Who should attend</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {course.whoShouldAttend.map((w) => (
                    <li key={w} className="rounded-full bg-navy-50 px-3 py-1 text-sm text-navy-800 ring-1 ring-inset ring-navy-200">
                      {w}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-heading font-semibold text-navy-900">Programme outline</h2>
                <ol className="mt-5 divide-y divide-border rounded-2xl bg-white ring-1 ring-border">
                  {course.moduleOutline.map((m, i) => (
                    <li key={m.title} className="flex gap-5 p-5">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-900 font-heading text-sm font-semibold text-white">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="font-heading font-semibold text-navy-900">{m.title}</p>
                        <p className="mt-1 text-sm text-ink-muted">{m.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-2xl bg-surface-subtle p-6">
                  <div className="flex items-center gap-2 text-cyan-700">
                    <BookOpen className="h-5 w-5" />
                    <p className="font-heading font-semibold">Assessment</p>
                  </div>
                  <p className="mt-3 text-sm text-ink-muted">{course.assessment}</p>
                </div>
                <div className="rounded-2xl bg-surface-subtle p-6">
                  <div className="flex items-center gap-2 text-cyan-700">
                    <Award className="h-5 w-5" />
                    <p className="font-heading font-semibold">Certification</p>
                  </div>
                  <p className="mt-3 text-sm text-ink-muted">{course.certification}</p>
                </div>
              </div>
            </div>

            {/* Sticky enrolment card */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated">
                <p className="text-xs uppercase tracking-wider text-ink-soft">From</p>
                <p className="mt-1 font-heading text-3xl font-semibold text-navy-900">
                  {course.priceFromUSD ? (
                    <PriceDisplay usd={course.priceFromUSD} showSource={false} />
                  ) : (
                    "Enquire"
                  )}
                </p>
                <ul className="mt-5 space-y-3 text-sm">
                  <li className="flex items-center gap-2.5 text-ink">
                    <Clock className="h-4 w-4 text-cyan-600" /> {formatDuration(course.durationHours)} of learning
                  </li>
                  <li className="flex items-center gap-2.5 text-ink capitalize">
                    <GraduationCap className="h-4 w-4 text-cyan-600" /> {course.level} level
                  </li>
                  <li className="flex items-center gap-2.5 text-ink">
                    <Globe2 className="h-4 w-4 text-cyan-600" /> {course.modes.join(" · ")}
                  </li>
                  <li className="flex items-center gap-2.5 text-ink">
                    <Users className="h-4 w-4 text-cyan-600" /> Taught in {course.language === "en-ar" ? "English & Arabic" : course.language.toUpperCase()}
                  </li>
                </ul>
                <div className="mt-6 flex flex-col gap-2.5">
                  <EnrolNowButton
                    courseSlug={course.slug}
                    price={course.priceFromUSD}
                    currency="USD"
                    fullWidth
                  />
                  <Button href="#enquire" variant="outline" size="lg">
                    Talk to admissions
                  </Button>
                  <Button href="/contact#brochure" variant="ghost" size="sm">
                    Download brochure
                  </Button>
                </div>
                <p className="mt-4 text-xs text-ink-soft">
                  Pay securely by card. Flexible instalment plans available for Level 5+ programmes — ask admissions.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="flex items-baseline justify-between">
            <h2 className="font-heading text-2xl font-semibold text-navy-900">
              Reviews from learners
            </h2>
            {rating.count > 0 && (
              <p className="text-sm text-ink-soft">
                <strong className="text-navy-900">{rating.avg.toFixed(1)}</strong> / 5 ·{" "}
                {rating.count} verified review{rating.count === 1 ? "" : "s"}
              </p>
            )}
          </div>
          <div className="mt-6">
            {/* Server component reads the reviews JSON. */}
            {/* @ts-expect-error Async Server Component */}
            <ReviewsList courseSlug={course.slug} limit={4} />
          </div>
        </Container>
      </Section>

      <Section tone="subtle" id="enquire">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="eyebrow">Enquire</p>
              <h2 className="mt-3 text-display-sm font-heading font-semibold text-navy-900">
                Request the syllabus, cohort dates and pricing.
              </h2>
              <p className="mt-4 text-ink-muted">
                Tell us a little about your goals. An EIOSH advisor will follow up within one business day with the full brochure, available cohorts and any progression advice.
              </p>
            </div>
            <InquiryForm variant="course" initialCourseSlug={course.slug} />
          </div>
        </Container>
      </Section>

      {related.length ? (
        <CourseGrid
          courses={related}
          eyebrow="Related programmes"
          title="You might also consider"
          description="Other qualifications in the same category — often chosen alongside this one."
          showViewAll={false}
          tone="surface"
        />
      ) : null}
    </>
  );
}
