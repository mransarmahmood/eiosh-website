import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border transition hover:ring-cyan-400 hover:shadow-elevated">
      <div className="relative aspect-[16/9] bg-brand-gradient-soft">
        <div className="absolute inset-0 flex items-end p-5">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-medium text-navy-800 ring-1 ring-inset ring-navy-200 backdrop-blur">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs uppercase tracking-wider text-cyan-700">
          {formatDate(post.publishedAt)} · {post.readTimeMinutes} min read
        </p>
        <h3 className="mt-3 text-lg font-heading font-semibold text-navy-900 leading-snug text-balance">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 text-sm text-ink-muted line-clamp-3">{post.excerpt}</p>
        <div className="mt-auto pt-5">
          <span className="inline-flex items-center gap-1 text-sm font-medium text-cyan-700 transition group-hover:gap-1.5">
            Read article
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
