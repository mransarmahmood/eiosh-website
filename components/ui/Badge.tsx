import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeStyles = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
  {
    variants: {
      tone: {
        navy: "bg-navy-50 text-navy-800 ring-navy-200",
        cyan: "bg-cyan-50 text-cyan-800 ring-cyan-200",
        gold: "bg-gold-50 text-gold-700 ring-gold-200",
        neutral: "bg-surface-sunken text-ink-muted ring-border",
        success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
        warn: "bg-amber-50 text-amber-800 ring-amber-200",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeStyles> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeStyles({ tone }), className)} {...props} />;
}
