"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { X, Phone, MessageCircle, ArrowRight, LogIn, UserPlus, ShieldCheck, FileCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { site } from "@/content/site";

export function MobileNav({
  open,
  onClose,
  links,
}: {
  open: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
}) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-navy-950/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white shadow-floating lg:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <Logo />
              <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md text-navy-900 hover:bg-navy-50 cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-5" aria-label="Mobile">
              {/* Account actions up-top */}
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={process.env.NEXT_PUBLIC_LMS_URL ?? "https://eiosh-com-725461.hostingersite.com/lms/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white px-3 py-2.5 text-sm font-medium text-navy-900 hover:border-cyan-400 hover:text-cyan-700"
                >
                  <LogIn className="h-4 w-4" /> Sign in
                </a>
                <Link
                  href="/admission"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-400 px-3 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-500"
                >
                  <UserPlus className="h-4 w-4" /> Apply / Register
                </Link>
              </div>

              <p className="mt-6 px-3 text-[0.7rem] font-semibold uppercase tracking-wider text-ink-soft">Browse</p>
              <ul className="mt-1 space-y-0.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      onClick={onClose}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[1rem] font-medium text-navy-900 hover:bg-navy-50"
                    >
                      {l.label}
                      <ArrowRight className="h-4 w-4 text-cyan-600" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-6 px-3 text-[0.7rem] font-semibold uppercase tracking-wider text-ink-soft">Apply & request</p>
              <ul className="mt-1 space-y-0.5">
                <li>
                  <Link href="/admission" onClick={onClose} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[1rem] font-medium text-navy-900 hover:bg-navy-50">
                    Admission form
                    <ArrowRight className="h-4 w-4 text-cyan-600" />
                  </Link>
                </li>
                <li>
                  <Link href="/quotation" onClick={onClose} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[1rem] font-medium text-navy-900 hover:bg-navy-50">
                    Request a quotation
                    <ArrowRight className="h-4 w-4 text-cyan-600" />
                  </Link>
                </li>
                <li>
                  <Link href="/propose-course" onClick={onClose} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[1rem] font-medium text-navy-900 hover:bg-navy-50">
                    Propose a course
                    <ArrowRight className="h-4 w-4 text-cyan-600" />
                  </Link>
                </li>
                <li>
                  <Link href="/verify-certificate" onClick={onClose} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[1rem] font-medium text-navy-900 hover:bg-navy-50">
                    <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-cyan-600" /> Verify certificate</span>
                    <ArrowRight className="h-4 w-4 text-cyan-600" />
                  </Link>
                </li>
                <li>
                  <Link href="/contact" onClick={onClose} className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[1rem] font-medium text-navy-900 hover:bg-navy-50">
                    Contact
                    <ArrowRight className="h-4 w-4 text-cyan-600" />
                  </Link>
                </li>
              </ul>

              <p className="mt-6 px-3 text-[0.7rem] font-semibold uppercase tracking-wider text-ink-soft">Student portals</p>
              <ul className="mt-1 space-y-0.5">
                <li>
                  <a
                    href={process.env.NEXT_PUBLIC_LMS_URL ?? "https://eiosh-com-725461.hostingersite.com/lms/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[1rem] font-medium text-navy-900 hover:bg-navy-50"
                  >
                    <span className="inline-flex items-center gap-2"><LogIn className="h-4 w-4 text-cyan-600" /> LMS — learning portal</span>
                    <ArrowRight className="h-4 w-4 text-cyan-600" />
                  </a>
                </li>
                <li>
                  <a
                    href={process.env.NEXT_PUBLIC_EXAM_URL ?? "https://eiosh-com-725461.hostingersite.com/exam/public/login"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[1rem] font-medium text-navy-900 hover:bg-navy-50"
                  >
                    <span className="inline-flex items-center gap-2"><FileCheck className="h-4 w-4 text-cyan-600" /> Exam portal</span>
                    <ArrowRight className="h-4 w-4 text-cyan-600" />
                  </a>
                </li>
              </ul>
            </nav>

            <div className="border-t border-border p-5 space-y-3">
              <Button href="/courses" variant="gold" size="lg" className="w-full">
                Browse courses
              </Button>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${site.contact.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-medium text-navy-900 hover:bg-navy-50"
                >
                  <Phone className="h-4 w-4" /> Call
                </a>
                <a
                  href={`https://wa.me/${site.contact.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-600"
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
