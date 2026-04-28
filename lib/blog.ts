import { blog } from "@/content/blog";
import { trainers } from "@/content/trainers";
import type { BlogPost, Trainer } from "@/lib/types";

/** Approximate reading time in whole minutes. ~200 words per minute. */
export function readingTime(post: Pick<BlogPost, "body" | "excerpt" | "readTimeMinutes">): number {
  if (post.readTimeMinutes && post.readTimeMinutes > 0) return post.readTimeMinutes;
  const text = `${post.excerpt ?? ""} ${post.body ?? ""}`.trim();
  if (!text) return 1;
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Resolve the post's author to a trainer record (if `authorTrainerSlug` is set). */
export function authorTrainer(post: BlogPost): Trainer | null {
  if (!post.authorTrainerSlug) return null;
  return trainers.find((t) => t.slug === post.authorTrainerSlug) ?? null;
}

/** Posts that share at least one category/tag with `post`, ranked by overlap. */
export function relatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const own = new Set([post.category, ...(post.tags ?? [])].filter(Boolean) as string[]);
  return blog
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const candidate = new Set([p.category, ...(p.tags ?? [])].filter(Boolean) as string[]);
      let overlap = 0;
      for (const k of own) if (candidate.has(k)) overlap += 1;
      return { post: p, overlap };
    })
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      // tie-break: newest first
      return Date.parse(b.post.publishedAt) - Date.parse(a.post.publishedAt);
    })
    .slice(0, limit)
    .map((x) => x.post);
}

/** All distinct categories actually present in the blog data. */
export function blogCategories(): string[] {
  return Array.from(new Set(blog.map((p) => p.category).filter(Boolean) as string[])).sort();
}

/** All distinct tags actually present. */
export function blogTags(): string[] {
  return Array.from(new Set(blog.flatMap((p) => p.tags ?? []))).sort();
}

/** Schema.org Article JSON-LD for a single post. Drop into a `<script type="application/ld+json">`. */
export function articleJsonLd(post: BlogPost, siteUrl: string) {
  const author = authorTrainer(post);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.cover ? new URL(post.cover, siteUrl).toString() : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: author?.name ?? post.author,
      url: author ? new URL(`/trainers#${author.slug}`, siteUrl).toString() : undefined,
    },
    publisher: {
      "@type": "Organization",
      name: "EIOSH International",
      url: siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": new URL(`/blog/${post.slug}`, siteUrl).toString(),
    },
    keywords: post.tags?.join(", "),
    articleSection: post.category,
  };
}
