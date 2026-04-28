import Link from "next/link";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
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
  ArrowLeft,
  type LucideIcon,
} from "lucide-react";
import { isAuthed } from "@/lib/cms/auth";
import { schemas } from "@/lib/cms/schemas";
import { LogoutButton } from "./LogoutButton";

const ICONS: Record<string, LucideIcon> = {
  Settings,
  FolderTree,
  Award,
  GraduationCap,
  UsersRound,
  Quote,
  FileText,
  FileSpreadsheet,
  ClipboardList,
  Receipt,
  UserPlus,
  UserCheck,
  CalendarDays,
  HelpCircle,
  PlayCircle,
  BookText,
};

export function AdminShell({
  children,
  activeKey,
}: {
  children: React.ReactNode;
  activeKey?: string;
}) {
  if (!isAuthed()) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-white md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-navy-900 text-white font-heading text-sm font-semibold">
            E
          </div>
          <div>
            <p className="font-heading text-sm font-semibold text-navy-900">EIOSH CMS</p>
            <p className="text-[0.7rem] text-ink-soft">Content admin</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <Link
            href="/admin"
            className={cx(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-navy-900 hover:bg-navy-50",
              activeKey === "__dashboard__" && "bg-cyan-50 text-cyan-800"
            )}
          >
            <LayoutDashboard className="h-4 w-4 text-cyan-600" /> Dashboard
          </Link>
          <p className="mt-4 px-3 text-[0.7rem] font-semibold uppercase tracking-wider text-ink-soft">
            Content
          </p>
          <ul className="mt-1.5 space-y-0.5">
            {schemas.map((s) => {
              const Icon = ICONS[s.icon ?? "FileText"] ?? FileText;
              const active = activeKey === s.key;
              return (
                <li key={s.key}>
                  <Link
                    href={`/admin/${s.key}`}
                    className={cx(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-navy-50",
                      active ? "bg-cyan-50 text-cyan-800 font-medium" : "text-ink hover:text-navy-900"
                    )}
                  >
                    <Icon className="h-4 w-4 text-cyan-600" />
                    <span>{s.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 px-3 text-[0.7rem] font-semibold uppercase tracking-wider text-ink-soft">
            Tools
          </p>
          <ul className="mt-1.5 space-y-0.5">
            <li>
              <Link
                href="/admin/proposals/new"
                className={cx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-navy-50",
                  activeKey === "proposals/new" ? "bg-cyan-50 text-cyan-800 font-medium" : "text-ink hover:text-navy-900",
                )}
              >
                <FileText className="h-4 w-4 text-cyan-600" />
                <span>Send a proposal</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/services"
                className={cx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-navy-50",
                  activeKey === "services" ? "bg-cyan-50 text-cyan-800 font-medium" : "text-ink hover:text-navy-900",
                )}
              >
                <FileText className="h-4 w-4 text-cyan-600" />
                <span>Service catalog</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className={cx(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-navy-50",
                  activeKey === "settings" ? "bg-cyan-50 text-cyan-800 font-medium" : "text-ink hover:text-navy-900",
                )}
              >
                <FileText className="h-4 w-4 text-cyan-600" />
                <span>Settings &amp; API keys</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="border-t border-border p-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-ink-muted hover:bg-navy-50 hover:text-navy-900"
          >
            <ArrowLeft className="h-4 w-4" /> View public site
          </Link>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}

function cx(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
