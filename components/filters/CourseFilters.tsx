"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { CourseCard } from "@/components/cards/CourseCard";
import { categories } from "@/content/categories";
import { accreditations } from "@/content/accreditations";
import { courses as allCourses } from "@/content/courses";
import type { Course, DeliveryMode, CourseLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Filters {
  category: string;
  body: string;
  mode: DeliveryMode | "all";
  level: CourseLevel | "all";
  q: string;
}

const INITIAL: Filters = { category: "all", body: "all", mode: "all", level: "all", q: "" };

interface CourseFiltersProps {
  initialCategory?: string;
  initialBody?: string;
  initialMode?: Filters["mode"];
  initialLevel?: Filters["level"];
  initialQuery?: string;
}

export function CourseFilters({
  initialCategory,
  initialBody,
  initialMode,
  initialLevel,
  initialQuery,
}: CourseFiltersProps) {
  const [f, setF] = useState<Filters>({
    ...INITIAL,
    category: initialCategory ?? "all",
    body: initialBody ?? "all",
    mode: initialMode ?? "all",
    level: initialLevel ?? "all",
    q: initialQuery ?? "",
  });
  const [panelOpen, setPanelOpen] = useState(false);

  const filtered = useMemo(() => {
    return allCourses.filter((c: Course) => {
      if (f.category !== "all" && c.category !== f.category) return false;
      if (f.body !== "all" && c.awardingBody !== f.body) return false;
      if (f.mode !== "all" && !c.modes.includes(f.mode)) return false;
      if (f.level !== "all" && c.level !== f.level) return false;
      if (f.q && !(`${c.title} ${c.headline}`.toLowerCase().includes(f.q.toLowerCase()))) return false;
      return true;
    });
  }, [f]);

  const update = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((prev) => ({ ...prev, [k]: v }));
  const reset = () => setF(INITIAL);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <aside
        className={cn(
          "lg:col-span-3 lg:block",
          panelOpen ? "fixed inset-0 z-40 bg-white/95 backdrop-blur p-6 overflow-y-auto" : "hidden"
        )}
      >
        <div className="flex items-center justify-between lg:hidden">
          <p className="font-heading text-lg font-semibold text-navy-900">Filters</p>
          <button aria-label="Close filters" onClick={() => setPanelOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <FilterGroup label="Category">
          <RadioList
            name="category"
            options={[{ value: "all", label: "All categories" }, ...categories.map((c) => ({ value: c.slug, label: c.title }))]}
            value={f.category}
            onChange={(v) => update("category", v)}
          />
        </FilterGroup>

        <FilterGroup label="Awarding body">
          <RadioList
            name="body"
            options={[{ value: "all", label: "Any awarding body" }, ...accreditations.map((a) => ({ value: a.slug, label: a.shortName }))]}
            value={f.body}
            onChange={(v) => update("body", v)}
          />
        </FilterGroup>

        <FilterGroup label="Delivery mode">
          <RadioList
            name="mode"
            options={[
              { value: "all", label: "Any mode" },
              { value: "in-person", label: "In-person" },
              { value: "online", label: "Online (tutor-led)" },
              { value: "blended", label: "Blended" },
              { value: "self-paced", label: "Self-paced" },
            ]}
            value={f.mode}
            onChange={(v) => update("mode", v as Filters["mode"])}
          />
        </FilterGroup>

        <FilterGroup label="Level">
          <RadioList
            name="level"
            options={[
              { value: "all", label: "Any level" },
              { value: "introductory", label: "Introductory" },
              { value: "foundation", label: "Foundation" },
              { value: "intermediate", label: "Intermediate" },
              { value: "advanced", label: "Advanced" },
              { value: "specialist", label: "Specialist" },
            ]}
            value={f.level}
            onChange={(v) => update("level", v as Filters["level"])}
          />
        </FilterGroup>

        <button onClick={reset} className="mt-3 text-sm font-medium text-cyan-700 hover:underline">
          Reset filters
        </button>
      </aside>

      <section className="lg:col-span-9">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            placeholder="Search by keyword, e.g. IOSH, HACCP, ISO 45001"
            value={f.q}
            onChange={(e) => update("q", e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-white px-4 text-sm placeholder:text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 sm:max-w-md"
          />
          <div className="flex items-center gap-3">
            <button
              className="inline-flex lg:hidden items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-navy-900"
              onClick={() => setPanelOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
            <p className="text-sm text-ink-muted">{filtered.length} programmes</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-surface-subtle p-10 text-center text-ink-muted">
            No programmes match these filters yet. Try resetting or contact an advisor.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((c) => (
              <li key={c.id}>
                <CourseCard course={c} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 first:mt-0">
      <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">{label}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function RadioList({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <ul className="space-y-1.5">
      {options.map((o) => (
        <li key={o.value}>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              name={name}
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="h-4 w-4 border-border text-cyan-600 focus:ring-cyan-500"
            />
            <span>{o.label}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
