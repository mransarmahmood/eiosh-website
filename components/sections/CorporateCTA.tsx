import { ArrowRight, Building2, Users2, Globe2, ClipboardCheck } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const points = [
  { icon: Building2, t: "On-site or virtual", d: "Delivery on your premises or via Teams / Zoom, aligned to shift patterns." },
  { icon: Users2, t: "Cohorts of 6–500", d: "From focused senior-leader cohorts to enterprise-wide rollouts." },
  { icon: Globe2, t: "English & Arabic", d: "Selected programmes delivered bilingually with awarding-body approval." },
  { icon: ClipboardCheck, t: "Audit-ready records", d: "Attendance, assessment and certification reporting for HR and HSE audits." },
];

export function CorporateCTA() {
  return (
    <Section className="relative overflow-hidden" tone="gradient">
      <div className="absolute inset-0 bg-grid-subtle [background-size:32px_32px] opacity-[0.25]" aria-hidden />
      <div className="absolute -top-28 -right-28 h-96 w-96 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden />

      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <p className="eyebrow text-cyan-200">
              <span aria-hidden className="h-px w-6 bg-current" />
              Corporate training
            </p>
            <h2 className="mt-4 text-display-sm sm:text-display-md font-heading font-semibold text-white text-balance">
              Build a credentialed workforce — without disrupting the work.
            </h2>
            <p className="mt-5 max-w-xl text-white/80 text-lg leading-relaxed">
              Our corporate faculty designs tailored qualification programmes for energy, construction, logistics, hospitality and financial services clients across the GCC and beyond. One contract, one
              project manager, one quality standard.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button href="/corporate-training" variant="gold" size="lg">
                Explore corporate training <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                href="/contact#brochure"
                variant="outline"
                size="lg"
                className="bg-white/5 text-white ring-white/20 hover:bg-white/10 hover:ring-white/40"
              >
                Download capability deck
              </Button>
            </div>
          </div>

          <ul className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {points.map((p) => {
              const Icon = p.icon;
              return (
                <li
                  key={p.t}
                  className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-cyan-200 ring-1 ring-inset ring-white/10">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-4 font-heading text-lg font-semibold text-white">{p.t}</p>
                  <p className="mt-1 text-sm text-white/70">{p.d}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
