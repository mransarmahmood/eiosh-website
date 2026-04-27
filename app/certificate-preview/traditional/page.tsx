import { SAMPLE } from "@/components/admin/preview/CertificateSample";
import { qrDataUrl } from "@/lib/cert-qr";
import PrintBtn from "./PrintBtn";

export const dynamic = "force-dynamic";

export default async function TraditionalCertificatePreview() {
  const s = SAMPLE;
  const qr = await qrDataUrl(s.verificationUrl, { size: 320 });

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{CSS}</style>

      <div className="cert-shell">
        <div className="cert-toolbar">
          <a href="/certificate-preview" className="cert-back">← Back to concepts</a>
          <PrintBtn />
        </div>

        <article className="cert-page">
          <div className="cert-edge-navy" aria-hidden />
          <div className="cert-edge-cyan" aria-hidden />
          <div className="cert-edge-gold" aria-hidden />

          <CornerBracket position="tl" />
          <CornerBracket position="tr" />
          <CornerBracket position="bl" />
          <CornerBracket position="br" />

          <GuillocheWatermark />

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/OSHAWARDS THE CERTIFICATION PREMIER AWARDING BODY-01.png" alt="" aria-hidden className="cert-arms-watermark" />
          <div className="cert-name-watermark" aria-hidden>{s.holder.toUpperCase()}</div>

          <div className="cert-content">
            <header className="cert-top">
              <div className="cert-top-left">
                <span className="cert-label">Serial</span>
                <span className="cert-mono">S/N&nbsp;{s.serial}</span>
              </div>
              <div className="cert-top-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/Logo.png" alt="EIOSH" className="cert-eiosh-logo" />
                <div className="cert-tagline">Internationally Recognised Institute of Safety</div>
              </div>
              <div className="cert-top-right">
                <span className="cert-label">Registration</span>
                <span className="cert-mono">REG&nbsp;{s.registration}</span>
                <div className="cert-qr">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qr} alt={`Scan to verify ${s.serial}`} />
                </div>
                <span className="cert-qr-caption">Scan to verify</span>
              </div>
            </header>

            <div className="cert-centre">
              <div className="cert-kicker">{s.kicker}</div>
              <p className="cert-intro">This is to certify that</p>
              <h1 className="cert-name">{s.holder}</h1>
              <div className="cert-gold-rule" />
              <p className="cert-intro">has successfully completed the requirements of</p>
              <h2 className="cert-programme">{s.programme}</h2>

              <dl className="cert-meta">
                <div><dt>Credit hours</dt><dd>{s.creditHours}</dd></div>
                <div><dt>Grade</dt><dd>{s.grade}</dd></div>
                <div><dt>Issued</dt><dd>{s.issueDate}</dd></div>
                <div><dt>Valid until</dt><dd>{s.expiryDate}</dd></div>
              </dl>
            </div>

            <footer className="cert-bottom">
              <div className="cert-sig cert-sig-left">
                <span className="cert-sig-line" />
                <span className="cert-sig-name">{s.directorName}</span>
                <span className="cert-sig-title">{s.directorTitle}</span>
              </div>
              <div className="cert-seal-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/OSHAWARDS THE CERTIFICATION PREMIER AWARDING BODY-01.png" alt="OSHAwards" className="cert-arms-seal" />
              </div>
              <div className="cert-sig cert-sig-right">
                <span className="cert-sig-line" />
                <span className="cert-sig-name">{s.accreditorName}</span>
                <span className="cert-sig-title">{s.accreditorTitle}</span>
              </div>
            </footer>

            <div className="cert-partners">
              <div className="cert-partners-label">Authorized and Approved Training Partner of</div>
              <div className="cert-partners-logos">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/IOSH logo.png" alt="IOSH" />
                <span className="cert-partners-sep" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/NASP.jpg" alt="NASP" />
                <span className="cert-partners-sep" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/OTHM.png" alt="OTHM" />
                <span className="cert-partners-sep" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/HABC.png" alt="HABC" />
                <span className="cert-partners-sep" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/OSHAcademy.jpg" alt="OSHAcademy" />
              </div>
            </div>

            <div className="cert-microprint">{`Verify at ${s.verificationUrl}  ·  `.repeat(6).trim()}</div>
          </div>
        </article>
      </div>
    </>
  );
}

