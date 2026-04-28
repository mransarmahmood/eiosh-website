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

  // Boot script: applies the saved theme on first paint so dark mode does not
  // flash light. Also respects the OS preference when nothing is stored yet.
  const themeBoot = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body
        className={
          isAdmin
            ? "min-h-screen bg-surface-subtle text-ink antialiased"
            : "min-h-screen bg-surface text-ink antialiased pb-[72px] md:pb-0 dark:bg-navy-950 dark:text-white/90"
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
