"use client";

import { formatDate } from "@/lib/utils";

export type CertVariant = "certificate" | "diploma";

export interface CertificateDocumentProps {
  variant?: CertVariant;            // "certificate" = landscape, "diploma" = portrait
  serialNumber?: string | null;     // S. No.
  registrationNumber?: string | null; // Reg. No.
  holder: string;                   // "ABDUL REHMAN"
  course?: string | null;           // course / programme awarded
  issueDate?: string | null;        // ISO — formatted for display
  authorizedInstructor?: string | null;
  chairman?: string | null;
}

/**
 * Printable EIOSH Certificate / Diploma document styled to match the legacy
 * paper design (blue scalloped seashell border · red script title · watermark
 * EIOSH repeat · EIOSH + NASP logos · signature lines).
 * Open the print view in Chrome → Ctrl+P → Save as PDF for a PDF copy.
 */
export function CertificateDocument({
  variant = "certificate",
  serialNumber,
  registrationNumber,
  holder,
  course,
  issueDate,
  authorizedInstructor = "EIOSH Authorized Instructor",
  chairman = "Chairman EIOSH",
}: CertificateDocumentProps) {
  const isLandscape = variant === "certificate";
  const title = variant === "diploma" ? "Diploma" : "Certificate";

  return (
    <div className={`cert-doc cert-${variant}`}>
      <style>{CSS}</style>

      <div className="cert-page">
        {/* Ornate blue border — 4 sides */}
        <OrnateBorder />

        {/* Inner watermark field "EIOSH EIOSH EIOSH..." */}
        <div className="cert-watermark" aria-hidden />

        {/* Centre watermark monogram */}
        <div className="cert-mono-watermark" aria-hidden>
          <EIOSHMono size={260} faded />
        </div>

        <div className="cert-content">
          {/* Top identifiers */}
          <div className="cert-ids">
            <div>
              <span className="cert-id-label">S.No.</span>
              <span className="cert-id-value">{serialNumber ?? "_______________________"}</span>
            </div>
            <div>
              <span className="cert-id-label">Reg. No.</span>
              <span className="cert-id-value">{registrationNumber ?? "_______________________"}</span>
            </div>
          </div>

          {/* Header — logos + word EIOSH */}
          <div className="cert-header">
            <div className="cert-logo-left">
              <EIOSHMono size={68} />
            </div>
            <div className="cert-wordmark">
              <div className="cert-wordmark-e">EIOSH</div>
              <div className="cert-wordmark-sub">Internationally Recognize Institute of Safety</div>
            </div>
            <div className="cert-logo-right">
              <NASPMark />
            </div>
          </div>

          {/* Red script title */}
          <h1 className="cert-title">{title}</h1>

          <p className="cert-intro">This is to certify that</p>

          {/* Holder name line with an underline */}
          <div className="cert-holder">{holder || "_____________________________"}</div>

          <p className="cert-body">has satisfied the examiner and was</p>
          <p className="cert-body">Awarded to</p>

          {/* Course / award */}
          <div className="cert-course">{course || ""}</div>

          {issueDate ? (
            <p className="cert-date">Issued: {formatDate(issueDate)}</p>
          ) : null}

          {/* Signature block */}
          <div className="cert-signatures">
            <div className="cert-sig">
              <span className="cert-sig-line" />
              <span className="cert-sig-name">{authorizedInstructor}</span>
            </div>
            <div className="cert-mono-small" aria-hidden>
              <EIOSHMono size={60} />
            </div>
            <div className="cert-sig">
              <span className="cert-sig-line" />
              <span className="cert-sig-name">{chairman}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================= */
/* Ornate blue scalloped border — repeating SVG pattern on all 4 sides */
/* ================================================================= */
function OrnateBorder() {
  return (
    <>
      <svg className="cert-border cert-border-top" viewBox="0 0 1400 70" preserveAspectRatio="none">
        <defs>
          <pattern id="scallopX" x="0" y="0" width="42" height="70" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#184CA0" strokeWidth="1.5">
              <path d="M0 62 Q21 44 42 62" />
              <path d="M0 58 Q21 40 42 58" />
              <path d="M0 54 Q21 36 42 54" />
              <path d="M0 50 Q21 32 42 50" />
              <path d="M0 8 L42 8" strokeWidth="2.5" />
              <path d="M0 14 L42 14" />
              <path d="M0 20 L42 20" />
            </g>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#scallopX)" />
      </svg>
      <svg className="cert-border cert-border-bottom" viewBox="0 0 1400 70" preserveAspectRatio="none">
        <use href="#scallopX" />
        <rect x="0" y="0" width="100%" height="100%" fill="url(#scallopX)" transform="scale(1,-1) translate(0,-70)" />
      </svg>
      <svg className="cert-border cert-border-left" viewBox="0 0 70 1400" preserveAspectRatio="none">
        <defs>
          <pattern id="scallopY" x="0" y="0" width="70" height="42" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="#184CA0" strokeWidth="1.5">
              <path d="M62 0 Q44 21 62 42" />
              <path d="M58 0 Q40 21 58 42" />
              <path d="M54 0 Q36 21 54 42" />
              <path d="M50 0 Q32 21 50 42" />
              <path d="M8 0 L8 42" strokeWidth="2.5" />
              <path d="M14 0 L14 42" />
              <path d="M20 0 L20 42" />
            </g>
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#scallopY)" />
      </svg>
      <svg className="cert-border cert-border-right" viewBox="0 0 70 1400" preserveAspectRatio="none">
        <rect x="0" y="0" width="100%" height="100%" fill="url(#scallopY)" transform="scale(-1,1) translate(-70,0)" />
      </svg>

      {/* Decorative corner rosettes */}
      <div className="cert-corner cert-corner-tl"><CornerRosette /></div>
      <div className="cert-corner cert-corner-tr"><CornerRosette /></div>
      <div className="cert-corner cert-corner-bl"><CornerRosette /></div>
      <div className="cert-corner cert-corner-br"><CornerRosette /></div>
    </>
  );
}

function CornerRosette() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="#184CA0" strokeWidth="1.2">
      <circle cx="40" cy="40" r="24" />
      <circle cx="40" cy="40" r="18" />
      <circle cx="40" cy="40" r="12" />
      <path d="M40 16 L40 64 M16 40 L64 40 M22 22 L58 58 M58 22 L22 58" />
      <circle cx="40" cy="40" r="6" fill="#184CA0" />
    </svg>
  );
}

