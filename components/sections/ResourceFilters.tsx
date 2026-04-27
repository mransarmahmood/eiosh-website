"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ResourceCard } from "@/components/cards/ResourceCard";
import { resources } from "@/content/resources";
import type { ResourceKind } from "@/lib/types";

const FILTERS: { value: "all" | ResourceKind; label: string }[] = [
  { value: "all", label: "All" },
  { value: "book", label: "Books" },
  { value: "notes", label: "Study notes" },
  { value: "sample-paper", label: "Sample papers" },
  { value: "checklist", label: "Checklists & templates" },
  { value: "whitepaper", label: "Whitepapers" },
  { value: "brochure", label: "Brochures" },
];

export function ResourceFilters() {
  const [filter, setFilter] = useState<"all" | ResourceKind>("all");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    return resources.filter((r) => {
      if (filter !== "all" && r.kind !== filter) return false;
      if (q && !(`${r.title} ${r.summary}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [filter, q]);

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <ul role="tablist" className="flex flex-wrap gap-2">
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
        <input
          type="search"
          placeholder="Search the library"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-11 rounded-lg border border-border bg-white px-4 text-sm placeholder:text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 md:w-72"
        />
      </div>

      {list.length === 0 ? (
        <p className="mt-10 rounded-2xl bg-surface-subtle p-8 text-center text-ink-muted">
          Nothing matches yet. Try a different filter or reset your search.
        </p>
      ) : (
        <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((r) => (
            <li key={r.id}>
              <ResourceCard r={r} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
