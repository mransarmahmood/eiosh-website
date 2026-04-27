import type { Metadata } from "next";

const DEFAULT_TITLE = "EIOSH Global — International Training, Qualifications & Certification";
const DEFAULT_DESCRIPTION =
  "EIOSH is an approved centre delivering IOSH, OSHAcademy, OSHAwards, HABC and OTHM qualifications — with instructor-led, blended, and online pathways for professionals and enterprise teams.";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eiosh.com";

type PageMetaInput = {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
  type?: "website" | "article";
};

export function pageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  ogImage = "/brand/og-default.jpg",
  noIndex,
  type = "website",
}: PageMetaInput = {}): Metadata {
  const resolvedTitle = title ? `${title} — EIOSH Global` : DEFAULT_TITLE;
  const url = `${SITE_URL}${path}`;

  return {
    title: resolvedTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url, languages: { "en-GB": url, "ar-SA": `${SITE_URL}/ar${path}` } },
    openGraph: {
      title: resolvedTitle,
      description,
      url,
      type,
      siteName: "EIOSH Global",
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: "en_GB",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "EIOSH Global",
    alternateName: "EIOSH",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/eiosh-logo.png`,
    sameAs: [],
    description: DEFAULT_DESCRIPTION,
  };
}
