import { getSetting } from "@/lib/runtime-config";

/**
 * Best-effort outbound notifications. Anything that fails is logged but never
 * blocks the user-facing request (we never want a missing API key to hide an
 * already-completed enrolment from the user).
 */

export interface SendChannelResult {
  channel: "email" | "whatsapp" | "sms";
  ok: boolean;
  error?: string;
  skipped?: boolean;
}

/** Send a transactional email via the configured provider (Resend / SendGrid / Mailgun). */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<SendChannelResult> {
  const provider = (await getSetting("MAIL_PROVIDER")).toLowerCase();
  const apiKey = await getSetting("MAIL_API_KEY");
  const fromAddress = await getSetting("MAIL_FROM_ADDRESS", "no-reply@eiosh.com");
  const fromName = await getSetting("MAIL_FROM_NAME", "EIOSH International");

  if (!provider || !apiKey) return { channel: "email", ok: false, skipped: true };

  try {
    if (provider === "resend") {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: `${fromName} <${fromAddress}>`,
          to: opts.to,
          subject: opts.subject,
          text: opts.text,
          html: opts.html,
        }),
      });
      return { channel: "email", ok: res.ok, error: res.ok ? undefined : await res.text() };
    }
    if (provider === "sendgrid") {
      const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: opts.to }] }],
          from: { email: fromAddress, name: fromName },
          subject: opts.subject,
          content: [
            { type: "text/plain", value: opts.text },
            ...(opts.html ? [{ type: "text/html", value: opts.html }] : []),
          ],
        }),
      });
      return { channel: "email", ok: res.ok, error: res.ok ? undefined : `${res.status}` };
    }
    return { channel: "email", ok: false, error: `Unknown MAIL_PROVIDER: ${provider}` };
  } catch (err) {
    return { channel: "email", ok: false, error: (err as Error).message };
  }
}

/** Send a WhatsApp message via Twilio. `to` can be a plain number — we add `whatsapp:` automatically. */
export async function sendWhatsApp(opts: {
  to: string;
  body: string;
}): Promise<SendChannelResult> {
  const accountSid = await getSetting("TWILIO_ACCOUNT_SID");
  const authToken = await getSetting("TWILIO_AUTH_TOKEN");
  const from = await getSetting("TWILIO_WHATSAPP_FROM");

  if (!accountSid || !authToken || !from) {
    return { channel: "whatsapp", ok: false, skipped: true };
  }

  const toNumber = opts.to.startsWith("whatsapp:") ? opts.to : `whatsapp:${opts.to}`;
  const fromNumber = from.startsWith("whatsapp:") ? from : `whatsapp:${from}`;

  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: toNumber, From: fromNumber, Body: opts.body }).toString(),
      },
    );
    return {
      channel: "whatsapp",
      ok: res.ok,
      error: res.ok ? undefined : (await res.text()).slice(0, 200),
    };
  } catch (err) {
    return { channel: "whatsapp", ok: false, error: (err as Error).message };
  }
}

/** Convenience wrapper to send the same content to email + WhatsApp in parallel. */
export async function notifyChannels(opts: {
  emailTo?: string;
  whatsappTo?: string;
  subject: string;
  body: string;
  html?: string;
}): Promise<SendChannelResult[]> {
  const tasks: Promise<SendChannelResult>[] = [];
  if (opts.emailTo) tasks.push(sendEmail({ to: opts.emailTo, subject: opts.subject, text: opts.body, html: opts.html }));
  if (opts.whatsappTo) tasks.push(sendWhatsApp({ to: opts.whatsappTo, body: opts.body }));
  return Promise.all(tasks);
}
