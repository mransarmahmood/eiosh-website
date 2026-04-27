import Link from "next/link";
import { Linkedin, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { site } from "@/content/site";

const columns = [
  {
    heading: "Qualifications",
    links: [
      { label: "Health, Safety & Environment", href: "/courses?category=health-safety-environment" },
      { label: "Food Safety & Hospitality", href: "/courses?category=food-safety-hospitality" },
      { label: "Fire Safety & Emergency", href: "/courses?category=fire-safety-emergency" },
      { label: "Leadership & Management", href: "/courses?category=leadership-management" },
      { label: "Environment & Sustainability", href: "/courses?category=environment-sustainability" },
      { label: "First Aid & Medical", href: "/courses?category=first-aid-medical" },
    ],
  },
  {
    heading: "For learners",
    links: [
      { label: "Certification preparation", href: "/certification-preparation" },
      { label: "Course calendar", href: "/calendar" },
      { label: "Events, workshops & webinars", href: "/events" },
      { label: "Free online courses", href: "/free-courses" },
      { label: "Books & notes library", href: "/resources" },
      { label: "Student services", href: "/student-services" },
      { label: "Verify certificate", href: "/verify-certificate" },
      { label: "Insights", href: "/blog" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    heading: "Student portals",
    links: [
      {
        label: "Learning Management System",
        href: process.env.NEXT_PUBLIC_LMS_URL ?? "https://eiosh-com-725461.hostingersite.com/lms/",
        external: true,
      },
      {
        label: "Exam portal",
        href: process.env.NEXT_PUBLIC_EXAM_URL ?? "https://eiosh-com-725461.hostingersite.com/exam/public/login",
        external: true,
      },
      {
        label: "Invoice / billing",
        href: process.env.NEXT_PUBLIC_INVOICE_URL ?? "https://eiosh-com-725461.hostingersite.com/invoice/public/admin/login",
        external: true,
      },
      { label: "Verify certificate", href: "/verify-certificate" },
    ],
  },
  {
    heading: "For organisations",
    links: [
      { label: "Corporate training", href: "/corporate-training" },
      { label: "Request a quotation", href: "/quotation" },
      { label: "Propose a course", href: "/propose-course" },
      { label: "Apply for admission", href: "/admission" },
      { label: "Awarding bodies & approvals", href: "/awarding-bodies" },
      { label: "Partnership inquiry", href: "/partnership" },
      { label: "Download brochure", href: "/contact#brochure" },
    ],
  },
  {
    heading: "Organisation",
    links: [
      { label: "About EIOSH", href: "/about" },
      { label: "Our trainers", href: "/trainers" },
      { label: "Testimonials", href: "/testimonials" },
      { label: "Policies", href: "/policies" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-navy-950 text-white/80">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="container-page py-14 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow text-cyan-300">Stay current</p>
            <h3 className="mt-3 text-2xl lg:text-3xl font-heading font-semibold text-white text-balance">
              Practical insight from our faculty, straight to your inbox.
            </h3>
            <p className="mt-3 text-white/70 max-w-prose">
              One briefing every month — regulatory updates, new qualification pathways, and practitioner case studies. No noise, unsubscribe any time.
            </p>
          </div>
          <NewsletterForm tone="dark" />
        </div>
      </div>

      <div className="container-page py-16 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo variant="white" />
          <p className="mt-5 max-w-sm text-white/70">{site.brand.strapline}</p>

          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-cyan-300" />
              <span>
                {site.contact.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-cyan-300" />
              <a href={`tel:${site.contact.phone}`} className="hover:text-white">
                {site.contact.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-cyan-300" />
              <a href={`mailto:${site.contact.email}`} className="hover:text-white">
                {site.contact.email}
              </a>
            </li>
          </ul>

          <div className="mt-6 flex items-center gap-3">
            {site.social.linkedin ? (
              <a href={site.social.linkedin} aria-label="LinkedIn" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
                <Linkedin className="h-4 w-4" />
              </a>
            ) : null}
            {site.social.facebook ? (
              <a href={site.social.facebook} aria-label="Facebook" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
                <Facebook className="h-4 w-4" />
              </a>
            ) : null}
            {site.social.instagram ? (
              <a href={site.social.instagram} aria-label="Instagram" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
                <Instagram className="h-4 w-4" />
              </a>
            ) : null}
            {site.social.youtube ? (
              <a href={site.social.youtube} aria-label="YouTube" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 hover:bg-white/10">
                <Youtube className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
          {columns.map((col) => (
            <div key={col.heading}>
              <h4 className="font-heading font-semibold text-white">{col.heading}</h4>
              <ul className="mt-4 space-y-2 text-sm">
                {col.links.map((link: { label: string; href: string; external?: boolean }) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-white/70 hover:text-white transition-colors"
                      >
                        {link.label}
                        <span aria-hidden className="text-[0.65rem] opacity-60">↗</span>
                      </a>
                    ) : (
                      <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-sm text-white/60">
          <p>
            © {year} {site.brand.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/policies#privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/policies#terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/policies#refund" className="hover:text-white">
              Refund policy
            </Link>
            <Link href="/policies#quality" className="hover:text-white">
              Quality policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
