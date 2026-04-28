import crypto from "node:crypto";

/**
 * EIOSH referral codes.
 *
 * - Each alumni / partner gets a stable code derived from a salted hash of
 *   their email. We don't store a separate "referrers" table — the email +
 *   the code are reversible-checkable (the salt is in env), and the
 *   enrolments ledger records `referrerCode` so payouts can be calculated.
 * - Default reward: 5% of the gross enrolment amount, paid as account credit.
 *   Override in env REFERRAL_REWARD_PERCENT.
 * - We never expose the email→code mapping publicly — the user gets to see
 *   their own code by signing in to /refer (uses the student session cookie).
 */

const SALT_ENV = "REFERRAL_CODE_SALT";

function salt(): string {
  return process.env[SALT_ENV] ?? "eiosh-default-salt-change-me";
}

/** Stable 8-char alphanumeric referral code for an email address. */
export function codeForEmail(email: string): string {
  const norm = email.trim().toLowerCase();
  const hash = crypto.createHash("sha256").update(norm + ":" + salt()).digest("hex");
  // Take the first 8 hex chars and convert to base36 for shorter codes.
  const num = BigInt("0x" + hash.slice(0, 12));
  return num.toString(36).toUpperCase().slice(0, 8).padStart(8, "0");
}

/** Reward fraction (0–1) the referrer earns on each successful enrolment. */
export function rewardPercent(): number {
  const env = parseFloat(process.env.REFERRAL_REWARD_PERCENT ?? "0.05");
  if (Number.isNaN(env) || env < 0 || env > 0.5) return 0.05;
  return env;
}

export function rewardForAmount(amount: number): number {
  return Math.round(amount * rewardPercent() * 100) / 100;
}

/** Build the public share URL for a course + referral code. */
export function shareUrl(courseSlug: string, refCode: string, baseUrl: string): string {
  const url = new URL(`/courses/${courseSlug}`, baseUrl);
  url.searchParams.set("ref", refCode);
  return url.toString();
}
