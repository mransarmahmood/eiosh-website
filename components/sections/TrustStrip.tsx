"use client";

import { accreditations } from "@/content/accreditations";

// Continuous horizontal marquee of every awarding body / partner. Pauses on
// hover so people can actually read the names. Duplicated track = seamless
// infinite scroll with the `marquee` keyframe defined in tailwind.config.
export function TrustStrip() {
  const items = [...accreditations, ...accreditations];
  return (
    <div className="relative overflow-hidden border-y border-border bg-white">
      <div className="container-page py-6">
        <p className="mb-4 text-center text-xs uppercase tracking-[0.25em] text-ink-soft">
          Approved centre & learning partner for
        </p>
        <div className="relative overflow-hidden">
          {/* Edge fade masks for a polished marquee */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
          <ul className="flex w-max animate-marquee items-center gap-12 px-4 [&:hover]:[animation-play-state:paused]">
            {items.map((a, i) => (
              <li
                key={`${a.id}-${i}`}
                className="flex shrink-0 items-center gap-3 whitespace-nowrap font-heading text-lg font-semibold text-navy-900/70 transition hover:text-navy-900"
              >
                <span
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-navy-900 to-cyan-600 text-xs font-semibold text-white shadow-ring"
                  aria-hidden
                >
                  {a.shortName.split(" ")[0].slice(0, 3).toUpperCase()}
                </span>
                {a.shortName}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
