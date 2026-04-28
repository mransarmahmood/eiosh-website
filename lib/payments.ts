import Stripe from "stripe";

/**
 * Server-side Stripe client. Lazy-init so that builds don't fail when
 * STRIPE_SECRET_KEY is unset (mock mode for dev / preview deployments).
 */
let _stripe: Stripe | null = null;

export function stripe(): Stripe | null {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  _stripe = new Stripe(key, { apiVersion: "2024-11-20.acacia" as Stripe.LatestApiVersion });
  return _stripe;
}

export function paymentsEnabled(): boolean {
  return !!process.env.STRIPE_SECRET_KEY;
}

/** Available payment providers we know how to talk to. Extend with JazzCash/Easypaisa later. */
export type PaymentProvider = "stripe" | "paypal" | "jazzcash" | "easypaisa" | "bank-transfer";

/** Map a course price (USD) to Stripe's smallest unit (cents). */
export function toMinorUnit(amount: number, currency: string): number {
  // ZeroDecimalCurrencies don't use minor units — JPY etc.
  const zeroDecimal = ["JPY", "KRW", "VND", "BIF", "CLP"];
  if (zeroDecimal.includes(currency.toUpperCase())) return Math.round(amount);
  return Math.round(amount * 100);
}

export interface CheckoutItem {
  /** Stable identifier — usually a course slug. */
  id: string;
  name: string;
  description?: string;
  unitAmount: number; // human price (e.g. 385.00)
  currency: string;   // "USD", "GBP", "PKR" etc.
  quantity?: number;
  imageUrl?: string;
}

export interface CreateCheckoutInput {
  items: CheckoutItem[];
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  /** Optional metadata persisted on the Stripe Session (returned in webhook). */
  metadata?: Record<string, string>;
  /** When the user picks an instalment plan we map this to multiple invoices later. */
  instalments?: 1 | 2 | 3 | 6 | 12;
}

export async function createStripeCheckout(input: CreateCheckoutInput): Promise<string> {
  const s = stripe();
  if (!s) {
    throw new Error("Stripe is not configured. Set STRIPE_SECRET_KEY in .env.local.");
  }

  const session = await s.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: input.customerEmail,
    line_items: input.items.map((i) => ({
      quantity: i.quantity ?? 1,
      price_data: {
        currency: i.currency.toLowerCase(),
        unit_amount: toMinorUnit(i.unitAmount, i.currency),
        product_data: {
          name: i.name,
          description: i.description,
          images: i.imageUrl ? [i.imageUrl] : undefined,
        },
      },
    })),
    success_url: input.successUrl,
    cancel_url: input.cancelUrl,
    metadata: {
      ...(input.metadata ?? {}),
      instalments: String(input.instalments ?? 1),
    },
  });

  if (!session.url) throw new Error("Stripe did not return a redirect URL");
  return session.url;
}
