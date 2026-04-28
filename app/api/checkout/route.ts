import { NextResponse } from "next/server";
import { z } from "zod";
import { courses } from "@/content/courses";
import { createStripeCheckout, paymentsEnabled } from "@/lib/payments";

const Body = z.object({
  courseSlug: z.string().min(1),
  customerEmail: z.string().email().optional(),
  customerName: z.string().max(120).optional(),
  instalments: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(6), z.literal(12)]).optional(),
  /** Referral code captured from `?ref=...` on the course page. Stored on the enrolment for payout. */
  referrerCode: z.string().regex(/^[A-Z0-9]{6,12}$/i).optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }
  const { courseSlug, customerEmail, customerName, instalments, referrerCode } = parsed.data;

  const course = courses.find((c) => c.slug === courseSlug);
  if (!course) {
    return NextResponse.json({ ok: false, error: "Course not found" }, { status: 404 });
  }

  const price = course.priceFromUSD ?? 0;
  if (price <= 0) {
    return NextResponse.json({ ok: false, error: "This course is not yet priced for online checkout — please request a quote." }, { status: 400 });
  }

  if (!paymentsEnabled()) {
    // Mock flow for dev — log the intent and redirect to a stub success page.
    console.warn("[checkout] STRIPE_SECRET_KEY missing, returning mock URL");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
    return NextResponse.json({
      ok: true,
      mock: true,
      redirectUrl: `${siteUrl}/checkout/success?mock=1&course=${encodeURIComponent(courseSlug)}`,
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const url = await createStripeCheckout({
    items: [
      {
        id: course.slug,
        name: course.title,
        description: course.summary ?? undefined,
        unitAmount: price,
        currency: course.currency ?? "USD",
        quantity: 1,
        imageUrl: course.cover ? new URL(course.cover, siteUrl).toString() : undefined,
      },
    ],
    customerEmail,
    instalments,
    successUrl: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${siteUrl}/courses/${course.slug}?checkout=cancelled`,
    metadata: {
      courseSlug: course.slug,
      courseTitle: course.title,
      customerName: customerName ?? "",
      referrerCode: referrerCode?.toUpperCase() ?? "",
    },
  });

  return NextResponse.json({ ok: true, redirectUrl: url });
}
