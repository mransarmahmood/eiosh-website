"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, Pause, Play } from "lucide-react";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InitialsAvatar } from "@/components/ui/CourseArt";
import { testimonials } from "@/content/testimonials";
import { cn } from "@/lib/utils";

// Upgraded slider: auto-advance + directional slide animation + pause-on-hover,
// with floating avatar badges on the inactive testimonials for visual depth.
const AUTOPLAY_MS = 6000;

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -80 : 80, opacity: 0 }),
};

export function TestimonialsSlider() {
  const [[index, direction], setState] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setState(([i]) => [(i + 1) % testimonials.length, 1]);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused]);

  const goTo = (next: number) => {
    const dir = next > index ? 1 : -1;
    setState([next < 0 ? testimonials.length - 1 : next % testimonials.length, dir]);
  };

  // Guard against empty testimonial source — render a friendly empty state.
  if (testimonials.length === 0) {
    return (
      <Section tone="subtle">
        <Container className="text-center">
          <SectionHeading
            eyebrow="What our learners say"
            title="Testimonials coming soon."
            description="Be the first to share your EIOSH experience — we'd love to hear from you."
            align="center"
            className="mx-auto text-center"
          />
        </Container>
      </Section>
    );
  }

  const t = testimonials[index % testimonials.length];
  const peekLeft = testimonials[(index - 1 + testimonials.length) % testimonials.length];
  const peekRight = testimonials[(index + 1) % testimonials.length];

  // Strip any trailing escaped quote chars baked into the imported content.
  const cleanQuote = (t.quote ?? "").replace(/^["“”]+|["“”\\]+$/g, "").trim();

  return (
    <Section tone="subtle">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <SectionHeading
              eyebrow="What our learners say"
              title="Trusted by founders, safety leaders and enterprise teams."
              description="Real voices from the 1,500+ professionals who have completed an EIOSH programme — with 2,400+ verified reviews and a 100% satisfaction rate."
            />
            <div className="mt-6 flex items-center gap-2">
              <button
                onClick={() => goTo(index - 1)}
                aria-label="Previous testimonial"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-navy-900 transition hover:border-cyan-400 hover:text-cyan-700 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => goTo(index + 1)}
                aria-label="Next testimonial"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white transition hover:bg-navy-800 cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Resume auto-play" : "Pause auto-play"}
                className="ml-2 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-navy-900 transition hover:text-cyan-700 cursor-pointer"
              >
                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div
            className="relative lg:col-span-8"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Peek avatars floating either side for visual depth */}
            <div className="pointer-events-none absolute -left-6 top-8 hidden rotate-[-8deg] sm:block" aria-hidden>
              <InitialsAvatar name={peekLeft.name} size="lg" accent="cyan" />
            </div>
            <div className="pointer-events-none absolute -right-4 bottom-8 hidden rotate-[10deg] sm:block" aria-hidden>
              <InitialsAvatar name={peekRight.name} size="lg" accent="gold" />
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-white p-8 sm:p-10 ring-1 ring-border shadow-floating">
              {/* Progress bar */}
              <div className="absolute inset-x-0 top-0 h-1 bg-border">
                <motion.div
                  key={`${index}-${paused}`}
                  initial={{ width: "0%" }}
                  animate={{ width: paused ? "0%" : "100%" }}
                  transition={{ duration: paused ? 0 : AUTOPLAY_MS / 1000, ease: "linear" }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-navy-900"
                />
              </div>

              <AnimatePresence custom={direction} mode="wait">
                <motion.figure
                  key={t.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <Quote className="h-10 w-10 text-cyan-500" aria-hidden />
                  {t.rating ? (
                    <div className="mt-3 flex items-center gap-0.5" aria-label={`${t.rating} out of 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < (t.rating ?? 0) ? "fill-gold-400 text-gold-400" : "text-border-strong"
                          )}
                        />
                      ))}
                    </div>
                  ) : null}
                  <blockquote className="mt-4 text-xl leading-relaxed text-ink text-pretty sm:text-2xl">
                    {cleanQuote ? <>&ldquo;{cleanQuote}&rdquo;</> : t.name}
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-4 border-t border-border pt-6">
                    <InitialsAvatar name={t.name} size="md" accent="navy" />
                    <div>
                      <p className="font-heading font-semibold text-navy-900">{t.name}</p>
                      <p className="text-sm text-ink-muted">
                        {t.role}
                        {t.company ? ` · ${t.company}` : ""}
                      </p>
                    </div>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>

            <div className="mt-6 flex items-center justify-center gap-1.5" role="tablist" aria-label="Testimonial pagination">
              {testimonials.map((item, idx) => (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={idx === index}
                  aria-label={`Testimonial ${idx + 1}`}
                  onClick={() => goTo(idx)}
                  className={cn(
                    "h-1.5 rounded-full transition-all cursor-pointer",
                    idx === index ? "w-10 bg-navy-900" : "w-4 bg-border-strong hover:bg-ink-soft"
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
