import { PageHero } from "@/components/sections/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { TestimonialCard } from "@/components/cards/TestimonialCard";
import { testimonials } from "@/content/testimonials";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Testimonials",
  description:
    "Read what HSE leaders, hospitality operators, HR teams and individual learners say about EIOSH qualifications and corporate programmes.",
  path: "/testimonials",
});

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Learner & client voices"
        title="Trusted by professionals and teams in 64 countries."
        description="A representative set of testimonials from our learner community and enterprise clients."
        breadcrumbs={[{ label: "Testimonials" }]}
      />
      <Section tone="subtle">
        <Container>
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {testimonials.map((t) => (
              <li key={t.id}>
                <TestimonialCard t={t} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  );
}
