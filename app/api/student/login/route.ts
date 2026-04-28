import { NextResponse } from "next/server";
import { z } from "zod";
import { setStudentSession } from "@/lib/student-auth";

const Body = z.object({
  email: z.string().trim().email(),
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
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid email" }, { status: 400 });
  }

  // For MVP: we accept any email. In production wire this to a magic-link flow
  // (send a 6-digit OTP via the same provider used for inquiries) before
  // setting the session cookie.
  setStudentSession(parsed.data.email);

  return NextResponse.json({ ok: true });
}
