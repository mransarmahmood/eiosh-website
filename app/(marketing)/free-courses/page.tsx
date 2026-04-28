import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FreeCourseCard } from "@/components/cards/FreeCourseCard";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, GraduationCap, Infinity as InfinityIcon, Award, Sparkles, PlayCircle, BookOpen, Headphones, MousePointerClick } from "lucide-react";
import { freeCourses } from "@/content/freeCourses";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Free Online Courses",
  description:
    "An open library of short, practitioner-written courses — video, audio, reading and interactive — on safety, environment, food, fire and first aid.",
  path: "/free-courses",
});

const promises = [
  { icon: InfinityIcon, t: "Always free", d: "No trial. No credit card. No time-limit on access." },
  { icon: Award, t: "Verifiable certificate", d: "Selected courses include a shareable certificate on completion." },
  { icon: Sparkles, t: "Written by practitioners", d: "Every lesson is authored by the same faculty that teaches our paid programmes." },
  { icon: GraduationCap, t: "Feeds the full catalogue", d: "Natural stepping stone into our regulated qualifications when you're ready." },
];

const formats = [
  { icon: PlayCircle, label: "Video" },
  { icon: BookOpen, label: "Reading" },
  { icon: Headphones, label: "Podcast" },
  { icon: MousePointerClick, label: "Interactive" },
];

export default function FreeCoursesPage() {
  const withCert = freeCourses.filter((c) => c.hasCertificate);
  return (
    <>
      <PageHero
        eyebrow="Free online learning"
        title="An open library of safety, environment and compliance courses."
        description="Short, practitioner-written courses — video, audio, reading, interactive. No paywall, no signup friction. Start, stop and return whenever you want."
        breadcrumbs={[{ label: "Free courses" }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="#library" variant="gold" size="lg">
            Browse the library <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            href="/courses"
            variant="outline"
            size="lg"
            className="bg-white text-navy-900 ring-border hover:bg-navy-50 hover:ring-cyan-300 dark:bg-white/5 dark:text-white dark:ring-white/20 dark:hover:bg-white/10 dark:hover:ring-white/40"
          >
            Ready for a qualification?
          </Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-2 text-sm text-ink-muted dark:text-white/70">
          {formats.map((f) => {
            const Icon = f.icon;
            return (
              <span
                key={f.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 ring-1 ring-inset ring-border dark:bg-white/5 dark:ring-white/15"
              >
                <Icon className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-300" /> {f.label}
              </span>
            );
          })}
        </div>
      </PageHero>

      {/* Promises band */}
      <section className="border-b border-border bg-white">
        <Container className="py-12">
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {promises.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.t} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-heading font-semibold text-navy-900">{p.t}</p>
                    <p className="mt-1 text-sm text-ink-muted">{p.d}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Featured certificate tier */}
      <Section tone="subtle">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="With certificate"
              title="Free courses that come with a shareable certificate."
              description="Complete the lessons and the short assessment to earn a verifiable credential you can add to LinkedIn."
            />
            <Badge tone="gold" className="self-start md:self-end">
              <Award className="h-3.5 w-3.5" /> {withCert.length} certificate-backed courses
            </Badge>
          </div>
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {withCert.map((c) => (
              <li key={c.id}>
                <FreeCourseCard course={c} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Full library */}
      <Section id="library">
        <Container>
          <SectionHeading
            eyebrow="Full library"
            title="Every free course — ready to start."
            description="Ordered by category and length. Filters and search come in the next release."
          />
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {freeCourses.map((c) => (
              <li key={c.id}>
                <FreeCourseCard course={c} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="gradient">
        <Container className="text-center">
          <h2 className="font-heading text-display-sm font-semibold text-white text-balance">
            Ready to turn free learning into a qualification?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Everything you've covered here maps directly into our paid programmes. An advisor will map your learning to the right qualification level.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button href="/courses" variant="gold" size="lg">See paid programmes</Button>
            <Button href="/contact" variant="outline" size="lg" className="bg-white/5 text-white ring-white/20 hover:bg-white/10 hover:ring-white/40">
              Talk to an advisor
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
