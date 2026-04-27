import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  className,
  as = "h2",
}: SectionHeadingProps) {
  const HeadingTag = as;
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  const titleColor = tone === "dark" ? "text-white" : "text-navy-900";
  const descColor = tone === "dark" ? "text-white/75" : "text-ink-muted";
  const eyebrowColor = tone === "dark" ? "text-cyan-300" : "text-cyan-700";
  return (
    <div className={cn("max-w-3xl", alignClass, className)}>
      {eyebrow ? (
        <p
          className={cn(
            "inline-flex items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.2em]",
            eyebrowColor
          )}
        >
          <span aria-hidden className="h-px w-8 bg-current" />
          {eyebrow}
          <span aria-hidden className="h-px w-8 bg-current" />
        </p>
      ) : null}
      <HeadingTag
        className={cn(
          "mt-5 text-3xl sm:text-4xl lg:text-display-sm font-heading font-semibold text-balance",
          titleColor,
          as === "h1" && "sm:text-display-md lg:text-display-lg"
        )}
      >
        {title}
      </HeadingTag>
      {description ? (
        <p className={cn("mt-4 text-base sm:text-lg leading-relaxed text-pretty", descColor)}>{description}</p>
      ) : null}
    </div>
  );
}
