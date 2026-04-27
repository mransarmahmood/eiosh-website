"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";
import { Input, Textarea, Select, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { categories } from "@/content/categories";
import { courses } from "@/content/courses";

interface Props {
  initialCourseSlug?: string;
  variant?: "contact" | "course" | "corporate" | "partnership";
}

// Single inquiry form powering /contact, course detail, corporate and partnership pages.
// Posts to /api/inquiry which can forward to your CRM webhook (see .env.example).
export function InquiryForm({ initialCourseSlug, variant = "contact" }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, variant }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl bg-emerald-50 p-8 text-emerald-900 ring-1 ring-emerald-200">
        <div className="flex items-center gap-2 font-heading text-lg font-semibold">
          <Check className="h-5 w-5" /> We'll be in touch shortly.
        </div>
        <p className="mt-2 text-sm text-emerald-800">
          An EIOSH advisor will contact you within one business day to confirm your details and next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-2xl bg-white p-6 sm:p-8 ring-1 ring-border shadow-elevated">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div>
          <Label htmlFor="email">Work email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone (with country code)</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+971 50 000 0000" />
        </div>
        <div>
          <Label htmlFor="company">Organisation</Label>
          <Input id="company" name="company" autoComplete="organization" />
        </div>
      </div>

      {variant === "course" ? (
        <input type="hidden" name="courseSlug" value={initialCourseSlug ?? ""} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">Area of interest</Label>
            <Select id="category" name="category" defaultValue="">
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="courseSlug">Course (optional)</Label>
            <Select id="courseSlug" name="courseSlug" defaultValue={initialCourseSlug ?? ""}>
              <option value="">I'd like a recommendation</option>
              {courses.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </Select>
          </div>
        </div>
      )}

      <div>
        <Label htmlFor="message">How can we help?</Label>
        <Textarea id="message" name="message" rows={5} placeholder="Tell us about your goals, team size or timeline." />
      </div>

      <label className="flex items-start gap-2 text-xs text-ink-muted">
        <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 rounded border-border text-cyan-600 focus:ring-cyan-500" />
        <span>
          I agree to the EIOSH <a href="/policies#privacy" className="underline">privacy policy</a> and consent to being
          contacted about my enquiry.
        </span>
      </label>

      {state === "error" ? (
        <p className="text-sm text-red-600">Something went wrong sending your enquiry. Please try again or email info@eiosh.com.</p>
      ) : null}

      <Button type="submit" variant="primary" size="lg" disabled={state === "loading"}>
        {state === "loading" ? "Sending…" : "Send enquiry"}
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
