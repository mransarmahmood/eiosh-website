"use client";

import { MessageCircle } from "lucide-react";
import { site } from "@/content/site";

// Desktop-only floating WhatsApp button. Mobile is handled by StickyMobileCTA.
export function WhatsAppButton() {
  const whatsapp = site.contact.whatsapp.replace(/\D/g, "");
  return (
    <a
      href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi EIOSH team, I'd like to know more about your qualifications.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with EIOSH on WhatsApp"
      className="group fixed bottom-6 right-6 z-30 hidden md:inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-medium text-white shadow-floating transition hover:bg-emerald-600"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden lg:inline">Chat with an advisor</span>
    </a>
  );
}
