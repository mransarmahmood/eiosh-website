import "server-only";
import { cookies } from "next/headers";
import crypto from "node:crypto";
import {
  authenticate,
  findUserById,
  canAccessModule,
  effectivePermissions,
  type AdminUser,
  type SafeAdminUser,
} from "@/lib/cms/users";
import { permissionsFor, type AdminRole, type Permission } from "@/lib/cms/rbac";

/**
 * Two-tier admin auth:
 *
 *  1. **Master password gate** — `ADMIN_PASSWORD` env (or runtime config).
 *     The cookie value equals that password. Treated as the implicit super-admin
 *     so an empty user store still has someone with full access.
 *
 *  2. **User-based login** — admin emails + password hashes in
 *     `content/data/admin-users.json`. Cookie value is `<userId>.<sig>` signed
 *     with `ADMIN_SESSION_SECRET` (or a built-in fallback).
 *
 * Both are honoured simultaneously, so existing single-password users keep
 * working until they migrate.
 */

const COOKIE = "eiosh_admin";
const DEV_DEFAULT = "eiosh-admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function envPassword(): string {
  const p = process.env.ADMIN_PASSWORD;
  if (p && p.length >= 6) return p;
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_PASSWORD is required in production");
  }
  return DEV_DEFAULT;
}

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? envPassword();
}

function sign(value: string): string {
  return crypto.createHmac("sha256", sessionSecret()).update(value).digest("hex").slice(0, 24);
}

// ── Public surface (synchronous helpers used by Server Components) ──────────

/** Just "is the cookie present and valid?" — no role information. */
export function isAuthed(): boolean {
  return getCookieKind() !== "none";
}

/** Are we logged in via the legacy master password? */
export function isSuperAdmin(): boolean {
  return getCookieKind() === "master";
}

/**
 * Returns the user id from the signed cookie, or null. Doesn't load the user
 * record (saves a file read in hot paths like the AdminShell sidebar).
 */
export function currentUserId(): string | null {
  const c = cookies().get(COOKIE);
  if (!c?.value) return null;
  // Master-password cookie has no id.
  if (c.value === envPassword()) return null;
  const lastDot = c.value.lastIndexOf(".");
  if (lastDot < 0) return null;
  const id = c.value.slice(0, lastDot);
  const sig = c.value.slice(lastDot + 1);
  if (!id || !sig || sign(id) !== sig) return null;
  return id;
}

function getCookieKind(): "none" | "master" | "user" {
  const c = cookies().get(COOKIE);
  if (!c?.value) return "none";
  if (c.value === envPassword()) return "master";
  return currentUserId() ? "user" : "none";
}

/** Hydrate the full user record (one file read). Null if not signed in or master. */
export async function currentUser(): Promise<AdminUser | null> {
  const id = currentUserId();
  if (!id) return null;
  return findUserById(id);
}

// Synthetic "super admin" returned for the master-password session so
// permission checks have a uniform shape.
const SUPER_ADMIN: SafeAdminUser & { isSuper: true } = {
  id: "__super__",
  email: "super@local",
  name: "Super admin",
  role: "admin",
  modules: ["*"],
  permissionOverrides: [],
  active: true,
  createdAt: "1970-01-01T00:00:00Z",
  updatedAt: "1970-01-01T00:00:00Z",
  isSuper: true,
};

export async function currentUserOrSuper(): Promise<SafeAdminUser> {
  if (isSuperAdmin()) return SUPER_ADMIN;
  const u = await currentUser();
  if (u) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safe } = u;
    return safe;
  }
  // Not authenticated — return an "anonymous" user with no access.
  return {
    id: "__anon__",
    email: "",
    name: "",
    role: "advisor" as AdminRole,
    modules: [],
    permissionOverrides: [],
    active: false,
    createdAt: "",
    updatedAt: "",
  };
}

export async function currentRole(): Promise<AdminRole | null> {
  if (!isAuthed()) return null;
  if (isSuperAdmin()) return "admin";
  const u = await currentUser();
  return u?.role ?? null;
}

export async function hasPermission(perm: Permission): Promise<boolean> {
  if (isSuperAdmin()) return true;
  const u = await currentUser();
  if (!u || !u.active) return false;
  return effectivePermissions(u).includes(perm);
}

export async function canSeeModule(resourceKey: string): Promise<boolean> {
  if (isSuperAdmin()) return true;
  const u = await currentUser();
  if (!u || !u.active) return false;
  return canAccessModule(u, resourceKey);
}

/** Sync variant — used in the sidebar where awaiting per-link is awkward. */
export function canSeeModuleSync(user: SafeAdminUser, resourceKey: string): boolean {
  if (!user || !user.active) return false;
  if (user.modules.includes("*")) return true;
  return user.modules.includes(resourceKey);
}

// ── Login / logout ──────────────────────────────────────────────────────────

/** Legacy master-password login. Sets the cookie to the password value. */
export function loginWithMasterPassword(password: string): boolean {
  if (password !== envPassword()) return false;
  cookies().set(COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

/** New email + password login. Returns the user on success. */
export async function loginWithEmail(
  email: string,
  password: string,
): Promise<SafeAdminUser | null> {
  const user = await authenticate(email, password);
  if (!user) return null;
  cookies().set(COOKIE, `${user.id}.${sign(user.id)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}

export function logout() {
  cookies().delete(COOKIE);
}

// Legacy shim — old code calls `login(password)`. Keep it working.
export function login(password: string): boolean {
  return loginWithMasterPassword(password);
}
