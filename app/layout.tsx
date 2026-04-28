import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { StickyMobileCTA } from "@/components/layout/StickyMobileCTA";
import { AIChatFab } from "@/components/layout/AIChatFab";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { pageMeta, organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMeta();

export const viewport: Viewport = {
  themeColor: "#0A1F44",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = headers().get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en" dir="ltr">
      <body
        className={
          isAdmin
            ? "min-h-screen bg-surface-subtle text-ink antialiased"
            : "min-h-screen bg-surface text-ink antialiased pb-[72px] md:pb-0"
        }
      >
        {isAdmin ? (
          children
        ) : (
          <>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-navy-900 focus:px-3 focus:py-2 focus:text-white"
            >
              Skip to content
            </a>
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <WhatsAppButton />
            <AIChatFab />
            <StickyMobileCTA />
            <CookieConsent />

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
            />
          </>
        )}
      </body>
    </html>
  );
}
