"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqs } from "@/content/faqs";
import { cn } from "@/lib/utils";

export function FAQSection({ limit }: { limit?: number }) {
  const items = typeof limit === "number" ? faqs.slice(0, limit) : faqs;
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <Section>
      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="Questions, answered"
              title="What learners and L&D leaders ask us first."
              description="Can't find the answer you need? Our admissions advisors respond within one business day."
            />
          </div>
          <div className="lg:col-span-8">
            <ul className="divide-y divide-border rounded-2xl bg-white ring-1 ring-border">
              {items.map((f) => {
                const isOpen = open === f.id;
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : f.id)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left cursor-pointer"
                    >
                      <span className="font-heading text-[1.05rem] font-medium text-navy-900">{f.question}</span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 text-cyan-600 transition-transform duration-300",
                          isOpen && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid overflow-hidden px-6 text-ink-muted transition-[grid-template-rows,padding] duration-300",
                        isOpen ? "grid-rows-[1fr] pb-6" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="min-h-0">
                        <p className="leading-relaxed">{f.answer}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}
