import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { listSupportedCurrencies } from "@/lib/currency";

const COOKIE = "eiosh_ccy";
const Body = z.object({ code: z.string().min(2).max(6) });

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid currency code" }, { status: 400 });
  }
  const code = parsed.data.code.toUpperCase();
  const supported = listSupportedCurrencies().map((c) => c.code);
  if (!supported.includes(code)) {
    return NextResponse.json(
      { ok: false, error: `Unsupported currency. Choose one of ${supported.join(", ")}` },
      { status: 400 },
    );
  }
  cookies().set(COOKIE, code, {
    httpOnly: false, // client may read this if needed
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  return NextResponse.json({ ok: true, code });
}
