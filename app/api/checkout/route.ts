import { NextResponse } from "next/server";
import { z } from "zod";
import { courses } from "@/content/courses";
import { createStripeCheckout, paymentsEnabled } from "@/lib/payments";
import { applyCoupon } from "@/lib/coupons";

const Body = z.object({
  courseSlug: z.string().min(1),
  customerEmail: z.string().email().optional(),
  customerName: z.string().max(120).optional(),
  instalments: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(6), z.literal(12)]).optional(),
  /** Referral code captured from `?ref=...` on the course page. */
  referrerCode: z.string().regex(/^[A-Z0-9]{6,12}$/i).optional(),
  /** Optional coupon code (`?promo=` or typed at checkout). */
  couponCode: z.string().regex(/^[A-Z0-9_-]{3,32}$/i).optional(),
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
  const { courseSlug, customerEmail, customerName, instalments, referrerCode, couponCode } = parsed.data;

  const course = courses.find((c) => c.slug === courseSlug);
  if (!course) {
    return NextResponse.json({ ok: false, error: "Course not found" }, { status: 404 });
  }

  const baseUsd = course.priceFromUSD ?? 0;
  if (baseUsd <= 0) {
    return NextResponse.json({ ok: false, error: "This course is not yet priced for online checkout — please request a quote." }, { status: 400 });
  }

  // Apply coupon (if any) — returns either a discounted final amount or an error.
  let finalUsd = baseUsd;
  let appliedCoupon: { code: string; discount: number } | null = null;
  if (couponCode) {
    const evald = await applyCoupon(couponCode, { courseSlug, unitAmount: baseUsd });
    if (!evald.ok) {
      return NextResponse.json({ ok: false, error: evald.error }, { status: 400 });
    }
    finalUsd = evald.finalAmount ?? baseUsd;
    appliedCoupon = { code: evald.coupon!.code, discount: evald.discountAmount ?? 0 };
  }

  if (!paymentsEnabled()) {
    // Mock flow for dev — log the intent and redirect to a stub success page.
    console.warn("[checkout] STRIPE_SECRET_KEY missing, returning mock URL");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
    return NextResponse.json({
      ok: true,
      mock: true,
      redirectUrl: `${siteUrl}/checkout/success?mock=1&course=${encodeURIComponent(courseSlug)}`,
      pricing: { baseUsd, finalUsd, appliedCoupon },
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const url = await createStripeCheckout({
    items: [
      {
        id: course.slug,
        name: appliedCoupon ? `${course.title} — ${appliedCoupon.code}` : course.title,
        description: course.summary ?? undefined,
        unitAmount: finalUsd,
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
      couponCode: appliedCoupon?.code ?? "",
      couponDiscount: String(appliedCoupon?.discount ?? 0),
      baseUsd: String(baseUsd),
    },
  });

  return NextResponse.json({ ok: true, redirectUrl: url });
}
