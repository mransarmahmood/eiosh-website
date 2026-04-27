import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Handshake, Globe2, GraduationCap, Layers } from "lucide-react";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Partnership Inquiry",
  description:
    "Become an EIOSH affiliated training partner, reseller, university progression partner or corporate alliance. Submit a partnership inquiry.",
  path: "/partnership",
});

const tracks = [
  {
    icon: Handshake,
    t: "Affiliated training provider",
    d: "Deliver EIOSH-accredited programmes in your region under a co-branded approval.",
  },
  {
    icon: Layers,
    t: "Reseller / channel partner",
    d: "Represent EIOSH's qualification catalogue commercially in your market.",
  },
  {
    icon: GraduationCap,
    t: "University progression partner",
    d: "Articulate EIOSH Level 5 / 6 diplomas into your undergraduate or postgraduate routes.",
  },
  {
    icon: Globe2,
    t: "Corporate alliance",
    d: "Long-term workforce development partnerships for multi-country enterprises and government entities.",
  },
];

export default function PartnershipPage() {
  return (
    <>
      <PageHero
        eyebrow="Partnerships"
        title="Partner with EIOSH to extend regulated qualifications in your market."
        description="We work with training providers, universities, corporate clients and government entities to scale access to internationally regulated qualifications responsibly."
        breadcrumbs={[{ label: "Partnerships" }]}
      />

      <Section>
        <Container>
          <SectionHeading eyebrow="Partnership tracks" title="Four ways we partner." />
          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {tracks.map((t) => {
              const Icon = t.icon;
              return (
                <li key={t.t} className="rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-50 text-navy-800 ring-1 ring-inset ring-navy-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-5 font-heading text-lg font-semibold text-navy-900">{t.t}</p>
                  <p className="mt-2 text-sm text-ink-muted">{t.d}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section tone="subtle">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div>
              <p className="eyebrow">Submit a partnership inquiry</p>
              <h2 className="mt-3 text-display-sm font-heading font-semibold text-navy-900">
                Tell us about your organisation and what you'd like to build with us.
              </h2>
              <p className="mt-4 text-ink-muted">
                Our partnerships team reviews every serious inquiry personally. A partnerships director will follow up within two business days with a first conversation and, where a fit is likely, a short diligence process.
              </p>
            </div>
            <InquiryForm variant="partnership" />
          </div>
        </Container>
      </Section>
    </>
  );
}
