import { NextResponse } from "next/server";
import { z } from "zod";
import { addComment, findThread } from "@/lib/forum";
import { getStudentEmail } from "@/lib/student-auth";

const Body = z.object({
  body: z.string().trim().min(2).max(8000),
  authorName: z.string().trim().min(2).max(120),
});

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const t = await findThread(params.slug);
  if (!t) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, thread: t });
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
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
  const result = await addComment(params.slug, {
    authorEmail: email,
    authorName: parsed.data.authorName,
    body: parsed.data.body,
  });
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, thread: result.thread });
}
