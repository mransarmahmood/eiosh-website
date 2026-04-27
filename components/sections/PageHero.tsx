import Link from "next/link";
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

// Shared interior-page hero. Consistent tone across every marketing page so the
// visual rhythm is predictable as learners move across the site.
export function PageHero({ eyebrow, title, description, breadcrumbs, children, align = "left" }: Props) {
  const alignClass = align === "center" ? "text-center mx-auto max-w-3xl" : "max-w-4xl";
  return (
    <section className="relative overflow-hidden bg-navy-950 text-white">
      <div className="absolute inset-0 bg-grid-subtle [background-size:32px_32px] opacity-[0.3]" aria-hidden />
      <div className="absolute -top-28 right-0 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" aria-hidden />
      <Container className="relative z-10 py-20 lg:py-28">
        {breadcrumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
              <li>
                <Link href="/" className="hover:text-white">Home</Link>
              </li>
              {breadcrumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5" />
                  {c.href ? (
                    <Link href={c.href} className="hover:text-white">{c.label}</Link>
                  ) : (
                    <span className="text-white/80">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className={alignClass}>
          {eyebrow ? <p className="eyebrow text-cyan-300">{eyebrow}</p> : null}
          <h1 className="mt-4 text-display-md sm:text-display-lg font-heading font-semibold text-white text-balance">{title}</h1>
          {description ? (
            <p className="mt-5 text-lg text-white/75 leading-relaxed text-pretty">{description}</p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </Container>
    </section>
  );
}
