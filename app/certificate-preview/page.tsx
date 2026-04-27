import Link from "next/link";

export const dynamic = "force-dynamic";

export default function CertificatePreviewIndex() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#E9E7E1",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#0A2540",
        padding: "48px 24px",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto" }}>
        <p style={{ textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 12, fontWeight: 600, color: "#B8860B", margin: 0 }}>
          Certificate redesign
        </p>
        <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 40, fontWeight: 600, marginTop: 8 }}>
          Pick a concept
        </h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, maxWidth: 700, color: "#1A1A1A" }}>
          Both render with the same live sample data (Ansar Umar · NEBOSH International General Certificate · Serial 55186 · Reg 4041). Click
          either tile to see the full A4-landscape template. Tell me which one to ship and I'll build the full stack — Blade template, service
          class, routes, verification page, PDF generator.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 40 }}>
          <Tile
            href="/certificate-preview/traditional"
            label="A · Editorial Traditional"
            lede="Triple-line border (crimson + navy + cyan) · gold corner brackets · OSHAwards coat-of-arms as centre seal · full EIOSH + OSHAwards + IFCA + Global Awards branding · Cormorant Garamond name"
            accent="#C62828"
          />
          <Tile
            href="/certificate-preview/contemporary"
            label="B · Contemporary Minimalist"
            lede="Navy → cyan gradient side rail carrying the OSHAwards coat-of-arms + vertical serial · asymmetric · gold foil sunburst seal · partner bar (OSHAwards · IFCA · Global Awards)"
            accent="#1FB6E0"
          />
        </div>

        <p style={{ marginTop: 40, fontSize: 13, color: "#6B7280" }}>
          Once you approve a concept, I'll replace <code>CertificateDocument.tsx</code> so every record at <code>/admin/certificates/*</code> uses the new design.
        </p>
      </div>
    </div>
  );
}

function Tile({ href, label, lede, accent }: { href: string; label: string; lede: string; accent: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        background: "#FDFCF8",
        padding: "28px 28px 24px",
        border: "1px solid #E8E4DB",
        borderLeft: `4px solid ${accent}`,
        borderRadius: 6,
        textDecoration: "none",
        color: "#0A2540",
        boxShadow: "0 1px 3px rgba(10,37,64,.06)",
      }}
    >
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: "0.14em", color: accent, margin: 0, textTransform: "uppercase", fontWeight: 600 }}>
        Concept
      </p>
      <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, fontWeight: 600, margin: "6px 0 10px" }}>{label}</h2>
      <p style={{ fontSize: 13, lineHeight: 1.55, color: "#1B3A5C", margin: 0 }}>{lede}</p>
      <p style={{ marginTop: 18, fontSize: 12, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: accent }}>
        Preview →
      </p>
    </Link>
  );
}
