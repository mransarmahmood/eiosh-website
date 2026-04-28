import { NextResponse } from "next/server";
import { z } from "zod";
import { listThreads, addThread } from "@/lib/forum";
import { getStudentEmail } from "@/lib/student-auth";

export async function GET() {
  return NextResponse.json({ ok: true, threads: await listThreads() });
}

const Body = z.object({
  title: z.string().trim().min(8).max(180),
  body: z.string().trim().min(10).max(8000),
  category: z.string().trim().max(40).optional(),
  authorName: z.string().trim().min(2).max(120),
});

export async function POST(req: Request) {
  const email = getStudentEmail();
  if (!email) {
    return NextResponse.json({ ok: false, error: "Sign in to post." }, { status: 401 });
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
  const t = await addThread({ ...parsed.data, authorEmail: email });
  return NextResponse.json({ ok: true, thread: t });
}
