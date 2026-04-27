"use client";

import { useState } from "react";
import { Search, ShieldCheck, ShieldAlert, Loader2 } from "lucide-react";
import { Input, Label } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

type Record = {
  holder: string;
  certificateNumber: string;
  registrationNumber: string | null;
  course: string;
  issueDate: string | null;
  expiryDate: string | null;
  company: string | null;
};

type Result =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "valid"; record: Record }
  | { kind: "not-found" }
  | { kind: "name-mismatch" }
  | { kind: "error"; message: string };

export function CertificateVerifyForm() {
  const [result, setResult] = useState<Result>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult({ kind: "loading" });
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/verify-certificate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult({ kind: "error", message: body.message ?? "Verification failed." });
        return;
      }
      if (body.kind === "valid") setResult({ kind: "valid", record: body.record });
      else if (body.kind === "name-mismatch") setResult({ kind: "name-mismatch" });
      else setResult({ kind: "not-found" });
    } catch {
      setResult({ kind: "error", message: "Network error." });
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <form
        onSubmit={onSubmit}
        className="lg:col-span-3 grid gap-4 rounded-2xl bg-white p-8 ring-1 ring-border shadow-elevated"
      >
        <div>
          <Label htmlFor="reference">Certificate reference</Label>
          <Input id="reference" name="reference" placeholder="e.g. 95034 or EIOSH-95034" required />
          <p className="mt-1 text-xs text-ink-soft">
            Printed on every EIOSH certificate, next to the QR code. You can enter the raw certificate number or the full reference.
          </p>
        </div>
        <div>
          <Label htmlFor="holder">Holder name (any part)</Label>
          <Input id="holder" name="holder" placeholder="e.g. Sandro or Villacencio" autoComplete="family-name" />
          <p className="mt-1 text-xs text-ink-soft">Optional — we'll cross-check if provided.</p>
        </div>
        <Button type="submit" variant="primary" size="lg" disabled={result.kind === "loading"}>
          {result.kind === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
            </>
          ) : (
            <>
              Verify certificate <Search className="h-4 w-4" />
            </>
          )}
        </Button>
      </form>

      <div className="lg:col-span-2">
        {result.kind === "valid" ? (
          <div className="h-full rounded-2xl bg-emerald-50 p-6 ring-1 ring-emerald-200 text-emerald-900">
            <ShieldCheck className="h-7 w-7" />
            <p className="mt-3 text-lg font-heading font-semibold">Valid certificate</p>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Holder" value={result.record.holder} />
              <Row label="Course" value={result.record.course} />
              <Row label="Certificate #" value={result.record.certificateNumber} />
              {result.record.registrationNumber ? (
                <Row label="Registration #" value={result.record.registrationNumber} />
              ) : null}
              {result.record.issueDate ? <Row label="Issued" value={formatDate(result.record.issueDate)} /> : null}
              {result.record.expiryDate ? <Row label="Expires" value={formatDate(result.record.expiryDate)} /> : null}
              {result.record.company && result.record.company !== result.record.certificateNumber ? (
                <Row label="Organisation" value={result.record.company} />
              ) : null}
            </dl>
          </div>
        ) : result.kind === "not-found" ? (
          <div className="h-full rounded-2xl bg-red-50 p-6 ring-1 ring-red-200 text-red-900">
            <ShieldAlert className="h-7 w-7" />
            <p className="mt-3 text-lg font-heading font-semibold">No certificate matched</p>
            <p className="mt-2 text-sm text-red-800/80">
              Please double-check the reference. If it was issued before 2022, contact our registrar at
              registrar@eiosh.com.
            </p>
          </div>
        ) : result.kind === "name-mismatch" ? (
          <div className="h-full rounded-2xl bg-amber-50 p-6 ring-1 ring-amber-200 text-amber-900">
            <ShieldAlert className="h-7 w-7" />
            <p className="mt-3 text-lg font-heading font-semibold">Reference exists, name doesn't match</p>
            <p className="mt-2 text-sm text-amber-800/80">
              We found a certificate with that reference but the holder name you provided doesn't match our records. If
              you're the certificate holder, try submitting without a name, or use the spelling exactly as it appears on
              your certificate.
            </p>
          </div>
        ) : result.kind === "error" ? (
          <div className="h-full rounded-2xl bg-red-50 p-6 ring-1 ring-red-200 text-red-900">
            <ShieldAlert className="h-7 w-7" />
            <p className="mt-3 text-lg font-heading font-semibold">Verification failed</p>
            <p className="mt-2 text-sm">{result.message}</p>
          </div>
        ) : (
          <div className="h-full rounded-2xl bg-surface-subtle p-6 ring-1 ring-border">
            <ShieldCheck className="h-7 w-7 text-cyan-600" />
            <p className="mt-3 font-heading font-semibold text-navy-900">Independent verification</p>
            <p className="mt-2 text-sm text-ink-muted">
              Every EIOSH certificate is issued with a unique reference and QR code. Our registry holds{" "}
              <strong>681+</strong> verifiable certificates. Employers and awarding bodies can verify credentials here
              without contacting our team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-emerald-800/80">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
