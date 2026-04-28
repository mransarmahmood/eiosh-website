import Link from "next/link";
import { CheckCircle2, ArrowRight, Mail } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Enrolment confirmed",
  description: "Thanks — your enrolment is confirmed. Check your inbox for next steps.",
  path: "/checkout/success",
  noIndex: true,
});

interface Props {
  searchParams: { session_id?: string; mock?: string; course?: string };
}

export default function CheckoutSuccessPage({ searchParams }: Props) {
  const isMock = searchParams.mock === "1";

  return (
    <>
      <PageHero
        eyebrow="Payment complete"
        title="You're enrolled."
        description="A confirmation email is on its way with login details for the LMS."
        breadcrumbs={[{ label: "Checkout" }, { label: "Success" }]}
      />
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-600" />
            <h2 className="mt-4 text-2xl font-heading font-semibold text-navy-900">
              Thank you — your seat is reserved.
            </h2>
            {isMock ? (
              <p className="mt-3 text-sm text-amber-700">
                ⚠️ This was a test transaction (Stripe is not configured yet). In production this page
                will only appear after a real payment.
              </p>
            ) : (
              <p className="mt-3 text-ink-soft">
                We've recorded your payment and our admissions team will be in touch within one
                business day with your LMS login, batch dates and joining instructions.
              </p>
            )}

            <ul className="mx-auto mt-8 max-w-md space-y-3 text-left text-sm text-ink">
              <li className="flex gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-cyan-700" />
                <span>
                  Check your inbox (and spam folder) for an email from <strong>info@eiosh.com</strong> with your invoice.
                </span>
              </li>
              <li className="flex gap-3">
                <ArrowRight className="h-5 w-5 flex-shrink-0 text-cyan-700" />
                <span>
                  Log in to the LMS at{" "}
                  <Link href="/student" className="text-cyan-700 underline">
                    your student dashboard
                  </Link>{" "}
                  to access course materials.
                </span>
              </li>
            </ul>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <Link
                href="/student"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-navy-900 px-6 text-sm font-semibold text-white hover:bg-navy-800"
              >
                Go to my dashboard <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-border px-6 text-sm font-semibold text-navy-900 hover:bg-navy-50"
              >
                Explore more courses
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
