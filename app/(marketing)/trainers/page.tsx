import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { TrainerCard } from "@/components/cards/TrainerCard";
import { trainers } from "@/content/trainers";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Faculty & Trainers",
  description:
    "Meet the practitioner-led faculty behind EIOSH — HSE directors, registered auditors, environmental specialists and senior safety engineers who still work in industry.",
  path: "/trainers",
});

export default function TrainersPage() {
  return (
    <>
      <PageHero
        eyebrow="Faculty"
        title="Practitioners who still work in the industries they teach."
        description="Our faculty is drawn from operating industry — not from a career spent in classrooms. Every lead tutor holds a current professional role alongside their teaching."
        breadcrumbs={[{ label: "Trainers" }]}
      />
      <Section tone="subtle">
        <Container>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trainers.map((t) => (
              <li key={t.id}>
                <TrainerCard trainer={t} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
