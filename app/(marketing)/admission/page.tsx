import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { AdmissionFormBuilder } from "@/components/forms/AdmissionFormBuilder";
import { UserPlus, CheckCircle2, Globe2, ShieldCheck } from "lucide-react";
import { pageMeta } from "@/lib/seo";
import { listAll } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export const metadata = pageMeta({
  title: "Admission Form",
  description:
    "Apply for admission to an EIOSH qualification. Our admissions team confirms eligibility, cohort availability and next steps within one business day.",
  path: "/admission",
});

const steps = [
  { icon: UserPlus, t: "Submit application", d: "Complete the form — it takes two minutes." },
  { icon: CheckCircle2, t: "Eligibility check", d: "Our admissions team verifies prerequisites within one business day." },
  { icon: Globe2, t: "Cohort confirmation", d: "We lock in your start date and share pre-course materials." },
  { icon: ShieldCheck, t: "Learning begins", d: "Get access to the LMS and join your tutor-led sessions." },
];

export default async function AdmissionPage() {
  const [coursesRes, eventsRes] = await Promise.all([
    listAll("courses").catch(() => ({ records: [] as any })),
    listAll("events").catch(() => ({ records: [] as any })),
  ]);

  const coursesData = Array.isArray(coursesRes.records)
    ? (coursesRes.records as Array<{ id?: string; title?: string; status?: string; cohortStart?: string }>)
    : [];
  const eventsData = Array.isArray(eventsRes.records)
    ? (eventsRes.records as Array<{ startsAt?: string; type?: string }>)
    : [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const courses = coursesData
    .filter((c) => c.title && c.status !== "closed" && c.status !== "archived")
    .map((c) => ({
      id: String(c.id ?? c.title),
      title: String(c.title),
      cohortStart: c.cohortStart ?? "",
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  const datesSet = new Set<string>();
  for (const c of coursesData) {
    if (c.cohortStart && new Date(c.cohortStart) >= today) datesSet.add(c.cohortStart.slice(0, 10));
  }
  for (const e of eventsData) {
    if (!e.startsAt) continue;
    if (e.type && e.type !== "cohort-start" && e.type !== "open-day") continue;
    const d = new Date(e.startsAt);
    if (d >= today) datesSet.add(e.startsAt.slice(0, 10));
  }
  const cohortDates = Array.from(datesSet).sort();

  return (
    <>
      <PageHero
        eyebrow="Admissions"
        title="Apply for admission."
        description="Submit your admission form and EIOSH's admissions team will confirm eligibility, cohort availability and next steps within one business day."
        breadcrumbs={[{ label: "Admission" }]}
        align="center"
      />

      <Section>
        <Container>
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.t} className="relative rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated">
                  <span className="absolute -top-3 left-6 inline-flex h-6 items-center rounded-full bg-navy-900 px-3 text-xs font-semibold uppercase tracking-wider text-white">
                    Step 0{i + 1}
                  </span>
                  <span className="mt-3 flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 font-heading text-lg font-semibold text-navy-900">{s.t}</p>
                  <p className="mt-2 text-sm text-ink-muted">{s.d}</p>
                </li>
              );
            })}
          </ol>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Apply now</p>
              <h2 className="mt-3 font-heading text-display-sm font-semibold text-navy-900 text-balance">
                The admission form.
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-ink-muted">
                All fields marked with an asterisk are required. Your details stay strictly confidential and are used
                only to process your admission.
              </p>
            </div>

            <AdmissionFormBuilder courses={courses} cohortDates={cohortDates} />
          </div>
        </Container>
      </Section>
    </>
  );
}
