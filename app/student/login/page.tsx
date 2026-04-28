"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Loader2, AlertCircle } from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";

export default function StudentLoginPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErrorMsg(json.error ?? "Login failed");
        setState("error");
        return;
      }
      router.push("/student");
      router.refresh();
    } catch {
      setErrorMsg("Network error. Please retry.");
      setState("error");
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Student access"
        title="Sign in to your dashboard."
        description="Enter the email address you used when you enrolled. You'll see all your courses, payments, certificates and upcoming exams."
        breadcrumbs={[{ label: "Student", href: "/student" }, { label: "Sign in" }]}
        align="center"
      />
      <Section>
        <Container>
          <form
            onSubmit={onSubmit}
            className="mx-auto max-w-md space-y-4 rounded-2xl border border-border bg-white p-8 shadow-sm"
          >
            <label className="block">
              <span className="text-sm font-medium text-navy-900">Your email address</span>
              <div className="mt-1 flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 focus-within:border-cyan-500">
                <Mail className="h-4 w-4 text-ink-soft" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent outline-none placeholder:text-ink-soft"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            {errorMsg && (
              <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                <AlertCircle className="mt-0.5 h-4 w-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={state === "loading"}
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-navy-900 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:cursor-wait disabled:opacity-70"
            >
              {state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Continue
            </button>

            <p className="text-center text-xs text-ink-soft">
              No password yet — we use the same email you registered with. Course access lives in
              the LMS and is linked to your enrolment record.
            </p>
          </form>
        </Container>
      </Section>
    </>
  );
}
