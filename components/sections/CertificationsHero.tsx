"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  BookOpen,
  ChevronRight,
  Clock,
  Globe2,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { AwardingBodyLogo } from "@/components/ui/AwardingBodyLogo";
import type { Certification } from "@/lib/types";

// "EIOSH (CQI/IRCA-compatible)" → "EIOSH". Strips trailing parenthetical
// modifiers and country suffixes so the AwardingBodyLogo gradient map can
// resolve a clean key.
function bodyKey(awardingBody: string): string {
  return awardingBody.replace(/\s*\(.*?\)\s*$/, "").trim().split(/\s+/)[0] ?? awardingBody;
}

// Bright, brand-coherent hero for the Certifications index page. Stays
// strictly within the EIOSH palette (navy authority + cyan clarity + warm
// gold accent) — no indigo / violet / fuchsia which would push off-brand for
// a training institute. Light gradient field, gradient-typed accent word,
// floating preview cards on the right, frosted stat strip below.
export function CertificationsHero({
  featured,
  totalCount,
}: {
  featured: Certification[];
  totalCount: number;
}) {
  // Up to three preview cards on the right column. The card-tone rotation is
  // index-based and tuned to the brand palette: cyan (clarity), navy (depth)
  // and gold (warmth). No off-brand fuchsia / violet here.
  const cardTones = [
    {
      ring: "ring-cyan-100",
      tag: "bg-cyan-100 text-cyan-700",
    },
    {
      ring: "ring-amber-100",
      tag: "bg-amber-100 text-amber-800",
    },
    {
      ring: "ring-navy-100",
      tag: "bg-navy-100 text-navy-700",
    },
  ];

  const previewCards = featured.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-cyan-50/60 to-white">
      {/* Brand-aligned ambient depth — two cyan, one warm gold accent. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-cyan-300/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-16 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-[12%] h-56 w-56 rounded-full bg-amber-200/25 blur-3xl"
      />
      {/* Faint dotted-grid texture for premium tactility. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(10,31,68,0.05)_1px,transparent_0)] [background-size:28px_28px]"
      />

      <Container className="relative z-10 pt-12 pb-16 lg:pt-16 lg:pb-20">
        {/* Breadcrumb. */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-soft">
            <li>
              <Link href="/" className="hover:text-cyan-700 transition">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-navy-900 font-medium">Certifications</span>
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left column — copy, CTA, feature pills. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
            className="lg:col-span-7"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cyan-700 ring-1 ring-inset ring-cyan-200/70 shadow-sm backdrop-blur">
              <span aria-hidden className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-500">
                <span className="absolute inset-0 animate-ping rounded-full bg-cyan-500/60" />
              </span>
              Certifications
            </span>

            <h1 className="mt-5 font-heading text-[2.5rem] font-bold leading-[1.05] tracking-tight text-navy-900 text-balance sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]">
              Internationally{" "}
              <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-navy-700 bg-clip-text text-transparent">
                recognised
              </span>{" "}
              credentials.
            </h1>

            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">
              Every certification EIOSH prepares you for — full syllabus, awarding body, and
              apply route. Click any card to see the modules, duration and assessment.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {/* Primary CTA uses brand gold — the established conversion colour. */}
              <a
                href="#all-certifications"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/35"
              >
                Explore Certifications
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <Link
                href="/admission"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-navy-900 ring-1 ring-border transition hover:bg-navy-50 hover:ring-cyan-300"
              >
                Talk to an advisor
              </Link>
            </div>

            {/* Feature pills — three quick value props, all on brand cyan/navy. */}
            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <FeaturePill
                icon={Globe2}
                title="Globally Recognised"
                blurb="Internationally accredited by leading bodies"
                gradient="from-cyan-500 to-cyan-700"
              />
              <FeaturePill
                icon={ShieldCheck}
                title="Career Focused"
                blurb="Designed to boost your professional growth"
                gradient="from-navy-700 to-navy-900"
              />
              <FeaturePill
                icon={Sparkles}
                title="Practical Learning"
                blurb="Real-world skills and industry relevance"
                gradient="from-amber-500 to-amber-600"
              />
            </div>
          </motion.div>

          {/* Right column — stack of three live certification preview cards. */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative lg:col-span-5"
          >
            {/* Decorative certificate "trophy" mark above the cards. */}
            <div className="pointer-events-none absolute -top-10 right-4 hidden h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 to-navy-700 shadow-2xl shadow-cyan-500/30 lg:flex">
              <Award className="h-14 w-14 text-white drop-shadow" />
              <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-500 ring-4 ring-white">
                <Star className="h-4 w-4 fill-white text-white" />
              </span>
            </div>

            <div className="space-y-4 lg:pt-12">
              {previewCards.map((c, i) => {
                const tone = cardTones[i % cardTones.length];
                return (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.15 * i + 0.25 }}
                  >
                    <Link
                      href={`/certifications/${c.slug}`}
                      className={`group flex items-center gap-3 rounded-2xl bg-white p-3.5 shadow-lg ring-1 ${tone.ring} transition hover:-translate-y-0.5 hover:shadow-xl hover:ring-cyan-300`}
                    >
                      <AwardingBodyLogo shortName={bodyKey(c.awardingBody)} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate font-heading font-semibold text-navy-900">
                            {c.title}
                          </p>
                          {c.popular ? (
                            <span
                              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[0.6rem] font-bold ${tone.tag}`}
                            >
                              <Sparkles className="h-2.5 w-2.5" />
                              Popular
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-0.5 truncate text-xs text-ink-muted">{c.subtitle}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[0.65rem] uppercase tracking-wider text-ink-soft">
                          <span className="inline-flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> {c.modules.length} mod
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {shortDuration(c.duration)}
                          </span>
                        </div>
                      </div>
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-navy-700 text-white shadow-md transition group-hover:translate-x-0.5">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Stat strip — frosted card. Brand cyan / navy / amber stat tones. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 grid grid-cols-2 gap-3 rounded-3xl bg-white/85 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur sm:p-6 lg:grid-cols-4 lg:gap-6"
        >
          <Stat
            icon={GraduationCap}
            value={`${totalCount}+`}
            label="Certifications"
            blurb="Industry-leading programs"
            gradient="from-cyan-500 to-cyan-700"
          />
          <Stat
            icon={Users}
            value="15,000+"
            label="Professionals Trained"
            blurb="Across the globe"
            gradient="from-navy-700 to-navy-900"
          />
          <Stat
            icon={Globe2}
            value="45+"
            label="Countries"
            blurb="Global presence"
            gradient="from-cyan-600 to-navy-700"
          />
          <Stat
            icon={Trophy}
            value="98%"
            label="Success Rate"
            blurb="Student achievement"
            gradient="from-amber-500 to-amber-600"
          />
        </motion.div>
      </Container>

      {/* Soft fade into the next section. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-white"
      />
    </section>
  );
}

function FeaturePill({
  icon: Icon,
  title,
  blurb,
  gradient,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  blurb: string;
  gradient: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-white/85 p-4 ring-1 ring-black/5 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md">
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-md`}
      >
        <Icon className="h-5 w-5 text-white" />
      </span>
      <div className="min-w-0">
        <p className="font-heading text-sm font-semibold text-navy-900">{title}</p>
        <p className="mt-0.5 text-xs leading-snug text-ink-muted">{blurb}</p>
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
  blurb,
  gradient,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  blurb: string;
  gradient: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl px-4 py-3 transition hover:bg-white">
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}
      >
        <Icon className="h-6 w-6 text-white" />
      </span>
      <div>
        <p className="font-heading text-2xl font-bold leading-none text-navy-900 sm:text-3xl">
          {value}
        </p>
        <p className="mt-1 text-sm font-semibold text-navy-900">{label}</p>
        <p className="text-xs text-ink-soft">{blurb}</p>
      </div>
    </div>
  );
}

// Hero preview cards display a compact duration. The data is written as e.g.
// "10–12 weeks blended (≈ 120 hours)" so we trim parentheses and shorten the
// units. Falls back to the first 14 characters if no pattern matches.
function shortDuration(raw: string): string {
  const noParen = raw.replace(/\s*\(.*?\)\s*$/, "").trim();
  const m = noParen.match(/^([\d–\-]+)\s*[- ]?(day|days|week|weeks|month|months|hour|hours)/i);
  if (m) {
    const num = m[1];
    const unit = m[2].toLowerCase();
    const short = unit.startsWith("day")
      ? "Days"
      : unit.startsWith("week")
      ? "Wks"
      : unit.startsWith("month")
      ? "Mos"
      : "Hrs";
    return `${num} ${short}`;
  }
  return noParen.length > 18 ? noParen.slice(0, 16) + "…" : noParen;
}
