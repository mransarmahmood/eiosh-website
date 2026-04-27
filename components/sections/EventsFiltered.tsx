"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Video, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EventRegisterButton } from "@/components/forms/EventRegisterButton";
import { events } from "@/content/events";
import type { EventItem } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const FILTERS: { value: "all" | EventItem["type"]; label: string }[] = [
  { value: "all", label: "All" },
  { value: "workshop", label: "Workshops & seminars" },
  { value: "webinar", label: "Free webinars" },
  { value: "cohort-start", label: "Cohort starts" },
  { value: "open-day", label: "Open days" },
];

export function EventsFiltered() {
  const [filter, setFilter] = useState<"all" | EventItem["type"]>("all");

  const list = useMemo(() => {
    const sorted = [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    return filter === "all" ? sorted : sorted.filter((e) => e.type === filter);
  }, [filter]);

  return (
    <>
      <ul role="tablist" className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <li key={f.value}>
              <button
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer",
                  active
                    ? "bg-navy-900 text-white shadow-elevated"
                    : "bg-white text-navy-900 ring-1 ring-inset ring-border hover:ring-cyan-400"
                )}
              >
                {f.label}
              </button>
            </li>
          );
        })}
      </ul>

      {list.length === 0 ? (
        <p className="rounded-2xl bg-surface-subtle p-8 text-center text-ink-muted">
          Nothing in this category this month. Check back soon or subscribe to our calendar.
        </p>
      ) : (
        <ul className="divide-y divide-border rounded-2xl bg-white ring-1 ring-border shadow-elevated">
          {list.map((e) => (
            <li id={e.slug} key={e.id} className="grid gap-5 p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-brand-gradient text-white">
                <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-cyan-200">
                  {new Date(e.startsAt).toLocaleString("en-GB", { month: "short" })}
                </span>
                <span className="font-heading text-2xl font-semibold leading-none">{new Date(e.startsAt).getDate()}</span>
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
                </div>
                <h3 className="mt-2 font-heading text-xl font-semibold text-navy-900">{e.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{e.summary}</p>
                <p className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-700">
                  <CalendarDays className="h-3 w-3" />
                  {formatDate(e.startsAt)}
                  {e.endsAt ? ` – ${formatDate(e.endsAt)}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2 md:justify-end">
                <EventRegisterButton eventSlug={e.slug} eventTitle={e.title} size="sm" />
                <Link href="/contact" className="hidden lg:inline-flex text-sm font-medium text-cyan-700 hover:underline">
                  Add to calendar
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
