import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TestimonialCard({ t, className }: { t: Testimonial; className?: string }) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col rounded-2xl bg-white p-8 ring-1 ring-border shadow-elevated",
        className
      )}
    >
      <Quote className="h-8 w-8 text-cyan-500" aria-hidden />
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
      <blockquote className="mt-4 text-lg leading-relaxed text-ink text-pretty">
        &ldquo;{(t.quote ?? "").replace(/^["“”]+|["“”\\]+$/g, "").trim()}&rdquo;
      </blockquote>
      <figcaption className="mt-6 border-t border-border pt-4">
        <p className="font-heading font-semibold text-navy-900">{t.name}</p>
        <p className="text-sm text-ink-muted">
          {t.role}
          {t.company ? ` · ${t.company}` : ""}
        </p>
      </figcaption>
    </figure>
  );
}
