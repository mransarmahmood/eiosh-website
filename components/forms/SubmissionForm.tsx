"use client";

import { useState } from "react";
import { Check, Send, Loader2 } from "lucide-react";
import { Input, Textarea, Select, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export interface SubmissionField {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "date" | "textarea" | "select";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  help?: string;
  wide?: boolean;
}

interface Props {
  endpoint: string;
  fields: SubmissionField[];
  submitLabel?: string;
  successTitle?: string;
  successMessage?: string;
}

// Generic public-form component used by /propose-course, /quotation, /admission.
// Posts to the given endpoint, validates required fields client-side, and shows
// a success panel when the server returns ok.
export function SubmissionForm({
  endpoint,
  fields,
  submitLabel = "Submit",
  successTitle = "Submission received.",
  successMessage = "Our team will be in touch within one business day.",
}: Props) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErrorMsg(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        setState("done");
      } else {
        setErrorMsg(body.error === "validation" ? "Please check the highlighted fields." : "Something went wrong. Please try again.");
        setState("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl bg-emerald-50 p-8 ring-1 ring-emerald-200 text-emerald-900">
        <div className="flex items-center gap-2 font-heading text-lg font-semibold">
          <Check className="h-5 w-5" /> {successTitle}
        </div>
        <p className="mt-2 text-sm text-emerald-800">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl bg-white p-6 sm:p-8 ring-1 ring-border shadow-elevated">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => {
          const wrap = f.wide || f.type === "textarea" ? "sm:col-span-2" : "";
          return (
            <div key={f.name} className={wrap}>
              <Label htmlFor={f.name}>
                {f.label}
                {f.required ? <span className="ml-1 text-red-500">*</span> : null}
              </Label>
              {f.type === "textarea" ? (
                <Textarea id={f.name} name={f.name} required={f.required} rows={4} placeholder={f.placeholder} />
              ) : f.type === "select" ? (
                <Select id={f.name} name={f.name} defaultValue="" required={f.required}>
                  <option value="" disabled>
                    {f.placeholder ?? "Select…"}
                  </option>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              ) : (
                <Input
                  id={f.name}
                  name={f.name}
                  type={f.type ?? "text"}
                  required={f.required}
                  placeholder={f.placeholder}
                  autoComplete={f.type === "email" ? "email" : f.type === "tel" ? "tel" : "off"}
                />
              )}
              {f.help ? <p className="mt-1 text-xs text-ink-soft">{f.help}</p> : null}
            </div>
          );
        })}
      </div>

      {state === "error" && errorMsg ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">{errorMsg}</p>
      ) : null}

      <label className="flex items-start gap-2 text-xs text-ink-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 rounded border-border text-cyan-600 focus:ring-cyan-500" />
        <span>
          I agree to the EIOSH <a href="/policies#privacy" className="underline">privacy policy</a> and consent to being contacted about this submission.
        </span>
      </label>

      <Button type="submit" variant="primary" size="lg" disabled={state === "loading"}>
        {state === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            {submitLabel} <Send className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  );
}
