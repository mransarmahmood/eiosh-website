import Link from "next/link";
import { ExternalLink, GraduationCap, Receipt, FileCheck, ImageIcon } from "lucide-react";

interface Module {
  name: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "ready" | "partial" | "assets-only";
  notes?: string;
}

const modules: Module[] = [
  {
    name: "LMS · Academy",
    description: "Full CodeIgniter learning management system — courses, enrolments, quizzes, certificates.",
    href: "https://eiosh-com-725461.hostingersite.com/lms/",
    icon: GraduationCap,
    status: "ready",
    notes: "DB: eiosh_lms (seeded from install.sql)",
  },
  {
    name: "Exam portal",
    description: "Laravel exam engine with Jetstream + Inertia — campuses, courses, exam entries and results.",
    href: "https://eiosh-com-725461.hostingersite.com/exam/public/login",
    icon: FileCheck,
    status: "ready",
    notes: "DB: exam (pre-populated)",
  },
  {
    name: "Invoice / billing",
    description: "Laravel invoicing app (ZATCA-ready) with Jetstream multi-auth.",
    href: "https://eiosh-com-725461.hostingersite.com/invoice/public/login",
    icon: Receipt,
    status: "partial",
    notes: "Login loads; admin dashboard needs the bmatovu/multi-auth `admin` guard wired into config/auth.php",
  },
  {
    name: "Legacy asset library",
    description: "publiceiosh/ — static images, CSS, JS, uploads from the old Laravel site. Link to e.g. /eiosh/publiceiosh/images/FILE.jpg",
    href: "http://localhost/eiosh/publiceiosh/images/",
    icon: ImageIcon,
    status: "assets-only",
    notes: "PHP entry broken (orphan public/ dir); static assets serve fine",
  },
];

const STATUS_STYLE: Record<Module["status"], string> = {
  ready: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  partial: "bg-amber-50 text-amber-800 ring-amber-200",
  "assets-only": "bg-surface-sunken text-ink-muted ring-border",
};

const STATUS_LABEL: Record<Module["status"], string> = {
  ready: "Ready to use",
  partial: "Partial — see note",
  "assets-only": "Assets only",
};

export function ModulesPanel() {
  return (
    <div className="mt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Connected modules</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-navy-900">Legacy PHP apps alongside the CMS</h2>
          <p className="mt-1 max-w-2xl text-sm text-ink-muted">
            These run on XAMPP/Apache beside the Next.js site. Each opens in a new tab.
          </p>
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <li key={m.name}>
              <a
                href={m.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated transition hover:-translate-y-0.5 hover:ring-cyan-400 hover:shadow-floating"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50 text-navy-800 ring-1 ring-inset ring-navy-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLE[m.status]}`}
                  >
                    {STATUS_LABEL[m.status]}
                  </span>
                </div>
                <p className="mt-5 font-heading text-lg font-semibold text-navy-900">{m.name}</p>
                <p className="mt-1 text-sm text-ink-muted">{m.description}</p>
                {m.notes ? (
                  <p className="mt-3 text-xs text-ink-soft">
                    <span className="font-semibold">Note:</span> {m.notes}
                  </p>
                ) : null}
                <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 transition group-hover:gap-1">
                  Open module <ExternalLink className="h-3.5 w-3.5" />
                </p>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
