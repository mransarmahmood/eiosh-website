import { NextResponse } from "next/server";
import { loginWithEmail, loginWithMasterPassword, logout } from "@/lib/cms/auth";

/**
 * Admin auth endpoint.
 *
 *  - { action: "logout" }        → clears the cookie
 *  - { email, password }         → user-based login (looks up admin-users.json)
 *  - { password }                → legacy master-password login (env / runtime)
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    email?: string;
    password?: string;
  };

  if (body.action === "logout") {
    logout();
    return NextResponse.json({ ok: true });
  }

  const password = typeof body.password === "string" ? body.password : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (email) {
    const user = await loginWithEmail(email, password);
    if (!user) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password." },
        { status: 401 },
      );
    }
    return NextResponse.json({ ok: true, user });
  }

  // Legacy: just a password → match against ADMIN_PASSWORD.
  const ok = loginWithMasterPassword(password);
  if (!ok) {
    return NextResponse.json(
      { ok: false, error: "Wrong password." },
      { status: 401 },
    );
  }
  return NextResponse.json({ ok: true, master: true });
}
