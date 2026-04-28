import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Headphones,
  ShieldCheck,
  Sparkles,
  Timer,
  Building2,
  Users,
  Globe2,
  ArrowRight,
  Linkedin,
} from "lucide-react";
import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { FAQSection } from "@/components/sections/FAQSection";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact EIOSH",
  description:
    "Talk to an EIOSH advisor about qualifications, corporate training, certification preparation or verification. Response within one business day.",
  path: "/contact",
});

const promise = [
  {
    icon: Timer,
    t: "< 1 business day",
    d: "Average response from an EIOSH advisor to any enquiry submitted through this page.",
  },
  {
    icon: Headphones,
    t: "Named account lead",
    d: "Corporate enquiries are assigned a single account lead from first call through to certification.",
  },
  {
    icon: ShieldCheck,
    t: "Procurement-ready",
    d: "Trade licence, approval letters, tax documentation and insurance certificates on request.",
  },
  {
    icon: Sparkles,
    t: "Arabic & English",
    d: "Advisors, delivery and documentation available in both languages across the GCC region.",
  },
];

const offices = [
  {
    city: "Dubai",
    country: "United Arab Emirates",
    role: "Regional headquarters",
    address: ["Business Bay District", "Dubai, UAE"],
    phone: site.contact.phone,
    email: site.contact.email,
    flag: "🇦🇪",
  },
  {
    city: "Riyadh",
    country: "Saudi Arabia",
    role: "Corporate delivery hub",
    address: ["King Fahd Road", "Al Olaya, Riyadh 12214"],
    phone: "+966 11 123 4567",
    email: "riyadh@eiosh.com",
    flag: "🇸🇦",
  },
  {
    city: "Karachi",
    country: "Pakistan",
    role: "South Asia operations",
    address: ["Shahrah-e-Faisal", "Karachi 75350"],
    phone: "+92 21 1234 5678",
    email: "south-asia@eiosh.com",
    flag: "🇵🇰",
  },
  {
    city: "London",
    country: "United Kingdom",
    role: "Awarding-body liaison",
    address: ["Canary Wharf", "London E14"],
    phone: "+44 20 1234 5678",
    email: "uk@eiosh.com",
    flag: "🇬🇧",
  },
];

const departments = [
  { name: "Admissions", email: "admissions@eiosh.com", blurb: "Enrolments, cohort dates and course brochures." },
  { name: "Corporate", email: "corporate@eiosh.com", blurb: "In-house programmes, proposals, RFPs and procurement." },
  { name: "Registrar", email: "registrar@eiosh.com", blurb: "Certificate verification, transcripts and reissue." },
  { name: "Partnerships", email: "partners@eiosh.com", blurb: "Affiliated providers, universities and channel partners." },
  { name: "Press & media", email: "press@eiosh.com", blurb: "Interviews, spokespeople and research contributions." },
  { name: "Quality & appeals", email: "quality@eiosh.com", blurb: "Learner appeals, complaints and quality feedback." },
];

