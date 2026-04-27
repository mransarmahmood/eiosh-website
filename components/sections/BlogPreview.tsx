import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { BlogCard } from "@/components/cards/BlogCard";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { blog } from "@/content/blog";

export function BlogPreview() {
  const featured = blog.slice(0, 3);
  return (
    <Section tone="subtle">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Insights"
            title="Practitioner briefings from the EIOSH faculty."
            description="Short, substantive reads on regulation, ESG, behavioural safety and qualification strategy — written by the people who teach our programmes."
          />
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline">
            All insights
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <li key={p.id}>
              <BlogCard post={p} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
