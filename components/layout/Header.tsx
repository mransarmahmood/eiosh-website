"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Phone, Menu, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { MegaMenuPanel, type MegaKey } from "@/components/layout/MegaMenu";
import { MobileNav } from "@/components/layout/MobileNav";
import { site } from "@/content/site";

const primaryLinks: { label: string; href: string; mega?: MegaKey }[] = [
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses", mega: "courses" },
  { label: "Certifications", href: "/certifications", mega: "certifications" },
  { label: "Awarding Bodies", href: "/awarding-bodies", mega: "approvals" },
  { label: "Corporate", href: "/corporate-training" },
  { label: "Leadership", href: "/leadership" },
  // Resources mega includes Calendar, Free Courses, Exam Portal, Books, Insights, Verify
  { label: "Resources", href: "/resources", mega: "resources" },
];

export function Header() {
  const [active, setActive] = useState<MegaKey>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  const openMega = (key: MegaKey) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActive(key);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 200);
  };
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const closeImmediately = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActive(null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mega menu on Escape for keyboard users.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeImmediately();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Click outside the header closes any open mega menu.
  useEffect(() => {
    if (!active) return;
    const onDocClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeImmediately();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [active]);

  return (
    <>
      {/* Utility bar */}
      <div className="hidden lg:block bg-navy-950 text-white/80 text-xs">
        <div className="container-page flex h-9 items-center justify-between gap-4">
          <p className="tracking-wide">
            Approved centre for IOSH · OSHAcademy · OSHAwards · HABC · OTHM
          </p>
          <div className="flex items-center gap-5">
            <Link href="/verify-certificate" className="hover:text-cyan-300 transition">
              Verify certificate
            </Link>
            <a href={`tel:${site.contact.phone}`} className="inline-flex items-center gap-1.5 hover:text-cyan-300 transition">
              <Phone className="h-3.5 w-3.5" /> {site.contact.phone}
            </a>
            <span aria-hidden className="h-3 w-px bg-white/20" />
            <a
              href={process.env.NEXT_PUBLIC_LMS_URL ?? "https://eiosh-com-725461.hostingersite.com/lms/"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-cyan-300 transition"
            >
              <LogIn className="h-3.5 w-3.5" /> Student login
            </a>
            <Link href="/admission" className="inline-flex items-center gap-1.5 hover:text-cyan-300 transition">
              <UserPlus className="h-3.5 w-3.5" /> Register
            </Link>
          </div>
        </div>
      </div>

      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-40 border-b bg-white/95 backdrop-blur-md transition-all",
          scrolled ? "border-border shadow-[0_6px_24px_-16px_rgba(10,31,68,0.25)]" : "border-transparent"
        )}
      >
        <div className="container-page">
          <div className="flex h-16 lg:h-20 items-center justify-between gap-6">
            <Logo />

            <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
              {primaryLinks.map((link) => {
                const isMega = !!link.mega;
                const isActive = active === link.mega;
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => {
                      if (isMega) openMega(link.mega!);
                      else scheduleClose();
                    }}
                    onMouseLeave={() => isMega && scheduleClose()}
                  >
                    {isMega ? (
                      <button
                        type="button"
                        onClick={() => (isActive ? closeImmediately() : openMega(link.mega!))}
                        aria-expanded={isActive}
                        aria-haspopup="true"
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-[0.95rem] font-medium text-navy-900 transition-colors hover:text-cyan-700 cursor-pointer",
                          isActive && "text-cyan-700"
                        )}
                      >
                        {link.label}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 opacity-60 transition-transform duration-200",
                            isActive && "rotate-180"
                          )}
                          aria-hidden
                        />
                      </button>
                    ) : link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-[0.95rem] font-medium text-navy-900 transition-colors hover:text-cyan-700"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-1 rounded-md px-3 py-2 text-[0.95rem] font-medium text-navy-900 transition-colors hover:text-cyan-700"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-2.5">
              <Link
                href="/student/login"
                className="hidden md:inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-sm font-medium text-navy-900 transition hover:border-cyan-400 hover:text-cyan-700"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </Link>
              <Button href="/admission" variant="gold" size="sm" className="hidden sm:inline-flex">
                <UserPlus className="h-4 w-4" /> Apply now
              </Button>
              <button
                type="button"
                className="inline-flex lg:hidden h-10 w-10 items-center justify-center rounded-md text-navy-900 hover:bg-navy-50 cursor-pointer"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <MegaMenuPanel
          activeKey={active}
          onEnter={cancelClose}
          onClose={scheduleClose}
          onLinkClick={closeImmediately}
        />
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} links={primaryLinks} />
    </>
  );
}
