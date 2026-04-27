import * as React from "react";
import { formatDate } from "@/lib/utils";

// Branded EIOSH document template matching the legacy printed design:
//   • Top-left: EIOSH International mark + "Promoting Safety Worldwide"
//   • Background: soft sky gradient + world-map dot pattern + EIOSH watermark
//   • Body: white card with dynamic content blocks
//   • Bottom: navy ribbon with address · phone · email + QR reference
//
// One component powers proposal / quotation / invoice variants.

export interface DocLine {
  description: string;
  qty?: number;
  unitPrice?: number;
  total?: number;
}

export interface BrandedDocumentProps {
  variant: "PROPOSAL" | "QUOTATION" | "INVOICE";
  kindLabel?: string;
  docNumber: string;
  date: string; // ISO
  dueDate?: string;
  validUntil?: string;
  billTo: {
    name: string;
    company?: string;
    address?: string;
    email?: string;
    phone?: string;
  };
  subject?: string;
  /** Structured proposal sections (ignored for invoices) */
  overview?: string;
  scope?: string[];
  deliverables?: string[];
  timeline?: string;
  investmentSummary?: string;
  terms?: string;
  /** Free body for legacy data. */
  body?: React.ReactNode;
  lineItems?: DocLine[];
  notes?: string;
  currency?: string;
  vatPercent?: number;
}

const COMPANY = {
  name: "EIOSH International",
  tagline: "Promoting Safety Worldwide",
  address1: "1st floor, Khair Muhammad Plaza, opposite to State Bank of Pakistan,",
  address2: "Peshawar Cantt. Khyber Pakhtunkhwa, Pakistan",
  address3: "2nd floor Office #7 Royal Arcade, Ferozepur road Lahore, Lahore, Pakistan",
  phone1: "091 5284208",
  phone2: "0349 4295479",
  email: "info@eiosh.com",
  website: "eiosh.com",
};

