import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { pageMeta } from "@/lib/seo";
import { loadPageContent, type BasicHero } from "@/lib/page-content";

interface PolicySection {
  id: string;
  title: string;
  body: string;
}

interface PoliciesContent {
  hero: BasicHero;
  lastReviewed?: string;
  sections: PolicySection[];
}

export async function generateMetadata() {
  try {
    const p = await loadPageContent<PoliciesContent>("policies");
    return pageMeta({ title: p.hero.title, description: p.hero.description, path: "/policies" });
  } catch {
    return pageMeta({ title: "Policies", path: "/policies" });
  }
}

export default async function PoliciesPage() {
  const p = await loadPageContent<PoliciesContent>("policies");

  return (
    <>
      <PageHero
        eyebrow={p.hero.eyebrow}
        title={p.hero.title}
        description={p.hero.description}
        breadcrumbs={[{ label: "Policies" }]}
      />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
            {/* In-page nav */}
            <nav className="lg:sticky lg:top-28 lg:self-start">
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-soft">
                On this page
              </p>
              <ul className="mt-3 space-y-1">
                {p.sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block rounded px-2 py-1 text-sm text-ink hover:bg-navy-50 hover:text-navy-900"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
              {p.lastReviewed && (
                <p className="mt-6 text-xs text-ink-soft">
                  Last reviewed: {p.lastReviewed}
                </p>
              )}
            </nav>

            {/* Sections */}
            <article className="prose-eiosh max-w-3xl space-y-12">
              {p.sections.map((s) => (
                <section key={s.id} id={s.id}>
                  <h2 className="font-heading text-2xl font-semibold text-navy-900">{s.title}</h2>
                  <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-ink">
                    {s.body}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </Container>
      </Section>
    </>
  );
}
