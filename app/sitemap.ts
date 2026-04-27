import type { MetadataRoute } from "next";
import { courses } from "@/content/courses";
import { blog } from "@/content/blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://eiosh.com";

const staticPaths = [
  "",
  "/about",
  "/courses",
  "/certification-preparation",
  "/awarding-bodies",
  "/corporate-training",
  "/trainers",
  "/blog",
  "/events",
  "/calendar",
  "/free-courses",
  "/resources",
  "/testimonials",
  "/faq",
  "/contact",
  "/verify-certificate",
  "/student-services",
  "/policies",
  "/partnership",
  "/propose-course",
  "/quotation",
  "/admission",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
  const courseEntries: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${SITE_URL}/courses/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));
  const blogEntries: MetadataRoute.Sitemap = blog.map((b) => ({
    url: `${SITE_URL}/blog/${b.slug}`,
    lastModified: new Date(b.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...staticEntries, ...courseEntries, ...blogEntries];
}
