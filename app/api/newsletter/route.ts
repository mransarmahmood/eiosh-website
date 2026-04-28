import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

const Body = z.object({
  email: z.string().trim().email("Invalid email address"),
  source: z.string().max(120).optional(),
});

const STORE = join(process.cwd(), "content", "data", "newsletter-subscribers.jsonl");

async function appendSubscriber(line: string) {
  await fs.mkdir(join(process.cwd(), "content", "data"), { recursive: true });
  await fs.appendFile(STORE, line + "\n", "utf-8");
}

async function pushToMailchimp(email: string): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.NEWSLETTER_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  if (!apiKey || !listId) return { ok: false, error: "Mailchimp not configured" };

  // API key looks like "abc123-us21" — the suffix is the dc.
  const dc = apiKey.includes("-") ? apiKey.split("-").pop() : null;
  if (!dc) return { ok: false, error: "Invalid Mailchimp API key (no dc)" };

  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email_address: email, status: "subscribed" }),
  });
  if (res.ok) return { ok: true };
  const text = await res.text().catch(() => "");
  // 400 with title "Member Exists" — already subscribed; treat as success.
  if (text.includes("Member Exists")) return { ok: true };
  return { ok: false, error: `Mailchimp ${res.status}: ${text.slice(0, 200)}` };
}

async function pushToWebhook(email: string, source: string | undefined): Promise<{ ok: boolean }> {
  const url = process.env.INQUIRY_WEBHOOK_URL;
  if (!url) return { ok: false };
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "newsletter", email, source, at: new Date().toISOString() }),
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Body.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  }

  const { email, source } = parsed.data;
  const at = new Date().toISOString();

  // Always persist locally (a one-line JSON record per subscriber).
  try {
    await appendSubscriber(JSON.stringify({ email, source: source ?? null, at }));
  } catch (e) {
    // Log but don't fail the request — we still want to accept the subscription.
    console.warn("[newsletter] local store failed:", e);
  }

  // Best-effort fan-out to Mailchimp + webhook (errors don't block the user).
  const provider = (process.env.NEWSLETTER_PROVIDER ?? "").toLowerCase();
  const results: Record<string, { ok: boolean; error?: string }> = {};
  if (provider === "mailchimp") {
    results.mailchimp = await pushToMailchimp(email);
  }
  results.webhook = await pushToWebhook(email, source);

  return NextResponse.json({ ok: true, providers: results });
}
