import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/cms/auth";
import { listCoupons, upsertCoupon, saveCoupons, type Coupon } from "@/lib/coupons";

function deny() {
  return NextResponse.json({ ok: false, error: "unauthenticated" }, { status: 401 });
}

export async function GET() {
  if (!isAuthed()) return deny();
  return NextResponse.json({ ok: true, coupons: await listCoupons() });
}

export async function POST(req: Request) {
  if (!isAuthed()) return deny();
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const c = body as Coupon;
  if (!c.code || !c.kind) {
    return NextResponse.json({ ok: false, error: "code and kind required" }, { status: 400 });
  }
  const next: Coupon = {
    code: String(c.code).toUpperCase(),
    label: String(c.label ?? c.code),
    description: c.description ? String(c.description) : undefined,
    kind: c.kind === "fixed" ? "fixed" : "percent",
    amount: Number(c.amount ?? 0),
    currency: String(c.currency ?? "USD"),
    validFrom: c.validFrom ? String(c.validFrom) : null,
    validUntil: c.validUntil ? String(c.validUntil) : null,
    usageLimit: Number(c.usageLimit ?? 0),
    usedCount: Number(c.usedCount ?? 0),
    courseSlugs: Array.isArray(c.courseSlugs) ? c.courseSlugs.map(String) : [],
    active: c.active !== false,
  };
  await upsertCoupon(next);
  return NextResponse.json({ ok: true, coupon: next });
}

export async function DELETE(req: Request) {
  if (!isAuthed()) return deny();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.json({ ok: false, error: "code required" }, { status: 400 });
  const all = await listCoupons();
  await saveCoupons(all.filter((c) => c.code.toUpperCase() !== code.toUpperCase()));
  return NextResponse.json({ ok: true });
}
