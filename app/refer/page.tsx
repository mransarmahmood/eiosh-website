import Link from "next/link";
import { redirect } from "next/navigation";
import { Gift, Share2, TrendingUp, DollarSign } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { getStudentEmail } from "@/lib/student-auth";
import { listEnrolments } from "@/lib/enrolments";
import { codeForEmail, rewardPercent, shareUrl } from "@/lib/referrals";
import { courses } from "@/content/courses";
import { ReferralCodeCard } from "@/components/refer/ReferralCodeCard";
import { formatDate } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Refer & earn",
  description: "Share EIOSH with your colleagues — earn account credit on every successful enrolment.",
  path: "/refer",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eiosh.com";

export default async function ReferPage() {
  const email = getStudentEmail();
  if (!email) {
    // Logged out → redirect to login with return-to=/refer
    redirect("/student/login?next=/refer");
  }

  const code = codeForEmail(email);
  const allEnrolments = await listEnrolments();
  const myReferrals = allEnrolments.filter((e) => e.referrerCode === code);
  const totalEarned = myReferrals.reduce(
    (sum, e) => sum + (e.referralRewardAmount ?? 0),
    0,
  );

  const featured = courses.filter((c) => c.featured).slice(0, 3);
  const pct = Math.round(rewardPercent() * 100);

  return (
    <>
      <PageHero
        eyebrow="Alumni programme"
        title="Refer a colleague — earn credit."
        description={`Share EIOSH with someone who'd benefit. When they enrol using your code, you get ${pct}% of their fee back as account credit toward your next course.`}
        breadcrumbs={[{ label: "Refer & earn" }]}
        align="center"
      />

      <Section>
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Stat icon={Gift} label="Reward rate" value={`${pct}%`} note="of each successful enrolment" />
            <Stat icon={TrendingUp} label="Successful referrals" value={String(myReferrals.length)} note="all time" />
            <Stat icon={DollarSign} label="Earned" value={`US$${totalEarned.toFixed(2)}`} note="payable as credit" />
          </div>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <ReferralCodeCard code={code} email={email} />
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className="text-lg font-heading font-semibold text-navy-900">Quick-share course links</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Pre-built share links with your code already attached — drop them in WhatsApp, LinkedIn or email.
          </p>
          <ul className="mt-6 space-y-3">
            {featured.map((c) => (
              <li
                key={c.slug}
                className="flex flex-col gap-2 rounded-2xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:gap-4"
              >
                <span className="flex-1">
                  <span className="block font-medium text-navy-900">{c.title}</span>
                  <span className="block text-xs text-ink-soft">
                    {c.priceFromUSD ? `From US$${c.priceFromUSD}` : "Price on request"}
                  </span>
                </span>
                <code className="block max-w-full overflow-x-auto rounded bg-ink/5 px-3 py-1.5 text-xs text-ink-soft">
                  {shareUrl(c.slug, code, SITE_URL)}
                </code>
                <Link
                  href={`/courses/${c.slug}?ref=${code}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-navy-900 hover:bg-navy-50"
                >
                  <Share2 className="h-3.5 w-3.5" /> Open
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {myReferrals.length > 0 && (
        <Section tone="subtle">
          <Container>
            <h2 className="text-lg font-heading font-semibold text-navy-900">Your referrals</h2>
            <ul className="mt-6 divide-y divide-border rounded-2xl bg-white ring-1 ring-border">
              {myReferrals.map((r) => (
                <li key={r.id} className="flex items-center justify-between p-4">
                  <span>
                    <span className="block font-medium text-navy-900">{r.courseTitle}</span>
                    <span className="block text-xs text-ink-soft">
                      {formatDate(r.enrolledAt)} · {r.customerEmail}
                    </span>
                  </span>
                  <span className="font-mono text-sm text-green-700">
                    +US${(r.referralRewardAmount ?? 0).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-cyan-700">
          <Icon className="h-5 w-5" />
        </span>
        <span className="text-sm font-medium uppercase tracking-wider text-ink-soft">{label}</span>
      </div>
      <p className="mt-3 text-3xl font-heading font-semibold text-navy-900">{value}</p>
      <p className="text-xs text-ink-soft">{note}</p>
    </div>
  );
}
