import { promises as fs } from "node:fs";
import { join } from "node:path";
import { listEnrolments } from "@/lib/enrolments";

export interface Review {
  id: string;
  /** Enrolment id this review attests — proves the reviewer actually paid for the course. */
  enrolmentId: string;
  courseSlug: string;
  rating: 1 | 2 | 3 | 4 | 5;
  reviewerName: string;
  reviewerCompany?: string;
  body: string;
  /** "verified" = matched a real enrolment; "pending" = imported from elsewhere; "rejected" = moderated out. */
  status: "verified" | "pending" | "rejected";
  submittedAt: string;
}

const STORE = join(process.cwd(), "content", "data", "reviews.json");

async function loadAll(): Promise<Review[]> {
  try {
    const txt = await fs.readFile(STORE, "utf-8");
    const arr = JSON.parse(txt);
    return Array.isArray(arr) ? (arr as Review[]) : [];
  } catch {
    return [];
  }
}

async function saveAll(rows: Review[]): Promise<void> {
  await fs.mkdir(join(process.cwd(), "content", "data"), { recursive: true });
  await fs.writeFile(STORE, JSON.stringify(rows, null, 2), "utf-8");
}

export async function listReviews(filter?: {
  courseSlug?: string;
  status?: Review["status"];
}): Promise<Review[]> {
  const all = await loadAll();
  return all
    .filter((r) => {
      if (filter?.courseSlug && r.courseSlug !== filter.courseSlug) return false;
      if (filter?.status && r.status !== filter.status) return false;
      return true;
    })
    .sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt));
}

/** Submit a review — verifies the enrolment exists and belongs to `submitterEmail`. */
export async function submitReview(input: {
  enrolmentId: string;
  submitterEmail: string;
  rating: 1 | 2 | 3 | 4 | 5;
  reviewerName: string;
  reviewerCompany?: string;
  body: string;
}): Promise<{ ok: true; review: Review } | { ok: false; error: string }> {
  const enrolments = await listEnrolments();
  const enr = enrolments.find((e) => e.id === input.enrolmentId);
  if (!enr) return { ok: false, error: "Enrolment not found." };
  if (enr.customerEmail.toLowerCase() !== input.submitterEmail.toLowerCase()) {
    return { ok: false, error: "This enrolment is registered to a different email." };
  }
  if (enr.status !== "paid") {
    return { ok: false, error: "We only accept reviews from paid enrolments." };
  }

  const rows = await loadAll();
  // One review per enrolment.
  if (rows.some((r) => r.enrolmentId === input.enrolmentId)) {
    return { ok: false, error: "You've already submitted a review for this enrolment." };
  }

  const review: Review = {
    id: `rev-${Date.now().toString(36)}`,
    enrolmentId: input.enrolmentId,
    courseSlug: enr.courseSlug,
    rating: input.rating,
    reviewerName: input.reviewerName.trim(),
    reviewerCompany: input.reviewerCompany?.trim() || undefined,
    body: input.body.trim(),
    status: "verified",
    submittedAt: new Date().toISOString(),
  };
  rows.push(review);
  await saveAll(rows);
  return { ok: true, review };
}

/** Aggregate rating for a course — used in Course schema and the marketing card. */
export async function ratingFor(courseSlug: string): Promise<{
  avg: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}> {
  const reviews = await listReviews({ courseSlug, status: "verified" });
  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const r of reviews) {
    distribution[r.rating] += 1;
    sum += r.rating;
  }
  const count = reviews.length;
  const avg = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
  return { avg, count, distribution };
}

/** Schema.org Course + AggregateRating JSON-LD blob. Drop into a JSON-LD script tag. */
export function courseSchemaJsonLd(opts: {
  course: { slug: string; title: string; headline?: string; priceFromUSD?: number };
  rating: { avg: number; count: number };
  reviews: Review[];
  siteUrl: string;
}) {
  const reviewsArr = opts.reviews.slice(0, 12).map((r) => ({
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.rating,
      bestRating: 5,
    },
    author: {
      "@type": "Person",
      name: r.reviewerName,
    },
    datePublished: r.submittedAt,
    reviewBody: r.body,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.course.title,
    description: opts.course.headline,
    url: new URL(`/courses/${opts.course.slug}`, opts.siteUrl).toString(),
    provider: {
      "@type": "Organization",
      name: "EIOSH International",
      url: opts.siteUrl,
    },
    ...(opts.course.priceFromUSD
      ? {
          offers: {
            "@type": "Offer",
            price: opts.course.priceFromUSD,
            priceCurrency: "USD",
          },
        }
      : {}),
    ...(opts.rating.count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: opts.rating.avg,
            reviewCount: opts.rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(reviewsArr.length > 0 ? { review: reviewsArr } : {}),
  };
}
