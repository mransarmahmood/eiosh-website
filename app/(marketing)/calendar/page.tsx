import Link from "next/link";
import { ArrowRight, CalendarDays, Video, MapPin, Clock } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EventRegisterButton } from "@/components/forms/EventRegisterButton";
import { CalendarGrid } from "@/components/sections/CalendarGrid";
import { events } from "@/content/events";
import { formatDate } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Course Calendar",
  description:
    "Every EIOSH cohort start, workshop, webinar, seminar and open day — in a single calendar view with timezone-aware detail.",
  path: "/calendar",
});

export default function CalendarPage() {
  const upcoming = [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt)).slice(0, 6);
  return (
    <>
      <PageHero
        eyebrow="Course calendar"
        title="Every cohort, workshop and webinar — in one place."
        description="A live calendar of EIOSH programme starts, hands-on workshops, free webinars, seminars and open days. Click any day for the detail, or scroll to the timeline below."
        breadcrumbs={[{ label: "Calendar" }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="#grid" variant="gold" size="lg">
            View this month <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            href="/events"
            variant="outline"
            size="lg"
            className="bg-white text-navy-900 ring-border hover:bg-navy-50 hover:ring-cyan-300 dark:bg-white/5 dark:text-white dark:ring-white/20 dark:hover:bg-white/10 dark:hover:ring-white/40"
          >
            Events list
          </Button>
        </div>
      </PageHero>

      <Section tone="subtle" id="grid">
        <Container>
          <CalendarGrid />
        </Container>
      </Section>

      {/* Up-next list (complements the calendar) */}
      <Section>
        <Container>
          <SectionHeading
            eyebrow="Up next"
            title="The next six events in your calendar."
            description="Cohorts fill fast — the earliest enrolments typically close 7–14 days before the start date."
          />

          <ol className="mt-12 divide-y divide-border rounded-2xl bg-white ring-1 ring-border shadow-elevated">
            {upcoming.map((e) => (
              <li key={e.id} className="grid gap-4 p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
                <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-brand-gradient text-white">
                  <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-cyan-200">
                    {new Date(e.startsAt).toLocaleString("en-GB", { month: "short" })}
                  </span>
                  <span className="font-heading text-2xl font-semibold leading-none">
                    {new Date(e.startsAt).getDate()}
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="cyan">{e.type.replace("-", " ")}</Badge>
                    <Badge tone="neutral">
                      {e.mode === "online" ? (
                        <span className="inline-flex items-center gap-1">
                          <Video className="h-3 w-3" /> Online
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {e.location ?? "In-person"}
                        </span>
                      )}
                    </Badge>
                    <span className="inline-flex items-center gap-1 text-xs text-ink-soft">
                      <Clock className="h-3 w-3" />
                      {new Date(e.startsAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} GST
                    </span>
                  </div>
                  <h3 className="mt-2 font-heading text-lg font-semibold text-navy-900">{e.title}</h3>
                  <p className="mt-1 text-sm text-ink-muted line-clamp-2">{e.summary}</p>
                  <p className="mt-2 text-xs text-cyan-700">
                    <CalendarDays className="inline h-3 w-3 mr-1" />
                    {formatDate(e.startsAt)}
                    {e.endsAt ? ` – ${formatDate(e.endsAt)}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2 md:justify-end">
                  <EventRegisterButton eventSlug={e.slug} eventTitle={e.title} size="sm" />
                  <Link href="/events" className="hidden lg:inline-flex text-sm font-medium text-cyan-700 hover:underline">
                    Details
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </>
  );
}
