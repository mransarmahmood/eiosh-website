import Link from "next/link";
import { MessageSquare, Pin, Lock } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { listThreads } from "@/lib/forum";
import { formatDate } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Community",
  description: "Alumni community — questions, advice, war stories from the field. Open to current and past EIOSH learners.",
  path: "/community",
});

export const dynamic = "force-dynamic";

export default async function CommunityIndexPage() {
  const threads = await listThreads();

  return (
    <>
      <PageHero
        eyebrow="Community"
        title="Alumni discussions."
        description="Open to current and past EIOSH learners. Share questions, post advice, and learn from each other's experience in the field."
        breadcrumbs={[{ label: "Community" }]}
      >
        <Link
          href="/community/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-navy-950 hover:bg-cyan-400"
        >
          <MessageSquare className="h-3.5 w-3.5" /> Start a thread
        </Link>
      </PageHero>

      <Section tone="subtle">
        <Container>
          {threads.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-ink-soft">
              No threads yet. Be the first.
            </p>
          ) : (
            <ul className="space-y-3">
              {threads.map((t) => {
                const lastAt = t.comments.at(-1)?.createdAt ?? t.createdAt;
                return (
                  <li
                    key={t.id}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md"
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-700">
                      {t.locked ? <Lock className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/community/${t.slug}`}
                        className="block font-semibold text-navy-900 hover:text-cyan-700"
                      >
                        {t.pinned && <Pin className="mr-1 inline h-3 w-3 text-cyan-700" />}
                        {t.title}
                      </Link>
                      <p className="text-xs text-ink-soft">
                        {t.category} · started by {t.authorName} · last activity {formatDate(lastAt)}
                      </p>
                    </div>
                    <span className="rounded-full bg-navy-50 px-2 py-1 text-xs font-medium text-navy-900">
                      {t.comments.length} {t.comments.length === 1 ? "reply" : "replies"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Container>
      </Section>
    </>
  );
}
