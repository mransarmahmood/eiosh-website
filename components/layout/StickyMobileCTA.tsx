"use client";

import Link from "next/link";
import { Phone, MessageCircle } from "lucide-react";
import { site } from "@/content/site";

// Conversion-focused sticky bar on small screens only — single visible primary CTA.
export function StickyMobileCTA() {
  const whatsapp = site.contact.whatsapp.replace(/\D/g, "");
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-white/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-3 gap-2 p-3">
        <a
          href={`tel:${site.contact.phone}`}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-white py-2.5 text-sm font-medium text-navy-900"
          aria-label="Call EIOSH"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 py-2.5 text-sm font-medium text-white"
          aria-label="WhatsApp EIOSH"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <Link
          href="/admission"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold-400 py-2.5 text-sm font-semibold text-navy-950"
        >
          Apply
        </Link>
      </div>
    </div>
  );
}
