import { promises as fs } from "node:fs";
import { join } from "node:path";

export interface Enrolment {
  id: string;
  courseSlug: string;
  courseTitle: string;
  amountPaid: number;
  currency: string;
  customerEmail: string;
  customerName?: string;
  paymentProvider: "stripe" | "paypal" | "jazzcash" | "easypaisa" | "bank-transfer";
  paymentRef: string;
  instalments: number;
  enrolledAt: string;
  status: "paid" | "pending" | "refunded";
  /** Set when the buyer arrived via a referral link (?ref=ABCD1234). */
  referrerCode?: string;
  /** Computed at enrolment time so payouts are stable even if the % changes later. */
  referralRewardAmount?: number;
}

const STORE = join(process.cwd(), "content", "data", "enrolments.jsonl");

/** Append-only ledger of paid enrolments. CMS reads this to build the admin list. */
export async function recordEnrolment(e: Enrolment): Promise<void> {
  await fs.mkdir(join(process.cwd(), "content", "data"), { recursive: true });
  await fs.appendFile(STORE, JSON.stringify(e) + "\n", "utf-8");
}

/** Read all enrolments — newest first. */
export async function listEnrolments(): Promise<Enrolment[]> {
  try {
    const text = await fs.readFile(STORE, "utf-8");
    const lines = text.split("\n").filter(Boolean);
    return lines
      .map((l) => {
        try {
          return JSON.parse(l) as Enrolment;
        } catch {
          return null;
        }
      })
      .filter((x): x is Enrolment => !!x)
      .sort((a, b) => Date.parse(b.enrolledAt) - Date.parse(a.enrolledAt));
  } catch {
    return [];
  }
}

/** Hand-off to the LMS so the learner gets immediate access after payment. */
export async function provisionLmsAccess(e: Enrolment): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.LMS_AUTO_ENROL_URL;
  const key = process.env.LMS_AUTO_ENROL_KEY;
  if (!url || !key) {
    // No LMS integration configured — treat as "deferred". Admin will enrol manually.
    return { ok: false, error: "LMS auto-enrolment not configured" };
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Api-Key": key },
      body: JSON.stringify({
        email: e.customerEmail,
        name: e.customerName,
        course: e.courseSlug,
        ref: e.paymentRef,
      }),
    });
    return { ok: res.ok, error: res.ok ? undefined : `LMS responded ${res.status}` };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
