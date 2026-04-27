import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ResourceFilters } from "@/components/sections/ResourceFilters";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { resources } from "@/content/resources";
import { ArrowRight, BookText, StickyNote, FileCheck, ListChecks, FileSpreadsheet, FileDown } from "lucide-react";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Resources, Books & Notes",
  description:
    "Books, consolidated study notes, sample papers, checklists, whitepapers and brochures from the EIOSH faculty. Public and email-gated downloads.",
  path: "/resources",
});

function kindCount(kind: string) {
  return resources.filter((r) => r.kind === kind).length;
}

const overview = [
  { icon: BookText, label: "Books", value: kindCount("book") },
  { icon: StickyNote, label: "Study notes", value: kindCount("notes") },
  { icon: FileCheck, label: "Sample papers", value: kindCount("sample-paper") },
  { icon: ListChecks, label: "Checklists", value: kindCount("checklist") },
  { icon: FileSpreadsheet, label: "Whitepapers", value: kindCount("whitepaper") },
  { icon: FileDown, label: "Brochures", value: kindCount("brochure") },
];

export default function ResourcesPage() {
  const featured = resources.slice(0, 3);
  return (
    <>
      <PageHero
        eyebrow="Library"
        title="Books, notes and practitioner resources."
        description="An open library of practitioner-written material — books, consolidated study notes, sample papers with model answers, checklists and whitepapers. Most are free, some request an email to send you future updates."
        breadcrumbs={[{ label: "Resources" }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="#library" variant="gold" size="lg">
            Browse the library <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            href="/free-courses"
            variant="outline"
            size="lg"
            className="bg-white/5 text-white ring-white/20 hover:bg-white/10 hover:ring-white/40"
          >
            Explore free courses
          </Button>
        </div>
      </PageHero>

      {/* Overview band */}
      <section className="border-b border-border bg-white">
        <Container className="py-12">
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {overview.map((o) => {
              const Icon = o.icon;
              return (
                <li key={o.label} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-heading text-xl font-semibold text-navy-900">{o.value}</p>
                    <p className="text-xs text-ink-muted">{o.label}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Featured shelf */}
      <Section tone="subtle">
        <Container>
          <SectionHeading
            eyebrow="This month's shelf"
            title="Three resources our faculty is pushing this month."
            description="Newly updated or newly released material worth an immediate download."
          />
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((r) => (
              <li key={r.id}>
                <ResourceCard r={r} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Filterable library */}
      <Section id="library">
        <Container>
          <SectionHeading
            eyebrow="Full library"
            title="Filter by kind — search by keyword."
            description="Every public resource downloads immediately. Email-gated downloads are sent within minutes; learner-only resources require an EIOSH account."
          />
          <div className="mt-10">
            <ResourceFilters />
          </div>
        </Container>
      </Section>

      <Section tone="gradient">
        <Container className="text-center">
          <h2 className="font-heading text-display-sm font-semibold text-white text-balance">
            Publishing a resource every two weeks.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Subscribe to our monthly round-up to get new books, notes and sample papers sent to your inbox the day they publish.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button href="/contact#enquire" variant="gold" size="lg">Subscribe by email</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
