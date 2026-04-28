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
import type { Certification } from "@/lib/types";

// Bright, aspirational hero for the Certifications index page. Replaces the
// dark navy PageHero with a light gradient field, gradient-typed accent word,
// floating preview cards on the right, and a stat strip — designed to read
// as premium and "interactive" (subtle motion + hover-lift) without being noisy.
export function CertificationsHero({
  featured,
  totalCount,
}: {
  featured: Certification[];
  totalCount: number;
}) {
  // Up to three preview cards on the right column. The rotation of accent
  // colours below is index-based so adding/removing a card cannot shift the
  // palette away from the brand.
  const cardTones = [
    {
      from: "from-emerald-400",
      to: "to-emerald-600",
      ring: "ring-emerald-100",
      tag: "bg-emerald-100 text-emerald-700",
    },
    {
      from: "from-cyan-400",
      to: "to-blue-600",
      ring: "ring-cyan-100",
      tag: "bg-cyan-100 text-cyan-700",
    },
    {
      from: "from-amber-400",
      to: "to-orange-500",
      ring: "ring-amber-100",
      tag: "bg-amber-100 text-amber-700",
    },
  ];

  const previewCards = featured.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-cyan-50/50 to-indigo-50/70">
      {/* Decorative ambient blobs — purely visual, sit behind the content. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-indigo-300/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-violet-300/20 blur-3xl"
      />

      <Container className="relative z-10 py-14 lg:py-20">
        {/* Breadcrumb — kept understated so the headline does the heavy lifting. */}
        <nav aria-label="Breadcrumb" className="mb-8">
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

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left column — copy, CTA, feature pills. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-100/80 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cyan-700 ring-1 ring-inset ring-cyan-200">
              Certifications
            </span>

            <h1 className="mt-6 font-heading text-4xl font-bold leading-[1.05] text-navy-900 sm:text-5xl lg:text-[3.5rem]">
              Internationally{" "}
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 bg-clip-text text-transparent">
                recognised
              </span>{" "}
              credentials.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              Every certification EIOSH prepares you for — full syllabus, awarding body, and
              apply route. Click any card to see the modules, duration and assessment.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#all-certifications"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-cyan-500/40"
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

            {/* Feature pills — three quick value props under the CTA. */}
            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FeaturePill
                icon={Globe2}
                title="Globally Recognised"
                blurb="Internationally accredited by leading bodies"
                gradient="from-indigo-500 to-violet-600"
              />
              <FeaturePill
                icon={ShieldCheck}
                title="Career Focused"
                blurb="Designed to boost your professional growth"
                gradient="from-cyan-500 to-blue-600"
              />
              <FeaturePill
                icon={Sparkles}
                title="Practical Learning"
                blurb="Real-world skills and industry relevance"
                gradient="from-violet-500 to-fuchsia-600"
              />
            </div>
          </motion.div>

          {/* Right column — stack of three live certification preview cards. */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative"
          >
            {/* Decorative certificate "trophy" mark above the cards. */}
            <div className="pointer-events-none absolute -top-10 right-4 hidden h-28 w-28 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-2xl shadow-cyan-500/40 lg:flex">
              <Award className="h-14 w-14 text-white drop-shadow" />
              <span className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 ring-4 ring-white">
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
                      className={`group flex items-center gap-4 rounded-2xl bg-white/85 p-4 shadow-xl ring-1 ${tone.ring} backdrop-blur transition hover:-translate-y-0.5 hover:shadow-2xl`}
                    >
                      <span
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tone.from} ${tone.to} shadow-md`}
                      >
                        <Award className="h-6 w-6 text-white" />
                      </span>
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
                        <p className="mt-0.5 truncate text-sm text-ink-muted">{c.subtitle}</p>
                      </div>
                      <div className="hidden flex-col items-start gap-1 text-xs text-ink-soft sm:flex">
                        <span className="inline-flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" /> {c.modules.length} Modules
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {shortDuration(c.duration)}
                        </span>
                      </div>
                      <span className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md transition group-hover:translate-x-0.5">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Stat strip — sits below the hero pair, frosted card style. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-14 grid grid-cols-2 gap-3 rounded-3xl bg-white/80 p-4 shadow-xl ring-1 ring-black/5 backdrop-blur sm:p-6 lg:grid-cols-4 lg:gap-6"
        >
          <Stat
            icon={GraduationCap}
            value={`${totalCount}+`}
            label="Certifications"
            blurb="Industry-leading programs"
            gradient="from-violet-500 to-indigo-600"
          />
          <Stat
            icon={Users}
            value="15,000+"
            label="Professionals Trained"
            blurb="Across the globe"
            gradient="from-emerald-500 to-teal-600"
          />
          <Stat
            icon={Globe2}
            value="45+"
            label="Countries"
            blurb="Global presence"
            gradient="from-cyan-500 to-blue-600"
          />
          <Stat
            icon={Trophy}
            value="98%"
            label="Success Rate"
            blurb="Student achievement"
            gradient="from-amber-400 to-orange-500"
          />
        </motion.div>
      </Container>
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
    <div className="flex items-start gap-3 rounded-2xl bg-white/70 p-4 ring-1 ring-black/5 backdrop-blur transition hover:bg-white">
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
  // "3-day cohort" → "3 Days"; "10–12 weeks blended" → "10–12 Wks"; etc.
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
