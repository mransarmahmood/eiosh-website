// Shared content contracts. Kept deliberately CMS-agnostic so a Sanity or
// Strapi backend can map straight onto these shapes (see /cms schema docs).

export type DeliveryMode = "online" | "in-person" | "blended" | "self-paced";
export type CourseLevel = "introductory" | "foundation" | "intermediate" | "advanced" | "specialist";
export type CourseStatus = "open" | "filling-fast" | "waitlist" | "upcoming";

export interface AccreditationBody {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  kind: "awarding-body" | "accreditor" | "partner";
  country?: string;
  logo?: string;
  summary: string;
  highlights?: string[];
  website?: string;
}

export interface CourseCategory {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string; // lucide icon name
  accentHex?: string;
  image?: string; // optional hero image for the category card
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  headline: string;
  category: string; // CourseCategory.slug
  awardingBody: string; // AccreditationBody.slug
  level: CourseLevel;
  durationHours: number;
  modes: DeliveryMode[];
  language: "en" | "ar" | "en-ar";
  priceFromUSD?: number;
  status: CourseStatus;
  cohortStart?: string; // ISO
  learningOutcomes: string[];
  whoShouldAttend: string[];
  moduleOutline: { title: string; description: string }[];
  assessment: string;
  certification: string;
  heroImage?: string;
  featured?: boolean;
}

export interface Trainer {
  id: string;
  slug: string;
  name: string;
  title: string;
  credentials: string[];
  specialisms: string[];
  bio: string;
  photo?: string;
  linkedin?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company?: string;
  courseSlug?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  avatar?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body?: string;
  tags: string[];
  author: string;
  publishedAt: string;
  readTimeMinutes: number;
  cover?: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  type: "webinar" | "workshop" | "open-day" | "cohort-start";
  startsAt: string;
  endsAt?: string;
  mode: DeliveryMode;
  location?: string;
  summary: string;
  registerUrl?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: "admissions" | "certification" | "payments" | "corporate" | "verification" | "general";
}

export type FreeCourseFormat = "video" | "reading" | "interactive" | "podcast";

export interface FreeCourse {
  id: string;
  slug: string;
  title: string;
  summary: string;
  format: FreeCourseFormat;
  durationMinutes: number;
  level: "introductory" | "foundation" | "intermediate";
  lessonsCount: number;
  category: string;
  authorSlug?: string;
  enrolledCount?: number;
  hasCertificate?: boolean;
  tags?: string[];
}

export type ResourceKind = "book" | "notes" | "sample-paper" | "brochure" | "checklist" | "whitepaper";

export interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  kind: ResourceKind;
  summary: string;
  pages?: number;
  sizeMB?: number;
  language: "en" | "ar" | "en-ar";
  fileUrl?: string;
  accessLevel: "public" | "email-gated" | "learner-only";
  awardingBodySlug?: string;
  categorySlug?: string;
  updatedAt: string;
}

// Submission types — populated by public forms, editable in /admin.

export type SubmissionStatus = "new" | "in-review" | "responded" | "closed" | "historical";

export type DocumentKind =
  | "training"
  | "certification"
  | "service"
  | "equipment-inspection"
  | "consulting"
  | "custom";

export interface DocumentLineItem {
  description: string;
  qty: number;
  unitPrice: number;
}

export interface Proposal {
  id: string;
  title: string;
  kind?: DocumentKind;
  companyName: string;
  phone: string;
  companyAddress: string;
  companyEmail: string;
  invoiceDate?: string;
  validUntil?: string;
  overview?: string;
  scope?: string[];
  deliverables?: string[];
  timeline?: string;
  investmentSummary?: string;
  terms?: string;
  description?: string;
  receivedAt: string;
  status: SubmissionStatus;
}

export interface Quotation {
  id: string;
  title: string;
  kind?: DocumentKind;
  company: string;
  email: string;
  mobile: string;
  serviceRequired: string;
  overview?: string;
  lineItems?: DocumentLineItem[];
  currency?: string;
  vatPercent?: number;
  validUntil?: string;
  terms?: string;
  notes?: string;
  receivedAt: string;
  status: SubmissionStatus;
}

export interface Admission {
  id: string;
  title: string;
  dob?: string;
  gender?: string;
  email: string;
  nationality?: string;
  mobile?: string;
  company?: string;
  notes?: string;
  receivedAt: string;
  status: SubmissionStatus;
}

export interface SiteSettings {
  brand: {
    name: string;
    tagline: string;
    strapline: string;
    logoLight: string;
    logoDark: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    addressLines: string[];
  };
  social: { linkedin?: string; facebook?: string; instagram?: string; youtube?: string; x?: string };
  stats: { label: string; value: string }[];
}
