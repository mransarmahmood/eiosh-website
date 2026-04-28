import { NextResponse } from "next/server";
import { z } from "zod";
import { getStudentEmail } from "@/lib/student-auth";
import { submitReview, listReviews } from "@/lib/reviews";

const Body = z.object({
  enrolmentId: z.string().min(1),
  rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  reviewerName: z.string().trim().min(2).max(120),
  reviewerCompany: z.string().trim().max(160).optional(),
  body: z.string().trim().min(20).max(2000),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const courseSlug = url.searchParams.get("course") ?? undefined;
  const reviews = await listReviews({ courseSlug, status: "verified" });
  return NextResponse.json({ ok: true, reviews });
}

export async function POST(req: Request) {
  const email = getStudentEmail();
  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Sign in to submit a review." },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const result = await submitReview({ submitterEmail: email, ...parsed.data });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, review: result.review });
}
