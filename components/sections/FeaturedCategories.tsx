import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, HardHat, UtensilsCrossed, Flame, Briefcase, Users, Leaf, HeartPulse } from "lucide-react";
import { categories } from "@/content/categories";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { CourseCategory } from "@/lib/types";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  HardHat,
  UtensilsCrossed,
  Flame,
  Briefcase,
  Users,
  Leaf,
  HeartPulse,
};

export function FeaturedCategories() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Qualification areas"
          title="Pathways built around the credentials that matter."
          description="From single-day awareness through to Level 6 diplomas, every EIOSH programme leads to a credential issued by a recognised awarding body."
          align="center"
          className="mx-auto text-center"
        />
        <div className="mt-4 flex justify-center">
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline"
          >
            Browse all courses
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((c: CourseCategory) => {
            const Icon = ICONS[c.icon] ?? HardHat;
            return (
              <li key={c.id}>
                <Link
                  href={`/courses?category=${c.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border transition hover:-translate-y-1 hover:ring-cyan-400 hover:shadow-floating"
                >
                  {/* Hero image corner — full-width on top */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-navy-900 via-navy-700 to-cyan-600">
                    {c.image ? (
                      <Image
                        src={c.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover opacity-95 transition duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    {/* Navy glaze for consistent contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-900/30 to-transparent" />
                    <div className="absolute inset-0 bg-grid-subtle [background-size:18px_18px] opacity-[0.18]" aria-hidden />
                    {/* Icon tile pinned top-right corner */}
                    <span className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/95 text-cyan-700 shadow-elevated ring-1 ring-inset ring-cyan-200 backdrop-blur">
                      <Icon className="h-5 w-5" />
                    </span>
                    {/* Gold accent bar bottom-left of image */}
                    <span className="absolute bottom-0 left-0 h-1 w-16 bg-gold-400" aria-hidden />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-heading text-lg font-semibold text-navy-900 leading-snug text-balance">
                      {c.title}
                    </h3>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-cyan-700">{c.tagline}</p>
                    <p className="mt-3 text-sm text-ink-muted flex-1">{c.description}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-navy-900 transition group-hover:gap-1.5 group-hover:text-cyan-700">
                      Explore <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
