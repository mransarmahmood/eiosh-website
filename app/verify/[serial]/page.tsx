import { promises as fs } from "node:fs";
import { join } from "node:path";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Cert {
  id: string;
  holder: string;
  certificateNumber: string;
  registrationNumber: string | null;
  course: string;
  issueDate: string | null;
  expiryDate: string | null;
  company: string | null;
}

async function lookup(serial: string): Promise<Cert | null> {
  const path = join(process.cwd(), "content", "data", "certificates.json");
  try {
    const certs: Cert[] = JSON.parse(await fs.readFile(path, "utf-8"));
    const norm = (s?: string | null) => String(s ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
    const s = norm(serial.replace(/^eiosh-?/i, ""));
    return certs.find((c) => {
      return norm(c.certificateNumber) === s || norm(c.registrationNumber) === s || norm(c.id.replace(/^cert-/, "")) === s;
    }) ?? null;
  } catch {
    return null;
  }
}

const FMT = (d?: string | null) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) : "—";

export default async function VerifyBySerial({ params }: { params: { serial: string } }) {
  const rec = await lookup(params.serial);
  const valid = !!rec;
  const expired = rec?.expiryDate ? new Date(rec.expiryDate) < new Date() : false;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap"
        rel="stylesheet"
      />
      <main style={{ minHeight: "100vh", background: "#FDFCF8", fontFamily: "'Inter', system-ui, sans-serif", padding: "48px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <header style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/Logo.png" alt="EIOSH" style={{ height: 56, width: "auto" }} />
            <div>
              <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "#B8860B", fontWeight: 600 }}>Public certificate register</p>
              <h1 style={{ margin: "4px 0 0", fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 30, fontWeight: 600, color: "#0A2540" }}>Certificate verification</h1>
            </div>
          </header>

          {valid ? (
            <section
              style={{
                background: "#fff",
                border: `2px solid ${expired ? "#B8860B" : "#1F6B47"}`,
                borderLeftWidth: 6,
                borderRadius: 6,
                padding: "28px 32px",
                boxShadow: "0 12px 36px rgba(10,37,64,.10)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 32, height: 32, borderRadius: "50%",
                  background: expired ? "#F5EBDC" : "#E8F2EC",
                  color: expired ? "#B8860B" : "#1F6B47",
                  fontSize: 18, fontWeight: 700,
                }}>✓</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: expired ? "#B8860B" : "#1F6B47", fontSize: 15 }}>
                    {expired ? "Certificate is genuine — but has expired" : "Certificate is genuine and valid"}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>Verified against the OSHAwards / EIOSH public register.</p>
                </div>
              </div>

              <dl style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 28px", margin: 0 }}>
                <Row label="Certificate holder" value={rec.holder} big />
                <Row label="Programme / course" value={rec.course} big />
                <Row label="Certificate no." value={rec.certificateNumber} mono />
                <Row label="Registration no." value={rec.registrationNumber} mono />
                <Row label="Issue date" value={FMT(rec.issueDate)} mono />
                <Row label="Expiry date" value={FMT(rec.expiryDate)} mono tone={expired ? "warn" : undefined} />
              </dl>

              <p style={{ margin: "24px 0 0", fontSize: 11, color: "#6B7280", lineHeight: 1.6 }}>
                This certificate is registered with EIOSH International. If you believe this record is inaccurate or the certificate has been
                tampered with, contact <a href="mailto:info@eiosh.com" style={{ color: "#0A2540" }}>info@eiosh.com</a> citing the certificate number above.
              </p>
            </section>
          ) : (
            <section
              style={{
                background: "#fff",
                border: "2px solid #8B2A2A",
                borderLeftWidth: 6,
                borderRadius: 6,
                padding: "28px 32px",
                boxShadow: "0 12px 36px rgba(10,37,64,.10)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 32, height: 32, borderRadius: "50%", background: "#F5E6E6", color: "#8B2A2A", fontSize: 18, fontWeight: 700 }}>✗</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 600, color: "#8B2A2A", fontSize: 15 }}>No certificate found for reference {params.serial}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>This reference does not appear in the public register.</p>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "#4A4A4A", lineHeight: 1.6, margin: "10px 0 0" }}>
                Please double-check the certificate or registration number and try again. You can also
                {" "}<Link href="/verify-certificate" style={{ color: "#0A2540", fontWeight: 500 }}>search the full register</Link>.
              </p>
            </section>
          )}

          <footer style={{ marginTop: 32, textAlign: "center", fontSize: 11, color: "#6B7280" }}>
            EIOSH International · OSHAwards · ISO/IEC 17024 · {" "}
            <Link href="/verify-certificate" style={{ color: "#0A2540" }}>Search the register</Link>
          </footer>
        </div>
      </main>
    </>
  );
}

function Row({ label, value, mono, big, tone }: { label: string; value: any; mono?: boolean; big?: boolean; tone?: "warn" }) {
  return (
    <div>
      <dt style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#6B7280", fontWeight: 600, margin: 0 }}>{label}</dt>
      <dd
        style={{
          margin: "6px 0 0",
          fontFamily: mono ? "'JetBrains Mono', monospace" : (big ? "'Cormorant Garamond', Georgia, serif" : undefined),
          fontSize: big ? 22 : 14,
          fontWeight: big ? 600 : 500,
          color: tone === "warn" ? "#B8860B" : "#0A2540",
          lineHeight: 1.3,
        }}
      >
        {value ?? "—"}
      </dd>
    </div>
  );
}