export default function ContactPage() {
  const whatsapp = site.contact.whatsapp.replace(/\D/g, "");

  return (
    <>
      <PageHero
        eyebrow="Talk to us"
        title="Speak to an advisor."
        description="Tell us what you're trying to achieve and we'll come back with a recommended qualification pathway, cohort dates and pricing — usually within one business day."
        breadcrumbs={[{ label: "Contact" }]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href="#enquire" variant="gold" size="lg">
            Send an enquiry <ArrowRight className="h-4 w-4" />
          </Button>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-13 items-center gap-2 rounded-lg bg-emerald-500 px-7 py-3.5 font-heading font-medium text-white shadow-elevated transition hover:bg-emerald-600"
          >
            <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
          </a>
          <a
            href={`tel:${site.contact.phone}`}
            className="inline-flex h-13 items-center gap-2 rounded-lg bg-white px-7 py-3.5 font-heading font-medium text-navy-900 ring-1 ring-inset ring-border transition hover:bg-navy-50 hover:ring-cyan-300 dark:bg-white/5 dark:text-white dark:ring-white/20 dark:hover:bg-white/10 dark:hover:ring-white/40"
          >
            <Phone className="h-4 w-4" /> {site.contact.phone}
          </a>
        </div>
      </PageHero>

      {/* Support promise band */}
      <section className="border-b border-border bg-white">
        <Container className="py-12">
          <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {promise.map((p) => {
              const Icon = p.icon;
              return (
                <li key={p.t} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-heading font-semibold text-navy-900">{p.t}</p>
                    <p className="mt-1 text-sm text-ink-muted">{p.d}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      {/* Direct lines + inquiry form */}
      <Section tone="subtle" id="enquire">
        <Container>
          <div className="grid gap-10 lg:grid-cols-5 lg:items-start">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl bg-white p-8 ring-1 ring-border shadow-elevated">
                <p className="eyebrow">Direct lines</p>
                <ul className="mt-5 space-y-5 text-sm text-ink">
                  <li className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                      <Mail className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-heading font-semibold text-navy-900">Email</p>
                      <a href={`mailto:${site.contact.email}`} className="text-ink-muted hover:text-navy-900">
                        {site.contact.email}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                      <Phone className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-heading font-semibold text-navy-900">Phone</p>
                      <a href={`tel:${site.contact.phone}`} className="text-ink-muted hover:text-navy-900">
                        {site.contact.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200">
                      <MessageCircle className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-heading font-semibold text-navy-900">WhatsApp</p>
                      <a
                        href={`https://wa.me/${whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ink-muted hover:text-navy-900"
                      >
                        Chat with an advisor
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-50 text-navy-800 ring-1 ring-inset ring-navy-200">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-heading font-semibold text-navy-900">Headquarters</p>
                      {site.contact.addressLines.map((line) => (
                        <p key={line} className="text-ink-muted">
                          {line}
                        </p>
                      ))}
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold-50 text-gold-700 ring-1 ring-inset ring-gold-200">
                      <Clock className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-heading font-semibold text-navy-900">Hours</p>
                      <p className="text-ink-muted">Sun – Thu, 9:00 – 18:00 GST</p>
                      <p className="text-xs text-ink-soft">Out-of-hours enquiries answered next business day.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Brochure card — visual */}
              <div id="brochure" className="relative overflow-hidden rounded-2xl bg-brand-gradient p-8 text-white shadow-floating">
                <div className="absolute inset-0 bg-grid-subtle [background-size:24px_24px] opacity-[0.2]" aria-hidden />
                <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-cyan-400/30 blur-3xl" aria-hidden />
                <div className="relative z-10">
                  <Badge tone="cyan" className="bg-cyan-500/15 text-cyan-200 ring-cyan-400/30">
                    <Sparkles className="h-3.5 w-3.5" /> Free download
                  </Badge>
                  <p className="mt-5 font-heading text-2xl font-semibold text-white">2026 Qualifications Brochure</p>
                  <p className="mt-3 text-white/80 text-sm">
                    64 pages. Every EIOSH programme, cohort calendar, fee schedule and awarding-body approval. Sent by email within the hour.
                  </p>
                  <Button href="#enquire" variant="gold" size="md" className="mt-6">
                    Request brochure <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <p className="eyebrow">Send an enquiry</p>
              <h2 className="mt-3 font-heading text-display-sm font-semibold text-navy-900">
                Tell us about your goal — we'll map the pathway.
              </h2>
              <p className="mt-4 text-ink-muted">
                Whether you're choosing your first qualification or scoping a 500-person rollout, an advisor will come back with a concrete recommendation and available cohorts.
              </p>
              <div className="mt-8">
                <InquiryForm variant="contact" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Global offices */}
      <Section>
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Global presence</p>
              <h2 className="mt-3 font-heading text-display-sm font-semibold text-navy-900 text-balance">
                Four offices. Sixty-four countries served.
              </h2>
              <p className="mt-4 text-ink-muted">
                EIOSH delivers in-person across the GCC and South Asia, online worldwide, and maintains a UK liaison office for awarding-body coordination.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-800 ring-1 ring-inset ring-cyan-200">
              <Globe2 className="h-4 w-4" /> Learners in 64 countries
            </div>
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {offices.map((o) => (
              <li
                key={o.city}
                className="group relative flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated transition hover:-translate-y-0.5 hover:ring-cyan-400 hover:shadow-floating"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl leading-none" aria-hidden>
                    {o.flag}
                  </span>
                  <Badge tone="navy">{o.role}</Badge>
                </div>
                <p className="mt-5 font-heading text-xl font-semibold text-navy-900">{o.city}</p>
                <p className="text-sm text-ink-soft">{o.country}</p>
                <ul className="mt-4 space-y-2 text-sm text-ink-muted">
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                    <span>
                      {o.address.map((l) => (
                        <span key={l} className="block">
                          {l}
                        </span>
                      ))}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-cyan-600" />
                    <a href={`tel:${o.phone.replace(/\s/g, "")}`} className="hover:text-navy-900">
                      {o.phone}
                    </a>
                  </li>
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-cyan-600" />
                    <a href={`mailto:${o.email}`} className="hover:text-navy-900 truncate">
                      {o.email}
                    </a>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Departments directory */}
      <Section tone="subtle">
        <Container>
          <div className="max-w-2xl">
            <p className="eyebrow">Email the right team directly</p>
            <h2 className="mt-3 font-heading text-display-sm font-semibold text-navy-900 text-balance">
              Six dedicated lines for six kinds of request.
            </h2>
            <p className="mt-4 text-ink-muted">
              Routing your enquiry to the right team saves you a round trip. Every department is staffed by a named lead with a one-business-day SLA.
            </p>
          </div>
          <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((d) => (
              <li key={d.name}>
                <a
                  href={`mailto:${d.email}`}
                  className="group flex h-full flex-col rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated transition hover:ring-cyan-400 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-heading text-lg font-semibold text-navy-900">{d.name}</p>
                    <ArrowRight className="h-4 w-4 text-cyan-600 transition group-hover:translate-x-0.5" />
                  </div>
                  <p className="mt-2 text-sm text-ink-muted">{d.blurb}</p>
                  <p className="mt-4 text-sm font-medium text-cyan-700">{d.email}</p>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Visual CTA band */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0 bg-grid-subtle [background-size:32px_32px] opacity-[0.3]" aria-hidden />
        <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-cyan-400/15 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-navy-700/40 blur-3xl" aria-hidden />
        <Container className="relative z-10 py-20 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <p className="eyebrow text-cyan-300">Prefer a human?</p>
              <h2 className="mt-4 font-heading text-display-sm sm:text-display-md font-semibold text-white text-balance">
                Book a 20-minute advisory call with an EIOSH specialist.
              </h2>
              <p className="mt-5 max-w-xl text-lg text-white/75 leading-relaxed">
                Walk through your goals, get a straight recommendation, and leave the call with a cohort shortlist and a pricing range — no sales scripts.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href="#enquire" variant="gold" size="lg">
                  Book my advisory call <ArrowRight className="h-4 w-4" />
                </Button>
                <a
                  href={site.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-6 py-3 font-heading font-medium text-white ring-1 ring-inset ring-white/20 transition hover:bg-white/10"
                >
                  <Linkedin className="h-4 w-4" /> Connect on LinkedIn
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, v: "42,000+", l: "Professionals trained" },
                  { icon: Building2, v: "380+", l: "Corporate clients" },
                  { icon: Globe2, v: "64", l: "Countries reached" },
                  { icon: ShieldCheck, v: "4.8 / 5", l: "Learner rating" },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.l}
                      className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10 backdrop-blur"
                    >
                      <Icon className="h-5 w-5 text-cyan-300" />
                      <p className="mt-3 font-heading text-2xl font-semibold text-white">{s.v}</p>
                      <p className="mt-1 text-xs text-white/60">{s.l}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <FAQSection limit={5} />
    </>
  );
}
