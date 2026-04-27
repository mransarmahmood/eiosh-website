import { SAMPLE } from "@/components/admin/preview/CertificateSample";
import { qrDataUrl } from "@/lib/cert-qr";
import PrintBtn from "./PrintBtn";

export const dynamic = "force-dynamic";

export default async function ContemporaryCertificatePreview() {
  const s = SAMPLE;
  const qr = await qrDataUrl(s.verificationUrl, { size: 320 });

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
      <style>{CSS}</style>

      <div className="cert-shell">
        <div className="cert-toolbar">
          <a href="/certificate-preview" className="cert-back">← Back to concepts</a>
          <PrintBtn />
        </div>

        <article className="cert-page">
          {/* Edge-flush borders */}
          <div className="cert-edge-outer" aria-hidden />
          <div className="cert-edge-inner" aria-hidden />

          {/* Navy → cyan gradient rail */}
          <aside className="cert-rail">
            <div className="cert-rail-arms">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/OSHAWARDS THE CERTIFICATION PREMIER AWARDING BODY-01.png" alt="OSHAwards" />
            </div>
            <div className="cert-rail-serial">
              <span className="cert-rail-label">Serial</span>
              <span className="cert-rail-serial-value">{s.serial}</span>
            </div>
            <div className="cert-rail-vertical">OSHAWARDS · EIOSH · ISO/IEC 17024</div>
          </aside>

          <GuillocheWatermark />
          <div className="cert-name-watermark" aria-hidden>{s.holder.toUpperCase()}</div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/OSHAWARDS THE CERTIFICATION PREMIER AWARDING BODY-01.png" alt="" aria-hidden className="cert-arms-watermark" />

          {/* Clean EIOSH logo — top-right corner, no background */}
          <div className="cert-corner-logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/Logo.png" alt="EIOSH" />
          </div>

          <div className="cert-content">
            <div className="cert-top-right">
              <div className="cert-qr-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt={`Scan to verify ${s.serial}`} />
                <span className="cert-qr-label">Scan to verify</span>
              </div>
              <div className="cert-reg">
                <span className="cert-label">Registration</span>
                <span className="cert-mono">{s.registration}</span>
              </div>
            </div>

            <div className="cert-centre">
              <div className="cert-gold-rule-short" />

              <h3 className="cert-kicker">{s.kicker}</h3>

              <p className="cert-intro">Awarded to</p>

              <h1 className="cert-name">{s.holder}</h1>

              <div className="cert-meta-row">
                <span className="cert-meta-pill">{s.creditHours} credit hours</span>
                <span className="cert-meta-pill cert-meta-pill-cyan">Grade · {s.grade}</span>
                <span className="cert-meta-pill">Issued {s.issueDate}</span>
              </div>

              <p className="cert-intro cert-for">for successful completion of</p>
              <h2 className="cert-programme">{s.programme}</h2>
            </div>

            <footer className="cert-bottom">
              <div className="cert-sig">
                <span className="cert-sig-line" />
                <span className="cert-sig-name">{s.directorName}</span>
                <span className="cert-sig-title">{s.directorTitle}</span>
              </div>
              <div className="cert-sig">
                <span className="cert-sig-line" />
                <span className="cert-sig-name">{s.accreditorName}</span>
                <span className="cert-sig-title">{s.accreditorTitle}</span>
              </div>
              <div className="cert-foil-seal">
                <FoilSeal />
                <span className="cert-valid">Valid until {s.expiryDate}</span>
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

function GuillocheWatermark() {
  return (
    <svg className="cert-guilloche" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden>
      <defs>
        <pattern id="guilloche-modern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <circle cx="30" cy="30" r="22" fill="none" stroke="#0A2540" strokeWidth="0.3" />
          <circle cx="30" cy="30" r="14" fill="none" stroke="#C62828" strokeWidth="0.25" opacity="0.7" />
          <circle cx="30" cy="30" r="8" fill="none" stroke="#B8860B" strokeWidth="0.28" />
          <circle cx="30" cy="30" r="3" fill="none" stroke="#1FB6E0" strokeWidth="0.22" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#guilloche-modern)" opacity="0.06" />
    </svg>
  );
}

function FoilSeal() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
      <defs>
        <radialGradient id="foilA" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#FFF5C4" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#7A5A10" />
        </radialGradient>
        <linearGradient id="foilB" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8CA76" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      <g transform="translate(60 60)">
        {Array.from({ length: 24 }).map((_, i) => (
          <path key={i} d="M0 -50 L3 -24 L0 -20 L-3 -24 Z"
                fill={i % 2 === 0 ? "url(#foilA)" : "url(#foilB)"}
                transform={`rotate(${i * 15})`}
                stroke="#7A5A10" strokeWidth="0.2" />
        ))}
      </g>
      <circle cx="60" cy="60" r="32" fill="url(#foilA)" stroke="#7A5A10" strokeWidth="0.6" />
      <circle cx="60" cy="60" r="28" fill="none" stroke="#C62828" strokeWidth="0.6" strokeDasharray="1 2" />
      <text x="60" y="57" textAnchor="middle" fontFamily="'Playfair Display', Georgia, serif" fontWeight="700" fontSize="15" fill="#0A2540">EIOSH</text>
      <text x="60" y="69" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="500" fontSize="5" letterSpacing="1.6" fill="#0A2540">CERTIFIED</text>
      <text x="60" y="77" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="500" fontSize="4.5" letterSpacing="1.3" fill="#0A2540">ISO 17024</text>
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
    radial-gradient(ellipse at 85% 20%, rgba(31,182,224,0.08) 0%, transparent 45%),
    radial-gradient(ellipse at 20% 85%, rgba(198,40,40,0.06) 0%, transparent 45%);
  box-shadow: 0 12px 40px rgba(10,37,64,.18);
  overflow: hidden;
  font-family: 'Inter', system-ui, sans-serif;
  color: #0A2540;
  display: flex;
}

