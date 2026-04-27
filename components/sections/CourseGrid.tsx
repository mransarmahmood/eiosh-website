import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CourseCard } from "@/components/cards/CourseCard";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Course } from "@/lib/types";

interface Props {
  courses: Course[];
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  tone?: "surface" | "subtle";
  showViewAll?: boolean;
}

export function CourseGrid({
  courses,
  eyebrow = "Featured programmes",
  title = "Programmes our learners rank the highest.",
  description = "Hand-picked qualifications across our most in-demand categories — ready to enrol this quarter.",
  tone = "subtle",
  showViewAll = true,
}: Props) {
  return (
    <Section tone={tone}>
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          {showViewAll ? (
            <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline">
              View all courses
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          ) : null}
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <li key={c.id}>
              <CourseCard course={c} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
