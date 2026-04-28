import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { stripe } from "@/lib/payments";
import { recordEnrolment, provisionLmsAccess } from "@/lib/enrolments";
import { rewardForAmount } from "@/lib/referrals";

/**
 * Stripe webhook entry point. Configure in Stripe Dashboard:
 *   URL: https://your-site/api/webhooks/stripe
 *   Events: checkout.session.completed, charge.refunded
 *   Copy the signing secret into STRIPE_WEBHOOK_SECRET.
 */
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const s = stripe();
  const sig = headers().get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!s || !sig || !secret) {
    return NextResponse.json({ ok: false, error: "Stripe not configured" }, { status: 503 });
  }

  const buf = Buffer.from(await req.arrayBuffer());
  let event: Stripe.Event;
  try {
    event = s.webhooks.constructEvent(buf, sig, secret);
  } catch (err) {
    console.error("[stripe] signature verification failed:", (err as Error).message);
    return NextResponse.json({ ok: false, error: "Bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const md = session.metadata ?? {};
    const amountPaid = (session.amount_total ?? 0) / 100;
    const referrerCode = md.referrerCode ? md.referrerCode.toUpperCase() : undefined;
    const enrolment = {
      id: session.id,
      courseSlug: md.courseSlug ?? "unknown",
      courseTitle: md.courseTitle ?? "Unknown course",
      amountPaid,
      currency: (session.currency ?? "usd").toUpperCase(),
      customerEmail: session.customer_email ?? session.customer_details?.email ?? "",
      customerName: md.customerName || session.customer_details?.name || undefined,
      paymentProvider: "stripe" as const,
      paymentRef: session.payment_intent as string,
      instalments: Number(md.instalments ?? 1),
      enrolledAt: new Date().toISOString(),
      status: "paid" as const,
      ...(referrerCode
        ? { referrerCode, referralRewardAmount: rewardForAmount(amountPaid) }
        : {}),
    };

    await recordEnrolment(enrolment);

    // Best-effort LMS auto-enrol; failure is logged but not surfaced to Stripe.
    const lms = await provisionLmsAccess(enrolment);
    if (!lms.ok) {
      console.warn("[stripe] LMS auto-enrol skipped:", lms.error);
    }
  }

  return NextResponse.json({ ok: true });
}
