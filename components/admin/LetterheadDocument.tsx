"use client";

import { ReactNode } from "react";

export interface LetterheadDocumentProps {
  children?: ReactNode;             // body of the letter / quote / invoice
  documentNumber?: string | null;   // e.g. "QUO-2026-0001"
  documentDate?: string | null;     // ISO date
  tagline?: string;                 // default "Promoting Safety Worldwide"
  address1?: string;                // Lahore office
  address2?: string;                // Multan office
  onPrint?: () => void;
}

/**
 * Standard EIOSH letterhead used by proposals, quotations, invoices and
 * other branded correspondence. Based on the legacy paper design:
 *   • Olive/mustard vertical stripe on the left edge
 *   • EIOSH logo + wordmark at top, with tagline under the mark
 *   • Thin olive rule under the header
 *   • Large body area (children)
 *   • Two office addresses centred at the foot of the page
 */
export function LetterheadDocument({
  children,
  documentNumber = null,
  documentDate = null,
  tagline = "Promoting Safety Worldwide",
  address1 = "Lahore Office: Royal Arcade, Main Ferozpur Road, Lahore (Pakistan) Cell: 0333-9284928",
  address2 = "Multan Office: Chowk Kumharaan Wala, Multan Ph: 061-6560231",
  onPrint,
}: LetterheadDocumentProps) {
  return (
    <div className="lh-doc">
      <style>{CSS}</style>

      {onPrint ? (
        <div className="lh-toolbar no-print">
          <button type="button" onClick={onPrint} className="lh-print-btn">
            🖨 Print / Save as PDF
          </button>
        </div>
      ) : null}

      <div className="lh-page">
        {/* Olive/mustard stripe on left edge with embossed rule pattern */}
        <div className="lh-stripe" aria-hidden />

        {/* Header */}
        <div className="lh-header">
          <div className="lh-logo">
            <EIOSHMono size={78} />
            <p className="lh-tagline">{tagline}</p>
          </div>
          <div className="lh-wordmark">
            <div className="lh-wordmark-big">EIOSH</div>
            <div className="lh-wordmark-sub">
              EMIRATES INSTITUTE OF OCCUPATIONAL SAFETY &amp; HEALTH
            </div>
          </div>
        </div>

        {/* Thin olive rule under the header */}
        <div className="lh-rule" />

        {/* Document number / date strip */}
        {(documentNumber || documentDate) ? (
          <div className="lh-doc-meta">
            {documentNumber ? <span><strong>Ref:</strong> {documentNumber}</span> : null}
            {documentDate ? (
              <span>
                <strong>Date:</strong>{" "}
                {new Date(documentDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            ) : null}
          </div>
        ) : null}

        {/* Body */}
        <div className="lh-body">{children}</div>

        {/* Addresses footer */}
        <div className="lh-footer">
          <p>{address1}</p>
          <p>{address2}</p>
        </div>
      </div>
    </div>
  );
}

function EIOSHMono({ size = 78 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      <path d="M50 5 L95 85 L5 85 Z" fill="#7CB2E4" />
      <circle cx="50" cy="62" r="22" fill="none" stroke="#184CA0" strokeWidth="3" />
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="16"
        fontStyle="italic"
        fill="#184CA0"
      >
        Eiosh
      </text>
    </svg>
  );
}

const CSS = `
@page { size: A4; margin: 0; }
@media screen { body { background: #eaeaea; } }

.lh-doc { display: flex; flex-direction: column; align-items: center; padding: 24px; font-family: 'Times New Roman', 'Liberation Serif', serif; color: #0A0A0A; }
.lh-toolbar { width: 210mm; display: flex; justify-content: flex-end; margin-bottom: 12px; }
.lh-print-btn {
  background: #0B1F3A; color: white; border: none; border-radius: 6px;
  padding: 8px 16px; font-size: 13px; font-weight: 500; cursor: pointer;
  font-family: 'DM Sans', sans-serif;
}
.lh-print-btn:hover { box-shadow: 0 0 0 1px #B8873A, 0 6px 20px rgba(184,135,58,0.25); }
.no-print { display: block; }

.lh-page {
  position: relative;
  width: 210mm; min-height: 297mm;
  background: #FFFFFF;
  padding: 30px 40px 30px 85px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  display: flex; flex-direction: column;
  box-sizing: border-box;
}

/* Olive stripe */
.lh-stripe {
  position: absolute; top: 0; left: 0; bottom: 0; width: 42px;
  background: repeating-linear-gradient(
    0deg,
    #C7C680 0 2px,
    #FDFCF0 2px 4px
  );
  border-right: 1.5px solid #C7C680;
}

/* Header */
.lh-header {
  display: flex; align-items: center; gap: 24px;
  margin-bottom: 6px;
}
.lh-logo { display: flex; flex-direction: column; align-items: center; }
.lh-tagline {
  font-size: 10px; font-weight: 700; color: #0A0A0A;
  margin: 4px 0 0; font-family: Arial, sans-serif;
}
.lh-wordmark { flex: 1; text-align: center; }
.lh-wordmark-big {
  font-family: Arial, 'Helvetica Neue', sans-serif;
  font-weight: 900;
  font-size: 52px;
  color: #184CA0;
  letter-spacing: -1px;
  line-height: 1;
}
.lh-wordmark-sub {
  font-family: Arial, sans-serif;
  font-weight: 700;
  font-size: 12.5px;
  color: #0A0A0A;
  letter-spacing: 1px;
  margin-top: 4px;
}

.lh-rule {
  margin: 6px -40px 20px -40px;
  height: 1.5px;
  background: #C7C680;
}

.lh-doc-meta {
  display: flex; justify-content: space-between;
  font-size: 12px; color: #0A0A0A;
  margin-bottom: 20px;
}
.lh-doc-meta strong { font-weight: 700; }

.lh-body {
  flex: 1;
  font-size: 12px;
  line-height: 1.6;
}

.lh-footer {
  margin: 20px -40px 0 -40px;
  padding: 12px 40px 0 40px;
  text-align: center;
  font-size: 11.5px;
  border-top: 1px solid #C7C680;
}
.lh-footer p { margin: 2px 0; }

@media print {
  body { background: #fff !important; }
  .lh-doc { padding: 0; }
  .lh-page { box-shadow: none; }
  .lh-toolbar { display: none !important; }
}
`;