function CornerBracket({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const base: React.CSSProperties = { position: "absolute", width: 64, height: 64, zIndex: 3 };
  const pos: Record<string, React.CSSProperties> = {
    tl: { top: 12, left: 12 },
    tr: { top: 12, right: 12, transform: "scaleX(-1)" },
    bl: { bottom: 12, left: 12, transform: "scaleY(-1)" },
    br: { bottom: 12, right: 12, transform: "scale(-1,-1)" },
  };
  return (
    <svg style={{ ...base, ...pos[position] }} viewBox="0 0 64 64" fill="none">
      <path d="M0 22 L0 0 L22 0" stroke="#B8860B" strokeWidth="1.5" />
      <path d="M0 30 L0 6 L6 0 L30 0" stroke="#B8860B" strokeWidth="0.6" />
      <path d="M0 38 L0 12 L12 0 L38 0" stroke="#1FB6E0" strokeWidth="0.5" strokeDasharray="2 1.5" opacity="0.6" />
      <circle cx="10" cy="10" r="2.6" fill="#C62828" />
      <circle cx="10" cy="10" r="4.4" fill="none" stroke="#B8860B" strokeWidth="0.5" />
    </svg>
  );
}

function GuillocheWatermark() {
  return (
    <svg className="cert-guilloche" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id="guilloche-trad" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20 Q10 0 20 20 T40 20" fill="none" stroke="#0A2540" strokeWidth="0.4" />
          <path d="M0 20 Q10 40 20 20 T40 20" fill="none" stroke="#C62828" strokeWidth="0.3" opacity="0.5" />
          <circle cx="20" cy="20" r="12" fill="none" stroke="#B8860B" strokeWidth="0.3" />
          <circle cx="20" cy="20" r="6" fill="none" stroke="#1FB6E0" strokeWidth="0.25" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#guilloche-trad)" opacity="0.065" />
    </svg>
  );
}

const CSS = `
@page { size: A4 landscape; margin: 0; }
@media screen { body { background: #E9E7E1; } }

.cert-shell { padding: 32px 24px; display: flex; flex-direction: column; align-items: center; font-family: 'Inter', system-ui, sans-serif; }
.cert-toolbar { width: 297mm; max-width: 100%; display: flex; justify-content: space-between; margin-bottom: 14px; }
.cert-back { font-size: 13px; color: #0A2540; text-decoration: none; font-weight: 500; }
.cert-back:hover { color: #B8860B; }

.cert-page {
  position: relative;
  width: 297mm; height: 210mm;
  background: #FDFCF8;
  background-image:
    radial-gradient(ellipse at top right, rgba(31,182,224,0.045) 0%, transparent 55%),
    radial-gradient(ellipse at bottom left, rgba(198,40,40,0.035) 0%, transparent 55%);
  box-shadow: 0 12px 40px rgba(10,37,64,.18);
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  color: #0A2540;
}

/* Border flush with the edge of the page */
.cert-edge-navy, .cert-edge-cyan, .cert-edge-gold { position: absolute; pointer-events: none; border-style: solid; }
.cert-edge-navy  { inset: 0;    border-width: 3px;   border-color: #0A2540; }
.cert-edge-cyan  { inset: 3px;  border-width: 1.2px; border-color: #1FB6E0; }
.cert-edge-gold  { inset: 7px;  border-width: 0.6px; border-color: #B8860B; }

.cert-guilloche { position: absolute; inset: 20px; z-index: 1; }
.cert-arms-watermark {
  position: absolute; top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 420px; height: auto;
  opacity: 0.06; z-index: 1; pointer-events: none;
}
.cert-name-watermark {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 700;
  font-size: 120px; color: rgba(10,37,64,0.035);
  letter-spacing: 0.08em; white-space: nowrap;
  transform: rotate(-22deg); pointer-events: none; z-index: 1;
}

.cert-content {
  position: relative; z-index: 2;
  padding: 44px 72px 28px;
  height: 100%;
  display: flex; flex-direction: column;
}

.cert-top { display: grid; grid-template-columns: 1fr 1.3fr 1fr; align-items: flex-start; gap: 24px; margin-bottom: 14px; }
.cert-top-left { display: flex; flex-direction: column; gap: 2px; }
.cert-top-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.cert-label { font-size: 9.5px; letter-spacing: 0.2em; text-transform: uppercase; color: #6B7280; font-weight: 600; }
.cert-mono { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: #0A2540; font-weight: 500; }

.cert-qr { margin-top: 4px; border: 2px solid #1FB6E0; padding: 4px; background: #fff; line-height: 0; }
.cert-qr img { width: 96px; height: 96px; display: block; }
.cert-qr-caption { font-size: 8.5px; letter-spacing: 0.18em; text-transform: uppercase; color: #0E6BA8; font-weight: 600; margin-top: 3px; }

/* Clean EIOSH logo — no ribbon or backdrop */
.cert-top-center { text-align: center; }
.cert-eiosh-logo { height: 72px; width: auto; object-fit: contain; display: block; margin: 0 auto; }
.cert-tagline { font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: #0A2540; font-weight: 600; margin-top: 8px; }

.cert-centre { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 4px 0; }
.cert-kicker {
  font-size: 13px; letter-spacing: 0.42em; text-transform: uppercase;
  color: #B8860B; font-weight: 600;
  padding: 6px 28px;
  border-top: 1.5px double #C62828;
  border-bottom: 1.5px double #C62828;
  display: inline-block; margin-bottom: 16px;
  background: linear-gradient(90deg, rgba(184,134,11,0.04), rgba(31,182,224,0.04), rgba(184,134,11,0.04));
}
.cert-intro { font-family: 'Cormorant Garamond', Georgia, serif; font-style: italic; font-size: 18px; color: #1B3A5C; margin: 4px 0; }
.cert-name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 600; font-size: 60px; color: #0A2540;
  line-height: 1.05; margin: 4px 0 6px;
  max-width: 90%; overflow-wrap: anywhere;
}
.cert-gold-rule {
  width: 260px; height: 2px;
  background: linear-gradient(to right, transparent, #B8860B 15%, #C62828 50%, #B8860B 85%, transparent);
  margin: 4px auto 12px;
}
.cert-programme {
  font-family: 'Inter', sans-serif;
  font-size: 20px; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #0A2540; margin: 8px 0 14px; line-height: 1.3;
}
.cert-meta {
  display: flex; gap: 36px; margin: 4px 0 0; padding: 8px 18px;
  justify-content: center;
  background: linear-gradient(90deg, rgba(10,37,64,0.02), rgba(31,182,224,0.05), rgba(10,37,64,0.02));
  border-radius: 2px;
}
.cert-meta > div { text-align: center; }
.cert-meta dt { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #6B7280; font-weight: 600; margin: 0; }
.cert-meta dd { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #0A2540; margin: 4px 0 0; font-weight: 500; }

.cert-bottom { display: grid; grid-template-columns: 1fr auto 1fr; align-items: flex-end; gap: 32px; margin-top: 12px; }
.cert-sig { display: flex; flex-direction: column; align-items: center; }
.cert-sig-left { align-items: flex-start; }
.cert-sig-right { align-items: flex-end; }
.cert-sig-line { border-top: 1px solid #0A2540; width: 220px; margin-bottom: 4px; }
.cert-sig-name { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 16px; font-weight: 600; font-style: italic; color: #0A2540; }
.cert-sig-title { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #6B7280; margin-top: 2px; }

.cert-seal-wrap { display: flex; align-items: center; justify-content: center; }
.cert-arms-seal { width: 130px; height: auto; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15)); }

.cert-partners {
  margin-top: 10px; padding-top: 8px;
  border-top: 1px solid #1FB6E0;
  display: flex; flex-direction: column; align-items: center; gap: 5px;
}
.cert-partners-label { font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: #6B7280; font-weight: 600; }
.cert-partners-logos { display: flex; align-items: center; gap: 16px; height: 32px; }
.cert-partners-logos img { height: 28px; width: auto; max-width: 110px; object-fit: contain; }
.cert-partners-logos img[alt="IOSH"]       { height: 24px; }
.cert-partners-logos img[alt="NASP"]       { height: 28px; }
.cert-partners-logos img[alt="OSHAcademy"] { height: 24px; }
.cert-partners-sep { width: 1px; height: 18px; background: #D9D3C6; }

.cert-microprint {
  position: absolute; bottom: 4px; left: 30px; right: 30px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 5px; letter-spacing: 0.08em;
  color: rgba(10,37,64,0.4);
  text-align: center; overflow: hidden; white-space: nowrap;
}

@media print {
  body, html { background: white !important; }
  .cert-shell { padding: 0; }
  .cert-toolbar { display: none !important; }
  .cert-page { box-shadow: none; }
}
`;
