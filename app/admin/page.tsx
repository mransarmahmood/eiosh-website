import Link from "next/link";
import {
  Settings,
  FolderTree,
  Award,
  GraduationCap,
  UsersRound,
  Quote,
  FileText,
  FileSpreadsheet,
  CalendarDays,
  HelpCircle,
  PlayCircle,
  BookText,
  ClipboardList,
  Receipt,
  UserPlus,
  UserCheck,
  Layers,
  Inbox,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ModulesPanel } from "@/components/admin/ModulesPanel";
import { schemas, type ResourceSchema } from "@/lib/cms/schemas";
import { counts } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

const ICONS: Record<string, LucideIcon> = {
  Settings, FolderTree, Award, GraduationCap, UsersRound, Quote,
  FileText, FileSpreadsheet, CalendarDays, HelpCircle, PlayCircle, BookText,
  ClipboardList, Receipt, UserPlus, UserCheck,
};

// Resources grouped by business area so the dashboard reads as a product, not a flat list.
const GROUPS: { heading: string; icon: LucideIcon; keys: string[]; accent: string }[] = [
  {
    heading: "Catalogue",
    icon: GraduationCap,
    accent: "from-navy-900 via-navy-700 to-cyan-600",
    keys: ["courses", "categories", "accreditations", "trainers", "free-courses"],
  },
  {
    heading: "Marketing & community",
    icon: Layers,
    accent: "from-cyan-700 via-cyan-500 to-cyan-300",
    keys: ["blog", "testimonials", "events", "resources", "faqs"],
  },
  {
    heading: "Sales documents",
    icon: Receipt,
    accent: "from-gold-500 via-gold-400 to-amber-300",
    keys: ["proposals", "quotations", "invoices"],
  },
  {
    heading: "Inbox & submissions",
    icon: Inbox,
    accent: "from-emerald-700 via-emerald-500 to-emerald-300",
    keys: ["admissions", "registrations"],
  },
  {
    heading: "Static pages",
    icon: BookText,
    accent: "from-purple-700 via-purple-500 to-pink-300",
    keys: [
      "page-certification-preparation",
      "page-about",
      "page-corporate-training",
      "page-partnership",
      "page-propose-course",
      "page-student-services",
      "page-policies",
    ],
  },
  {
    heading: "Settings",
    icon: Settings,
    accent: "from-navy-950 via-navy-800 to-navy-600",
    keys: ["site"],
  },
];

export default async function AdminDashboard() {
  const c = await counts();
  const totals = schemas.reduce((acc, s) => {
    if (s.shape === "singleton") return acc;
    return acc + (c[s.key] ?? 0);
  }, 0);

  return (
    <AdminShell activeKey="__dashboard__">
      <div className="p-6 lg:p-10">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-950 via-navy-800 to-cyan-700 p-8 text-white shadow-floating">
          <div className="absolute inset-0 bg-grid-subtle [background-size:24px_24px] opacity-[0.25]" aria-hidden />
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden />
          <div className="relative z-10 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-200">Admin dashboard</p>
              <h1 className="mt-3 font-heading text-3xl font-semibold lg:text-4xl">Manage every piece of EIOSH content.</h1>
              <p className="mt-3 max-w-2xl text-sm text-white/75">
                Edits save to <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.7rem]">content/data/*.json</code> and
                the public site re-renders automatically.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-1">
              <div className="rounded-lg bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-200">Total records</dt>
                <dd className="mt-1 font-heading text-2xl font-semibold">{totals.toLocaleString()}</dd>
              </div>
              <div className="rounded-lg bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur">
                <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-200">Content types</dt>
                <dd className="mt-1 font-heading text-2xl font-semibold">{schemas.length}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Grouped content sections */}
        <div className="mt-10 space-y-12">
          {GROUPS.map((g) => {
            const GIcon = g.icon;
            const items = g.keys
              .map((k) => schemas.find((s) => s.key === k))
              .filter((s): s is ResourceSchema => !!s);
            if (items.length === 0) return null;
            return (
              <section key={g.heading}>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${g.accent} text-white shadow-elevated`}
                    >
                      <GIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cyan-700">Group</p>
                      <h2 className="font-heading text-xl font-semibold text-navy-900">{g.heading}</h2>
                    </div>
                  </div>
                  <p className="text-xs text-ink-soft">{items.length} resources</p>
                </div>

                <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((s) => {
                    const Icon = ICONS[s.icon ?? "FileText"] ?? FileText;
                    const count = s.shape === "singleton" ? null : c[s.key] ?? 0;
                    return (
                      <li key={s.key}>
                        <Link
                          href={`/admin/${s.key}`}
                          className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border shadow-elevated transition hover:-translate-y-0.5 hover:ring-cyan-400 hover:shadow-floating"
                        >
                          {/* Accent strip */}
                          <span
                            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${g.accent}`}
                            aria-hidden
                          />
                          <div className="flex flex-1 flex-col p-6">
                            <div className="flex items-start justify-between">
                              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-50 to-white text-cyan-700 shadow-ring ring-1 ring-inset ring-cyan-200">
                                <Icon className="h-5 w-5" />
                              </span>
                              {count != null ? (
                                <div className="flex flex-col items-end">
                                  <span className="font-heading text-2xl font-semibold text-navy-900 tabular-nums">
                                    {count}
                                  </span>
                                  <span className="text-[0.65rem] font-medium uppercase tracking-wider text-ink-soft">
                                    records
                                  </span>
                                </div>
                              ) : (
                                <span className="rounded-full bg-navy-50 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-navy-800">
                                  Singleton
                                </span>
                              )}
                            </div>
                            <p className="mt-5 font-heading text-lg font-semibold text-navy-900">{s.label}</p>
                            {s.description ? (
                              <p className="mt-1 text-sm text-ink-muted line-clamp-2">{s.description}</p>
                            ) : null}
                            <span className="mt-auto pt-5 inline-flex items-center gap-1 text-sm font-medium text-cyan-700 transition group-hover:gap-1.5">
                              Manage <ArrowUpRight className="h-4 w-4" />
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        <ModulesPanel />
      </div>
    </AdminShell>
  );
}
