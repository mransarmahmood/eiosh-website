"use client";

import { formatDate } from "@/lib/utils";

interface Props {
  record: Record<string, any>;
  id: string;
}

// Formal admission form rendered as an A4 document — matches the classic
// EIOSH / institute admission form layout shown in the reference: branded
// header band, photo box top-right, numbered form rows, signatures.

export function AdmissionFormDocument({ record, id }: Props) {
  const admissionNumber = record.admissionNumber || `EIOSH-ADM-${id.slice(-6).toUpperCase()}`;

  // Helper: only show if it actually looks like a plausible value for the label
  // (fixes the legacy/migrated data where extra_field_* slots held different
  // meanings across records — e.g. an old "nationality" cell now holding a date).
  const looksLikeDate = (v: string) => /^\d{4}-\d{2}-\d{2}/.test(v);
  const looksLikeEmail = (v: string) => /@/.test(v);
  const safe = (v: any) => (v == null ? "" : String(v).trim());

  const rawEmail = safe(record.email);
  const emailValue = looksLikeEmail(rawEmail) ? rawEmail : "";
  const rawNat = safe(record.nationality);
  const nationalityValue = looksLikeDate(rawNat) ? "" : rawNat; // old data had DOB here
  const rawCompany = safe(record.company);
  const companyValue = looksLikeDate(rawCompany) ? "" : rawCompany;
  const dobRaw = safe(record.dob);
  const dobValue = dobRaw && looksLikeDate(dobRaw) ? formatDate(dobRaw) : "";
  const qualificationValue =
    safe(record.lastQualification) ||
    safe(record.qualification) ||
    [safe(record.qualificationInstitute), safe(record.qualificationYear)].filter(Boolean).join(" · ");

  const rows: Array<{ label: string; value: string; second?: { label: string; value: string } }> = [
    { label: "Applicant's name", value: safe(record.title) },
    { label: "Father's name", value: safe(record.fatherName) },
    {
      label: "Date of birth",
      value: dobValue,
      second: { label: "Gender", value: safe(record.gender) },
    },
    {
      label: "Nationality",
      value: nationalityValue,
      second: { label: "Religion", value: safe(record.religion) },
    },
    { label: "CNIC / Passport", value: safe(record.cnic) },
    {
      label: "Email",
      value: emailValue,
      second: { label: "Mobile", value: safe(record.mobile) },
    },
    {
      label: "Employer / organisation",
      value: companyValue,
      second: { label: "Qualification", value: qualificationValue },
    },
  ];

  return (
    <div className="eiosh-adm-doc relative mx-auto w-full max-w-[820px] overflow-hidden rounded-xl bg-white shadow-[0_16px_40px_-12px_rgba(10,31,68,0.25)]">
      {/* Top navy band with cyan accent corner (letterhead) */}
      <div className="eiosh-adm-doc__top-band" aria-hidden />
      <div className="eiosh-adm-doc__corner-accent" aria-hidden />

      {/* Header */}
      <header className="relative z-10 flex items-start justify-between gap-6 px-10 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <Mark />
          <div>
            <p className="font-heading text-[1.7rem] font-bold leading-none tracking-tight text-navy-900">EIOSH</p>
            <p className="font-heading text-[0.75rem] font-semibold tracking-[0.3em] text-navy-900">INTERNATIONAL</p>
            <p className="mt-1 text-[0.6rem] font-semibold tracking-wider text-cyan-600">
              Promoting Safety Worldwide
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cyan-700">Form</p>
          <p className="mt-1 font-heading text-3xl font-bold tracking-tight text-navy-900">ADMISSION</p>
          <p className="mt-2 inline-block rounded-md border-2 border-navy-900 px-3 py-1 text-[0.7rem] font-semibold text-navy-900">
            #{admissionNumber}
          </p>
        </div>
      </header>

      {/* Title band */}
      <div className="relative z-10 mx-10 mb-6 rounded-md bg-navy-900 px-5 py-2.5 text-center text-white shadow-elevated">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-cyan-300">
          Session {record.session || new Date().getFullYear()}
        </p>
        <p className="mt-1 font-heading text-sm font-semibold">
          Admission Application Form — {record.courseApplied || "EIOSH Programme"}
        </p>
      </div>

      {/* Photo + applicant snapshot */}
      <div className="relative z-10 grid grid-cols-[1fr_auto] gap-6 px-10">
        <div>
          <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-cyan-700">Course applied for</p>
          <p className="mt-1.5 font-heading text-xl font-bold text-navy-900">{record.courseApplied || "—"}</p>
          <p className="mt-4 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-cyan-700">Applicant name</p>
          <p className="mt-1.5 font-heading text-lg font-semibold text-navy-900">{record.title || "—"}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-[0.7rem] font-semibold text-cyan-800 ring-1 ring-inset ring-cyan-200">
            Received:{" "}
            {record.receivedAt
              ? new Date(record.receivedAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </div>
        </div>
        <PhotoBox src={record.photoUrl} />
      </div>

      {/* Personal details numbered rows */}
      <section className="relative z-10 mt-6 px-10">
        <SectionLabel number="A" title="Personal details" />
        <dl className="mt-3 space-y-0 overflow-hidden rounded-lg border-2 border-navy-900 bg-white">
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={`grid ${r.second ? "grid-cols-2" : "grid-cols-1"} divide-x divide-navy-900 ${
                i > 0 ? "border-t border-navy-900" : ""
              }`}
            >
              <FormRow index={i + 1} label={r.label} value={r.value} />
              {r.second ? (
                <FormRow index={i + 1} label={r.second.label} value={r.second.value} sub />
              ) : null}
            </div>
          ))}
        </dl>
      </section>

      {record.notes ? (
        <section className="relative z-10 mt-6 px-10">
          <SectionLabel number="B" title="Additional notes" />
          <div className="mt-3 rounded-lg border-2 border-navy-900 bg-white p-3 text-sm text-ink">
            <p className="whitespace-pre-wrap leading-relaxed">{record.notes}</p>
          </div>
        </section>
      ) : null}

      {/* Declaration */}
      <section className="relative z-10 mt-6 px-10">
        <SectionLabel number={record.notes ? "C" : "B"} title="Declaration" />
        <p className="mt-3 text-[11px] leading-relaxed text-ink-muted">
          I declare that the information provided above is true and correct to the best of my knowledge. I understand
          that providing false information may lead to cancellation of my admission at any stage. I agree to abide by
          the rules and regulations of EIOSH International and the relevant awarding body.
        </p>
      </section>

      {/* Signatures */}
      <section className="relative z-10 mt-8 grid grid-cols-2 gap-10 px-10">
        <div>
          <div className="mt-8 border-t border-navy-900 pt-2">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-navy-900">
              Applicant signature
            </p>
            <p className="mt-0.5 text-[10px] text-ink-muted">Date: _______________</p>
          </div>
        </div>
        <div>
          <div className="mt-8 border-t border-navy-900 pt-2 text-right">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-navy-900">
              EIOSH admissions officer
            </p>
            <p className="mt-0.5 text-[10px] text-ink-muted">For office use only</p>
          </div>
        </div>
      </section>

      {/* Footer ribbon */}
      <div className="eiosh-adm-doc__footer relative z-10 mt-8">
        <div className="flex flex-wrap items-center justify-between gap-3 px-10 py-4 text-[0.7rem] text-white">
          <span>Office #7, 2nd Floor, Royal Arcade, Lahore, Pakistan</span>
          <span>+92 300 458 0231</span>
          <span>info@eiosh.com · eiosh.com</span>
        </div>
      </div>

      <style>{`
        .eiosh-adm-doc {
          background:
            radial-gradient(ellipse at top right, rgba(31,182,224,0.06) 0%, transparent 50%),
            linear-gradient(180deg, #F3F9FD 0%, #FFFFFF 15%, #FFFFFF 85%, #EAF5FB 100%);
          min-height: 1123px;
          font-family: "Source Sans 3", system-ui, sans-serif;
        }
        .eiosh-adm-doc__top-band {
          position: absolute; top: 0; left: 0; right: 0;
          height: 8px;
          background: linear-gradient(90deg, #0A1F44 0%, #12295C 50%, #1FB6E0 100%);
          z-index: 2;
        }
        .eiosh-adm-doc__corner-accent {
          position: absolute; top: 8px; right: 0;
          width: 160px; height: 60px;
          background: linear-gradient(90deg, transparent, #1FB6E0 60%, #0A1F44 100%);
          border-bottom-left-radius: 80px;
          z-index: 2;
        }
        .eiosh-adm-doc__footer {
          background: linear-gradient(90deg, #06142E 0%, #0A1F44 50%, #12295C 100%);
        }
        @media print {
          @page { size: A4; margin: 0; }
          .eiosh-adm-doc { box-shadow: none !important; border-radius: 0 !important; max-width: 210mm !important; }
        }
      `}</style>
    </div>
  );
}

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-navy-900 font-heading text-xs font-bold text-white">
        {number}
      </span>
      <p className="font-heading text-sm font-semibold uppercase tracking-[0.15em] text-navy-900">{title}</p>
    </div>
  );
}

