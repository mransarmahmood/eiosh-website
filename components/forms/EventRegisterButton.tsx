"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Send, Loader2, Calendar } from "lucide-react";
import { Input, Textarea, Label } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

interface Props {
  eventSlug: string;
  eventTitle: string;
  className?: string;
  variant?: "primary" | "outline" | "gold";
  size?: "sm" | "md" | "lg";
}

// Public register button — opens a modal, posts to /api/submit/registration,
// shows a success state. Works on Events page and Calendar.
export function EventRegisterButton({
  eventSlug,
  eventTitle,
  className,
  variant = "primary",
  size = "md",
}: Props) {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setErr(null);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/submit/registration", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, eventSlug, eventTitle }),
      });
      if (res.ok) setState("done");
      else {
        setState("error");
        setErr("Registration failed. Please try again.");
      }
    } catch {
      setState("error");
      setErr("Network error.");
    }
  }

  const btn = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-heading font-medium transition cursor-pointer",
    size === "sm" ? "h-9 px-3 text-sm" : size === "lg" ? "h-12 px-5 text-base" : "h-10 px-4 text-sm",
    variant === "primary" && "bg-navy-900 text-white hover:bg-navy-800",
    variant === "gold" && "bg-gold-400 text-navy-950 hover:bg-gold-500 font-semibold",
    variant === "outline" && "bg-white text-navy-900 ring-1 ring-inset ring-border hover:ring-cyan-400",
    className
  );

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={btn}>
        <Calendar className="h-4 w-4" /> Register
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 bg-navy-950/50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 24, scale: 0.97 }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-floating"
                role="dialog"
                aria-modal="true"
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="absolute right-4 top-4 rounded-md p-1.5 text-ink-muted hover:bg-surface-subtle hover:text-navy-900"
                >
                  <X className="h-5 w-5" />
                </button>

                {state === "done" ? (
                  <div className="p-8 text-center">
                    <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                      <Check className="h-7 w-7" />
                    </div>
                    <h3 className="mt-4 font-heading text-xl font-semibold text-navy-900">You're registered.</h3>
                    <p className="mt-2 text-sm text-ink-muted">
                      We've added you to the attendee list for <strong>{eventTitle}</strong>. A joining link + calendar
                      invite will arrive by email within the hour.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setState("idle");
                      }}
                      className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-navy-900 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-800"
                    >
                      Close
                    </button>
                  </div>
                ) : (
                  <form onSubmit={onSubmit} className="p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Register</p>
                    <h3 className="mt-2 font-heading text-xl font-semibold text-navy-900">{eventTitle}</h3>
                    <p className="mt-1 text-xs text-ink-muted">We'll email your joining details within the hour.</p>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <Label htmlFor={`name-${eventSlug}`}>
                          Full name <span className="text-red-500">*</span>
                        </Label>
                        <Input id={`name-${eventSlug}`} name="title" required autoComplete="name" />
                      </div>
                      <div>
                        <Label htmlFor={`email-${eventSlug}`}>
                          Email <span className="text-red-500">*</span>
                        </Label>
                        <Input id={`email-${eventSlug}`} type="email" name="email" required autoComplete="email" />
                      </div>
                      <div>
                        <Label htmlFor={`phone-${eventSlug}`}>Phone</Label>
                        <Input
                          id={`phone-${eventSlug}`}
                          type="tel"
                          name="phone"
                          autoComplete="tel"
                          placeholder="+971 50 000 0000"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor={`company-${eventSlug}`}>Company / organisation</Label>
                        <Input id={`company-${eventSlug}`} name="company" />
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor={`notes-${eventSlug}`}>Anything we should know?</Label>
                        <Textarea id={`notes-${eventSlug}`} name="notes" rows={3} />
                      </div>
                    </div>

                    {state === "error" && err ? (
                      <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-200">{err}</p>
                    ) : null}

                    <div className="mt-6 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="rounded-lg px-4 py-2 text-sm text-ink-muted hover:text-navy-900"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={state === "loading"}
                        className="inline-flex items-center gap-2 rounded-lg bg-navy-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-navy-800 disabled:opacity-60"
                      >
                        {state === "loading" ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                          </>
                        ) : (
                          <>
                            Confirm registration <Send className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
