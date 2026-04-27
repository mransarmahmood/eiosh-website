import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { StatsBand } from "@/components/sections/StatsBand";
import { FeaturedCategories } from "@/components/sections/FeaturedCategories";
import { CourseGrid } from "@/components/sections/CourseGrid";
import { Pathway } from "@/components/sections/Pathway";
import { AwardingBodies } from "@/components/sections/AwardingBodies";
import { TestimonialsSlider } from "@/components/sections/TestimonialsSlider";
import { CorporateCTA } from "@/components/sections/CorporateCTA";
import { EventsPreview } from "@/components/sections/EventsPreview";
import { FreeCoursesPreview } from "@/components/sections/FreeCoursesPreview";
import { ResourcesPreview } from "@/components/sections/ResourcesPreview";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { FAQSection } from "@/components/sections/FAQSection";
import { courses } from "@/content/courses";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Internationally Recognised Training, Qualifications & Certification",
  description:
    "Approved centre for IOSH, OSHAcademy, OSHAwards, HABC and OTHM. Regulated qualifications delivered online, blended and in-person — for professionals and enterprise teams worldwide.",
  path: "/",
});

export default function HomePage() {
  const featured = courses.filter((c) => c.featured).slice(0, 6);

  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedCategories />
      <CourseGrid courses={featured} />
      <Pathway />
      <AwardingBodies />
      <StatsBand />
      <CorporateCTA />
      <FreeCoursesPreview />
      <TestimonialsSlider />
      <EventsPreview />
      <ResourcesPreview />
      <BlogPreview />
      <FAQSection limit={5} />
    </>
  );
}
