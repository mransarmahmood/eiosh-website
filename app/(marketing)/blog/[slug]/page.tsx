import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { BlogCard } from "@/components/cards/BlogCard";
import { blog } from "@/content/blog";
import { formatDate } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return blog.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params) {
  const p = blog.find((x) => x.slug === params.slug);
  if (!p) return pageMeta({ title: "Article not found", noIndex: true });
  return pageMeta({ title: p.title, description: p.excerpt, path: `/blog/${p.slug}`, type: "article" });
}

export default function BlogPostPage({ params }: Params) {
  const post = blog.find((p) => p.slug === params.slug);
  if (!post) return notFound();
  const related = blog.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={`${formatDate(post.publishedAt)} · ${post.readTimeMinutes} min read`}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[{ label: "Insights", href: "/blog" }, { label: post.title }]}
      />

      <Section>
        <Container>
          <article className="mx-auto max-w-3xl prose-eiosh">
            <p className="text-sm uppercase tracking-wider text-cyan-700">By {post.author}</p>
            {/* Body content would come from CMS rich text. Placeholder lede keeps the layout honest. */}
            <p className="mt-6 text-lg leading-relaxed">
              {post.body ??
                "This article is being prepared by our faculty. In the meantime, please explore the related reading below, or reach out to our team for the key points of this briefing."}
            </p>
            <p>
              The EIOSH faculty publishes briefings like this one roughly twice a month. If you'd like new articles delivered to your inbox, subscribe to our monthly round-up at the bottom of the page.
            </p>
            <Link href="/blog" className="mt-10 inline-flex items-center gap-1.5 text-cyan-700 hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to all insights
            </Link>
          </article>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <h2 className="text-xl font-heading font-semibold text-navy-900">Continue reading</h2>
          <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {related.map((p) => (
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
