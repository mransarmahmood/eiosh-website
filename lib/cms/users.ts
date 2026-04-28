import "server-only";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import crypto from "node:crypto";
import { permissionsFor, type AdminRole, type Permission } from "@/lib/cms/rbac";

/**
 * Multi-user store for the admin panel. Persisted to
 * `content/data/admin-users.json`.
 *
 * - Passwords are stored as PBKDF2-SHA256 hashes (built-in to Node, no extra
 *   dependency). 100k iterations + 16-byte random salt.
 * - The legacy single-password gate (ADMIN_PASSWORD env / runtime config) still
 *   works and acts as the implicit super-admin. Once at least one User exists
 *   with role=admin, you can disable the env-password gate by deleting the env
 *   value — the new user takes over.
 */

const FILE = join(process.cwd(), "content", "data", "admin-users.json");

export interface AdminUser {
  id: string;
  email: string;        // unique, lowercase
  name: string;
  passwordHash: string; // "iter:salt-hex:hash-hex"
  role: AdminRole;
  /**
   * Resource keys the user can access. Empty array = use the role's defaults.
   * `["*"]` means every resource. Otherwise specific keys, e.g.
   * `["blog", "events", "testimonials"]` for a blog editor.
   */
  modules: string[];
  /** Optional explicit permission overrides. Empty = use role defaults. */
  permissionOverrides: Permission[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type SafeAdminUser = Omit<AdminUser, "passwordHash">;

// ── Password hashing ─────────────────────────────────────────────────────
const ITERATIONS = 100_000;
const KEYLEN = 32;
const DIGEST = "sha256";

export function hashPassword(plain: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(plain, salt, ITERATIONS, KEYLEN, DIGEST)
    .toString("hex");
  return `${ITERATIONS}:${salt}:${hash}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const [iterStr, salt, hash] = stored.split(":");
  if (!iterStr || !salt || !hash) return false;
  const iters = parseInt(iterStr, 10);
  if (Number.isNaN(iters) || iters < 1000) return false;
  const candidate = crypto
    .pbkdf2Sync(plain, salt, iters, KEYLEN, DIGEST)
    .toString("hex");
  return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(hash, "hex"));
}

// ── Persistence ──────────────────────────────────────────────────────────
async function loadAll(): Promise<AdminUser[]> {
  try {
    const txt = await fs.readFile(FILE, "utf-8");
    const arr = JSON.parse(txt);
    return Array.isArray(arr) ? (arr as AdminUser[]) : [];
  } catch {
    return [];
  }
}

async function saveAll(rows: AdminUser[]): Promise<void> {
  await fs.mkdir(join(process.cwd(), "content", "data"), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(rows, null, 2), "utf-8");
}

function toSafe(u: AdminUser): SafeAdminUser {
  // Strip the password hash before sending to the client / logs.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = u;
  return safe;
}

// ── CRUD ─────────────────────────────────────────────────────────────────
export async function listUsers(): Promise<SafeAdminUser[]> {
  const all = await loadAll();
  return all.map(toSafe).sort((a, b) => a.email.localeCompare(b.email));
}

export async function findUserByEmail(email: string): Promise<AdminUser | null> {
  const all = await loadAll();
  return all.find((u) => u.email.toLowerCase() === email.trim().toLowerCase()) ?? null;
}

export async function findUserById(id: string): Promise<AdminUser | null> {
  return (await loadAll()).find((u) => u.id === id) ?? null;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  role: AdminRole;
  modules?: string[];
  permissionOverrides?: Permission[];
  active?: boolean;
}

export async function createUser(input: CreateUserInput): Promise<{ ok: true; user: SafeAdminUser } | { ok: false; error: string }> {
  if (input.password.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  const all = await loadAll();
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, error: "Invalid email." };
  }
  if (all.some((u) => u.email.toLowerCase() === email)) {
    return { ok: false, error: "A user with that email already exists." };
  }
  const now = new Date().toISOString();
  const user: AdminUser = {
    id: "u-" + crypto.randomBytes(6).toString("hex"),
    email,
    name: input.name.trim(),
    passwordHash: hashPassword(input.password),
    role: input.role,
    modules: input.modules ?? ["*"],
    permissionOverrides: input.permissionOverrides ?? [],
    active: input.active ?? true,
    createdAt: now,
    updatedAt: now,
  };
  all.push(user);
  await saveAll(all);
  return { ok: true, user: toSafe(user) };
}

export interface UpdateUserInput {
  id: string;
  name?: string;
  role?: AdminRole;
  modules?: string[];
  permissionOverrides?: Permission[];
  active?: boolean;
  /** When set, replaces the password. */
  newPassword?: string;
}

export async function updateUser(
  input: UpdateUserInput,
): Promise<{ ok: true; user: SafeAdminUser } | { ok: false; error: string }> {
  const all = await loadAll();
  const i = all.findIndex((u) => u.id === input.id);
  if (i < 0) return { ok: false, error: "User not found." };
  const existing = all[i];
  if (input.newPassword && input.newPassword.length < 8) {
    return { ok: false, error: "Password must be at least 8 characters." };
  }
  const updated: AdminUser = {
    ...existing,
    name: input.name ?? existing.name,
    role: input.role ?? existing.role,
    modules: input.modules ?? existing.modules,
    permissionOverrides: input.permissionOverrides ?? existing.permissionOverrides,
    active: input.active ?? existing.active,
    passwordHash: input.newPassword ? hashPassword(input.newPassword) : existing.passwordHash,
    updatedAt: new Date().toISOString(),
  };
  all[i] = updated;
  await saveAll(all);
  return { ok: true, user: toSafe(updated) };
}

export async function deleteUser(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const all = await loadAll();
  const next = all.filter((u) => u.id !== id);
  if (next.length === all.length) return { ok: false, error: "User not found." };
  // Don't allow deleting the last admin — leaves no one with super-admin powers.
  const remainingAdmins = next.filter((u) => u.role === "admin" && u.active);
  if (remainingAdmins.length === 0 && all.find((u) => u.id === id)?.role === "admin") {
    return { ok: false, error: "Can't delete the last active admin." };
  }
  await saveAll(next);
  return { ok: true };
}

// ── Authentication helpers ───────────────────────────────────────────────
export async function authenticate(
  email: string,
  password: string,
): Promise<AdminUser | null> {
  const u = await findUserByEmail(email);
  if (!u || !u.active) return null;
  if (!verifyPassword(password, u.passwordHash)) return null;
  return u;
}

/** Compute the effective permission set for a user (role defaults + overrides). */
export function effectivePermissions(u: Pick<AdminUser, "role" | "permissionOverrides">): Permission[] {
  const fromRole = permissionsFor(u.role);
  const set = new Set<Permission>([...fromRole, ...(u.permissionOverrides ?? [])]);
  return Array.from(set);
}

/** Whether this user can edit the given CMS resource key (e.g. "blog", "courses"). */
export function canAccessModule(u: Pick<AdminUser, "modules">, resourceKey: string): boolean {
  if (!u.modules || u.modules.length === 0) return false;
  if (u.modules.includes("*")) return true;
  return u.modules.includes(resourceKey);
}