export function BrandedDocument(props: BrandedDocumentProps) {
  const {
    variant,
    kindLabel,
    docNumber,
    date,
    dueDate,
    validUntil,
    billTo,
    subject,
    overview,
    scope,
    deliverables,
    timeline,
    investmentSummary,
    terms,
    body,
    lineItems,
    notes,
    currency = "USD",
    vatPercent,
  } = props;

  const computedLines: Required<DocLine>[] = (lineItems ?? []).map((l) => {
    const qty = l.qty ?? 1;
    const unitPrice = l.unitPrice ?? 0;
    const total = l.total ?? qty * unitPrice;
    return { description: l.description, qty, unitPrice, total };
  });
  const subtotal = computedLines.reduce((s, l) => s + l.total, 0);
  const vatAmount = vatPercent ? (subtotal * vatPercent) / 100 : 0;
  const grandTotal = subtotal + vatAmount;

  return (
    <div className="eiosh-doc relative mx-auto w-full max-w-[820px] overflow-hidden rounded-xl bg-white shadow-[0_16px_40px_-12px_rgba(10,31,68,0.25)]">
      {/* Top corner accents */}
      <div className="eiosh-doc__corner-top" aria-hidden />
      <div className="eiosh-doc__map" aria-hidden />

      {/* Header */}
      <header className="relative z-10 flex items-start justify-between gap-6 px-10 pt-10">
        <div className="flex items-center gap-3">
          <EIOSHMark />
          <div>
            <p className="font-heading text-[1.6rem] font-bold leading-none tracking-tight text-navy-900">
              EIOSH
            </p>
            <p className="font-heading text-[0.72rem] font-semibold tracking-[0.3em] text-navy-900">
              INTERNATIONAL
            </p>
            <p className="mt-1 text-[0.6rem] font-semibold tracking-wider text-cyan-600">
              {COMPANY.tagline}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-cyan-700">
            Document
          </p>
          <p className="mt-1 font-heading text-3xl font-bold tracking-tight text-navy-900">
            {variant}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-lg border-2 border-navy-900 px-3 py-1.5 text-[0.7rem] font-semibold">
            <span className="text-ink-muted">{variant === "INVOICE" ? "INVOICE #" : variant === "QUOTATION" ? "QUOTE #" : "REF #"}</span>
            <span className="text-navy-900">{docNumber}</span>
          </div>
        </div>
      </header>

      {/* Subtitle date row */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center gap-x-6 gap-y-1 px-10 text-xs text-ink-muted">
        <p>
          <span className="font-semibold text-navy-900">Date:</span> {formatDate(date)}
        </p>
        {dueDate ? (
          <p>
            <span className="font-semibold text-navy-900">Due:</span> {formatDate(dueDate)}
          </p>
        ) : null}
        {validUntil ? (
          <p>
            <span className="font-semibold text-navy-900">Valid until:</span> {formatDate(validUntil)}
          </p>
        ) : null}
      </div>

      {/* Bill-to + Company boxes */}
      <div className="relative z-10 mt-6 grid grid-cols-2 gap-5 px-10">
        <BoxedBlock title={variant === "INVOICE" ? "BILL TO" : variant === "QUOTATION" ? "PREPARED FOR" : "ADDRESSED TO"}>
          <p className="font-semibold text-navy-900">{billTo.name}</p>
          {billTo.company ? <p>{billTo.company}</p> : null}
          {billTo.address ? <p className="text-ink-muted">{billTo.address}</p> : null}
          {billTo.email ? <p className="text-ink-muted">{billTo.email}</p> : null}
          {billTo.phone ? <p className="text-ink-muted">{billTo.phone}</p> : null}
        </BoxedBlock>
        <BoxedBlock title="COMPANY DETAILS">
          <p className="font-semibold text-navy-900">{COMPANY.name}</p>
          <p className="text-ink-muted">{COMPANY.address3}</p>
          <p className="text-ink-muted">
            {COMPANY.phone1} · {COMPANY.phone2}
          </p>
          <p className="text-ink-muted">{COMPANY.email}</p>
        </BoxedBlock>
      </div>

      {/* Subject + structured sections */}
      <div className="relative z-10 mt-8 space-y-6 px-10">
        {subject ? (
          <div className="rounded-lg bg-cyan-50 px-4 py-3 ring-1 ring-cyan-200">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-700">
              {kindLabel ? `${kindLabel} · Subject` : "Subject"}
            </p>
            <p className="mt-1 font-heading text-base font-semibold text-navy-900">{subject}</p>
          </div>
        ) : null}

        {overview ? <Section title="Overview">{paragraphs(overview)}</Section> : null}

        {scope && scope.length > 0 ? (
          <Section title="Scope of work">
            <ol className="mt-1 space-y-1.5 pl-4 text-sm text-ink">
              {scope.map((s, i) => (
                <li key={i} className="list-decimal">
                  {s}
                </li>
              ))}
            </ol>
          </Section>
        ) : null}

        {deliverables && deliverables.length > 0 ? (
          <Section title="Deliverables">
            <ul className="mt-1 space-y-1.5 pl-4 text-sm text-ink">
              {deliverables.map((s, i) => (
                <li key={i} className="list-disc">
                  {s}
                </li>
              ))}
            </ul>
          </Section>
        ) : null}

        {timeline ? <Section title="Timeline">{paragraphs(timeline)}</Section> : null}

        {investmentSummary ? (
          <Section title="Investment">{paragraphs(investmentSummary)}</Section>
        ) : null}

        {body ? <div className="text-sm leading-relaxed text-ink">{body}</div> : null}
      </div>

      {/* Line items table (invoice / quotation) */}
      {computedLines.length > 0 ? (
        <div className="relative z-10 mt-8 px-10">
          <table className="w-full overflow-hidden rounded-lg text-sm">
            <thead>
              <tr className="bg-navy-900 text-white">
                <th className="w-8 px-3 py-2.5 text-left text-[0.7rem] font-semibold uppercase tracking-wider">#</th>
                <th className="px-3 py-2.5 text-left text-[0.7rem] font-semibold uppercase tracking-wider">Description</th>
                <th className="w-14 px-3 py-2.5 text-right text-[0.7rem] font-semibold uppercase tracking-wider">Qty</th>
                <th className="w-24 px-3 py-2.5 text-right text-[0.7rem] font-semibold uppercase tracking-wider">Unit</th>
                <th className="w-28 px-3 py-2.5 text-right text-[0.7rem] font-semibold uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {computedLines.map((l, i) => (
                <tr key={i} className="bg-white">
                  <td className="px-3 py-3 text-ink-muted">{String(i + 1).padStart(2, "0")}</td>
                  <td className="px-3 py-3 text-ink">{l.description}</td>
                  <td className="px-3 py-3 text-right text-ink">{l.qty}</td>
                  <td className="px-3 py-3 text-right text-ink tabular-nums">
                    {currency} {l.unitPrice.toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-right font-semibold text-navy-900 tabular-nums">
                    {currency} {l.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 ml-auto w-72 space-y-1.5 text-sm">
            <div className="flex justify-between text-ink">
              <span>Subtotal</span>
              <span className="tabular-nums">{currency} {subtotal.toFixed(2)}</span>
            </div>
            {vatPercent ? (
              <div className="flex justify-between text-ink">
                <span>VAT ({vatPercent}%)</span>
                <span className="tabular-nums">{currency} {vatAmount.toFixed(2)}</span>
              </div>
            ) : null}
            <div className="flex justify-between rounded-md bg-navy-900 px-4 py-2 text-white">
              <span className="font-semibold uppercase tracking-wider text-[0.75rem]">Grand total</span>
              <span className="font-heading font-bold tabular-nums">{currency} {grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : null}

      {notes ? (
        <div className="relative z-10 mt-8 px-10">
          <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-700">Notes</p>
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink leading-relaxed">{notes}</p>
        </div>
      ) : null}

      {terms ? (
        <div className="relative z-10 mt-8 px-10">
          <Section title="Terms &amp; conditions">
            <p className="whitespace-pre-wrap text-xs text-ink-muted leading-relaxed">{terms}</p>
          </Section>
        </div>
      ) : null}

      {/* Signature strip */}
      <div className="relative z-10 mt-12 grid grid-cols-2 gap-10 px-10">
        <div>
          <div className="mt-12 border-t border-navy-900 pt-2">
            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-navy-900">
              Authorised signature
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">EIOSH International</p>
          </div>
        </div>
        <div>
          <div className="mt-12 border-t border-navy-900 pt-2 text-right">
            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-navy-900">
              Received by
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">Client signature &amp; date</p>
          </div>
        </div>
      </div>

      {/* Footer ribbon */}
      <div className="eiosh-doc__footer relative z-10 mt-12">
        <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-5 px-10 py-5 text-[0.7rem] text-white">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">📍</span>
            <div className="leading-snug">
              <p>{COMPANY.address1}</p>
              <p>{COMPANY.address2}</p>
              <p>{COMPANY.address3}</p>
            </div>
          </div>
          <div />
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">📞</span>
            <div className="leading-snug">
              <p>{COMPANY.phone1}</p>
              <p>{COMPANY.phone2}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10">✉️</span>
            <p>{COMPANY.email}</p>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="eiosh-doc__watermark" aria-hidden>
        <EIOSHMark size={420} muted />
      </div>

      <style>{`
        .eiosh-doc {
          background:
            radial-gradient(ellipse at top right, rgba(31,182,224,0.08) 0%, transparent 55%),
            linear-gradient(180deg, #F3F9FD 0%, #FFFFFF 25%, #FFFFFF 75%, #EAF5FB 100%);
          min-height: 1123px; /* A4 height at 96dpi */
          font-family: "Source Sans 3", system-ui, sans-serif;
        }
        .eiosh-doc__corner-top {
          position: absolute;
          top: 0; right: 0;
          width: 120px; height: 40px;
          background: linear-gradient(90deg, transparent 0%, #1FB6E0 50%, #0A1F44 100%);
          border-bottom-left-radius: 48px;
          z-index: 2;
        }
        .eiosh-doc__map {
          position: absolute;
          top: 60px; right: 30px;
          width: 420px; height: 200px;
          opacity: 0.35;
          z-index: 0;
          background-image:
            radial-gradient(circle, #1FB6E0 1px, transparent 1.5px);
          background-size: 6px 6px;
          mask-image: radial-gradient(ellipse at right, #000 25%, transparent 75%);
          -webkit-mask-image: radial-gradient(ellipse at right, #000 25%, transparent 75%);
        }
        .eiosh-doc__watermark {
          position: absolute;
          left: 50%; top: 58%;
          transform: translate(-50%, -50%);
          opacity: 0.05;
          z-index: 0;
          pointer-events: none;
        }
        .eiosh-doc__footer {
          background: #0A1F44;
          position: relative;
        }
        .eiosh-doc__footer::before {
          content: "";
          position: absolute;
          top: -24px; right: 40px;
          width: 120px; height: 80px;
          background: #1FB6E0;
          border-radius: 50%;
          z-index: -1;
          opacity: 0.2;
        }

        @media print {
          @page { size: A4; margin: 0; }
          .eiosh-doc { box-shadow: none !important; border-radius: 0 !important; max-width: 210mm !important; }
        }
      `}</style>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-3 py-1">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden />
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-white">{title}</span>
      </div>
      <div className="mt-2.5 text-sm leading-relaxed text-ink">{children}</div>
    </div>
  );
}

function paragraphs(text: string) {
  return text
    .split(/\n\n+/)
    .map((p, i) => (
      <p key={i} className={i > 0 ? "mt-2" : ""}>
        {p}
      </p>
    ));
}

function BoxedBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute -top-3 left-4 z-10 rounded-md bg-navy-900 px-3 py-1 text-[0.65rem] font-semibold tracking-wider text-white">
        {title}
      </div>
      <div className="rounded-lg border-2 border-navy-900 bg-white/90 px-4 py-5 pt-6 text-xs backdrop-blur">
        <div className="space-y-1">{children}</div>
      </div>
    </div>
  );
}

function EIOSHMark({ size = 48, muted = false }: { size?: number; muted?: boolean }) {
  const navy = muted ? "#0A1F44" : "#0A1F44";
  const cyan = muted ? "#1FB6E0" : "#1FB6E0";
  return (
    <svg viewBox="0 0 52 52" width={size} height={size} aria-hidden>
      <path d="M26 4 L48 44 H4 Z" fill={navy} stroke={navy} strokeLinejoin="round" strokeWidth="2" />
      <circle cx="34" cy="30" r="12" fill="none" stroke={cyan} strokeWidth="4" />
      <circle cx="34" cy="30" r="5.5" fill={cyan} />
    </svg>
  );
}
