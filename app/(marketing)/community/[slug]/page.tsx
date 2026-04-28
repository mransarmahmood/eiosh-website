import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Lock, Pin } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { findThread } from "@/lib/forum";
import { formatDate } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";
import { CommentForm } from "@/components/community/CommentForm";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const t = await findThread(params.slug);
  if (!t) return pageMeta({ title: "Thread not found", noIndex: true });
  return pageMeta({
    title: t.title,
    description: t.body.slice(0, 200),
    path: `/community/${t.slug}`,
  });
}

export const dynamic = "force-dynamic";

export default async function CommunityThreadPage({ params }: Props) {
  const t = await findThread(params.slug);
  if (!t) notFound();

  return (
    <>
      <PageHero
        eyebrow={t.category}
        title={t.title}
        description={`Started by ${t.authorName} · ${formatDate(t.createdAt)}`}
        breadcrumbs={[
          { label: "Community", href: "/community" },
          { label: t.title },
        ]}
      />
      <Section>
        <Container>
          <div className="mx-auto max-w-3xl">
            {/* Original post */}
            <article className="rounded-2xl border border-border bg-white p-6 shadow-sm">
              <header className="flex items-center justify-between text-xs text-ink-soft">
                <span className="font-medium text-navy-900">{t.authorName}</span>
                <span>{formatDate(t.createdAt)}</span>
              </header>
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink">{t.body}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.7rem] uppercase tracking-wider text-ink-soft">
                {t.pinned && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-cyan-800">
                    <Pin className="h-3 w-3" /> pinned
                  </span>
                )}
                {t.locked && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-800">
                    <Lock className="h-3 w-3" /> locked
                  </span>
                )}
              </div>
            </article>

            {/* Replies */}
            {t.comments.length > 0 && (
              <ul className="mt-6 space-y-3">
                {t.comments.map((c) => (
                  <li
                    key={c.id}
                    className="rounded-xl border border-border bg-white p-4 shadow-sm"
                  >
                    <header className="flex items-center justify-between text-xs text-ink-soft">
                      <span className="font-medium text-navy-900">{c.authorName}</span>
                      <span>{formatDate(c.createdAt)}</span>
                    </header>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink">{c.body}</p>
                  </li>
                ))}
              </ul>
            )}

            {/* Reply form (gated by student session — handled inside the form) */}
            {!t.locked && (
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-navy-900">Add a reply</h3>
                <CommentForm threadSlug={t.slug} />
              </div>
            )}

            <Link
              href="/community"
              className="mt-8 inline-flex items-center gap-1.5 text-sm text-cyan-700 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> All threads
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
