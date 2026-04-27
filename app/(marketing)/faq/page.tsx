import { PageHero } from "@/components/sections/PageHero";
import { FAQSection } from "@/components/sections/FAQSection";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Frequently Asked Questions",
  description:
    "Admissions, certification, payments, corporate training, certificate verification — answered. Speak to an EIOSH advisor if you can't find what you need.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Straightforward answers to the questions we hear most."
        description="Can't find what you need? Our admissions advisors respond within one business day."
        breadcrumbs={[{ label: "FAQ" }]}
      />
      <FAQSection />
    </>
  );
}
