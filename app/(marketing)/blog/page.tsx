import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { BlogCard } from "@/components/cards/BlogCard";
import { blog } from "@/content/blog";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Insights & Briefings",
  description:
    "Practitioner-written insights on safety, environment, ESG, qualifications and leadership — from the EIOSH faculty.",
  path: "/blog",
});

export default function BlogIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Briefings from the EIOSH faculty."
        description="Short, substantive writing on the themes we teach — for busy practitioners who want the point, not the preamble."
        breadcrumbs={[{ label: "Insights" }]}
      />
      <Section tone="subtle">
        <Container>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blog.map((p) => (
              <li key={p.id}>
                <BlogCard post={p} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
