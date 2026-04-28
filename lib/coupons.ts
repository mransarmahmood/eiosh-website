import { promises as fs } from "node:fs";
import { join } from "node:path";

export interface Coupon {
  code: string;
  label: string;
  description?: string;
  kind: "percent" | "fixed";
  amount: number;
  currency: string;
  validFrom: string | null;
  validUntil: string | null;
  usageLimit: number; // 0 = unlimited
  usedCount: number;
  courseSlugs: string[]; // empty = applies to any course
  active: boolean;
}

const FILE = join(process.cwd(), "content", "data", "coupons.json");

export async function listCoupons(): Promise<Coupon[]> {
  try {
    const txt = await fs.readFile(FILE, "utf-8");
    const arr = JSON.parse(txt);
    return Array.isArray(arr) ? (arr as Coupon[]) : [];
  } catch {
    return [];
  }
}

export async function saveCoupons(rows: Coupon[]): Promise<void> {
  await fs.mkdir(join(process.cwd(), "content", "data"), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf-8");
}

export async function findCoupon(code: string): Promise<Coupon | null> {
  const all = await listCoupons();
  const c = all.find((x) => x.code.toUpperCase() === code.toUpperCase());
  return c ?? null;
}

export async function upsertCoupon(c: Coupon): Promise<Coupon> {
  const all = await listCoupons();
  const i = all.findIndex((x) => x.code.toUpperCase() === c.code.toUpperCase());
  if (i >= 0) all[i] = c;
  else all.push(c);
  await saveCoupons(all);
  return c;
}

export async function incrementUsage(code: string): Promise<void> {
  const all = await listCoupons();
  const i = all.findIndex((x) => x.code.toUpperCase() === code.toUpperCase());
  if (i < 0) return;
  all[i].usedCount = (all[i].usedCount ?? 0) + 1;
  await saveCoupons(all);
}

export interface CouponEvaluation {
  ok: boolean;
  error?: string;
  discountAmount?: number; // applied to the unit amount (USD)
  finalAmount?: number;
  coupon?: Coupon;
}

/**
 * Apply a coupon to a unit price (USD). Returns the discount + new amount,
 * or { ok: false, error } if the coupon is invalid for this context.
 */
export async function applyCoupon(
  code: string,
  ctx: { courseSlug: string; unitAmount: number },
): Promise<CouponEvaluation> {
  const coupon = await findCoupon(code);
  if (!coupon) return { ok: false, error: "Coupon not found." };
  if (!coupon.active) return { ok: false, error: "Coupon is inactive." };

  const now = Date.now();
  if (coupon.validFrom && Date.parse(coupon.validFrom) > now) {
    return { ok: false, error: "Coupon is not yet active." };
  }
  if (coupon.validUntil && Date.parse(coupon.validUntil) < now) {
    return { ok: false, error: "Coupon has expired." };
  }
  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { ok: false, error: "Coupon has reached its usage limit." };
  }
  if (coupon.courseSlugs.length > 0 && !coupon.courseSlugs.includes(ctx.courseSlug)) {
    return { ok: false, error: "This coupon doesn't apply to that course." };
  }

  const discount =
    coupon.kind === "percent"
      ? Math.round(((coupon.amount / 100) * ctx.unitAmount) * 100) / 100
      : Math.min(coupon.amount, ctx.unitAmount);
  return {
    ok: true,
    coupon,
    discountAmount: discount,
    finalAmount: Math.max(0, ctx.unitAmount - discount),
  };
}
