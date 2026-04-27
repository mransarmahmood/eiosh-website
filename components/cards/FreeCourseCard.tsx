import { PlayCircle, BookOpen, Headphones, MousePointerClick, Clock, Users, Award, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { CourseArt } from "@/components/ui/CourseArt";
import type { FreeCourse } from "@/lib/types";
import { categories } from "@/content/categories";

const FORMAT_ICON = {
  video: PlayCircle,
  reading: BookOpen,
  podcast: Headphones,
  interactive: MousePointerClick,
} as const;

const FORMAT_LABEL = {
  video: "Video series",
  reading: "Reading",
  podcast: "Podcast",
  interactive: "Interactive",
};

export function FreeCourseCard({ course }: { course: FreeCourse }) {
  const Icon = FORMAT_ICON[course.format];
  const category = categories.find((c) => c.slug === course.category);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border shadow-elevated transition hover:-translate-y-0.5 hover:ring-cyan-400 hover:shadow-floating">
      <CourseArt
        category={course.category}
        height="sm"
        badge={
          <>
            <Badge tone="navy" className="bg-white/95 text-navy-900 ring-0">
              <Icon className="h-3 w-3" /> {FORMAT_LABEL[course.format]}
            </Badge>
            <Badge tone="success">Free</Badge>
          </>
        }
      />

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-lg font-semibold text-navy-900 text-balance">
          <Link href={`/free-courses/${course.slug}`} className="after:absolute after:inset-0">
            {course.title}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-ink-muted line-clamp-3">{course.summary}</p>

        {category ? <p className="mt-3 text-xs font-medium uppercase tracking-wider text-cyan-700">{category.title}</p> : null}

        <dl className="mt-5 grid grid-cols-3 gap-3 text-xs text-ink-muted">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-cyan-600" />
            <span>{course.durationMinutes} min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5 text-cyan-600" />
            <span>{course.lessonsCount} lessons</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-cyan-600" />
            <span>{course.enrolledCount ? `${Math.round(course.enrolledCount / 100) / 10}k` : "New"}</span>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between pt-6">
          <span className="capitalize text-xs text-ink-soft">{course.level} level</span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-cyan-700 transition group-hover:gap-1.5">
            {course.hasCertificate ? (
              <span className="inline-flex items-center gap-1">
                <Award className="h-3.5 w-3.5" /> Start & earn
              </span>
            ) : (
              "Start learning"
            )}
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
