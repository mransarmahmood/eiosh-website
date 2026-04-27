"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Video, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { events } from "@/content/events";
import type { EventItem } from "@/lib/types";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Colour-code by event type so the grid is scannable at a glance.
const typeTone: Record<EventItem["type"], string> = {
  webinar: "bg-cyan-100 text-cyan-900 ring-cyan-200",
  workshop: "bg-gold-100 text-gold-800 ring-gold-200",
  "open-day": "bg-emerald-100 text-emerald-900 ring-emerald-200",
  "cohort-start": "bg-navy-100 text-navy-900 ring-navy-200",
};

const typeLabel: Record<EventItem["type"], string> = {
  webinar: "Webinar",
  workshop: "Workshop",
  "open-day": "Open day",
  "cohort-start": "Cohort start",
};

function getMonthDays(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startWeekday = (first.getDay() + 6) % 7; // Monday = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { startWeekday, daysInMonth };
}

export function CalendarGrid({ initialYear, initialMonth }: { initialYear?: number; initialMonth?: number }) {
  // Default to the earliest event month so the calendar lands on content.
  const defaultMonth = useMemo(() => {
    const sorted = [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    const first = sorted[0] ? new Date(sorted[0].startsAt) : new Date();
    return { year: first.getFullYear(), month: first.getMonth() };
  }, []);

  const [cursor, setCursor] = useState({
    year: initialYear ?? defaultMonth.year,
    month: initialMonth ?? defaultMonth.month,
  });
  const [selected, setSelected] = useState<string | null>(null);

  const { startWeekday, daysInMonth } = getMonthDays(cursor.year, cursor.month);

  const byDay = useMemo(() => {
    const map = new Map<string, EventItem[]>();
    for (const e of events) {
      const d = new Date(e.startsAt);
      if (d.getFullYear() !== cursor.year || d.getMonth() !== cursor.month) continue;
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const list = map.get(key) ?? [];
      list.push(e);
      map.set(key, list);
    }
    return map;
  }, [cursor]);

  const selectedEvents = selected ? byDay.get(selected) ?? [] : [];

  const cells: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const prev = () =>
    setCursor((c) => (c.month === 0 ? { year: c.year - 1, month: 11 } : { year: c.year, month: c.month - 1 }));
  const next = () =>
    setCursor((c) => (c.month === 11 ? { year: c.year + 1, month: 0 } : { year: c.year, month: c.month + 1 }));

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Month view</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold text-navy-900">
              {MONTHS[cursor.month]} {cursor.year}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label="Previous month"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-navy-900 transition hover:border-cyan-400 hover:text-cyan-700 cursor-pointer"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next month"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white transition hover:bg-navy-800 cursor-pointer"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <ul className="mt-6 flex flex-wrap gap-2 text-xs">
          {(Object.keys(typeLabel) as EventItem["type"][]).map((t) => (
            <li key={t} className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ring-1 ring-inset", typeTone[t])}>
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
              {typeLabel[t]}
            </li>
          ))}
        </ul>

        <div className="mt-6 overflow-hidden rounded-2xl bg-white ring-1 ring-border shadow-elevated">
          <div className="grid grid-cols-7 border-b border-border bg-surface-subtle text-xs font-semibold uppercase tracking-wider text-ink-soft">
            {WEEKDAYS.map((w) => (
              <div key={w} className="px-3 py-3 text-center">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              if (day === null) {
                return <div key={idx} className="min-h-28 border-b border-r border-border bg-surface-subtle/40" />;
              }
              const key = `${cursor.year}-${cursor.month}-${day}`;
              const dayEvents = byDay.get(key) ?? [];
              const isSelected = selected === key;
              return (
                <button
                  key={idx}
                  onClick={() => setSelected(key)}
                  className={cn(
                    "group flex min-h-28 flex-col gap-1.5 border-b border-r border-border bg-white p-2 text-left transition cursor-pointer hover:bg-cyan-50/40",
                    isSelected && "bg-cyan-50 ring-2 ring-inset ring-cyan-400"
                  )}
                >
                  <span className="text-xs font-semibold text-ink">{day}</span>
                  <div className="flex flex-col gap-1">
                    {dayEvents.slice(0, 2).map((e) => (
                      <span
                        key={e.id}
                        className={cn(
                          "truncate rounded-md px-1.5 py-0.5 text-[0.7rem] font-medium ring-1 ring-inset",
                          typeTone[e.type]
                        )}
                      >
                        {e.title.replace(/^.*?:\s*/, "")}
                      </span>
                    ))}
                    {dayEvents.length > 2 ? (
                      <span className="text-[0.7rem] text-ink-soft">+ {dayEvents.length - 2} more</span>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Day detail */}
      <aside className="lg:col-span-4">
        <div className="sticky top-28 rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated">
          <p className="eyebrow">Selected day</p>
          {selected ? (
            <>
              <h3 className="mt-2 font-heading text-lg font-semibold text-navy-900">
                {new Date(cursor.year, cursor.month, Number(selected.split("-")[2])).toLocaleDateString("en-GB", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              {selectedEvents.length === 0 ? (
                <p className="mt-3 text-sm text-ink-muted">No events scheduled on this day.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {selectedEvents.map((e) => (
                    <li key={e.id} className="rounded-xl bg-surface-subtle p-4">
                      <div className="flex items-center justify-between gap-2">
                        <Badge tone="cyan">{typeLabel[e.type]}</Badge>
                        <span className="text-xs text-ink-soft">
                          {new Date(e.startsAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="mt-2 font-heading text-sm font-semibold text-navy-900">{e.title}</p>
                      <p className="mt-1 text-xs text-ink-muted line-clamp-2">{e.summary}</p>
                      <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-cyan-700">
                        {e.mode === "online" ? (
                          <>
                            <Video className="h-3 w-3" /> Online
                          </>
                        ) : (
                          <>
                            <MapPin className="h-3 w-3" /> {e.location ?? "In-person"}
                          </>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm text-ink-muted">
              Select a highlighted day to see the full event detail — or browse the events list below for everything this month.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
