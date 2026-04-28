import { NextResponse } from "next/server";
import { clearStudentSession } from "@/lib/student-auth";

export async function POST() {
  clearStudentSession();
  return NextResponse.json({ ok: true });
}
