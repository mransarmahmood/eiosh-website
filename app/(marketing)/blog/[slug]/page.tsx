import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag, Folder } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { BlogCard } from "@/components/cards/BlogCard";
import { SocialShare } from "@/components/blog/SocialShare";
import { AuthorByline } from "@/components/blog/AuthorByline";
import { blog } from "@/content/blog";
import { formatDate } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";
import { readingTime, relatedPosts, articleJsonLd } from "@/lib/blog";

interface Params {
  params: { slug: string };
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eiosh.com";

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
  const related = relatedPosts(post, 3);
  const minutes = readingTime(post);
  const jsonLd = articleJsonLd(post, SITE_URL);
  const articleUrl = `${SITE_URL}/blog/${post.slug}`;

  return (
    <>
      {/* Article schema markup for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        eyebrow={`${formatDate(post.publishedAt)} · ${minutes} min read${post.category ? ` · ${post.category}` : ""}`}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[{ label: "Insights", href: "/blog" }, { label: post.title }]}
      />

      <Section>
        <Container>
          <article className="mx-auto max-w-3xl">
            <header className="mb-8 space-y-4">
              <AuthorByline post={post} expanded />
              <div className="flex flex-wrap items-center justify-between gap-4 border-y border-border py-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
                  {post.category && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-navy-50 px-2.5 py-1 text-navy-900">
                      <Folder className="h-3 w-3" />
                      <Link href={`/blog?category=${encodeURIComponent(post.category)}`} className="hover:underline">
                        {post.category}
                      </Link>
                    </span>
                  )}
                  {(post.tags ?? []).map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-1 text-cyan-800 hover:bg-cyan-100"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </Link>
                  ))}
                </div>
                <SocialShare title={post.title} url={articleUrl} />
              </div>
            </header>

            <div className="prose-eiosh">
              <p className="text-lg leading-relaxed">
                {post.body ??
                  "This article is being prepared by our faculty. In the meantime, please explore the related reading below, or reach out to our team for the key points of this briefing."}
              </p>
              <p>
                The EIOSH faculty publishes briefings like this one roughly twice a month. If you'd like new articles delivered to your inbox, subscribe to our monthly round-up at the bottom of the page.
              </p>
            </div>

            <footer className="mt-10 flex items-center justify-between border-t border-border pt-6">
              <Link
                href="/blog"
                className="inline-flex items-center gap-1.5 text-sm text-cyan-700 hover:underline"
              >
                <ArrowLeft className="h-4 w-4" /> Back to all insights
              </Link>
              <SocialShare title={post.title} url={articleUrl} />
            </footer>
          </article>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="subtle">
          <Container>
            <h2 className="text-xl font-heading font-semibold text-navy-900">Continue reading</h2>
            <p className="mt-1 text-sm text-ink-soft">Articles related by topic.</p>
            <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((p) => (
                <li key={p.id}>
                  <BlogCard post={p} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}
