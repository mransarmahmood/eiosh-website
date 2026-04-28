import { Star, ShieldCheck } from "lucide-react";
import { listReviews } from "@/lib/reviews";
import { formatDate } from "@/lib/utils";

interface Props {
  courseSlug: string;
  limit?: number;
}

export async function ReviewsList({ courseSlug, limit = 6 }: Props) {
  const reviews = await listReviews({ courseSlug, status: "verified" });
  const visible = reviews.slice(0, limit);

  if (visible.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-ink-soft">
        No reviews yet — be the first to leave one after completing this programme.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {visible.map((r) => (
        <li key={r.id} className="rounded-2xl border border-border bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`h-4 w-4 ${
                    r.rating >= n ? "fill-yellow-400 text-yellow-500" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[0.7rem] text-green-700">
              <ShieldCheck className="h-3 w-3" /> Verified enrolment
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink">{r.body}</p>
          <p className="mt-3 text-xs text-ink-soft">
            <strong className="text-navy-900">{r.reviewerName}</strong>
            {r.reviewerCompany ? ` · ${r.reviewerCompany}` : ""} · {formatDate(r.submittedAt)}
          </p>
        </li>
      ))}
    </ul>
  );
}
