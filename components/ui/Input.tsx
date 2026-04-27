import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = "text", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-11 w-full rounded-lg border border-border bg-white px-4 text-sm text-ink placeholder:text-ink-soft transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:border-cyan-400",
        "disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, rows = 4, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "flex w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft transition",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:border-cyan-400",
          className
        )}
        {...props}
      />
    );
  }
);

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-lg border border-border bg-white px-4 text-sm text-ink transition appearance-none cursor-pointer",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:border-cyan-400",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );
  }
);

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-navy-900", className)} {...props} />;
}
