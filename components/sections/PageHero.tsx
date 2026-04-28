"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";

interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: Crumb[];
  children?: React.ReactNode;
  align?: "left" | "center";
}

// Shared interior-page hero. Bright, premium light treatment with subtle
// ambient blobs and a gradient-typed accent on the last word of the title.
// Dark-mode aware so the global ThemeToggle reads coherently. The homepage
// uses its own dedicated `Hero` section — this component is for everything
// else (about, courses, certifications, awarding-bodies, etc.).
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  children,
  align = "left",
}: Props) {
  const alignClass =
    align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-4xl";

  // If the title is a plain string, gradient-style the final word so every
  // page automatically picks up the brand accent without callers having to
  // pass JSX. ReactNode titles render as-is.
  const renderedTitle =
    typeof title === "string" ? splitTitleWithAccent(title) : title;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-cyan-50/50 to-indigo-50/70 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950">
      {/* Decorative ambient blobs — purely visual. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-500/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-indigo-300/25 blur-3xl dark:bg-indigo-500/15"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-1/3 h-64 w-64 rounded-full bg-violet-300/20 blur-3xl dark:bg-violet-500/15"
      />
      {/* Soft grid overlay for texture. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(10,31,68,0.06)_1px,transparent_0)] [background-size:28px_28px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)]"
      />

      <Container className="relative z-10 py-14 lg:py-20">
        {breadcrumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-soft dark:text-white/55">
              <li>
                <Link
                  href="/"
                  className="hover:text-cyan-700 transition dark:hover:text-cyan-300"
                >
                  Home
                </Link>
              </li>
              {breadcrumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5" />
                  {c.href ? (
                    <Link
                      href={c.href}
                      className="hover:text-cyan-700 transition dark:hover:text-cyan-300"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-navy-900 font-medium dark:text-white/85">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          className={alignClass}
        >
          {eyebrow ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-cyan-100/80 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cyan-700 ring-1 ring-inset ring-cyan-200 dark:bg-cyan-500/15 dark:text-cyan-300 dark:ring-cyan-500/30">
              <span
                aria-hidden
                className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400"
              >
                <span className="absolute inset-0 animate-ping rounded-full bg-cyan-500/60 dark:bg-cyan-400/60" />
              </span>
              {eyebrow}
            </span>
          ) : null}

          <h1 className="mt-5 font-heading text-[2.25rem] font-bold leading-[1.1] tracking-tight text-navy-900 text-balance sm:text-5xl lg:text-[3.25rem] dark:text-white">
            {renderedTitle}
          </h1>

          {description ? (
            <p
              className={`mt-5 text-lg leading-relaxed text-ink-muted text-pretty dark:text-white/65 ${
                align === "center" ? "" : "max-w-2xl"
              }`}
            >
              {description}
            </p>
          ) : null}

          {children ? <div className="mt-7">{children}</div> : null}
        </motion.div>
      </Container>
    </section>
  );
}

// Returns the title as JSX with the final word styled in a cyan→blue→violet
// gradient. We strip a trailing period before highlighting and reattach it so
// titles like "About EIOSH." still feel intentional.
function splitTitleWithAccent(title: string): React.ReactNode {
  const trimmed = title.trim();
  // Single word — gradient the whole thing.
  if (!trimmed.includes(" ")) {
    return <Accent>{trimmed}</Accent>;
  }
  const trailingPunct = /[.!?]$/.test(trimmed) ? trimmed.slice(-1) : "";
  const body = trailingPunct ? trimmed.slice(0, -1) : trimmed;
  const lastSpace = body.lastIndexOf(" ");
  const head = body.slice(0, lastSpace);
  const tail = body.slice(lastSpace + 1);
  return (
    <>
      {head}{" "}
      <Accent>
        {tail}
        {trailingPunct}
      </Accent>
    </>
  );
}

function Accent({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 bg-clip-text text-transparent">
      {children}
    </span>
  );
}
