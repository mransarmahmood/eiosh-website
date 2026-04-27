import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

// Quiet credibility proof band — no flashy counters, just confident numbers.
export function StatsBand() {
  return (
    <section className="bg-navy-950 text-white">
      <Container className="py-16">
        <dl className="grid grid-cols-2 gap-y-8 sm:grid-cols-4">
          {site.stats.map((s) => (
            <div key={s.label} className="text-center sm:border-l sm:border-white/10 first:sm:border-l-0 px-4">
              <dt className="text-sm uppercase tracking-[0.2em] text-cyan-300">{s.label}</dt>
              <dd className="mt-3 font-heading text-4xl font-semibold tracking-tight">{s.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
