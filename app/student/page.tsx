import Link from "next/link";
import { redirect } from "next/navigation";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import {
  GraduationCap,
  Award,
  Receipt,
  CalendarClock,
  ExternalLink,
  LogOut,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { getStudentEmail } from "@/lib/student-auth";
import { listEnrolments, type Enrolment } from "@/lib/enrolments";
import { events } from "@/content/events";
import { courses } from "@/content/courses";
import { formatDate } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Student dashboard",
  description: "Your courses, payments, certificates and exam schedule in one place.",
  path: "/student",
  noIndex: true,
});

interface Cert {
  id: string;
  holder: string;
  certificateNumber: string;
  course: string;
  issueDate: string | null;
  expiryDate: string | null;
}

async function loadCerts(): Promise<Cert[]> {
  try {
    const path = join(process.cwd(), "content", "data", "certificates.json");
    return JSON.parse(await fs.readFile(path, "utf-8")) as Cert[];
  } catch {
    return [];
  }
}

export default async function StudentDashboard() {
  const email = getStudentEmail();
  if (!email) redirect("/student/login");

  const allEnrolments = await listEnrolments();
  const myEnrolments = allEnrolments.filter(
    (e: Enrolment) => e.customerEmail.toLowerCase() === email.toLowerCase(),
  );

  // Match certificates by holder name OR by linked enrolment course slug.
  const allCerts = await loadCerts();
  const customerName = myEnrolments[0]?.customerName?.trim().toLowerCase();
  const myCerts = allCerts.filter(
    (c) =>
      (customerName && c.holder.toLowerCase().includes(customerName)) ||
      myEnrolments.some(
        (e) => c.course && e.courseTitle && c.course.toLowerCase() === e.courseTitle.toLowerCase(),
      ),
  );

  // Upcoming exams = events flagged as exam, in the future.
  const now = Date.now();
  const upcoming = events
    .filter((e) => {
      const start = e.startsAt ? Date.parse(e.startsAt) : NaN;
      return !Number.isNaN(start) && start >= now;
    })
    .slice(0, 5);

  const lmsUrl = process.env.NEXT_PUBLIC_LMS_URL ?? "https://eiosh-com-725461.hostingersite.com/lms/";
  const examUrl = process.env.NEXT_PUBLIC_EXAM_URL ?? "https://eiosh-com-725461.hostingersite.com/exam/public/login";
  const invoiceUrl = process.env.NEXT_PUBLIC_INVOICE_URL ?? "https://eiosh-com-725461.hostingersite.com/invoice/public/admin/login";

  return (
    <>
      <PageHero
        eyebrow="Student dashboard"
        title={`Welcome back.`}
        description={`Signed in as ${email}.`}
        breadcrumbs={[{ label: "Student" }]}
      >
        <form action="/api/student/logout" method="POST">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs text-navy-900 ring-1 ring-inset ring-border hover:bg-navy-50 dark:bg-white/10 dark:text-white/80 dark:ring-white/20 dark:hover:bg-white/15"
          >
            <LogOut className="h-3 w-3" /> Sign out
          </button>
        </form>
      </PageHero>

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <DashStat icon={GraduationCap} label="Enrolments" value={myEnrolments.length} />
            <DashStat icon={Award} label="Certificates" value={myCerts.length} />
            <DashStat icon={CalendarClock} label="Upcoming events" value={upcoming.length} />
          </div>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Enrolments */}
            <Card title="My courses" icon={BookOpen}>
              {myEnrolments.length === 0 ? (
                <p className="text-sm text-ink-soft">
                  No enrolments yet under this email.{" "}
                  <Link href="/courses" className="text-cyan-700 underline">
                    Browse courses
                  </Link>
                  .
                </p>
              ) : (
                <ul className="space-y-3">
                  {myEnrolments.map((e) => {
                    const course = courses.find((c) => c.slug === e.courseSlug);
                    return (
                      <li
                        key={e.id}
                        className="rounded-lg border border-border bg-white p-3"
                      >
                        <p className="font-medium text-navy-900">{e.courseTitle}</p>
                        <p className="text-xs text-ink-soft">
                          Enrolled {formatDate(e.enrolledAt)} · Paid {e.currency}{" "}
                          {e.amountPaid.toFixed(2)} via {e.paymentProvider}
                        </p>
                        {course && (
                          <Link
                            href={`/courses/${course.slug}`}
                            className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-700 hover:underline"
                          >
                            View course <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            {/* Certificates */}
            <Card title="My certificates" icon={ShieldCheck}>
              {myCerts.length === 0 ? (
                <p className="text-sm text-ink-soft">
                  No certificates linked to this email yet. Once your awarding body releases your
                  result we'll list it here.
                </p>
              ) : (
                <ul className="space-y-3">
                  {myCerts.slice(0, 5).map((c) => (
                    <li key={c.id} className="rounded-lg border border-border bg-white p-3">
                      <p className="font-medium text-navy-900">{c.course}</p>
                      <p className="text-xs text-ink-soft">
                        Cert #{c.certificateNumber}
                        {c.issueDate ? ` · Issued ${formatDate(c.issueDate)}` : ""}
                      </p>
                      <Link
                        href={`/verify/${c.certificateNumber}`}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-cyan-700 hover:underline"
                      >
                        Verify · share <ExternalLink className="h-3 w-3" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            {/* Upcoming */}
            <Card title="Upcoming" icon={CalendarClock}>
              {upcoming.length === 0 ? (
                <p className="text-sm text-ink-soft">No scheduled events.</p>
              ) : (
                <ul className="space-y-3">
                  {upcoming.map((e) => (
                    <li key={e.id} className="rounded-lg border border-border bg-white p-3">
                      <p className="font-medium text-navy-900">{e.title}</p>
                      <p className="text-xs text-ink-soft">
                        {formatDate(e.startsAt)} · {e.mode ?? "in-person"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-lg font-heading font-semibold text-navy-900">Connected portals</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Single-sign-on between these systems is on the roadmap. For now use your existing logins.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <PortalLink
              href={lmsUrl}
              icon={GraduationCap}
              title="LMS"
              note="Course materials, video lessons, assignments."
            />
            <PortalLink
              href={examUrl}
              icon={Award}
              title="Exam portal"
              note="Schedule and sit your written assessments."
            />
            <PortalLink
              href={invoiceUrl}
              icon={Receipt}
              title="Invoices"
              note="Download paid invoices and tax receipts."
            />
          </div>
        </Container>
      </Section>
    </>
  );
}

function DashStat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-5 ring-1 ring-border">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 text-cyan-700">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-heading font-semibold text-navy-900">{value}</p>
        <p className="text-xs uppercase tracking-wider text-ink-soft">{label}</p>
      </div>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 ring-1 ring-border">
      <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ink-soft">
        <Icon className="h-4 w-4" /> {title}
      </h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function PortalLink({
  href,
  icon: Icon,
  title,
  note,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  note: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-border bg-white p-5 transition hover:border-cyan-300 hover:shadow-sm"
    >
      <div className="flex items-center gap-2 text-cyan-700">
        <Icon className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase tracking-wider">{title}</span>
        <ExternalLink className="ml-auto h-4 w-4 opacity-50 group-hover:opacity-100" />
      </div>
      <p className="mt-2 text-sm text-ink-soft">{note}</p>
    </a>
  );
}
