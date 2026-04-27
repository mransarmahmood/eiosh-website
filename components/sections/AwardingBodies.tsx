import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { AwardingBodyLogo } from "@/components/ui/AwardingBodyLogo";
import { accreditations } from "@/content/accreditations";

export function AwardingBodies() {
  return (
    <Section tone="subtle">
      <Container>
        <SectionHeading
          eyebrow="Awarding bodies & approvals"
          title="Credentials governed by the bodies employers already trust."
          description="EIOSH operates as an approved centre, learning partner and affiliated provider for internationally recognised awarding bodies. Our role is to uphold their standards — not to invent new ones."
          align="center"
          className="mx-auto text-center"
        />
        <div className="mt-4 flex justify-center">
          <Link
            href="/awarding-bodies"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 hover:underline"
          >
            Explore every approval in detail
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {accreditations.slice(0, 6).map((a) => (
            <li key={a.id}>
              <Link
                href={`/awarding-bodies/${a.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-border transition hover:-translate-y-1 hover:ring-cyan-400 hover:shadow-floating"
              >
                {/* Top row: logo + approval badge */}
                <div className="flex items-start justify-between gap-3">
                  <AwardingBodyLogo shortName={a.shortName} size="md" />
                  <Badge tone={a.kind === "partner" ? "neutral" : "cyan"}>
                    {a.kind === "partner" ? "Learning partner" : "Approved centre"}
                  </Badge>
                </div>

                <p className="mt-5 font-heading text-lg font-semibold text-navy-900">{a.shortName}</p>
                <p className="text-xs uppercase tracking-wider text-cyan-700">{a.name}</p>

                <p className="mt-3 text-sm text-ink-muted line-clamp-3 flex-1">{a.summary}</p>

                {a.highlights?.length ? (
                  <ul className="mt-4 space-y-1.5 text-sm text-ink-muted">
                    {a.highlights.slice(0, 2).map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-600" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-cyan-700 transition group-hover:gap-1.5">
                  View {a.shortName} <ArrowUpRight className="h-4 w-4" />
                </span>

                {/* Bottom cyan accent bar */}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-400 via-cyan-500 to-navy-900 opacity-0 transition group-hover:opacity-100" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
