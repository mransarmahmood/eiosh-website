"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Printer, Download } from "lucide-react";
import type { ResourceSchema, FieldDef } from "@/lib/cms/schemas";
import { get } from "@/lib/cms/shape";
import { formatDate } from "@/lib/utils";
import { BrandedDocument, type DocLine } from "./BrandedDocument";
import { AdmissionFormDocument } from "./AdmissionFormDocument";
import { CertificateDocument } from "./CertificateDocument";
import { LetterheadDocument } from "./LetterheadDocument";
import { DeleteRecordButton } from "./DeleteRecordButton";

interface Props {
  schema: ResourceSchema;
  record: Record<string, any>;
  id: string;
}

// Resources that should render as a branded A4 document rather than a generic
// definition list. Maps the CMS resource key to the document variant label.
const BRANDED: Record<string, "PROPOSAL" | "QUOTATION" | "INVOICE"> = {
  proposals: "PROPOSAL",
  quotations: "QUOTATION",
  invoices: "INVOICE",
};

// Read-only detailed view with a print-to-PDF button. The `.print-doc` root is
// styled by the print CSS block below so browser "Save as PDF" produces a clean
// one-page document with the EIOSH header/footer.
export function RecordView({ schema, record, id }: Props) {
  const router = useRouter();
  const displayValue = get(record, schema.displayField);
  const subValue = schema.subField ? get(record, schema.subField) : null;
  const brandedVariant = BRANDED[schema.key];

  const onPrint = () => {
    window.print();
  };

  const afterDelete = () => router.push(`/admin/${schema.key}`);

  // Header chrome shared by both branded and generic views.
  const Header = (
    <div className="no-print">
      <Link
        href={`/admin/${schema.key}`}
        className="inline-flex items-center gap-1.5 text-sm text-cyan-700 hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back to {schema.label.toLowerCase()}
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">View</p>
          <h1 className="mt-3 font-heading text-3xl font-semibold text-navy-900">
            {String(displayValue ?? schema.singular)}
          </h1>
          {subValue ? <p className="mt-1 text-sm text-ink-muted">{String(subValue)}</p> : null}
          <p className="mt-1 text-xs text-ink-soft">id: {id}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/${schema.key}/${id}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-navy-900 ring-1 ring-inset ring-border transition hover:ring-cyan-400"
          >
            <Edit className="h-4 w-4" /> Edit
          </Link>
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-navy-800 cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gold-400 px-3 py-2 text-sm font-semibold text-navy-950 transition hover:bg-gold-500 cursor-pointer"
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
          {schema.shape !== "singleton" ? (
            <DeleteRecordButton
              resource={schema.key}
              id={id}
              label={`Delete this ${schema.singular.toLowerCase()}`}
              variant="button"
              onDeleted={afterDelete}
              className="text-sm"
            />
          ) : null}
        </div>
      </div>
    </div>
  );

  // Ornate EIOSH certificate / diploma for /admin/certificates/[id]/view
  if (schema.key === "certificates") {
    const isDiploma =
      typeof record?.course === "string" &&
      /diploma/i.test(record.course);
    return (
      <div className="mx-auto w-full max-w-[1400px] p-6 lg:p-10">
        {Header}
        <div className="mt-8 print:mt-0">
          <CertificateDocument
            variant={isDiploma ? "diploma" : "certificate"}
            serialNumber={record.id?.replace?.(/^cert-/, "") ?? id}
            registrationNumber={record.registrationNumber}
            holder={record.holder || "—"}
            course={record.course}
            issueDate={record.issueDate}
          />
        </div>
        <PrintResetCss />
      </div>
    );
  }

  // Branded A4 admission form for /admin/admissions/[id]/view
  if (schema.key === "admissions") {
    return (
      <div className="mx-auto w-full max-w-5xl p-6 lg:p-10">
        {Header}
        <div className="mt-8 print:mt-0">
          <AdmissionFormDocument record={record} id={id} />
        </div>
        <PrintResetCss />
      </div>
    );
  }

  // Branded A4 document for proposals, quotations and invoices — wrapped in
  // the EIOSH letterhead (olive left stripe + EIOSH wordmark + office footer).
  if (brandedVariant) {
    return (
      <div className="mx-auto w-full max-w-5xl p-6 lg:p-10">
        {Header}
        <div className="mt-8 print:mt-0">
          <LetterheadDocument
            documentNumber={docReferenceFor(schema.key, id)}
            documentDate={record.invoiceDate ?? record.receivedAt ?? record.createdAt ?? new Date().toISOString()}
          >
          <BrandedDocument
            variant={brandedVariant}
            kindLabel={kindLabelFor(record.kind)}
            docNumber={docReferenceFor(schema.key, id)}
            date={record.invoiceDate ?? record.receivedAt ?? record.createdAt ?? new Date().toISOString()}
            dueDate={record.dueDate}
            validUntil={record.validUntil}
            billTo={{
              name: record.title ?? record.companyName ?? record.company ?? "Recipient",
              company: record.companyName ?? record.company,
              address: record.companyAddress ?? record.address,
              email: record.companyEmail ?? record.email,
              phone: record.phone ?? record.mobile,
            }}
            subject={deriveSubject(schema.key, record)}
            overview={record.overview}
            scope={Array.isArray(record.scope) ? record.scope : undefined}
            deliverables={Array.isArray(record.deliverables) ? record.deliverables : undefined}
            timeline={record.timeline}
            investmentSummary={record.investmentSummary}
            terms={record.terms}
            body={
              record.overview || (record.scope?.length ?? 0) > 0 || (record.deliverables?.length ?? 0) > 0
                ? undefined
                : deriveBody(schema.key, record)
            }
            lineItems={coerceLineItems(record.lineItems)}
            notes={record.notes ?? (record.overview ? undefined : record.description)}
            currency={record.currency ?? "USD"}
            vatPercent={typeof record.vatPercent === "number" ? record.vatPercent : undefined}
          />
          </LetterheadDocument>
        </div>
        <PrintResetCss />
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-8 lg:p-12">
      {Header}

      {/* Printable document */}
      <article className="print-doc mt-8 rounded-2xl bg-white p-8 sm:p-12 ring-1 ring-border shadow-elevated">
        {/* Branded header */}
        <header className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-cyan-700">
              EIOSH International
            </p>
            <p className="mt-1 text-xs text-ink-muted">Build the skills to drive your career.</p>
          </div>
          <div className="text-right">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink-soft">
              {schema.singular}
            </p>
            <p className="mt-0.5 font-heading text-sm font-semibold text-navy-900">#{id}</p>
          </div>
        </header>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-cyan-700">
            {schema.label}
          </p>
          <h2 className="mt-3 font-heading text-2xl font-semibold text-navy-900 text-balance">
            {String(displayValue ?? schema.singular)}
          </h2>
          {subValue ? <p className="mt-1 text-sm text-ink-muted">{String(subValue)}</p> : null}
        </div>

        {/* Fields as a definition list */}
        <dl className="mt-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          {schema.fields
            .filter((f) => f.name !== schema.displayField && f.name !== "id")
            .map((f) => {
              const raw = get(record, f.path ?? f.name);
              if (raw == null || raw === "" || (Array.isArray(raw) && raw.length === 0)) return null;
              const isWide = f.wide || f.type === "textarea" || f.type === "richtext" || f.type === "moduleList" || f.type === "stringList";
              return (
                <div key={f.name} className={isWide ? "sm:col-span-2" : ""}>
                  <dt className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-soft">
                    {f.label}
                  </dt>
                  <dd className="mt-1.5 text-sm text-ink leading-relaxed">
                    {renderValue(f, raw)}
                  </dd>
                </div>
              );
            })}
        </dl>

        {/* Footer */}
        <footer className="mt-12 flex items-center justify-between border-t border-border pt-6 text-xs text-ink-soft">
          <p>
            Generated from EIOSH CMS on {formatDate(new Date().toISOString())}
          </p>
          <p>eiosh.com</p>
        </footer>
      </article>

      {/* Print CSS — hides chrome, sizes to A4, ensures white background */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm 14mm;
          }
          body {
            background: #ffffff !important;
            color: #0F172A !important;
          }
          .no-print {
            display: none !important;
          }
          /* Kill the admin sidebar */
          aside {
            display: none !important;
          }
          main {
            display: block !important;
          }
          .print-doc {
            box-shadow: none !important;
            ring: 0 !important;
            border: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            margin: 0 !important;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  );
}

function renderValue(field: FieldDef, value: any): React.ReactNode {
  switch (field.type) {
    case "date":
      return typeof value === "string" ? formatDate(value) : String(value);
    case "datetime":
      return typeof value === "string"
        ? new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })
        : String(value);
    case "boolean":
      return value ? "Yes" : "No";
    case "tags":
    case "stringList":
      if (!Array.isArray(value)) return String(value);
      return (
        <ul className="mt-1 flex flex-wrap gap-1.5">
          {value.map((v, i) => (
            <li key={i} className="rounded-full bg-surface-subtle px-2.5 py-0.5 text-xs text-ink">
              {String(v)}
            </li>
          ))}
        </ul>
      );
    case "moduleList":
      if (!Array.isArray(value)) return null;
      return (
        <ol className="mt-1 space-y-2">
          {value.map((m: any, i: number) => (
            <li key={i} className="rounded-lg bg-surface-subtle p-3">
              <p className="font-heading font-medium text-navy-900">
                {i + 1}. {m.title}
              </p>
              {m.description ? <p className="mt-1 text-xs text-ink-muted">{m.description}</p> : null}
            </li>
          ))}
        </ol>
      );
    case "statList":
      if (!Array.isArray(value)) return null;
      return (
        <dl className="mt-1 grid grid-cols-2 gap-3">
          {value.map((s: any, i: number) => (
            <div key={i} className="rounded-lg bg-surface-subtle p-3">
              <dt className="text-[0.7rem] uppercase tracking-wider text-ink-soft">{s.label}</dt>
              <dd className="mt-1 font-heading font-semibold text-navy-900">{s.value}</dd>
            </div>
          ))}
        </dl>
      );
    case "socialObj":
      if (!value || typeof value !== "object") return null;
      const entries = Object.entries(value).filter(([, v]) => v);
      if (entries.length === 0) return null;
      return (
        <ul className="mt-1 space-y-1">
          {entries.map(([k, v]) => (
            <li key={k} className="text-sm">
              <span className="capitalize text-ink-muted">{k}:</span>{" "}
              <a href={String(v)} className="text-cyan-700 underline" target="_blank" rel="noopener noreferrer">
                {String(v)}
              </a>
            </li>
          ))}
        </ul>
      );
    case "richtext":
    case "textarea":
      return <p className="whitespace-pre-wrap">{String(value)}</p>;
    case "enum": {
      const label = field.options?.find((o) => o.value === String(value))?.label;
      return label ?? String(value);
    }
    default:
      if (typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://"))) {
        return (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-cyan-700 underline">
            {value}
          </a>
        );
      }
      return String(value);
  }
}

