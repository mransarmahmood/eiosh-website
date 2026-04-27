import Link from "next/link";
import { Clock, GraduationCap, Globe2, ArrowUpRight, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { CourseArt } from "@/components/ui/CourseArt";
import { accreditations } from "@/content/accreditations";
import { categories } from "@/content/categories";
import type { Course } from "@/lib/types";
import { cn, formatDuration, formatDate } from "@/lib/utils";

export function CourseCard({ course, className }: { course: Course; className?: string }) {
  const body = accreditations.find((a) => a.slug === course.awardingBody);
  const category = categories.find((c) => c.slug === course.category);

  const statusTone =
    course.status === "filling-fast"
      ? "warn"
      : course.status === "waitlist"
      ? "neutral"
      : course.status === "upcoming"
      ? "cyan"
      : "success";
  const statusLabel =
    course.status === "filling-fast"
      ? "Filling fast"
      : course.status === "waitlist"
      ? "Join waitlist"
      : course.status === "upcoming"
      ? "Upcoming cohort"
      : "Open for enrolment";

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border transition hover:ring-cyan-400 hover:shadow-floating",
        className
      )}
    >
      <CourseArt
        category={course.category}
        imageUrl={course.heroImage}
        height="sm"
        badge={
          <>
            <Badge tone="navy" className="bg-white/95 text-navy-900 ring-0">{body?.shortName ?? "EIOSH"}</Badge>
            <Badge tone={statusTone}>{statusLabel}</Badge>
          </>
        }
      />

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium uppercase tracking-wider text-cyan-700">{category?.title ?? "Qualification"}</p>
        <h3 className="mt-2 text-xl font-heading font-semibold text-navy-900 leading-snug text-balance">
          <Link href={`/courses/${course.slug}`} className="after:absolute after:inset-0">
            {course.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-ink-muted line-clamp-2">{course.headline}</p>

        <dl className="mt-5 grid grid-cols-3 gap-3 text-xs text-ink-muted">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-cyan-600" />
            <span>{formatDuration(course.durationHours)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GraduationCap className="h-3.5 w-3.5 text-cyan-600" />
            <span className="capitalize">{course.level}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5 text-cyan-600" />
            <span>
              {course.modes
                .map((m) => (m === "in-person" ? "In-person" : m === "self-paced" ? "Self-paced" : m[0].toUpperCase() + m.slice(1)))
                .slice(0, 2)
                .join(" · ")}
            </span>
          </div>
        </dl>

        {course.cohortStart ? (
          <p className="mt-4 inline-flex items-center gap-1.5 text-xs text-gold-700">
            <CalendarDays className="h-3 w-3" /> Next cohort {formatDate(course.cohortStart)}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between pt-6">
          <div>
            {course.priceFromUSD ? (
              <>
                <span className="block text-xs text-ink-soft">From</span>
                <span className="text-xl font-heading font-semibold text-navy-900">
                  US${course.priceFromUSD.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-sm text-ink-muted">Enquire for pricing</span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-cyan-700 transition group-hover:gap-1.5">
            View details
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
