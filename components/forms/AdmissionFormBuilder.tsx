"use client";

import { useRef, useState } from "react";
import { Check, Send, Loader2, UserCircle2, GraduationCap, Phone, Camera, X } from "lucide-react";
import { Input, Textarea, Select, Label } from "@/components/ui/Input";

interface CourseOption {
  id: string;
  title: string;
  cohortStart?: string;
}

export interface AdmissionFormProps {
  courses?: CourseOption[];
  cohortDates?: string[]; // ISO yyyy-mm-dd (future only), sorted
}

// Professional multi-section admission form. Posts to /api/submit/admission.
// Sections: Course & session · Personal details · Contact · Declaration.
export function AdmissionFormBuilder({ courses = [], cohortDates = [] }: AdmissionFormProps = {}) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  async function onPhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Photo must be under 5 MB.");
      return;
    }
    setPhotoUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload/admission-photo", { method: "POST", body: fd });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Upload failed.");
      setPhotoUrl(body.url);
    } catch (err: any) {
      setError(err?.message ?? "Photo upload failed.");
    } finally {
      setPhotoUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function clearPhoto() {
    setPhotoUrl("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setError(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    if (photoUrl) (data as Record<string, string>).photoUrl = photoUrl;
    try {
      const res = await fetch("/api/submit/admission", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) setState("done");
      else {
        setState("error");
        setError("Submission failed. Please check the form and try again.");
      }
    } catch {
      setState("error");
      setError("Network error. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-2xl bg-white p-10 text-center ring-1 ring-border shadow-elevated">
        <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="mt-4 font-heading text-2xl font-semibold text-navy-900">Admission submitted.</h3>
        <p className="mx-auto mt-3 max-w-lg text-ink-muted">
          Thank you — your application has been received. Our admissions team will email you within one business day
          with eligibility confirmation, cohort options and next steps.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="overflow-hidden rounded-2xl bg-white ring-1 ring-border shadow-elevated">
      {/* Branded header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-navy-950 via-navy-800 to-cyan-700 p-6 text-white">
        <div className="absolute inset-0 bg-grid-subtle [background-size:20px_20px] opacity-25" aria-hidden />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-cyan-200">
              EIOSH International
            </p>
            <h3 className="mt-2 font-heading text-2xl font-semibold">Admission Application Form</h3>
            <p className="mt-1 text-sm text-white/75">Build the skills to drive your career.</p>
          </div>
          <div className="rounded-xl bg-white/10 p-3 text-center ring-1 ring-white/20 backdrop-blur">
            <p className="text-[0.6rem] uppercase tracking-wider text-cyan-200">Form no.</p>
            <p className="mt-1 font-heading text-sm font-semibold">EIOSH-ADM-{new Date().getFullYear()}</p>
          </div>
        </div>
      </div>

      {/* ----- Section 1: Course & session ----- */}
      <FormSection
        number="01"
        icon={GraduationCap}
        title="Course & session"
        hint="Tell us which EIOSH programme you want to enrol in."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="courseApplied">Course applied for<span className="text-red-500 ml-1">*</span></Label>
            {courses.length > 0 ? (
              <Select id="courseApplied" name="courseApplied" required defaultValue="">
                <option value="" disabled>
                  — Select a course —
                </option>
                {courses.map((c) => (
                  <option key={c.id} value={c.title}>
                    {c.title}
                  </option>
                ))}
              </Select>
            ) : (
              <Input
                id="courseApplied"
                name="courseApplied"
                required
                placeholder="e.g. IOSH Managing Safely V5.0"
              />
            )}
          </div>
          <div>
            <Label htmlFor="session">Preferred session / intake</Label>
            <Input id="session" name="session" type="month" />
            <p className="mt-1 text-xs text-ink-soft">Choose the month you'd like to start.</p>
          </div>
          <div>
            <Label htmlFor="admissionDate">Preferred start date</Label>
            {cohortDates.length > 0 ? (
              <>
                <Select id="admissionDate" name="admissionDate" defaultValue="">
                  <option value="">— Any upcoming date —</option>
                  {cohortDates.map((d) => (
                    <option key={d} value={d}>
                      {new Date(d).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </option>
                  ))}
                </Select>
                <p className="mt-1 text-xs text-ink-soft">
                  Dates from the EIOSH schedule. Leave as "Any" if none fit.
                </p>
              </>
            ) : (
              <>
                <Input id="admissionDate" name="admissionDate" type="date" />
                <p className="mt-1 text-xs text-ink-soft">
                  No scheduled cohorts published — pick any date and we'll match you to the next intake.
                </p>
              </>
            )}
          </div>
        </div>
      </FormSection>

      {/* ----- Section 2: Personal details ----- */}
      <FormSection
        number="02"
        icon={UserCircle2}
        title="Personal details"
        hint="Enter your full legal name as it should appear on your certificate."
      >
        {/* Photo upload (passport-style) */}
        <div className="mb-6 flex items-start gap-4 rounded-xl bg-surface-subtle p-4 ring-1 ring-border">
          <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-dashed ring-border">
            {photoUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photoUrl} alt="Applicant photo" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={clearPhoto}
                  className="absolute right-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700 cursor-pointer"
                  aria-label="Remove photo"
                  title="Remove photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-ink-soft">
                <Camera className="h-6 w-6" />
                <span className="text-[0.6rem] uppercase tracking-wider">Photo</span>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Label htmlFor="photoFile">Passport-style photo</Label>
            <p className="mt-1 text-xs text-ink-muted">
              JPG, PNG or WEBP. Plain background, face clearly visible. Max 5 MB.
            </p>
            <input
              ref={fileRef}
              id="photoFile"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onPhotoChange}
              className="hidden"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={photoUploading}
                className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60 cursor-pointer"
              >
                {photoUploading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading…
                  </>
                ) : (
                  <>
                    <Camera className="h-3.5 w-3.5" /> {photoUrl ? "Replace photo" : "Upload photo"}
                  </>
                )}
              </button>
              {photoUrl ? (
                <span className="text-[0.7rem] text-emerald-700">Photo attached.</span>
              ) : (
                <span className="text-[0.7rem] text-ink-soft">Optional — recommended for your certificate.</span>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="title">Full name<span className="text-red-500 ml-1">*</span></Label>
            <Input id="title" name="title" required autoComplete="name" />
          </div>
          <div>
            <Label htmlFor="fatherName">Father's name</Label>
            <Input id="fatherName" name="fatherName" />
          </div>
          <div>
            <Label htmlFor="dob">Date of birth</Label>
            <Input id="dob" name="dob" type="date" />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select id="gender" name="gender" defaultValue="">
              <option value="" disabled>Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Input id="nationality" name="nationality" />
          </div>
          <div>
            <Label htmlFor="cnic">CNIC / Passport number</Label>
            <Input id="cnic" name="cnic" placeholder="e.g. 12345-1234567-1" />
          </div>
          <div>
            <Label htmlFor="religion">Religion</Label>
            <Input id="religion" name="religion" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="lastQualification">Qualification</Label>
            <Input
              id="lastQualification"
              name="lastQualification"
              placeholder="e.g. BSc Engineering — NED University — 2020"
            />
          </div>
        </div>
      </FormSection>

      {/* ----- Section 3: Contact ----- */}
      <FormSection
        number="03"
        icon={Phone}
        title="Contact information"
        hint="We'll confirm eligibility and cohort options via email within one business day."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="email">Email<span className="text-red-500 ml-1">*</span></Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div>
            <Label htmlFor="mobile">Mobile (with country code)<span className="text-red-500 ml-1">*</span></Label>
            <Input id="mobile" name="mobile" type="tel" required autoComplete="tel" placeholder="+92 300 000 0000" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="company">Employer / organisation</Label>
            <Input id="company" name="company" />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="notes">Anything else we should know?</Label>
            <Textarea id="notes" name="notes" rows={3} placeholder="Prior HSE/compliance experience, special requirements, etc." />
          </div>
        </div>
      </FormSection>

      {/* ----- Section 5: Declaration ----- */}
      <div className="border-t border-border bg-surface-subtle p-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Declaration</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            I declare that the information provided above is true and correct to the best of my knowledge. I understand
            that providing false information may lead to cancellation of my admission at any stage. I agree to abide by
            the rules and regulations of EIOSH International and the relevant awarding body.
          </p>

          <label className="mt-5 flex items-start gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-1 h-4 w-4 rounded border-border text-cyan-600 focus:ring-cyan-500"
            />
            <span>
              I agree to the EIOSH <a href="/policies#privacy" className="underline">privacy policy</a> and consent to
              being contacted about this application.
            </span>
          </label>

          {error ? (
            <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">{error}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-ink-soft">
              Date: {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
            </p>
            <button
              type="submit"
              disabled={state === "loading"}
              className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60 cursor-pointer"
            >
              {state === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  Submit admission application <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function FormSection({
  number,
  icon: Icon,
  title,
  hint,
  children,
}: {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border p-8">
      <div className="mb-6 flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-navy-900 to-cyan-600 font-heading text-sm font-bold text-white shadow-elevated">
          {number}
        </span>
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-navy-900">
            <Icon className="h-5 w-5 text-cyan-600" />
            {title}
          </h3>
          {hint ? <p className="mt-1 text-sm text-ink-muted">{hint}</p> : null}
        </div>
      </div>
      {children}
    </div>
  );
}
