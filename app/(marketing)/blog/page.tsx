import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { BlogCard } from "@/components/cards/BlogCard";
import { blog } from "@/content/blog";
import { blogCategories, blogTags } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Insights & Briefings",
  description:
    "Practitioner-written insights on safety, environment, ESG, qualifications and leadership — from the EIOSH faculty.",
  path: "/blog",
});

interface SearchParams {
  searchParams: { category?: string; tag?: string };
}

export default function BlogIndexPage({ searchParams }: SearchParams) {
  const activeCategory = searchParams?.category;
  const activeTag = searchParams?.tag;

  const filtered = blog.filter((p) => {
    if (activeCategory && p.category !== activeCategory) return false;
    if (activeTag && !(p.tags ?? []).includes(activeTag)) return false;
    return true;
  });

  const categories = blogCategories();
  const tags = blogTags();

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Briefings from the EIOSH faculty."
        description="Short, substantive writing on the themes we teach — for busy practitioners who want the point, not the preamble."
        breadcrumbs={[{ label: "Insights" }]}
      />

      {(categories.length > 0 || tags.length > 0) && (
        <Section tone="subtle">
          <Container>
            <div className="space-y-3">
              {categories.length > 0 && (
                <FilterRow
                  label="Categories"
                  items={categories}
                  active={activeCategory}
                  paramName="category"
                />
              )}
              {tags.length > 0 && (
                <FilterRow
                  label="Tags"
                  items={tags}
                  active={activeTag}
                  paramName="tag"
                />
              )}
            </div>
          </Container>
        </Section>
      )}

      <Section tone="subtle">
        <Container>
          {filtered.length === 0 ? (
            <p className="text-center text-ink-soft">
              No posts match that filter.{" "}
              <Link href="/blog" className="text-cyan-700 underline">
                Clear filter
              </Link>
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <li key={p.id}>
                  <BlogCard post={p} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}

function FilterRow({
  label,
  items,
  active,
  paramName,
}: {
  label: string;
  items: string[];
  active: string | undefined;
  paramName: "category" | "tag";
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-ink-soft">
        {label}:
      </span>
      <Link
        href="/blog"
        className={`rounded-full px-3 py-1 text-xs transition ${
          !active
            ? "bg-navy-900 text-white"
            : "bg-white text-ink-soft ring-1 ring-inset ring-border hover:bg-navy-50"
        }`}
      >
        All
      </Link>
      {items.map((item) => (
        <Link
          key={item}
          href={`/blog?${paramName}=${encodeURIComponent(item)}`}
          className={`rounded-full px-3 py-1 text-xs transition ${
            active === item
              ? "bg-navy-900 text-white"
              : "bg-white text-ink-soft ring-1 ring-inset ring-border hover:bg-navy-50"
          }`}
        >
          {item}
        </Link>
      ))}
    </div>
  );
}
