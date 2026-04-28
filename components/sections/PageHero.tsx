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

// Shared interior-page hero. Bright, brand-coherent treatment using only the
// EIOSH palette (navy authority + cyan clarity + warm gold conversion). The
// homepage uses its own dedicated `Hero` section — this component is for
// every other interior page.
//
// Design notes:
// • Background is a soft cyan-tinted gradient (the brand's clarity colour).
//   No indigo/violet — that would push off-brand for a training institute.
// • Two ambient cyan blobs + one warm gold blob give depth without noise.
// • The eyebrow is a pill with a pinging cyan dot — signals "live, current".
// • The headline auto-styles its final word in a cyan→navy gradient (two
//   brand hues only) so every page picks up an accent without bespoke JSX.
// • Padding is asymmetric (more above than below) so the next section feels
//   connected to the hero rather than walled off.
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

  // String titles get the auto-accent. JSX titles render as-is so callers
  // that pass custom JSX keep full control.
  const renderedTitle =
    typeof title === "string" ? splitTitleWithAccent(title) : title;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-cyan-50/60 to-white">
      {/* Brand-aligned ambient depth — two cyan, one warm gold accent. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 h-[28rem] w-[28rem] rounded-full bg-cyan-300/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-10 left-[8%] h-56 w-56 rounded-full bg-amber-200/25 blur-3xl"
      />
      {/* Faint dotted-grid texture for premium tactility. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(10,31,68,0.05)_1px,transparent_0)] [background-size:28px_28px]"
      />

      <Container className="relative z-10 pt-12 pb-16 lg:pt-16 lg:pb-20">
        {breadcrumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-ink-soft">
              <li>
                <Link
                  href="/"
                  className="hover:text-cyan-700 transition"
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
                      className="hover:text-cyan-700 transition"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-navy-900 font-medium">{c.label}</span>
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
            <span
              className={`inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-cyan-700 ring-1 ring-inset ring-cyan-200/70 shadow-sm backdrop-blur ${
                align === "center" ? "" : ""
              }`}
            >
              <span aria-hidden className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-500">
                <span className="absolute inset-0 animate-ping rounded-full bg-cyan-500/60" />
              </span>
              {eyebrow}
            </span>
          ) : null}

          <h1 className="mt-5 font-heading text-[2.25rem] font-bold leading-[1.08] tracking-tight text-navy-900 text-balance sm:text-5xl lg:text-[3.25rem]">
            {renderedTitle}
          </h1>

          {description ? (
            <p
              className={`mt-5 text-lg leading-relaxed text-ink-muted text-pretty ${
                align === "center" ? "" : "max-w-2xl"
              }`}
            >
              {description}
            </p>
          ) : null}

          {children ? <div className="mt-7">{children}</div> : null}
        </motion.div>
      </Container>

      {/* Soft fade into the next section so the hero feels connected. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-white"
      />
    </section>
  );
}

// Accent the final word of a plain-string title with the brand cyan→navy
// gradient. Strips and reattaches trailing punctuation so it feels intentional.
function splitTitleWithAccent(title: string): React.ReactNode {
  const trimmed = title.trim();
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
    <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-navy-700 bg-clip-text text-transparent">
      {children}
    </span>
  );
}
