import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Compass, BookOpen, Target, Trophy } from "lucide-react";

const steps = [
  {
    icon: Compass,
    title: "1. Advisory call",
    body: "A 20-minute call to map your experience, goals and sector to the right awarding body and level.",
  },
  {
    icon: BookOpen,
    title: "2. Programme delivery",
    body: "Tutor-led, blended or self-paced — sequenced around your workload with monthly live workshops.",
  },
  {
    icon: Target,
    title: "3. Assessment support",
    body: "Mock exams, portfolio reviews and internal verification to the standard the awarding body requires.",
  },
  {
    icon: Trophy,
    title: "4. Certification & beyond",
    body: "Your regulated certificate, employer verification, and a progression plan to the next qualification level.",
  },
];

export function Pathway() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="The EIOSH pathway"
          title="Engineered for professionals who cannot afford to pass twice."
          description="Every programme is delivered with a four-step pathway that turns an exam qualification into a credential your employer, regulator and awarding body will trust."
          align="center"
          className="mx-auto text-center"
        />

        <ol className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <li
                key={s.title}
                className="relative flex flex-col rounded-2xl bg-white p-6 ring-1 ring-border shadow-elevated"
              >
                <span className="absolute -top-3 left-6 inline-flex h-6 items-center rounded-full bg-navy-900 px-3 text-xs font-semibold uppercase tracking-wider text-white">
                  Step 0{idx + 1}
                </span>
                <span className="mt-3 flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-heading text-lg font-semibold text-navy-900">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{s.body}</p>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 flex flex-col items-center gap-3">
          <Button href="/contact" variant="primary" size="lg">
            Book an advisory call
          </Button>
          <p className="text-sm text-ink-muted">Typical response: within one business day.</p>
        </div>
      </Container>
    </Section>
  );
}
