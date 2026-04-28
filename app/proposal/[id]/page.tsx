import { notFound } from "next/navigation";
import { findProposal, parseApproachStages } from "@/lib/proposals";
import { site } from "@/content/site";
import { formatDate } from "@/lib/utils";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props) {
  const p = await findProposal(params.id);
  if (!p) return pageMeta({ title: "Proposal not found", noIndex: true });
  return pageMeta({
    title: `${p.reference} · ${p.title}`,
    description: `Proposal for ${p.client.company}`,
    noIndex: true,
  });
}

export default async function ProposalPage({ params }: Props) {
  const p = await findProposal(params.id);
  if (!p) notFound();

  const stages = parseApproachStages(p.approach);
  const mode = p.priceDisplayMode ?? "all";
  const showLineItemPrices = mode === "all";
  const showLumpSum = mode !== "no-price";
  const lumpSumLabel = (p.lumpSumLabel?.trim() || "Total");

  return (
    <main className="bg-gradient-to-b from-navy-50/40 via-gray-50 to-white py-12 print:bg-white print:py-0">
      <article className="mx-auto max-w-4xl rounded-2xl bg-white p-10 shadow-floating ring-1 ring-border print:shadow-none print:ring-0 print:p-0">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="grid grid-cols-1 gap-6 border-b border-border pb-8 sm:grid-cols-[1fr_auto] sm:items-start">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-cyan-700">
              Proposal · {p.reference}
            </p>
            <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight text-navy-900 sm:text-4xl">
              {p.title}
            </h1>
            <p className="mt-2 text-sm text-ink-soft">
              Prepared {formatDate(p.createdAt)}
              {p.validUntil ? ` · valid until ${formatDate(p.validUntil)}` : ""}
            </p>
          </div>
          <div className="rounded-xl bg-navy-900 p-5 text-right text-white shadow-sm">
            <p className="font-heading text-lg font-semibold">{site.brand.name}</p>
            <p className="mt-1 text-xs text-cyan-200">{site.contact.email}</p>
            <p className="text-xs text-cyan-200">{site.contact.phone}</p>
          </div>
        </header>

        {/* ── Prepared for ───────────────────────────────────────────────── */}
        <section className="mt-8 grid grid-cols-1 gap-6 rounded-xl bg-surface-subtle p-5 sm:grid-cols-2">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-soft">
              Prepared for
            </p>
            <p className="mt-2 font-heading text-lg font-semibold text-navy-900">
              {p.client.company}
            </p>
            {p.client.contactName && (
              <p className="text-sm text-ink">{p.client.contactName}</p>
            )}
            {p.client.contactEmail && (
              <p className="text-sm text-ink-soft">{p.client.contactEmail}</p>
            )}
            {p.client.contactPhone && (
              <p className="text-sm text-ink-soft">{p.client.contactPhone}</p>
            )}
          </div>
          <div className="text-sm sm:text-right">
            {p.client.addressLines.length > 0 && (
              <ul className="text-ink-soft">
                {p.client.addressLines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            )}
            {p.client.country && <p className="text-ink-soft">{p.client.country}</p>}
            <p className="mt-3 inline-flex items-center rounded-full bg-cyan-100 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-800">
              {p.status}
            </p>
          </div>
        </section>

        {/* ── Intro ──────────────────────────────────────────────────────── */}
        {p.intro && (
          <section className="mt-10">
            <SectionLabel>Introduction</SectionLabel>
            <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-ink">
              {p.intro}
            </p>
          </section>
        )}

        {/* ── Our approach as stage cards ────────────────────────────────── */}
        {stages.length > 0 && (
          <section className="mt-10">
            <SectionLabel>Our approach</SectionLabel>
            <ol className="mt-5 space-y-4">
              {stages.map((s) => (
                <li
                  key={`${s.index}-${s.title}`}
                  className="relative rounded-2xl border border-border bg-white p-5 pl-16 shadow-sm transition hover:border-cyan-300 print:break-inside-avoid"
                >
                  <span className="absolute left-5 top-5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-cyan-600 font-mono text-sm font-semibold text-white">
                    {String(s.index).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-navy-900">
                    {s.title}
                  </h3>
                  {s.body && (
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink">
                      {s.body}
                    </p>
                  )}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* ── Services / Investment ──────────────────────────────────────── */}
        <section className="mt-10">
          <SectionLabel>
            {mode === "no-price" ? "Scope of services" : "Services included"}
          </SectionLabel>

          {showLineItemPrices ? (
            <table className="mt-4 w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-[0.65rem] uppercase tracking-wider text-ink-soft">
                  <th className="py-2 pr-2">Service</th>
                  <th className="py-2 pr-2 text-right">Qty</th>
                  <th className="py-2 pr-2 text-right">Unit price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {p.lineItems.map((li) => (
                  <tr key={li.id} className="border-b border-border align-top">
                    <td className="py-3 pr-2">
                      <span className="block font-medium text-navy-900">{li.title}</span>
                      {li.description && (
                        <span className="mt-0.5 block text-xs text-ink-soft">
                          {li.description}
                        </span>
                      )}
                      {li.unit && (
                        <span className="mt-0.5 block text-[0.7rem] uppercase tracking-wider text-ink-soft">
                          {li.unit}
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-2 text-right tabular-nums">{li.quantity}</td>
                    <td className="py-3 pr-2 text-right tabular-nums">
                      {li.currency}{" "}
                      {li.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-right font-mono tabular-nums">
                      {li.currency}{" "}
                      {(li.quantity * li.unitPrice).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="text-sm">
                <tr>
                  <td colSpan={3} className="pt-4 pr-2 text-right text-ink-soft">
                    Subtotal
                  </td>
                  <td className="pt-4 text-right font-mono tabular-nums">
                    {p.currency}{" "}
                    {p.totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                {p.totals.discountPercent > 0 && (
                  <tr>
                    <td colSpan={3} className="pr-2 text-right text-amber-800">
                      Discount ({p.totals.discountPercent}%)
                    </td>
                    <td className="text-right font-mono tabular-nums text-amber-800">
                      −{p.currency}{" "}
                      {p.totals.discountAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                )}
                {p.totals.taxPercent > 0 && (
                  <tr>
                    <td colSpan={3} className="pr-2 text-right text-ink-soft">
                      Tax ({p.totals.taxPercent}%)
                    </td>
                    <td className="text-right font-mono tabular-nums">
                      +{p.currency}{" "}
                      {p.totals.taxAmount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                )}
                <tr className="border-t-2 border-navy-900">
                  <td colSpan={3} className="pt-2 pr-2 text-right font-semibold text-navy-900">
                    Total
                  </td>
                  <td className="pt-2 text-right font-heading text-lg font-semibold text-navy-900">
                    {p.currency}{" "}
                    {p.totals.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          ) : (
            // Scope-only list (used for both "lumpsum-only" and "no-price")
            <ul className="mt-4 space-y-3">
              {p.lineItems.map((li, i) => (
                <li
                  key={li.id}
                  className="flex gap-4 rounded-xl border border-border bg-white p-4 print:break-inside-avoid"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-600/10 font-mono text-xs font-semibold text-cyan-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading font-medium text-navy-900">{li.title}</p>
                    {li.description && (
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                        {li.description}
                      </p>
                    )}
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft">
                      {li.quantity > 1 && <span>Quantity: {li.quantity}</span>}
                      {li.unit && (
                        <span className="uppercase tracking-wider">{li.unit}</span>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Lump-sum total — shown for "lumpsum-only" */}
          {mode === "lumpsum-only" && showLumpSum && (
            <div className="mt-6 flex flex-col items-end rounded-2xl bg-navy-900 p-6 text-white shadow-sm">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-cyan-200">
                {lumpSumLabel}
              </p>
              <p className="mt-2 font-heading text-3xl font-semibold tabular-nums">
                {p.currency}{" "}
                {p.totals.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              {p.totals.discountPercent > 0 && (
                <p className="mt-1 text-xs text-cyan-100/80">
                  Includes a {p.totals.discountPercent}% discount.
                </p>
              )}
              {p.totals.taxPercent > 0 && (
                <p className="text-xs text-cyan-100/80">
                  Inclusive of {p.totals.taxPercent}% tax.
                </p>
              )}
            </div>
          )}

          {mode === "no-price" && (
            <p className="mt-4 rounded-xl border border-dashed border-border bg-surface-subtle p-4 text-xs text-ink-soft">
              Pricing is provided separately. Reach out to {site.contact.email} for the commercial
              breakdown.
            </p>
          )}
        </section>

        {/* ── Terms ──────────────────────────────────────────────────────── */}
        {p.terms && (
          <section className="mt-10">
            <SectionLabel>Terms</SectionLabel>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink">
              {p.terms}
            </p>
          </section>
        )}

        {/* ── Sign-off ───────────────────────────────────────────────────── */}
        <footer className="mt-12 rounded-2xl bg-surface-subtle p-6 text-center text-sm text-ink-soft">
          <p className="font-heading text-base font-semibold text-navy-900">
            Ready to move forward?
          </p>
          <p className="mt-2">
            To accept this proposal, reply to{" "}
            <a className="text-cyan-700 hover:underline" href={`mailto:${site.contact.email}`}>
              {site.contact.email}
            </a>{" "}
            or call{" "}
            <a className="text-cyan-700 hover:underline" href={`tel:${site.contact.phone}`}>
              {site.contact.phone}
            </a>
            . We look forward to working with {p.client.company}.
          </p>
          <p className="mt-3 text-xs">
            Print this page or save as PDF (Ctrl/Cmd&nbsp;+&nbsp;P) to share offline.
          </p>
        </footer>
      </article>

      <style>{`
        @media print {
          @page { margin: 16mm; }
          body { background: white; }
          .shadow-floating, .shadow-sm { box-shadow: none !important; }
        }
      `}</style>
    </main>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-cyan-700">
      <span className="inline-block h-px w-8 bg-cyan-600" aria-hidden />
      {children}
    </h2>
  );
}
