import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { CertificateVerifyForm } from "@/components/forms/CertificateVerifyForm";
import { ShieldCheck, QrCode, Globe2 } from "lucide-react";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Verify a Certificate",
  description:
    "Verify an EIOSH-issued certificate instantly. Every certificate carries a unique reference and QR code for employer, regulator and awarding-body verification.",
  path: "/verify-certificate",
});

const trust = [
  { icon: ShieldCheck, label: "Tamper-proof", note: "Each certificate has a unique registry entry." },
  { icon: QrCode, label: "QR verifiable", note: "Scan to reach this page with the reference pre-filled." },
  { icon: Globe2, label: "Employer-ready", note: "Shareable with HR, regulators or awarding bodies." },
];

export default function VerifyCertificatePage() {
  return (
    <>
      <PageHero
        eyebrow="Certificate verification"
        title="Validate an EIOSH certificate in seconds."
        description="For employers, regulators and awarding bodies. Enter the reference shown on the certificate and (optionally) the holder's name — we return the issue date, expiry and programme details."
        breadcrumbs={[{ label: "Verify Certificate" }]}
        align="center"
      >
        <div className="mx-auto mt-2 flex flex-wrap items-center justify-center gap-4 text-[0.75rem] text-white/75">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-cyan-300" /> 681 certificates indexed
          </span>
          <span className="hidden sm:inline h-1 w-1 rounded-full bg-white/30" aria-hidden />
          <span>Approved centre for IOSH · OSHAcademy · OSHAwards · HABC · OTHM · NASP</span>
        </div>
      </PageHero>

      <Section tone="subtle">
        <Container>
          {/* Trust band */}
          <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            {trust.map((t) => {
              const Icon = t.icon;
              return (
                <li
                  key={t.label}
                  className="flex items-start gap-3 rounded-2xl bg-white p-5 ring-1 ring-border shadow-elevated"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-heading text-sm font-semibold text-navy-900">{t.label}</p>
                    <p className="mt-0.5 text-xs text-ink-muted">{t.note}</p>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mx-auto mt-12 max-w-5xl">
            <CertificateVerifyForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
