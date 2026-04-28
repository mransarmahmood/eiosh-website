import { NextResponse } from "next/server";
import { z } from "zod";
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { notifyChannels } from "@/lib/notifications";
import { getSetting } from "@/lib/runtime-config";

// Inquiry endpoint. Forwards to INQUIRY_WEBHOOK_URL when set, and ALWAYS
// persists a copy to content/data/inquiries.jsonl so no lead is lost if the
// webhook is down or misconfigured. The admin can see the file count/read it
// out of band until a full CRM integration is wired in.

const Schema = z.object({
  name: z.string().min(2, "Please provide your full name"),
  email: z.string().email("Please provide a valid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  category: z.string().optional(),
  courseSlug: z.string().optional(),
  message: z.string().optional(),
  variant: z.enum(["contact", "course", "corporate", "partnership"]).default("contact"),
  consent: z.union([z.string(), z.boolean()]).optional(),
});

const LOG_PATH = join(process.cwd(), "content", "data", "inquiries.jsonl");

async function persistLocally(entry: Record<string, unknown>) {
  const line = JSON.stringify(entry) + "\n";
  try {
    await fs.appendFile(LOG_PATH, line, "utf-8");
  } catch (err) {
    console.error("[inquiry] failed to append local log", err);
  }
}

export async function POST(req: Request) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = Schema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const entry = {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
    source: req.headers.get("referer") ?? null,
    userAgent: req.headers.get("user-agent") ?? null,
  };

  // Always keep a local copy.
  await persistLocally(entry);

  // Optional webhook forward.
  const webhook = process.env.INQUIRY_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(entry),
      });
      if (!res.ok) {
        console.warn(`[inquiry] webhook returned ${res.status}`);
      }
    } catch (err) {
      console.error("[inquiry] webhook failed", err);
    }
  }

  // Best-effort transactional notifications.
  // 1. Auto-reply to the prospect, 2. Internal alert to the admissions inbox.
  const adminEmail = await getSetting("ADMIN_EMAIL", "info@eiosh.com");
  const adminWhatsApp = await getSetting("ADMIN_WHATSAPP_TO");
  const detail = `${parsed.data.variant} · ${parsed.data.name} (${parsed.data.email})${parsed.data.courseSlug ? ` · ${parsed.data.courseSlug}` : ""}\n\n${parsed.data.message ?? ""}`;
  // Don't await — we don't want a slow SMTP to delay the user's response.
  notifyChannels({
    emailTo: parsed.data.email,
    subject: "We've received your enquiry — EIOSH International",
    body: `Hi ${parsed.data.name.split(" ")[0]},\n\nThanks for reaching out. We've received your enquiry and an EIOSH advisor will be in touch within one business day.\n\n— EIOSH admissions`,
  }).catch((e) => console.warn("[inquiry] auto-reply failed", e));
  notifyChannels({
    emailTo: adminEmail,
    whatsappTo: adminWhatsApp || undefined,
    subject: `New enquiry — ${parsed.data.variant}`,
    body: `New enquiry received:\n\n${detail}`,
  }).catch((e) => console.warn("[inquiry] admin notify failed", e));

  return NextResponse.json({ ok: true });
}
