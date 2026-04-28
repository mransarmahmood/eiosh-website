import "server-only";
import { promises as fs } from "node:fs";
import { join } from "node:path";

/**
 * Runtime-editable configuration. Lets the admin set API keys / provider
 * choices from /admin/settings without editing `.env.local` and restarting.
 *
 * Lookup order for any key:
 *   1. runtime-config.json (admin-set, lives in content/data/, gitignored)
 *   2. process.env (developer default)
 *   3. fallback string from caller
 *
 * The file is plain JSON. We never log its values.
 */

export const SETTINGS_KEYS = [
  "AI_PROVIDER",
  "AI_API_KEY",
  "AI_MODEL",
  "AI_BASE_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  "STUDENT_SESSION_SECRET",
  "REFERRAL_CODE_SALT",
  "REFERRAL_REWARD_PERCENT",
  "NEWSLETTER_PROVIDER",
  "NEWSLETTER_API_KEY",
  "MAILCHIMP_LIST_ID",
  "INQUIRY_WEBHOOK_URL",
  "LMS_AUTO_ENROL_URL",
  "LMS_AUTO_ENROL_KEY",
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "MAIL_PROVIDER",
  "MAIL_API_KEY",
  "MAIL_FROM_ADDRESS",
  "MAIL_FROM_NAME",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_WHATSAPP_FROM",
] as const;

export type SettingKey = typeof SETTINGS_KEYS[number];

const FILE = join(process.cwd(), "content", "data", "runtime-config.json");

let cache: Record<string, string> | null = null;
let cacheLoadedAt = 0;
const CACHE_TTL_MS = 5_000;

async function loadFile(): Promise<Record<string, string>> {
  if (cache && Date.now() - cacheLoadedAt < CACHE_TTL_MS) return cache;
  try {
    const txt = await fs.readFile(FILE, "utf-8");
    const obj = JSON.parse(txt);
    cache = obj && typeof obj === "object" ? (obj as Record<string, string>) : {};
  } catch {
    cache = {};
  }
  cacheLoadedAt = Date.now();
  return cache;
}

/** Server-side getter. Reads runtime config first, then env. */
export async function getSetting(key: SettingKey, fallback = ""): Promise<string> {
  const file = await loadFile();
  if (file[key] != null && file[key] !== "") return String(file[key]);
  return process.env[key] ?? fallback;
}

/** Synchronous variant — useful in modules already loaded into memory. */
export function getSettingSync(key: SettingKey, fallback = ""): string {
  if (cache && cache[key] != null && cache[key] !== "") return String(cache[key]);
  return process.env[key] ?? fallback;
}

/** Trigger a refresh on next read. */
export function invalidateSettingsCache() {
  cache = null;
  cacheLoadedAt = 0;
}

/** Read all settings (for the admin form). Sensitive values are masked. */
export async function readAllSettings(): Promise<
  { key: SettingKey; value: string; isSet: boolean; isSensitive: boolean }[]
> {
  const file = await loadFile();
  return SETTINGS_KEYS.map((key) => {
    const fileVal = file[key] ?? "";
    const envVal = process.env[key] ?? "";
    const value = fileVal || envVal;
    return {
      key,
      value,
      isSet: !!value,
      isSensitive: /KEY|SECRET|TOKEN|PASSWORD|SALT/i.test(key),
    };
  });
}

export async function writeSettings(updates: Partial<Record<SettingKey, string>>) {
  const current = await loadFile();
  const next = { ...current };
  for (const [k, v] of Object.entries(updates)) {
    if (v == null || v === "") {
      delete next[k];
    } else {
      next[k] = v;
    }
  }
  await fs.mkdir(join(process.cwd(), "content", "data"), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(next, null, 2), "utf-8");
  invalidateSettingsCache();
}
