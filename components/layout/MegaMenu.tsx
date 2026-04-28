"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "@/content/categories";
import { accreditations } from "@/content/accreditations";
import { courses } from "@/content/courses";
import { popularCertifications } from "@/content/certifications";
import { Badge } from "@/components/ui/Badge";

// Single mega-menu panel driven by the navbar's active key. Panels render the same
// visual scaffold so the nav feels coherent regardless of which menu is open.
export type MegaKey = "courses" | "certifications" | "approvals" | "resources" | null;

export function MegaMenuPanel({
  activeKey,
  onEnter,
  onClose,
  onLinkClick,
}: {
  activeKey: MegaKey;
  onEnter?: () => void;
  onClose: () => void;
  onLinkClick?: () => void;
}) {
  return (
    <AnimatePresence>
      {activeKey ? (
        <motion.div
          key={activeKey}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
          className="absolute left-0 right-0 top-full z-50 border-t border-border bg-white shadow-floating"
          onMouseEnter={onEnter}
          onMouseLeave={onClose}
          onClick={(e) => {
            // Close the menu when an actual link/button inside is clicked.
            const target = e.target as HTMLElement;
            if (target.closest("a, button")) onLinkClick?.();
          }}
        >
          <div className="container-page py-10">
            {activeKey === "courses" ? <CoursesPanel /> : null}
            {activeKey === "certifications" ? <CertificationsPanel /> : null}
            {activeKey === "approvals" ? <ApprovalsPanel /> : null}
            {activeKey === "resources" ? <ResourcesPanel /> : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function CoursesPanel() {
  const featured = courses.filter((c) => c.featured).slice(0, 3);
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-7">
        <p className="eyebrow">Browse by category</p>
        <ul className="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/courses?category=${c.slug}`}
                className="group flex items-start gap-3 rounded-lg p-2 -m-2 transition hover:bg-navy-50"
              >
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-500" aria-hidden />
                <span>
                  <span className="block font-heading font-medium text-navy-900">{c.title}</span>
                  <span className="block text-sm text-ink-muted">{c.tagline}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="col-span-5 rounded-xl bg-surface-subtle p-6">
        <p className="eyebrow">Featured programmes</p>
        <ul className="mt-4 space-y-3">
          {featured.map((f) => (
            <li key={f.id}>
              <Link
                href={`/courses/${f.slug}`}
                className="group flex items-center justify-between gap-4 rounded-lg bg-white p-4 ring-1 ring-border transition hover:ring-cyan-400"
              >
                <span className="min-w-0">
                  <span className="block truncate font-heading font-medium text-navy-900">{f.title}</span>
                  <span className="mt-1 flex items-center gap-2 text-xs text-ink-muted">
                    <Badge tone="cyan">{f.level}</Badge>
                    <span>{f.durationHours}h</span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-cyan-600 transition group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/courses" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline">
          Browse all courses
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function CertificationsPanel() {
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-5">
        <p className="eyebrow">Certification preparation</p>
        <h3 className="mt-3 text-2xl font-heading font-semibold text-navy-900">
          Pass with confidence. Certified for life.
        </h3>
        <p className="mt-3 text-ink-muted">
          End-to-end preparation for the qualifications that move careers forward — with mock assessments, tutor office hours and a workplace-project mentor.
        </p>
        <Link
          href="/certification-preparation"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline"
        >
          Explore certification preparation
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <ul className="col-span-7 grid grid-cols-2 gap-3">
        {popularCertifications().map((c) => (
          <li key={c.id}>
            <Link
              href={`/certifications/${c.slug}`}
              className="block rounded-lg bg-surface-subtle p-4 ring-1 ring-border transition hover:ring-cyan-400 hover:bg-white"
            >
              <span className="block font-heading font-medium text-navy-900">{c.title}</span>
              <span className="mt-0.5 block text-sm text-ink-muted">{c.subtitle}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="col-span-12 -mb-2 mt-2 border-t border-border pt-3 text-right">
        <Link
          href="/certifications"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline"
        >
          See all certifications
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

function ResourcesPanel() {
  const examUrl =
    process.env.NEXT_PUBLIC_EXAM_URL ??
    "https://eiosh-com-725461.hostingersite.com/exam/public/login";
  const shelves: { label: string; href: string; blurb: string; external?: boolean }[] = [
    { label: "Course calendar", href: "/calendar", blurb: "Every cohort, workshop and webinar in a month view." },
    { label: "Events & seminars", href: "/events", blurb: "Upcoming workshops, free webinars and open days." },
    { label: "Free online courses", href: "/free-courses", blurb: "Short video, audio and reading courses — always free." },
    { label: "Exam portal ↗", href: examUrl, blurb: "Schedule and sit your written assessments online.", external: true },
    { label: "Books & notes", href: "/resources", blurb: "Practitioner books, sample papers and checklists." },
    { label: "Insights", href: "/blog", blurb: "Faculty briefings on safety, environment and leadership." },
    { label: "Verify a certificate", href: "/verify-certificate", blurb: "For employers and regulators." },
    { label: "Community", href: "/community", blurb: "Alumni discussions, peer-led, free to join." },
  ];
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-5">
        <p className="eyebrow">Learn & reference</p>
        <h3 className="mt-3 text-2xl font-heading font-semibold text-navy-900">
          A deep library, open to everyone.
        </h3>
        <p className="mt-3 text-ink-muted">
          Calendar, events, free courses, books, notes and sample papers — written by the same faculty who teach our qualifications. Most downloads are free; some exchange an email for future updates.
        </p>
        <Link href="/resources" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline">
          Enter the library
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <ul className="col-span-7 grid grid-cols-2 gap-3">
        {shelves.map((s) => (
          <li key={s.href}>
            {s.external ? (
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg bg-surface-subtle p-4 ring-1 ring-border transition hover:ring-cyan-400 hover:bg-white"
              >
                <span className="block font-heading font-medium text-navy-900">{s.label}</span>
                <span className="mt-0.5 block text-sm text-ink-muted">{s.blurb}</span>
              </a>
            ) : (
              <Link href={s.href} className="block rounded-lg bg-surface-subtle p-4 ring-1 ring-border transition hover:ring-cyan-400 hover:bg-white">
                <span className="block font-heading font-medium text-navy-900">{s.label}</span>
                <span className="mt-0.5 block text-sm text-ink-muted">{s.blurb}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ApprovalsPanel() {
  return (
    <div className="grid grid-cols-12 gap-10">
      <div className="col-span-5">
        <p className="eyebrow">Approved centre & partners</p>
        <h3 className="mt-3 text-2xl font-heading font-semibold text-navy-900">Qualifications that travel with you.</h3>
        <p className="mt-3 text-ink-muted">
          EIOSH is an approved centre and partner for internationally recognised awarding bodies. Every certificate we issue is verifiable and portable across employers and borders.
        </p>
        <Link href="/awarding-bodies" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline">
          Meet our awarding bodies
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <ul className="col-span-7 grid grid-cols-2 gap-3">
        {accreditations.slice(0, 6).map((a) => (
          <li key={a.id}>
            <Link
              href={`/awarding-bodies/${a.slug}`}
              className="block rounded-lg bg-surface-subtle p-4 ring-1 ring-border transition hover:ring-cyan-400 hover:bg-white"
            >
              <span className="flex items-center justify-between">
                <span className="font-heading font-medium text-navy-900">{a.shortName}</span>
                <Badge tone="navy">{a.kind === "partner" ? "Partner" : "Approved centre"}</Badge>
              </span>
              <span className="mt-1 block text-sm text-ink-muted line-clamp-2">{a.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
