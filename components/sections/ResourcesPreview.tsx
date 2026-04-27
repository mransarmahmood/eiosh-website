import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { resources } from "@/content/resources";

export function ResourcesPreview() {
  const featured = resources.slice(0, 4);
  return (
    <Section tone="subtle">
      <Container>
        <SectionHeading
          eyebrow="Library"
          title="Books, notes and practitioner resources."
          description="Faculty-written books, consolidated study notes, sample papers with model answers, checklists and whitepapers — most free, some email-gated for updates."
          align="center"
          className="mx-auto text-center"
        />
        <div className="mt-4 flex justify-center">
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline"
          >
            Enter the library
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {featured.map((r) => (
            <li key={r.id}>
              <ResourceCard r={r} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