function EIOSHMono({ size = 68, faded = false }: { size?: number; faded?: boolean }) {
  const navy = faded ? "#B8C5D6" : "#184CA0";
  const sky = faded ? "#E5ECF6" : "#7CB2E4";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      <path d="M50 5 L95 85 L5 85 Z" fill={sky} opacity={faded ? 0.4 : 1} />
      <circle cx="50" cy="62" r="22" fill="none" stroke={navy} strokeWidth="3" />
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="16"
        fontStyle="italic"
        fill={navy}
      >
        Eiosh
      </text>
    </svg>
  );
}

function NASPMark() {
  return (
    <div className="nasp-mark">
      <div className="nasp-small">National Association of Safety</div>
      <div className="nasp-big">
        N<span className="nasp-red-a">A</span>SP
      </div>
      <div className="nasp-small-italic">Professionals</div>
    </div>
  );
}

/* ================================================================= */
const CSS = `
@page { size: A4; margin: 0; }
@media screen {
  body { background: #eaeaea; }
}
.cert-doc {
  font-family: Georgia, 'Iowan Old Style', serif;
  color: #0A0A0A;
  display: flex;
  justify-content: center;
  padding: 24px;
}
.cert-page {
  position: relative;
  background: #FAFAF7;
  background-image: repeating-linear-gradient(0deg, rgba(11,31,58,0.02) 0 1px, transparent 1px 32px);
  width: 297mm;
  height: 210mm;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.12);
}
.cert-diploma .cert-page {
  width: 210mm;
  height: 297mm;
}

/* Ornate border placement */
.cert-border { position: absolute; color: #184CA0; }
.cert-border-top, .cert-border-bottom { left: 36px; right: 36px; height: 34px; }
.cert-border-top { top: 18px; }
.cert-border-bottom { bottom: 18px; }
.cert-border-left, .cert-border-right { top: 52px; bottom: 52px; width: 34px; }
.cert-border-left { left: 18px; }
.cert-border-right { right: 18px; }

.cert-corner { position: absolute; width: 80px; height: 80px; }
.cert-corner-tl { top: 8px; left: 8px; }
.cert-corner-tr { top: 8px; right: 8px; }
.cert-corner-bl { bottom: 8px; left: 8px; }
.cert-corner-br { bottom: 8px; right: 8px; }

/* Watermark "EIOSH EIOSH..." */
.cert-watermark {
  position: absolute;
  inset: 70px 70px 70px 70px;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(184,193,214,0.22) 0 14px,
    transparent 14px 28px
  );
  pointer-events: none;
}
.cert-watermark::before {
  content: 'EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH EIOSH';
  display: block;
  color: rgba(184,193,214,0.35);
  font-size: 11px;
  letter-spacing: 2px;
  line-height: 14px;
  font-family: Arial, sans-serif;
  word-break: break-all;
  padding: 4px;
}
.cert-mono-watermark {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  opacity: 0.18;
}

/* Content */
.cert-content {
  position: relative;
  z-index: 2;
  padding: 70px 96px;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.cert-ids {
  display: flex; justify-content: space-between;
  font-size: 12px; color: #0A0A0A;
  margin-bottom: 14px;
}
.cert-id-label { font-weight: 700; margin-right: 6px; }
.cert-id-value { font-family: 'Times New Roman', serif; letter-spacing: 2px; }
.cert-header {
  display: grid;
  grid-template-columns: 80px 1fr 120px;
  align-items: center;
  gap: 16px;
  margin: 4px 0 18px;
}
.cert-logo-left, .cert-logo-right { display: flex; justify-content: center; }
.cert-wordmark-e {
  font-family: Arial, sans-serif;
  font-weight: 900;
  font-size: 58px;
  color: #E87D1E;
  letter-spacing: -1px;
  line-height: 1;
}
.cert-wordmark-sub {
  background: #E87D1E;
  color: #FFFFFF;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  display: inline-block;
  margin-top: 6px;
  clip-path: polygon(2% 0%, 100% 0%, 98% 100%, 0% 100%);
}
.cert-title {
  font-family: 'Great Vibes', 'Kunstler Script', 'Lucida Handwriting', cursive;
  color: #D42B2B;
  font-size: 82px;
  font-weight: 400;
  margin: 10px 0 8px;
  line-height: 1;
}
.cert-diploma .cert-title { font-size: 96px; }
.cert-intro, .cert-body {
  font-family: 'Great Vibes', 'Kunstler Script', 'Lucida Handwriting', cursive;
  font-size: 26px;
  color: #0A0A0A;
  margin: 4px 0;
  line-height: 1.2;
}
.cert-holder {
  font-family: 'Times New Roman', serif;
  font-size: 34px;
  font-weight: 400;
  margin: 16px auto 8px;
  padding: 4px 24px 8px;
  border-bottom: 1.5px solid #0A0A0A;
  width: 70%;
}
.cert-course {
  font-family: 'Times New Roman', serif;
  font-size: 28px;
  font-weight: 700;
  margin: 14px auto 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.cert-date {
  font-family: 'Times New Roman', serif;
  font-size: 14px;
  margin: 10px 0 0;
  color: #4A4A4A;
}
.cert-signatures {
  margin-top: auto;
  padding-top: 30px;
  display: grid;
  grid-template-columns: 1fr 100px 1fr;
  align-items: end;
  gap: 30px;
}
.cert-sig { display: flex; flex-direction: column; align-items: center; }
.cert-sig-line { border-top: 1px solid #0A0A0A; width: 80%; margin-bottom: 6px; }
.cert-sig-name {
  font-family: 'Times New Roman', serif;
  font-style: italic;
  font-weight: 700;
  font-size: 13px;
  color: #0A0A0A;
}
.cert-mono-small { display: flex; justify-content: center; }

/* NASP mark */
.nasp-mark {
  font-family: Arial, sans-serif;
  text-align: center;
  line-height: 1;
}
.nasp-small { font-size: 9px; font-weight: 700; color: #184CA0; }
.nasp-big { font-size: 32px; font-weight: 900; color: #184CA0; letter-spacing: -1px; margin: 2px 0; }
.nasp-red-a { color: #D42B2B; }
.nasp-small-italic { font-size: 9px; font-style: italic; color: #184CA0; }

@media print {
  body { background: #fff !important; }
  .cert-doc { padding: 0; }
  .cert-page { box-shadow: none; }
}
`;