// ---------- Branded-document helpers ----------

const KIND_LABELS: Record<string, string> = {
  training: "Training",
  certification: "Certification",
  service: "Professional services",
  "equipment-inspection": "Equipment inspection",
  consulting: "HSE consulting",
  custom: "Custom",
};

function kindLabelFor(kind: unknown): string | undefined {
  if (typeof kind !== "string") return undefined;
  return KIND_LABELS[kind];
}

function docReferenceFor(resourceKey: string, id: string): string {
  const prefix = resourceKey === "proposals" ? "PROP" : resourceKey === "quotations" ? "QTN" : resourceKey === "invoices" ? "INV" : "DOC";
  const tail = id.replace(/[^a-zA-Z0-9]+/g, "").slice(-6).toUpperCase() || "000001";
  return `EIOSH-${prefix}-${tail}`;
}

function deriveSubject(resourceKey: string, record: Record<string, any>): string | undefined {
  if (resourceKey === "quotations") {
    return record.serviceRequired
      ? `Quotation for ${record.serviceRequired}`
      : record.title ?? undefined;
  }
  if (resourceKey === "proposals") {
    return record.title ?? "Course proposal";
  }
  if (resourceKey === "invoices") {
    return record.title ?? record.subject ?? "Invoice for services rendered";
  }
  return record.title;
}

function deriveBody(resourceKey: string, record: Record<string, any>): React.ReactNode {
  const description = record.description;
  if (!description) return null;
  const text = stripHtml(String(description));
  if (!text) return null;
  return (
    <div className="prose-eiosh text-sm leading-relaxed text-ink">
      {text.split(/\n\n+/).map((p, i) => (
        <p key={i} className={i === 0 ? "" : "mt-3"}>
          {p}
        </p>
      ))}
    </div>
  );
}

function coerceLineItems(value: any): DocLine[] | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  return value.map((item: any) => ({
    description: String(item.description ?? item.title ?? "Line item"),
    qty: Number(item.qty ?? item.quantity ?? 1),
    unitPrice: Number(item.unitPrice ?? item.price ?? item.amount ?? 0),
    total: item.total != null ? Number(item.total) : undefined,
  }));
}

function stripHtml(s: string): string {
  return s
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function PrintResetCss() {
  return (
    <style jsx global>{`
      @media print {
        @page { size: A4; margin: 0; }
        body { background: #ffffff !important; }
        aside, .no-print { display: none !important; }
        main { display: block !important; }
      }
    `}</style>
  );
}
