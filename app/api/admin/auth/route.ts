import { NextResponse } from "next/server";
import { login, logout } from "@/lib/cms/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (body.action === "logout") {
    logout();
    return NextResponse.json({ ok: true });
  }
  const password = typeof body.password === "string" ? body.password : "";
  const ok = login(password);
  return NextResponse.json({ ok }, { status: ok ? 200 : 401 });
}
