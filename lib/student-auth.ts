import "server-only";
import { cookies } from "next/headers";
import crypto from "node:crypto";

/**
 * Lightweight passwordless student gate. Not a replacement for proper SSO —
 * just enough to scope the dashboard to "this email's records". The LMS
 * remains the source of truth for course access.
 *
 *   POST /api/student/login  → sets `eiosh_student` cookie (signed email).
 *   GET  /api/student/me     → returns the email if signed-in.
 *   The dashboard pages read getStudentEmail() directly.
 */

const COOKIE = "eiosh_student";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret() {
  return process.env.STUDENT_SESSION_SECRET ?? "eiosh-dev-only-change-me";
}

function sign(value: string): string {
  return crypto.createHmac("sha256", secret()).update(value).digest("hex").slice(0, 24);
}

export function setStudentSession(email: string) {
  const v = email.trim().toLowerCase();
  cookies().set(COOKIE, `${v}.${sign(v)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearStudentSession() {
  cookies().delete(COOKIE);
}

export function getStudentEmail(): string | null {
  const c = cookies().get(COOKIE);
  if (!c?.value) return null;
  // Split on the LAST `.` so emails with dots survive intact (e.g.
  // "ansar@eiosh.com" → value is "ansar@eiosh.com.<sig>").
  const lastDot = c.value.lastIndexOf(".");
  if (lastDot < 0) return null;
  const email = c.value.slice(0, lastDot);
  const sig = c.value.slice(lastDot + 1);
  if (!email || !sig) return null;
  if (sign(email) !== sig) return null;
  return email;
}
