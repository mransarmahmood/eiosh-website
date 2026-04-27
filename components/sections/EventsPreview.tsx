import Link from "next/link";
import { CalendarDays, MapPin, ArrowUpRight } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { events } from "@/content/events";
import { formatDate } from "@/lib/utils";

export function EventsPreview() {
  const upcoming = events.slice(0, 3);
  return (
    <Section tone="subtle">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="What's on"
            title="Webinars, workshops and open days."
            description="Talk to our faculty, audit a workshop, or lock in your next cohort start — all on our calendar."
          />
          <Link href="/events" className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline">
            See full calendar
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {upcoming.map((e) => (
            <li key={e.id}>
              <Link
                href={`/events#${e.slug}`}
                className="group flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-border transition hover:ring-cyan-400 hover:shadow-elevated"
              >
                <div className="flex items-center justify-between">
                  <Badge tone="cyan">{e.type.replace("-", " ")}</Badge>
                  <span className="text-xs text-ink-soft uppercase tracking-wider">{e.mode.replace("-", " ")}</span>
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold text-navy-900">{e.title}</h3>
                <p className="mt-2 text-sm text-ink-muted line-clamp-3 flex-1">{e.summary}</p>
                <dl className="mt-5 space-y-1.5 text-sm text-ink-muted">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-cyan-600" />
                    <span>{formatDate(e.startsAt)}</span>
                  </div>
                  {e.location ? (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-cyan-600" />
                      <span>{e.location}</span>
                    </div>
                  ) : null}
                </dl>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
