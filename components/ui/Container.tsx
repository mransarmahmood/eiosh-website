import * as React from "react";
import { cn } from "@/lib/utils";

export function Container({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("container-page", className)} {...props}>
      {children}
    </div>
  );
}

export function Section({
  className,
  children,
  tone = "surface",
  ...props
}: React.HTMLAttributes<HTMLElement> & { tone?: "surface" | "subtle" | "navy" | "gradient" }) {
  // Dark variants keep the subtle/surface tones from looking like jarring
  // light cards when the user toggles dark mode globally.
  const toneClass =
    tone === "navy"
      ? "bg-navy-950 text-white"
      : tone === "gradient"
      ? "bg-brand-gradient text-white"
      : tone === "subtle"
      ? "bg-surface-subtle dark:bg-navy-950 dark:text-white/85"
      : "bg-surface dark:bg-navy-950 dark:text-white/85";
  return (
    <section className={cn("relative py-20 lg:py-28", toneClass, className)} {...props}>
      {children}
    </section>
  );
}
