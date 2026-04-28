import "server-only";
import { cookies } from "next/headers";

/**
 * Role-based access for /admin.
 *
 * - The legacy single password (`ADMIN_PASSWORD`) still works and grants the
 *   `admin` role. New users / roles are stored in `content/data/admin-users.json`.
 * - Roles & their permissions are defined here; pages & API routes call
 *   `hasPermission(perm)` to gate features.
 *
 * NOTE: This is an MVP RBAC. For real production use you'd swap to a proper
 * identity provider (NextAuth + a roles claim).
 */

export type AdminRole = "admin" | "faculty" | "advisor" | "finance" | "iv";

export type Permission =
  | "content:write"      // edit any CMS resource
  | "content:read"       // read-only catalog access (for advisors)
  | "settings:write"     // edit /admin/settings
  | "users:manage"       // add/remove RBAC users
  | "proposals:send"     // create + send proposals
  | "proposals:read"     // view proposal list only
  | "finance:read"       // read invoices, enrolments
  | "finance:write"      // edit invoices, refunds
  | "iv:audit"           // internal-verifier audit screens
  | "cohorts:manage";    // manage batches / waitlists

const ROLE_PERMS: Record<AdminRole, Permission[]> = {
  admin: [
    "content:write",
    "content:read",
    "settings:write",
    "users:manage",
    "proposals:send",
    "proposals:read",
    "finance:read",
    "finance:write",
    "iv:audit",
    "cohorts:manage",
  ],
  faculty: ["content:write", "content:read", "iv:audit", "cohorts:manage"],
  advisor: ["content:read", "proposals:send", "proposals:read", "cohorts:manage"],
  finance: ["finance:read", "finance:write", "proposals:read"],
  iv: ["iv:audit", "content:read"],
};

const COOKIE = "eiosh_admin"; // existing cookie keeps the password value
const ROLE_COOKIE = "eiosh_admin_role"; // optional role override for non-master users

export function currentRole(): AdminRole | null {
  const c = cookies().get(COOKIE);
  if (!c?.value) return null;
  // Master password = admin role.
  if (c.value === (process.env.ADMIN_PASSWORD ?? "eiosh-admin")) return "admin";
  // Role-cookie set by /api/admin/role-login (multi-user flow).
  const r = cookies().get(ROLE_COOKIE)?.value as AdminRole | undefined;
  if (r && (Object.keys(ROLE_PERMS) as AdminRole[]).includes(r)) return r;
  // Authenticated but unknown role → least privilege.
  return "advisor";
}

export function hasPermission(perm: Permission): boolean {
  const role = currentRole();
  if (!role) return false;
  return ROLE_PERMS[role].includes(perm);
}

export function permissionsFor(role: AdminRole): Permission[] {
  return ROLE_PERMS[role];
}

export function listRoles(): AdminRole[] {
  return Object.keys(ROLE_PERMS) as AdminRole[];
}
