import { redirect, notFound } from "next/navigation";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { ReviewForm } from "@/components/reviews/ReviewForm";
import { getStudentEmail } from "@/lib/student-auth";
import { listEnrolments } from "@/lib/enrolments";
import { listReviews } from "@/lib/reviews";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Leave a review",
  description: "Help future learners — share what your EIOSH programme was like.",
  path: "/student/review",
  noIndex: true,
});

interface Props {
  params: { enrolmentId: string };
}

export default async function LeaveReviewPage({ params }: Props) {
  const email = getStudentEmail();
  if (!email) redirect(`/student/login?next=/student/review/${params.enrolmentId}`);

  const enrolments = await listEnrolments();
  const enrolment = enrolments.find((e) => e.id === params.enrolmentId);
  if (!enrolment) notFound();
  if (enrolment.customerEmail.toLowerCase() !== email.toLowerCase()) {
    return (
      <Section>
        <Container>
          <p className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
            This enrolment is registered to a different email address.
          </p>
        </Container>
      </Section>
    );
  }

  // Already reviewed?
  const existing = await listReviews({ courseSlug: enrolment.courseSlug });
  const alreadyDone = existing.find((r) => r.enrolmentId === enrolment.id);

  return (
    <>
      <PageHero
        eyebrow="Course feedback"
        title={`Review ${enrolment.courseTitle}`}
        description="A quick rating and a few sentences help future learners decide. Verified reviews get a green badge on the course page."
        breadcrumbs={[
          { label: "Student", href: "/student" },
          { label: "Review" },
        ]}
      />
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl">
            {alreadyDone ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                <p className="font-semibold text-green-900">You've already reviewed this course.</p>
                <p className="mt-1 text-sm text-green-800">Thanks again — your review is live.</p>
              </div>
            ) : (
              <ReviewForm
                enrolmentId={enrolment.id}
                courseTitle={enrolment.courseTitle}
                defaultName={enrolment.customerName ?? ""}
              />
            )}
          </div>
        </Container>
      </Section>
    </>
  );
}