/* Edge-flush double rule */
.cert-edge-outer, .cert-edge-inner { position: absolute; pointer-events: none; z-index: 5; border-style: solid; }
.cert-edge-outer { inset: 0;   border-width: 3px;   border-color: #1FB6E0; }
.cert-edge-inner { inset: 3px; border-width: 0.8px; border-color: #B8860B; }

/* Rail starts after the edge border */
.cert-rail {
  width: 90px; flex: 0 0 90px;
  margin-left: 10px;
  background: linear-gradient(180deg, #0A2540 0%, #1B3A5C 45%, #0E6BA8 100%);
  color: #FAF7F2;
  display: flex; flex-direction: column; align-items: center;
  padding: 22px 0; position: relative;
  border-right: 2px solid #C62828;
}
.cert-rail::after {
  content: ''; position: absolute; top: 0; bottom: 0; right: -2px; width: 2px;
  background: linear-gradient(180deg, #C62828 0%, #B8860B 50%, #1FB6E0 100%);
}
.cert-rail-arms { background: rgba(255,255,255,0.08); border-radius: 6px; padding: 6px; margin-bottom: 24px; }
.cert-rail-arms img { width: 60px; height: auto; object-fit: contain; display: block; }
.cert-rail-serial { writing-mode: vertical-rl; transform: rotate(180deg); text-align: right; margin-top: 12px; }
.cert-rail-label { font-size: 8px; letter-spacing: 0.32em; text-transform: uppercase; color: rgba(255,255,255,0.55); font-weight: 600; margin-bottom: 8px; }
.cert-rail-serial-value { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 500; letter-spacing: 0.14em; color: #D4AF37; }
.cert-rail-vertical {
  writing-mode: vertical-rl; transform: rotate(180deg);
  font-size: 8px; letter-spacing: 0.32em; color: rgba(255,255,255,0.45);
  margin-top: auto;
  font-family: 'JetBrains Mono', monospace;
}

.cert-guilloche { position: absolute; inset: 0; left: 100px; z-index: 1; }
.cert-name-watermark {
  position: absolute; inset: 0; left: 100px;
  display: flex; align-items: center; justify-content: center;
  font-family: 'Playfair Display', Georgia, serif; font-weight: 700;
  font-size: 132px; color: rgba(10,37,64,0.03);
  letter-spacing: 0.04em; white-space: nowrap;
  transform: rotate(-18deg); pointer-events: none; z-index: 1;
}
.cert-arms-watermark {
  position: absolute;
  top: 50%; left: calc(50% + 50px);
  transform: translate(-50%, -50%);
  width: 340px; height: auto;
  opacity: 0.05; z-index: 1; pointer-events: none;
}

/* Clean EIOSH logo in top-right corner, zero background */
.cert-corner-logo {
  position: absolute;
  top: 28px; right: 44px;
  z-index: 3;
}
.cert-corner-logo img { height: 64px; width: auto; object-fit: contain; display: block; }

.cert-content {
  position: relative; z-index: 2;
  flex: 1; padding: 110px 56px 26px;
  display: flex; flex-direction: column;
}

/* QR below the EIOSH corner logo */
.cert-top-right {
  position: absolute;
  top: 104px; right: 44px;
  display: flex; flex-direction: column; align-items: flex-end; gap: 6px; z-index: 3;
}
.cert-qr-frame {
  padding: 6px 6px 4px; border: 1.5px solid #1FB6E0; border-radius: 4px;
  background: #FDFCF8;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
}
.cert-qr-frame img { width: 84px; height: 84px; display: block; }
.cert-qr-label { font-size: 8.5px; letter-spacing: 0.18em; text-transform: uppercase; color: #0E6BA8; font-weight: 600; }
.cert-reg { text-align: right; }
.cert-label { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #6B7280; font-weight: 600; display: block; }
.cert-mono { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #0A2540; font-weight: 500; }

/* Centre */
.cert-centre { flex: 1; display: flex; flex-direction: column; justify-content: center; padding-right: 150px; }
.cert-gold-rule-short {
  width: 80px; height: 3px;
  background: linear-gradient(90deg, #C62828 0%, #B8860B 50%, #1FB6E0 100%);
  margin: 0 0 14px;
  border-radius: 2px;
}
.cert-kicker {
  font-size: 12px; letter-spacing: 0.4em; text-transform: uppercase;
  color: #B8860B; font-weight: 600; margin: 0 0 22px;
}
.cert-intro {
  font-family: 'Playfair Display', Georgia, serif; font-style: italic;
  font-size: 18px; color: #1B3A5C; margin: 4px 0 6px;
}
.cert-for { margin-top: 14px; }
.cert-name {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  font-size: 60px;
  color: #0A2540;
  line-height: 1.02;
  margin: 4px 0 12px;
  max-width: 92%; overflow-wrap: anywhere;
}
.cert-meta-row { display: flex; flex-wrap: wrap; gap: 8px; margin: 4px 0 14px; }
.cert-meta-pill {
  display: inline-flex; align-items: center;
  padding: 5px 12px;
  border: 1px solid #D9D3C6; border-radius: 2px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10.5px; color: #0A2540; background: #FDFCF8;
  font-weight: 500;
}
.cert-meta-pill-cyan { border-color: #1FB6E0; background: rgba(31,182,224,0.08); color: #0E6BA8; }
.cert-programme {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700; font-size: 24px; color: #0A2540; margin: 4px 0; line-height: 1.25;
  max-width: 92%;
}

/* BOTTOM */
.cert-bottom { display: grid; grid-template-columns: 1fr 1fr auto; gap: 32px; align-items: flex-end; margin-top: 16px; }
.cert-sig { display: flex; flex-direction: column; }
.cert-sig-line { border-top: 1px solid #0A2540; width: 200px; margin-bottom: 4px; }
.cert-sig-name { font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: 15px; color: #0A2540; }
.cert-sig-title { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: #6B7280; margin-top: 2px; }

.cert-foil-seal { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.cert-valid { font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase; color: #6B7280; font-weight: 600; }

.cert-partners {
  margin-top: 10px; padding-top: 8px;
  border-top: 1px solid #1FB6E0;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.cert-partners-label { font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: #6B7280; font-weight: 600; }
.cert-partners-logos { display: flex; align-items: center; gap: 16px; height: 32px; }
.cert-partners-logos img { height: 28px; width: auto; max-width: 110px; object-fit: contain; }
.cert-partners-logos img[alt="IOSH"]       { height: 24px; }
.cert-partners-logos img[alt="NASP"]       { height: 28px; }
.cert-partners-logos img[alt="OSHAcademy"] { height: 24px; }
.cert-partners-sep { width: 1px; height: 18px; background: #D9D3C6; }

.cert-microprint {
  position: absolute; bottom: 4px; left: 110px; right: 30px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 5px; letter-spacing: 0.08em;
  color: rgba(10,37,64,0.35);
  text-align: center; overflow: hidden; white-space: nowrap;
}

@media print {
  body, html { background: white !important; }
  .cert-shell { padding: 0; }
  .cert-toolbar { display: none !important; }
  .cert-page { box-shadow: none; }
}
`;