function FormRow({
  index,
  label,
  value,
  sub,
}: {
  index: number;
  label: string;
  value: string;
  sub?: boolean;
}) {
  return (
    <div className={`flex items-stretch gap-0 text-xs ${sub ? "bg-surface-subtle" : "bg-white"}`}>
      <span className="flex w-8 shrink-0 items-center justify-center border-r border-navy-900 bg-navy-50 font-heading font-bold text-navy-900">
        {String(index).padStart(2, "0")}
      </span>
      <div className="flex-1 px-3 py-2.5">
        <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-cyan-700">{label}</p>
        <p className="mt-0.5 min-h-[20px] font-heading text-[13px] font-medium text-navy-900">
          {value || <span className="text-ink-soft">—</span>}
        </p>
      </div>
    </div>
  );
}

function PhotoBox({ src }: { src?: string }) {
  if (src) {
    return (
      <div className="flex h-40 w-32 items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-navy-900 bg-white p-0.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="Applicant photo" className="h-full w-full object-cover" />
      </div>
    );
  }
  return (
    <div className="flex h-40 w-32 flex-col items-center justify-center rounded-md border-2 border-dashed border-navy-900 bg-white text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy-900">Applicant</p>
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-navy-900">Photograph</p>
      <p className="mt-3 text-[9px] text-ink-muted">affix recent passport-size photo</p>
    </div>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 52 52" width={52} height={52} aria-hidden>
      <path d="M26 4 L48 44 H4 Z" fill="#0A1F44" stroke="#0A1F44" strokeLinejoin="round" strokeWidth="2" />
      <circle cx="34" cy="30" r="12" fill="none" stroke="#1FB6E0" strokeWidth="4" />
      <circle cx="34" cy="30" r="5.5" fill="#1FB6E0" />
    </svg>
  );
}
