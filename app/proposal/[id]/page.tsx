import { notFound } from "next/navigation";
import { findProposal } from "@/lib/proposals";
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

  return (
    <main className="bg-gray-100 py-10 print:bg-white print:py-0">
      <article className="mx-auto max-w-3xl rounded-lg bg-white p-10 shadow-md print:shadow-none print:p-0">
        {/* Header */}
        <header className="mb-10 flex items-start justify-between border-b border-border pb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
              Proposal
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold text-navy-900">
              {p.title}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              {p.reference} · prepared {formatDate(p.createdAt)}
              {p.validUntil ? ` · valid until ${formatDate(p.validUntil)}` : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="font-heading text-lg font-semibold text-navy-900">
              {site.brand.name}
            </p>
            <p className="text-xs text-ink-soft">{site.contact.email}</p>
            <p className="text-xs text-ink-soft">{site.contact.phone}</p>
          </div>
        </header>

        {/* For */}
        <section className="mb-8 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-soft">
              Prepared for
            </p>
            <p className="mt-1 font-semibold text-navy-900">{p.client.company}</p>
            {p.client.contactName && (
              <p className="text-ink-soft">{p.client.contactName}</p>
            )}
            {p.client.contactEmail && (
              <p className="text-ink-soft">{p.client.contactEmail}</p>
            )}
            {p.client.contactPhone && (
              <p className="text-ink-soft">{p.client.contactPhone}</p>
            )}
            {p.client.addressLines.length > 0 && (
              <ul className="mt-2 text-ink-soft">
                {p.client.addressLines.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            )}
            {p.client.country && <p className="text-ink-soft">{p.client.country}</p>}
          </div>
          <div className="text-right text-ink-soft">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider">Status</p>
            <p className="mt-1 inline-flex items-center rounded-full bg-cyan-50 px-2 py-0.5 text-xs font-medium uppercase text-cyan-800">
              {p.status}
            </p>
          </div>
        </section>

        {/* Intro */}
        {p.intro && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Introduction</h2>
            <p className="mt-3 whitespace-pre-line text-ink leading-relaxed">{p.intro}</p>
          </section>
        )}

        {/* Approach */}
        {p.approach && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Our approach</h2>
            <p className="mt-3 whitespace-pre-line text-ink leading-relaxed">{p.approach}</p>
          </section>
        )}

        {/* Line items */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Investment</h2>
          <table className="mt-3 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[0.7rem] uppercase tracking-wider text-ink-soft">
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
                      <span className="block text-xs text-ink-soft">{li.description}</span>
                    )}
                    {li.unit && (
                      <span className="block text-[0.7rem] text-ink-soft">({li.unit})</span>
                    )}
                  </td>
                  <td className="py-3 pr-2 text-right tabular-nums">{li.quantity}</td>
                  <td className="py-3 pr-2 text-right tabular-nums">
                    {li.currency} {li.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-right font-mono tabular-nums">
                    {li.currency} {(li.quantity * li.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="text-sm">
              <tr>
                <td colSpan={3} className="pt-4 pr-2 text-right text-ink-soft">Subtotal</td>
                <td className="pt-4 text-right font-mono tabular-nums">
                  {p.currency} {p.totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
              {p.totals.discountPercent > 0 && (
                <tr>
                  <td colSpan={3} className="pr-2 text-right text-amber-800">
                    Discount ({p.totals.discountPercent}%)
                  </td>
                  <td className="text-right font-mono tabular-nums text-amber-800">
                    −{p.currency} {p.totals.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )}
              {p.totals.taxPercent > 0 && (
                <tr>
                  <td colSpan={3} className="pr-2 text-right text-ink-soft">
                    Tax ({p.totals.taxPercent}%)
                  </td>
                  <td className="text-right font-mono tabular-nums">
                    +{p.currency} {p.totals.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              )}
              <tr className="border-t-2 border-navy-900">
                <td colSpan={3} className="pt-2 pr-2 text-right font-semibold text-navy-900">Total</td>
                <td className="pt-2 text-right font-heading text-lg font-semibold text-navy-900">
                  {p.currency} {p.totals.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </section>

        {/* Terms */}
        {p.terms && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-soft">Terms</h2>
            <p className="mt-3 whitespace-pre-line text-sm text-ink leading-relaxed">{p.terms}</p>
          </section>
        )}

        {/* Sign-off */}
        <footer className="mt-12 border-t border-border pt-6 text-center text-xs text-ink-soft">
          <p>
            To accept this proposal, reply to {site.contact.email} or call {site.contact.phone}. We
            look forward to working with {p.client.company}.
          </p>
          <p className="mt-2">
            Print this page or save as PDF (Ctrl/Cmd + P) to share offline.
          </p>
        </footer>
      </article>

      <style>{`
        @media print {
          @page { margin: 18mm; }
          body { background: white; }
        }
      `}</style>
    </main>
  );
}
