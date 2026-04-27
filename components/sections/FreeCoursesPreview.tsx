import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FreeCourseCard } from "@/components/cards/FreeCourseCard";
import { freeCourses } from "@/content/freeCourses";

export function FreeCoursesPreview() {
  const featured = freeCourses.slice(0, 3);
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Free online learning"
          title="Short, practitioner-written courses — always free."
          description="Start learning the fundamentals today. No paywall. No signup friction. Certificates on selected pathways."
          align="center"
          className="mx-auto text-center"
        />
        <div className="mt-4 flex justify-center">
          <Link
            href="/free-courses"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline"
          >
            Browse the free library
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((c) => (
            <li key={c.id}>
              <FreeCourseCard course={c} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
