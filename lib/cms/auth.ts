import "server-only";
import { cookies } from "next/headers";

// Minimal password gate. Set ADMIN_PASSWORD in .env.local; if unset, falls back
// to a dev-only default and logs a warning. For production swap for NextAuth
// or a proper identity provider.

const COOKIE = "eiosh_admin";
const DEV_DEFAULT = "eiosh-admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function expected() {
  const p = process.env.ADMIN_PASSWORD;
  if (p && p.length >= 6) return p;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_PASSWORD is required in production");
  }
  return DEV_DEFAULT;
}

export function isAuthed() {
  const c = cookies().get(COOKIE);
  if (!c?.value) return false;
  return c.value === expected();
}

export function login(password: string): boolean {
  if (password !== expected()) return false;
  cookies().set(COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

export function logout() {
  cookies().delete(COOKIE);
}
