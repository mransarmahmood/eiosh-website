import Link from "next/link";
import { CalendarDays, BookOpen, Headphones, DoorOpen, Users2 } from "lucide-react";
import { EventsHero } from "@/components/sections/EventsHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { EventsFiltered } from "@/components/sections/EventsFiltered";
import { events } from "@/content/events";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Events, Workshops, Seminars & Webinars",
  description:
    "Upcoming workshops, seminars, free webinars, cohort starts and open days hosted by the EIOSH faculty. Filter by type and register in one click.",
  path: "/events",
});

function count(type: string) {
  return events.filter((e) => e.type === type).length;
}

const stats = [
  { icon: BookOpen, label: "Workshops & seminars", value: count("workshop") },
  { icon: Headphones, label: "Free webinars", value: count("webinar") },
  { icon: Users2, label: "Cohort starts", value: count("cohort-start") },
  { icon: DoorOpen, label: "Open days", value: count("open-day") },
];

export default function EventsPage() {
  return (
    <>
      <EventsHero />

      {/* Type overview */}
      <section className="border-b border-border bg-white">
        <Container className="py-12">
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.label} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-heading text-2xl font-semibold text-navy-900">{s.value}</p>
                    <p className="text-sm text-ink-muted">{s.label}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <Section tone="subtle" id="list">
        <Container>
          <SectionHeading
            eyebrow="Filter by type"
            title="All upcoming events."
            description="Tap a filter to see just workshops, free webinars, cohort starts, or open days."
          />
          <div className="mt-10">
            <EventsFiltered />
          </div>
        </Container>
      </Section>

      <Section tone="gradient">
        <Container className="text-center">
          <h2 className="font-heading text-display-sm font-semibold text-white text-balance">
            Prefer a private workshop for your team?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/80">
            Every public workshop can be delivered privately — on-site, virtually or blended — with your own case studies.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button href="/corporate-training" variant="gold" size="lg">Commission a workshop</Button>
            <Link href="/calendar" className="text-sm font-medium text-white hover:underline">
              <CalendarDays className="inline h-4 w-4 mr-1" /> View calendar
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
