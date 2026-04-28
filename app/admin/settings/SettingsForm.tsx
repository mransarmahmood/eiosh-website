"use client";

import { useState } from "react";
import { Save, Eye, EyeOff, Check } from "lucide-react";

interface Setting {
  key: string;
  value: string;
  isSet: boolean;
  isSensitive: boolean;
  placeholder?: string;
}

const GROUPS: { title: string; description: string; keys: string[] }[] = [
  {
    title: "AI assistant",
    description: "Provider used by /api/ai/chat and /api/ai/generate.",
    keys: ["AI_PROVIDER", "AI_API_KEY", "AI_MODEL", "AI_BASE_URL"],
  },
  {
    title: "Payments (Stripe)",
    description:
      "Card checkout. Get keys at https://dashboard.stripe.com/apikeys. Webhook URL: https://eiosh.com/api/webhooks/stripe (events: checkout.session.completed, charge.refunded).",
    keys: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"],
  },
  {
    title: "Student session + referral",
    description: "Random secrets that sign student session cookies and stabilise referral codes.",
    keys: ["STUDENT_SESSION_SECRET", "REFERRAL_CODE_SALT", "REFERRAL_REWARD_PERCENT"],
  },
  {
    title: "Email + newsletter",
    description: "Mailchimp / SendGrid / similar. Falls back to local-only newsletter ledger.",
    keys: [
      "NEWSLETTER_PROVIDER",
      "NEWSLETTER_API_KEY",
      "MAILCHIMP_LIST_ID",
      "MAIL_PROVIDER",
      "MAIL_API_KEY",
      "MAIL_FROM_ADDRESS",
      "MAIL_FROM_NAME",
      "INQUIRY_WEBHOOK_URL",
    ],
  },
  {
    title: "LMS auto-enrolment",
    description: "Optional. When set, paid enrolments POST here so the LMS grants access immediately.",
    keys: ["LMS_AUTO_ENROL_URL", "LMS_AUTO_ENROL_KEY"],
  },
  {
    title: "WhatsApp / Twilio",
    description: "Send WhatsApp confirmations + reminders.",
    keys: ["TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN", "TWILIO_WHATSAPP_FROM"],
  },
  {
    title: "Admin login",
    description: "Password for the /admin gate. ⚠️ Setting this here also updates the gate.",
    keys: ["ADMIN_EMAIL", "ADMIN_PASSWORD"],
  },
];

export function SettingsForm({ initial }: { initial: Setting[] }) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(initial.map((s) => [s.key, ""])),
  );
  const [reveal, setReveal] = useState<Record<string, boolean>>({});
  const [state, setState] = useState<"idle" | "loading" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const initialMap = Object.fromEntries(initial.map((s) => [s.key, s]));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");
    // Only send keys the user actually typed into. Empty inputs = "leave as-is".
    const payload: Record<string, string> = {};
    for (const [k, v] of Object.entries(values)) {
      if (v.trim() !== "") payload[k] = v;
    }
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        setErrorMsg("Save failed.");
        setState("error");
        return;
      }
      setState("saved");
      setValues((cur) => Object.fromEntries(Object.keys(cur).map((k) => [k, ""])));
      setTimeout(() => setState("idle"), 2200);
    } catch {
      setErrorMsg("Network error.");
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {GROUPS.map((g) => (
        <fieldset
          key={g.title}
          className="rounded-2xl border border-border bg-white p-6 shadow-sm"
        >
          <legend className="px-2 text-base font-semibold text-navy-900">{g.title}</legend>
          <p className="mb-4 text-xs text-ink-soft">{g.description}</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {g.keys.map((key) => {
              const meta = initialMap[key];
              if (!meta) return null;
              const isVisible = reveal[key] || !meta.isSensitive;
              return (
                <label key={key} className="block">
                  <span className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-ink-soft">
                    <span>{key}</span>
                    {meta.isSet && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[0.65rem] text-green-700">
                        <Check className="h-3 w-3" /> set
                      </span>
                    )}
                  </span>
                  <span className="mt-1 flex items-stretch gap-2">
                    <input
                      type={isVisible ? "text" : "password"}
                      value={values[key] ?? ""}
                      onChange={(e) => setValues((c) => ({ ...c, [key]: e.target.value }))}
                      placeholder={meta.placeholder || (meta.value ? meta.value : `Set ${key}`)}
                      className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none"
                    />
                    {meta.isSensitive && (
                      <button
                        type="button"
                        onClick={() => setReveal((c) => ({ ...c, [key]: !c[key] }))}
                        className="rounded-lg border border-border px-2 text-ink-soft hover:bg-navy-50"
                        aria-label={isVisible ? "Hide value" : "Reveal typed value"}
                        title={isVisible ? "Hide" : "Reveal"}
                      >
                        {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="sticky bottom-0 -mx-6 flex items-center gap-4 border-t border-border bg-white/90 px-6 py-4 backdrop-blur sm:mx-0 sm:rounded-2xl">
        <button
          type="submit"
          disabled={state === "loading"}
          className="inline-flex h-10 items-center gap-2 rounded-lg bg-navy-900 px-5 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:cursor-wait disabled:opacity-70"
        >
          <Save className="h-4 w-4" /> Save changes
        </button>
        {state === "saved" && (
          <span className="inline-flex items-center gap-1 text-sm text-green-700">
            <Check className="h-4 w-4" /> Saved
          </span>
        )}
        {state === "error" && (
          <span className="text-sm text-red-700">{errorMsg}</span>
        )}
        <span className="text-xs text-ink-soft">
          Empty inputs are ignored — sensitive values stay hidden until you type a new one.
        </span>
      </div>
    </form>
  );
}
