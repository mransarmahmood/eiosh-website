"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Video,
  Users2,
  DoorOpen,
  Sparkles,
  Clock,
  MapPin,
  Flame,
  HardHat,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { events } from "@/content/events";
import { formatDate } from "@/lib/utils";

// Premium animated hero for the Events page: headline with staggered enter,
// stat trio, event-count pills, and a right-side floating card stack that
// previews the next three events. Everything uses transform/opacity so it
// stays buttery on low-end devices and honours prefers-reduced-motion.

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.2, 0.8, 0.2, 1], delay },
});

export function EventsHero() {
  const upcoming = [...events].sort((a, b) => a.startsAt.localeCompare(b.startsAt)).slice(0, 3);

  const pills = [
    { icon: BookOpen, label: "Workshops & seminars" },
    { icon: Video, label: "Free webinars" },
    { icon: Users2, label: "Cohort starts" },
    { icon: DoorOpen, label: "Open days" },
  ];

  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      {/* Background layers */}
      <div className="absolute inset-0 bg-grid-subtle [background-size:32px_32px] opacity-[0.35]" aria-hidden />
      <div className="absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-cyan-500/20 blur-3xl" aria-hidden />
      <div className="absolute -bottom-32 left-[-10%] h-[440px] w-[440px] rounded-full bg-navy-700/40 blur-3xl" aria-hidden />

      {/* Orbiting accent icons */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.18, rotate: 360 }}
        transition={{ opacity: { duration: 1 }, rotate: { duration: 60, repeat: Infinity, ease: "linear" } }}
        className="absolute left-[46%] top-[10%] hidden h-[520px] w-[520px] rounded-full border border-cyan-300/30 lg:block"
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.12, rotate: -360 }}
        transition={{ opacity: { duration: 1 }, rotate: { duration: 90, repeat: Infinity, ease: "linear" } }}
        className="absolute left-[40%] top-[4%] hidden h-[640px] w-[640px] rounded-full border border-cyan-300/20 lg:block"
      />

      <Container className="relative z-10 py-20 lg:py-28">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <span>/</span>
              <span className="text-white/80">Events</span>
            </li>
          </ol>
        </nav>

        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <motion.p {...fade(0)} className="eyebrow text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" /> What's on · 12 events live
            </motion.p>

            <motion.h1
              {...fade(0.05)}
              className="mt-5 text-display-md sm:text-display-lg lg:text-display-xl font-heading font-semibold text-white text-balance"
            >
              Workshops, seminars,{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-white bg-clip-text text-transparent">
                webinars
              </span>{" "}
              and cohort starts.
            </motion.h1>

            <motion.p {...fade(0.1)} className="mt-6 max-w-2xl text-lg text-white/75 leading-relaxed text-pretty">
              Audit a hands-on workshop, join a free faculty-led webinar, attend an open day at our Lahore academy, or
              lock in your next qualification cohort — all live on our calendar.
            </motion.p>

            {/* Event-type pills */}
            <motion.ul {...fade(0.15)} className="mt-7 flex flex-wrap gap-2">
              {pills.map((p) => {
                const Icon = p.icon;
                return (
                  <li
                    key={p.label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 ring-1 ring-inset ring-white/10"
                  >
                    <Icon className="h-3.5 w-3.5 text-cyan-300" /> {p.label}
                  </li>
                );
              })}
            </motion.ul>

            <motion.div {...fade(0.2)} className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/calendar" variant="gold" size="lg">
                Open full calendar <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                href="#list"
                variant="outline"
                size="lg"
                className="bg-white/5 text-white ring-white/20 hover:bg-white/10 hover:ring-white/40"
              >
                Browse the list
              </Button>
            </motion.div>

            {/* Trio of small stats */}
            <motion.ul {...fade(0.25)} className="mt-12 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <li>
                <p className="font-heading text-3xl font-semibold text-white">1,500+</p>
                <p className="mt-1 text-xs text-white/60">Students already enrolled</p>
              </li>
              <li>
                <p className="font-heading text-3xl font-semibold text-white">375+</p>
                <p className="mt-1 text-xs text-white/60">Accredited courses</p>
              </li>
              <li>
                <p className="font-heading text-3xl font-semibold text-white">100%</p>
                <p className="mt-1 text-xs text-white/60">Satisfaction rate</p>
              </li>
            </motion.ul>
          </div>

          {/* Right: floating upcoming-event cards */}
          <div className="relative lg:col-span-5">
            {/* Halo */}
            <div
              className="absolute left-1/2 top-1/2 -z-0 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/20 blur-3xl"
              aria-hidden
            />

            <div className="relative mx-auto flex w-full max-w-md flex-col gap-4">
              {upcoming.map((e, idx) => (
                <motion.article
                  key={e.id}
                  initial={{ opacity: 0, y: 24, rotate: idx === 1 ? 1 : idx === 2 ? -1.5 : 0.5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 + idx * 0.12, ease: [0.2, 0.8, 0.2, 1] }}
                  whileHover={{ y: -3 }}
                  className="group relative rounded-2xl bg-white/8 p-5 text-white ring-1 ring-white/10 backdrop-blur-md shadow-floating"
                  style={{ transform: `translateX(${idx * 14}px)` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-navy-900 text-white">
                      <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-100">
                        {new Date(e.startsAt).toLocaleString("en-GB", { month: "short" })}
                      </span>
                      <span className="font-heading text-xl font-semibold leading-none">
                        {new Date(e.startsAt).getDate()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-wider text-cyan-200">
                        {e.mode === "online" ? (
                          <Video className="h-3 w-3" />
                        ) : e.type === "cohort-start" ? (
                          <Users2 className="h-3 w-3" />
                        ) : e.type === "workshop" ? (
                          <HardHat className="h-3 w-3" />
                        ) : (
                          <DoorOpen className="h-3 w-3" />
                        )}
                        {e.type.replace("-", " ")}
                      </div>
                      <p className="mt-1 font-heading text-base font-semibold leading-snug text-white line-clamp-2">
                        {e.title}
                      </p>
                      <p className="mt-2 flex items-center gap-3 text-xs text-white/70">
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3 w-3" /> {formatDate(e.startsAt)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          {e.mode === "online" ? (
                            <Video className="h-3 w-3" />
                          ) : (
                            <MapPin className="h-3 w-3" />
                          )}
                          {e.mode === "online" ? "Online" : e.location ?? "In-person"}
                        </span>
                      </p>
                    </div>
                  </div>
                  {/* Pulsing live dot for the first item */}
                  {idx === 0 ? (
                    <span className="absolute right-4 top-4 flex h-2.5 w-2.5" aria-hidden>
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>
                  ) : null}
                </motion.article>
              ))}

              {/* Floating verified badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, rotate: -6 }}
                animate={{ opacity: 1, scale: 1, rotate: -4 }}
                transition={{ duration: 0.6, delay: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute -bottom-8 -left-4 hidden w-52 rounded-2xl bg-gold-50 p-4 text-navy-900 shadow-floating ring-1 ring-gold-200 sm:block"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-gold-500" />
                  <p className="font-heading text-sm font-semibold">Accredited worldwide</p>
                </div>
                <p className="mt-1 text-xs text-ink-muted">IOSH · OSHAwards · HABC · NASP · OTHM</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.92, rotate: 6 }}
                animate={{ opacity: 1, scale: 1, rotate: 3 }}
                transition={{ duration: 0.6, delay: 0.75, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute -top-6 -right-4 hidden w-44 rounded-2xl bg-white p-3 text-navy-900 shadow-floating ring-1 ring-border sm:block"
              >
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-red-500" />
                  <p className="text-xs font-semibold">Filling fast</p>
                </div>
                <p className="mt-1 text-xs text-ink-muted">Next cohorts close in 7–14 days.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
